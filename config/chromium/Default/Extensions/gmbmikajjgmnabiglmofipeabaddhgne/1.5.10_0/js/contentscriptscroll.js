/**
 * @fileoverview Content script used to scroll the viewable page
 * so the background page can perform screen captures of entire page.
 * Note that content scripts run in an isolated world, and do not have
 * direct access to the background page.
 * Since this file is injected into the currently viewed page, we cannot
 * use Closure's goog.require() or base.js because the usual deps.js loading
 * will not work since it loads files relative to the target page.
 * @author jeffcon@google.com (Jeff Conrad)
 * @suppress {checkProvides} Suppress JSCompiler's warning
 *     about constructors that do not have a goog.provide().
 */


var gdocscsc = gdocscsc || {};



/**
 * Content Script to Scroll the web page for full screen capture, as well
 * as maintaining the list of fixed positioned elements for proper placement
 * on the page as it is scrolled.
 * @param {!Window} scrollWindow Window object that will be scrolled
 *     and contains the document.
 * @constructor
 * @suppress {deprecated} Since we don't use base.js or other closure
 *     dependencies in contents scripts, suppress the warning about
 *     using property bind instead goog.bind().
 */
gdocscsc.ContentScriptScroll = function(scrollWindow) {
  /**
   * The window object.
   * @type {!Window}
   * @private
   */
  this.window_ = scrollWindow;

  /**
   * The document object.
   * @type {!Document}
   * @private
   */
  this.document_ = this.window_.document;

  /**
   * The body element. When testing, the bootstrapped window does not have
   * a body, so create an empty body.
   * @type {!HTMLBodyElement}
   * @private
   */
  this.body_ = this.document_.body ||
      /** @type {!HTMLBodyElement} */ (this.document_.createElement('body'));

  /**
   * The document actual full-size width available to capture, in pixels.
   * @type {number}
   * @private
   */
  this.totalWidth_ = this.body_.scrollWidth;

  /**
   * The document actual full-size height available to capture, in pixels.
   * @type {number}
   * @private
   */
  this.totalHeight_ = this.body_.scrollHeight;

  var viewPortSize = this.getViewPortSize_();

  /**
   * The visible width, in pixels.
   * @type {number}
   * @private
   */
  this.visibleWidth_ = viewPortSize.width;

  /**
   * The visible height, in pixels.
   * @type {number}
   * @private
   */
  this.visibleHeight_ = viewPortSize.height;

  /**
   * The original X position of the scroll bar.
   * @type {number}
   * @private
   */
  this.origXpos_ = this.body_.scrollLeft;

  /**
   * The original Y position of the scroll bar.
   * @type {number}
   * @private
   */
  this.origYpos_ = this.body_.scrollTop;

  /**
   * Elements which are using fixed positioning and are visible.
   * @type {!Array.<!gdocscsc.ContentScriptScroll.CornerElemData_>}
   * @private
   */
  this.fixedElems_ = [];

  /**
   * Elements which are using fixed positioning and are across the bottom.
   * @type {!Array.<!gdocscsc.ContentScriptScroll.EdgeElemData_>}
   * @private
   */
  this.bottomPositionElements_ = [];

  /**
   * Elements which are using fixed positioning and are on the right.
   * @type {!Array.<!gdocscsc.ContentScriptScroll.EdgeElemData_>}
   * @private
   */
  this.rightPositionElements_ = [];

  /**
   * Whether there are fixed positioned elements (and we have scroll bars)
   * @type {boolean}
   * @private
   */
  this.hasFixedElems_ = false;

  /**
   * Elements which are using fixed positioning and are visible, but have
   * been temporarily repositioned for the current capture because they
   * span captures.
   * Each array member is an array of [position, Element, style].
   * @type {!Array.<!Array>}
   * @private
   */
  this.repositionedFixedElems_ = [];

  /**
   * Function to handle messages.
   * @type {function(*, !MessageSender, function (*))}
   * @private
   */
  this.listenerFn_ = this.handleMessage_.bind(this);
};


/**
 * Number of animation frames to wait before sending scroll completion message.
 * webkitRequestAnimationFrame is invoked before the repaint, but we want to
 * respond *after* the repaint (when the scrolling has presumably completed),
 * which would be the second frame.
 * 1/30/13 jeffcon: We have seen some browsers which create an image with
 * the upper left image duplicated, presumably because the second animation
 * frame callback is too soon. Change to wait for the 3rd frame.
 */
