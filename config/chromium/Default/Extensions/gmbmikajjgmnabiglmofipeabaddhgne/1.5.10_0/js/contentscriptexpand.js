// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Content Script injected into page to send HTML with
 * CSS style links expanded to the background page in response
 * to the browser action.
 * Note that content scripts run in an isolated world, and do not have
 * direct access to the background page.
 * Since this file is injected into the currently viewed page, we cannot
 * use Closure's goog.require() or base.js because the usual deps.js loading
 * will not work since it loads files relative to the target page.
 * @author jeffcon@google.com (Jeff Conrad)
 * @suppress {checkProvides} Suppress JSCompiler's warning
 *     about constructors that do not have a goog.provide().
 */


var gdocscse = gdocscse || {};



/**
 * Content Script to expand CSS style links for saving as HTML.
 * @constructor
 */
gdocscse.ContentScriptExpand = function() {
  /**
   * Number of pending links to expand.
   * @type {number}
   * @private
   */
  this.numPending_ = 0;
};


/**
 * Gets the entire document, then expands the CSS style links, and
 * sends the result to the background page.
 */
gdocscse.ContentScriptExpand.prototype.init = function() {
  var htmlElem = document.getElementsByTagName('html')[0];
  this.sendExpandedCss_(htmlElem);
};


/**
 * Removes an element from it's parent in the DOM.
 * @param {!Element} el The element to remove.
 * @private
 */
gdocscse.ContentScriptExpand.prototype.removeElem_ = function(el) {
  el.parentNode.removeChild(el);
};


/**
 * Gets the style links to replace.
 * @param {!HTMLElement} htmlElem The HTML element for the cloned document.
 * @return {!Array.<!HTMLElement>} The style link elements to replace.
 * @private
 */
gdocscse.ContentScriptExpand.prototype.getStyleLinkElems_ = function(htmlElem) {
  var styleLinks = [];
  var links = htmlElem.getElementsByTagName('link');
  /*
   * See www.w3.org/TR/html4/struct/links.html
   * Handle elements like
   *  <link type="text/css" rel="stylesheet" href="//www.google.com/foo.css">
   */
  for (var i = 0; i < links.length; i++) {
    var link = links[i];
    var rel = link.getAttribute('rel');
    if (!rel || rel.toLowerCase() != 'stylesheet') {
      continue;
    }
    var href = link.getAttribute('href');
    if (!href) {
      continue;
    }
    if (href.toLowerCase().indexOf('chrome-extension://') == 0) {
      // This is a link that was injected by another extension. No need
      // expand and send it to Changeling, as it won't get rendered.
      this.removeElem_(link);
      continue;
    }
    styleLinks.push(link);
  }
  return styleLinks;
};


/**
 * Sends the expanded HTML string, with style sheet links expanded.
 * @param {!HTMLElement} origHtmlElem The HTML element for the document.
 * @private
 * @suppress {deprecated} Since we don't use base.js or other closure
 *     dependencies in contents scripts, suppress the warning about
 *     using property bind instead goog.bind().
 */
gdocscse.ContentScriptExpand.prototype.sendExpandedCss_ =
    function(origHtmlElem) {
  /**
   * A clone of HTML element from the DOM, so we can modify it without
   * affecting the original browser tab.
   * @type {!HTMLElement}
   */
  var htmlElem = /** @type {!HTMLElement} */ (origHtmlElem.cloneNode(true));
  var linkElems = this.getStyleLinkElems_(htmlElem);
  for (var i = 0; i < linkElems.length; i++) {
    var linkElem = linkElems[i];
    var href = linkElem.getAttribute('href');
    var xhr = new XMLHttpRequest();
    xhr.addEventListener(
        'load', this.onLoad_.bind(this, htmlElem, linkElem), false);
    xhr.open('GET', href, true);
    try {
      xhr.send();
    } catch (e) {
      // An exception occurred. Don't process the link.
      window.console.log('Unable to send. e:' + e);
      continue;
    }
    this.numPending_++;
  }
  if (this.numPending_ == 0) {
    // No external stylesheets. Send the data back to the background page.
    chrome.extension.sendMessage(null, htmlElem.outerHTML);
  }
};


/**
 * Handles the "load" XHR event, which is sent when the request has
 * successfully completed.
 * @param {!HTMLElement} htmlElem The HTML element for the cloned document.
 * @param {!Element} linkEl The link element we should replace.
 * @param {Event} e The XHR progress event object.
 * @private
 */
gdocscse.ContentScriptExpand.prototype.onLoad_ = function(htmlElem, linkEl, e) {
  var xhr = /** @type {!XMLHttpRequest} */ (e.currentTarget);
  if (xhr.status == 200) {
    var css = xhr.responseText;
    this.replaceWithCssStyle_(linkEl, css);
  }
  if (!--this.numPending_) {
    chrome.extension.sendMessage(null, htmlElem.outerHTML);
  }
};


/**
 * Adds a style element with the given CSS
 * @param {!Element} oldElem The element to replace.
 * @param {string} css The CSS requested from the link tag.
 * @private
 */
gdocscse.ContentScriptExpand.prototype.replaceWithCssStyle_ =
    function(oldElem, css) {
  var cssEl = document.createElement('style');
  cssEl.innerHTML = css;
  oldElem.parentNode.replaceChild(cssEl, oldElem);
};


/**
 * Initializes this content script.
 */
var contentScriptExpand = new gdocscse.ContentScriptExpand();
contentScriptExpand.init();