gdocscsc.ContentScriptScroll.NUM_ANIMATION_FRAMES = 3;


/**
 * Initializes the image capture page.
 */
gdocscsc.ContentScriptScroll.prototype.init = function() {
  if (!chrome.extension.onMessage.hasListener(this.listenerFn_)) {
    chrome.extension.onMessage.addListener(this.listenerFn_);
  }
};


/**
 * Handles messages from the background page.
 * @param {*} request The message sent from the background page.
 * @param {!MessageSender} sender The message sender.
 * @param {function(*)} responseFn The function to call with the response data
 *     to send to the background page.
 * @return {boolean} True if the response will be sent asynchronously at
 *     a later time, false if the message channel can be closed.
 * @private
 */
gdocscsc.ContentScriptScroll.prototype.handleMessage_ =
    function(request, sender, responseFn) {
  switch (request.msg) {
    case 'init':
      responseFn(this.scrollInit_());
      break;

    case 'scrollTo':
      this.scroll_(request.x, request.y, request.capturePosition, responseFn);
      return true;  // Return true to indicate we'll send the response later.

    case 'restore':
      responseFn(this.restore_());
      break;

    default:
      // This should never happen, but log it for ease of support.
      this.window_.console.log(
          'ContentScriptScroll.handleMessage invalid message:' + request.msg);
      break;
  }
  // According to Chrome Extension documentation, responseFn becomes invalid
  // when the event listener returns, unless the listener returns true to
  // indicate a response will be sent asynchronously, which keeps the
  // message channel open to the other end until responseFn is called.
  // We currently never need the channel to stay open after this method
  // returns, so we always return false.
  return false;
};


/**
 * Initializes the scrolled window position.
 * @return {!Object} The initial window parameters.
 * @private
 */
gdocscsc.ContentScriptScroll.prototype.scrollInit_ = function() {
  // Uncomment to enable logging (since we don't have a log infrastructure).
  // this.window_.console.log('document.compatMode: ' +
  //     this.document_.compatMode +
  //     '\ndocument.body.scrollWidthxHeight: ' +
  //     this.body_.scrollWidth +
  //     'x' + this.body_.scrollHeight +
  //     '\ndocument.body.clientWidthxHeight: ' +
  //     this.body_.clientWidth +
  //     'x' + this.body_.clientHeight +
  //     '\ndocument.documentElement.clientWidthxHeight: ' +
  //     this.document_.documentElement.clientWidth +
  //     'x' + this.document_.documentElement.clientHeight);
  if (this.hasScrollbar_()) {
    this.findFixedPosElements_();
  }

  this.window_.scrollTo(0, 0);
  if (this.hasFixedElems_) {
    this.showHideFixedElems_(gdocscsc.ContentScriptScroll.Corner_.TOP_LEFT);
  }

  return {
    msg: 'initialized',
    bodyScrollWidth: this.totalWidth_,
    bodyScrollHeight: this.totalHeight_,
    visibleWidth: this.visibleWidth_,
    visibleHeight: this.visibleHeight_
  };
};


/**
 * @return {boolean} Whether the document has a vertical scroll bar.
 * @private
 */
gdocscsc.ContentScriptScroll.prototype.hasVScrollbar_ = function() {
  return this.visibleHeight_ < this.totalHeight_;
};


/**
 * @return {boolean} Whether the document has a horizontal scroll bar.
 * @private
 */
gdocscsc.ContentScriptScroll.prototype.hasHScrollbar_ = function() {
  return this.visibleWidth_ < this.totalWidth_;
};


/**
 * @return {boolean} Whether the document has any scroll bar.
 * @private
 */
gdocscsc.ContentScriptScroll.prototype.hasScrollbar_ = function() {
  return this.hasVScrollbar_() || this.hasHScrollbar_();
};


/**
 * Scrolls to the given location, displaying any fixed elements according to
 * the capture position.
 * @param {number} x The x coordinate to scroll to.
 * @param {number} y The y coordinate to scroll to.
 * @param {string} cornerPosition The corner position (top_left, bottom_right,
 *     etc) or empty string if not at a corner.
 * @param {function(*)} responseFn The function to call with the response data
 *     to send to the background page.
 * @private
 * @suppress {deprecated} No base.js so goog.bind() is not available.
 */
gdocscsc.ContentScriptScroll.prototype.scroll_ =
    function(x, y, cornerPosition, responseFn) {
  this.window_.scrollTo(x, y);
  if (this.hasFixedElems_) {
    this.restoreRepositionedElements_();
    if (cornerPosition) {
      this.showHideFixedElems_(cornerPosition);
    } else {
      this.hideFixedElems_();
      this.handleSpanningFixedElems_();
    }
  }
  // The scroll may not have completed yet. Send the response after a repaint.
  // Otherwise, the page capture may capture the previous scrolled position.
  this.waitAnimationFrame_(
      gdocscsc.ContentScriptScroll.NUM_ANIMATION_FRAMES, responseFn);
};


/**
 * Wait for the given number of animation frame callbacks, which indicates
 * the scrolling has completed, and the next screen capture can commence.
 * @param {number} numFramesWait Number of Animation frames remaining until
 *     wait has completed.
 * @param {function(*)} responseFn The function to call with the response data
 *     to send to the background page.
 * @private
 * @suppress {deprecated} No base.js so goog.bind() is not available.
 */
gdocscsc.ContentScriptScroll.prototype.waitAnimationFrame_ =
    function(numFramesWait, responseFn) {
  if (numFramesWait <= 0) {
    // Finished. Respond to the background page that the scroll is complete.
    responseFn({
      msg: 'scrollToDone'
    });
    return;
  }
  window.webkitRequestAnimationFrame(
      this.waitAnimationFrame_.bind(this, numFramesWait - 1, responseFn));
};


/**
 * Restores to original location with fixed elements displayed.
 * @return {!Object} The restore completion message.
 * @private
 */
gdocscsc.ContentScriptScroll.prototype.restore_ = function() {
  this.window_.scrollTo(this.origXpos_, this.origYpos_);
  if (this.hasFixedElems_) {
    this.restoreRepositionedElements_();
    this.showFixedElems_();
  }
  chrome.extension.onMessage.removeListener(this.listenerFn_);
  return {
    msg: 'endOfPage'
  };
};


/**
 * Restores the visibility of all positioned fixed elements.
 * @private
 */
gdocscsc.ContentScriptScroll.prototype.showFixedElems_ = function() {
  this.setFixedElems_('visible');
};


/**
 * Hides all the positioned fixed elements so they do not show on the
 * current capture.
 * @private
 */
gdocscsc.ContentScriptScroll.prototype.hideFixedElems_ = function() {
  this.setFixedElems_('hidden');
};


/**
 * Sets the visibility on all positioned fixed elements.
 * @param {string} visibility The visibility to set.
 * @private
 */
gdocscsc.ContentScriptScroll.prototype.setFixedElems_ = function(visibility) {
  this.fixedElems_.forEach(function(elementInfo) {
    elementInfo.element.style.visibility = visibility;
  }, this);
};


/**
 * Iterates the DOM tree and cache visible fixed-position elements.
 * @private
 * @suppress {checkTypes} We don't have an externs file containing
 *     createNodeIterator().
 */
gdocscsc.ContentScriptScroll.prototype.findFixedPosElements_ = function() {
  var lastCapturePartialWidth_ = this.totalWidth_ % this.visibleWidth_;
  var lastCapturePartialHeight_ = this.totalHeight_ % this.visibleHeight_;
  var nodeIterator = this.document_.createNodeIterator(
      this.body_, NodeFilter.SHOW_ELEMENT, null, false);
  var currentNode;
  while (currentNode = nodeIterator.nextNode()) {
    var nodeComputedStyle = this.getComputedStyle_(currentNode);
    // Skip nodes which don't have computeStyle or are invisible.
    if (nodeComputedStyle) {
      if (nodeComputedStyle.position == 'fixed' &&
          nodeComputedStyle.display != 'none' &&
          nodeComputedStyle.visibility != 'hidden') {
        this.computeElemFixedPosition_(
            currentNode, lastCapturePartialWidth_, lastCapturePartialHeight_);
      }
    }
  }
  this.hasFixedElems_ = this.fixedElems_.length > 0;
};


/**
 * Detects the fixed-positioned element's position in the view port. To
 * reproduce the same effect that a large scroll bar-free window would
 * produce, each fixed position element will be displayed only for the
 * capture of it's pre-determined corner. If an element is fixed-positioned,
 * but not shown when we scroll to one of the 4 corners,
 * it is not given a position and will never be displayed.
 * @param {!Element} elem The fixed position element.
 * @param {number} lastCapturePartialWidth The width of the last column
 *     capture or 0 it it will be a full width capture.
 * @param {number} lastCapturePartialHeight The width of the last row
 *     capture or 0 it it will be a full height capture.
 * @private
 */
gdocscsc.ContentScriptScroll.prototype.computeElemFixedPosition_ =
    function(elem, lastCapturePartialWidth, lastCapturePartialHeight) {
  var rowPosition = '';
  var columnPosition = '';
  var extendsLastRow = false;
  var extendsLastColumn = false;

  if (this.hasVScrollbar_()) {
    // Compare distance between element and the edge of view port to determine
    // the capture position of element.
    var offsetTop = this.getOffsetTop(elem);
    if (offsetTop <=
        this.visibleHeight_ - offsetTop - this.getOffsetHeight(elem)) {
      rowPosition = gdocscsc.ContentScriptScroll.Edge_.TOP;
    } else if (offsetTop < this.visibleHeight_) {
      rowPosition = gdocscsc.ContentScriptScroll.Edge_.BOTTOM;
      if (lastCapturePartialHeight != 0) {
        extendsLastRow = this.getOffsetHeight(elem) > lastCapturePartialHeight;
      }
    } else {
      // The element is not visible, ignore. This can happen with a very small
      // visible area which does not contain the fixed element.
      return;
    }
  } else {
    // We will only have one row to capture.
    rowPosition = gdocscsc.ContentScriptScroll.Edge_.TOP;
  }

  if (this.hasHScrollbar_()) {
    var offsetLeft = this.getOffsetLeft(elem);
    if (offsetLeft <=
        this.visibleWidth_ - offsetLeft - this.getOffsetWidth(elem)) {
      columnPosition = gdocscsc.ContentScriptScroll.Edge_.LEFT;
    } else if (offsetLeft < this.visibleWidth_) {
      columnPosition = gdocscsc.ContentScriptScroll.Edge_.RIGHT;
      if (lastCapturePartialWidth != 0) {
        extendsLastColumn = this.getOffsetWidth(elem) > lastCapturePartialWidth;
      }
    } else {
      return;
    }
  } else {
    // We will only have one column to capture.
    columnPosition = gdocscsc.ContentScriptScroll.Edge_.LEFT;
  }
  var cornerPosition = rowPosition + '_' + columnPosition;
  var cornerData =
      {
        cornerPosition: cornerPosition,
        element: elem
      };
  this.fixedElems_.push(cornerData);

  // Remember the bottom and right fixed elements for processing
  // multi-capture spanning elements along the bottom or right edges.
  if (extendsLastRow) {
    var edgeData = {
      edgePosition: columnPosition,
      element: elem
    };
    this.bottomPositionElements_.push(edgeData);
  }
  if (extendsLastColumn) {
    var edgeData = {
      edgePosition: rowPosition,
      element: elem
    };
    this.rightPositionElements_.push(edgeData);
  }
};


/**
 * Shows or hides fixed-position elements for capture.
 * @param {string} capturePosition The position we are capturing.
 * @private
 */
gdocscsc.ContentScriptScroll.prototype.showHideFixedElems_ =
    function(capturePosition) {
  this.fixedElems_.forEach(function(elementInfo) {
    elementInfo.element.style.visibility =
        (elementInfo.cornerPosition == capturePosition) ?
        'visible' : 'hidden';
  }, this);
};


/**
 * Handles elements which span more than the last capture. Since the right
 * and bottom captures are often fractional captures, we may need to make
 * a fixed element visible, and move its location so that it will be captured
 * before the last capture in the row or column. We must also restore those
 * locations when finished.
 * @private
 */
gdocscsc.ContentScriptScroll.prototype.handleSpanningFixedElems_ = function() {
  var widthPos = new gdocscsc.Position_(
      this.totalWidth_, this.body_.scrollLeft, this.visibleWidth_);
  var heightPos = new gdocscsc.Position_(
      this.totalHeight_, this.body_.scrollTop, this.visibleHeight_);
  this.checkSpan_(widthPos, this.rightPositionElements_,
      'offsetWidth', gdocscsc.ContentScriptScroll.Edge_.RIGHT, heightPos);
  this.checkSpan_(heightPos, this.bottomPositionElements_,
      'offsetHeight', gdocscsc.ContentScriptScroll.Edge_.BOTTOM, widthPos);
};


/**
 * Check to see if any fixed elements need to be displayed because they
 * span multiple rows or columns.
 * @param {!gdocscsc.Position_} positionInfo Positional information for the
 *     dimension we are computing.
 * @param {!Array.<!gdocscsc.ContentScriptScroll.EdgeElemData_>} elements
 *     Array of position and elements.
 * @param {string} offsetWH Either 'offsetWidth' or 'offsetHeight'.
 * @param {gdocscsc.ContentScriptScroll.Edge_} posRB The edge the element
 *     is next to.
 * @param {!gdocscsc.Position_} otherDimensionPositionInfo Positional
 *     information for the opposite dimension we are computing.
 * @private
 */
gdocscsc.ContentScriptScroll.prototype.checkSpan_ = function(
    positionInfo, elements, offsetWH, posRB, otherDimensionPositionInfo) {
  if (!positionInfo.isNextToLast) {
    return;
  }
  elements.forEach(function(elementInfo) {
    var position = elementInfo.edgePosition;
    // We only want to display with the corresponding edge.
    if (this.isFirstLast_(position, otherDimensionPositionInfo)) {
      var element = elementInfo.element;
      var offset = offsetWH == 'offsetWidth' ?
          this.getOffsetWidth(element) : this.getOffsetHeight(element);
      if (offset > positionInfo.lastCapturePartial) {
        // This will need to span multiple captures
        element.style.visibility = 'visible';
        var original = this.getComputedStyle_(element)[posRB];
        this.repositionedFixedElems_.push([posRB, element, original]);
        element.style[posRB] = -positionInfo.lastCapturePartial + 'px';
      }
    }
  }, this);
};


/**
 * Determines if this is the corresponding first or last row/column
 * in the opposite direction. This prevents us from displaying on the
 * last row/column for every column/row.
 * @param {gdocscsc.ContentScriptScroll.Edge_} position The edge to check.
 * @param {!gdocscsc.Position_} otherDimensionPositionInfo Positional
 *     information for the opposite dimension we are computing.
 * @return {boolean} Whether this is the corresponding first/last row/column.
 * @private
 */
gdocscsc.ContentScriptScroll.prototype.isFirstLast_ =
    function(position, otherDimensionPositionInfo) {
  return position ==
      gdocscsc.ContentScriptScroll.Edge_.LEFT &&
          otherDimensionPositionInfo.isFirst ||
      position == gdocscsc.ContentScriptScroll.Edge_.RIGHT &&
          otherDimensionPositionInfo.isLast ||
      position == gdocscsc.ContentScriptScroll.Edge_.TOP &&
          otherDimensionPositionInfo.isFirst ||
      position == gdocscsc.ContentScriptScroll.Edge_.BOTTOM &&
          otherDimensionPositionInfo.isLast;
};


/**
 * Restores bottom and right fixed elements to their original position.
 * @private
 */
gdocscsc.ContentScriptScroll.prototype.restoreRepositionedElements_ =
    function() {
  this.repositionedFixedElems_.forEach(function(data) {
    var property = data[0];
    var element = data[1];
    var originalValue = data[2];
    element.style[property] = originalValue;
  }, this);
  this.repositionedFixedElems_ = [];
};


/**
 * Computes the view port size (visible area). This value is accessed
 * differently based on the compatibility mode of the document as
 * controlled by the DOCTYPE element's content. For example:
 *
 * <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">:
 * compatMode:BackCompat
 *            body.scrollWxH:1504x1419
 *            body.clientWxH:828x655 (visible size, same for both modes)
 * documentElement.clientWxH:828x1419 (entire document, including scroll bars)
 *
 * <!DOCTYPE html>:
 * compatMode:CSS1Compat
 *            body.scrollWxH:1504x1432
 *            body.clientWxH:812x1395 (entire document, excluding scroll bars)
 * documentElement.clientWxH:828x655 (visible size, same for both modes)
 *
 * @return {!Object} The width and height of the view port.
 * @private
 */
gdocscsc.ContentScriptScroll.prototype.getViewPortSize_ = function() {
  if (this.document_.compatMode == 'BackCompat') {
    return {
      width: this.body_.clientWidth,
      height: this.body_.clientHeight
    };
  } else {
    // CSS1Compat
    // This is the standards-compliant mode (also called "strict mode").
    return {
      width: this.document_.documentElement.clientWidth,
      height: this.document_.documentElement.clientHeight
    };
  }
};


/**
 * Get the computed style for an element.
 * @param {!Element} element The element to compute style for.
 * @return {!CSSStyleDeclaration} The computed style.
 * @private
 */
gdocscsc.ContentScriptScroll.prototype.getComputedStyle_ = function(element) {
  return this.window_.getComputedStyle(element, null) ||
      new CSSStyleDeclaration();
};


/**
 * For testability, create a method which can be overridden by the test
 * framework to get the element's top offset. Returns the vertical offset
 * position of the current element relative to its offset container.
 * @param {!Element} element The element.
 * @return {number} The element's top offset.
 */
gdocscsc.ContentScriptScroll.prototype.getOffsetTop = function(element) {
  return element.offsetTop;
};


/**
 * For testability, create a method which can be overridden by the test
 * framework to get the element's left offset. Returns the horizontal offset
 * position of the current element relative to its offset container.
 * @param {!Element} element The element.
 * @return {number} The element's left offset.
 */
gdocscsc.ContentScriptScroll.prototype.getOffsetLeft = function(element) {
  return element.offsetLeft;
};


/**
 * For testability, create a method which can be overridden by the test
 * framework to get the element's offset width. Returns the width of an element,
 * including borders and padding if any, but not the margins.
 * @param {!Element} element The element.
 * @return {number} The element's offset width.
 */
gdocscsc.ContentScriptScroll.prototype.getOffsetWidth = function(element) {
  return element.offsetWidth;
};


/**
 * For testability, create a method which can be overridden by the test
 * framework to get the element's offset height. Returns the entire height
 * of an element (including areas hidden with scrollbars).
 * @param {!Element} element The element.
 * @return {number} The element's offset height.
 */
gdocscsc.ContentScriptScroll.prototype.getOffsetHeight = function(element) {
  return element.offsetHeight;
};



/**
 * Compute the positional information for the width or height dimension.
 * @param {number} totalWH Total width or height.
 * @param {number} scrollTL Scroll top or left.
 * @param {number} visibleWH Visible width or height.
 * @constructor
 * @private
 */
gdocscsc.Position_ = function(totalWH, scrollTL, visibleWH) {
  /**
   * Width or height of last capture. Value will be > 0 and less than
   * the visible width/height.
   * @type {number}
   */
  this.lastCapturePartial = totalWH % visibleWH;

  /**
   * Number of pixels remaining to capture.
   * @type {number}
   */
  this.remainingCapture = totalWH - scrollTL;

  /**
   * Whether this is the first row/column to capture.
   * @type {boolean}
   */
  this.isFirst = scrollTL == 0;

  /**
   * Whether this is the last row/column to capture.
   * @type {boolean}
   */
  this.isLast = this.remainingCapture <= visibleWH;

  /**
   * Whether this is the next to last row/column to capture.
   * @type {boolean}
   */
  this.isNextToLast = this.remainingCapture > visibleWH &&
      this.remainingCapture <= (visibleWH * 2);
};


/**
 * The 4 corner positions.
 * @enum {string}
 * @private
 */
gdocscsc.ContentScriptScroll.Corner_ = {
  TOP_LEFT: 'top_left',
  TOP_RIGHT: 'top_right',
  BOTTOM_LEFT: 'bottom_left',
  BOTTOM_RIGHT: 'bottom_right'
};


/**
 * The edges.
 * @enum {string}
 * @private
 */
gdocscsc.ContentScriptScroll.Edge_ = {
  TOP: 'top',
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right'
};


/**
 * The corner position of the fixed element and the element itself.
 * @typedef {{
 *   cornerPosition: gdocscsc.ContentScriptScroll.Corner_,
 *   element: !Element
 * }}
 * @private
 */
gdocscsc.ContentScriptScroll.CornerElemData_;


/**
 * The edge position of the fixed element and the element itself.
 * @typedef {{
 *   edgePosition: gdocscsc.ContentScriptScroll.Edge_,
 *   element: !Element
 * }}
 * @private
 */
gdocscsc.ContentScriptScroll.EdgeElemData_;


/**
 * Initializes the content script with the current window.
 */
var contentScriptScroll = new gdocscsc.ContentScriptScroll(window);
contentScriptScroll.init();
