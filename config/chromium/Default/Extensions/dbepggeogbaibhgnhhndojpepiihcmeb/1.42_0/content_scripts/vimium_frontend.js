// Generated by CoffeeScript 1.3.3
(function() {
  var HUD, Tween, activatedElement, checkIfEnabledForUrl, currentCompletionKeys, disableVimium, enterInsertModeIfElementIsFocused, enterInsertModeWithoutShowingIndicator, executeFind, executePageCommand, exitFindMode, exitInsertMode, findAndFocus, findAndFollowLink, findAndFollowRel, findMode, findModeAnchorNode, findModeQuery, findModeQueryHasResults, focusFoundLink, followLink, frameId, getLinkFromSelection, getNextQueryFromRegexMatches, handleDeleteForFindMode, handleEnterForFindMode, handleEscapeForFindMode, handleKeyCharForFindMode, handlerStack, hasModifiersRegex, hideHelpDialog, initializeOnDomReady, initializePreDomReady, initializeWhenEnabled, insertModeLock, isDOMDescendant, isEditable, isEmbed, isEnabledForUrl, isFocusable, isInsertMode, isShowingHelpDialog, isValidFirstKey, keyPort, onBlurCapturePhase, onDOMActivate, onFocusCapturePhase, onKeydown, onKeypress, onKeyup, performFindInPlace, refreshCompletionKeys, registerFrameIfSizeAvailable, restoreDefaultSelectionHighlight, root, scrollActivatedElementBy, selectFoundInputElement, setScrollPosition, settings, showFindModeHUDForQuery, textInputXPath, toggleHelpDialog, updateFindModeQuery, validFirstKeys;

  insertModeLock = null;

  findMode = false;

  findModeQuery = {
    rawQuery: ""
  };

  findModeQueryHasResults = false;

  findModeAnchorNode = null;

  isShowingHelpDialog = false;

  handlerStack = new HandlerStack;

  keyPort = null;

  isEnabledForUrl = true;

  currentCompletionKeys = null;

  validFirstKeys = null;

  activatedElement = null;

  textInputXPath = (function() {
    var inputElements, textInputTypes;
    textInputTypes = ["text", "search", "email", "url", "number", "password"];
    inputElements = [
      "input[" + "(" + textInputTypes.map(function(type) {
        return '@type="' + type + '"';
      }).join(" or ") + "or not(@type))" + " and not(@disabled or @readonly)]", "textarea", "*[@contenteditable='' or translate(@contenteditable, 'TRUE', 'true')='true']"
    ];
    return DomUtils.makeXPath(inputElements);
  })();

  settings = {
    port: null,
    values: {},
    loadedValues: 0,
    valuesToLoad: ["scrollStepSize", "linkHintCharacters", "filterLinkHints", "hideHud", "previousPatterns", "nextPatterns", "findModeRawQuery", "regexFindMode", "userDefinedLinkHintCss", "helpDialog_showAdvancedCommands"],
    isLoaded: false,
    eventListeners: {},
    init: function() {
      this.port = chrome.extension.connect({
        name: "settings"
      });
      return this.port.onMessage.addListener(this.receiveMessage);
    },
    get: function(key) {
      return this.values[key];
    },
    set: function(key, value) {
      if (!this.port) {
        this.init();
      }
      this.values[key] = value;
      return this.port.postMessage({
        operation: "set",
        key: key,
        value: value
      });
    },
    load: function() {
      var i, _results;
      if (!this.port) {
        this.init();
      }
      _results = [];
      for (i in this.valuesToLoad) {
        _results.push(this.port.postMessage({
          operation: "get",
          key: this.valuesToLoad[i]
        }));
      }
      return _results;
    },
    receiveMessage: function(args) {
      var listener, _results;
      settings.values[args.key] = args.value;
      if (++settings.loadedValues === settings.valuesToLoad.length) {
        settings.isLoaded = true;
        listener = null;
        _results = [];
        while ((listener = settings.eventListeners["load"].pop())) {
          _results.push(listener());
        }
        return _results;
      }
    },
    addEventListener: function(eventName, callback) {
      if (!(eventName in this.eventListeners)) {
        this.eventListeners[eventName] = [];
      }
      return this.eventListeners[eventName].push(callback);
    }
  };

  frameId = Math.floor(Math.random() * 999999999);

  hasModifiersRegex = /^<([amc]-)+.>/;

  initializePreDomReady = function() {
    var requestHandlers;
    settings.addEventListener("load", LinkHints.init.bind(LinkHints));
    settings.load();
    checkIfEnabledForUrl();
    refreshCompletionKeys();
    keyPort = chrome.extension.connect({
      name: "keyDown"
    });
    requestHandlers = {
      hideUpgradeNotification: function() {
        return HUD.hideUpgradeNotification();
      },
      showUpgradeNotification: function(request) {
        return HUD.showUpgradeNotification(request.version);
      },
      toggleHelpDialog: function(request) {
        return toggleHelpDialog(request.dialogHtml, request.frameId);
      },
      focusFrame: function(request) {
        if (frameId === request.frameId) {
          return focusThisFrame(request.highlight);
        }
      },
      refreshCompletionKeys: refreshCompletionKeys,
      getScrollPosition: function() {
        return {
          scrollX: window.scrollX,
          scrollY: window.scrollY
        };
      },
      setScrollPosition: function(request) {
        return setScrollPosition(request.scrollX, request.scrollY);
      },
      executePageCommand: executePageCommand,
      getActiveState: function() {
        return {
          enabled: isEnabledForUrl
        };
      },
      disableVimium: disableVimium
    };
    return chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
      var _ref;
      if (!((_ref = sender.tab) != null ? _ref.url.startsWith('chrome-extension://') : void 0)) {
        return;
      }
      if (!(isEnabledForUrl || request.name === 'getActiveState')) {
        return;
      }
      sendResponse(requestHandlers[request.name](request, sender));
      return false;
    });
  };

  initializeWhenEnabled = function() {
    document.addEventListener("keydown", onKeydown, true);
    document.addEventListener("keypress", onKeypress, true);
    document.addEventListener("keyup", onKeyup, true);
    document.addEventListener("focus", onFocusCapturePhase, true);
    document.addEventListener("blur", onBlurCapturePhase, true);
    document.addEventListener("DOMActivate", onDOMActivate, true);
    return enterInsertModeIfElementIsFocused();
  };

  disableVimium = function() {
    document.removeEventListener("keydown", onKeydown, true);
    document.removeEventListener("keypress", onKeypress, true);
    document.removeEventListener("keyup", onKeyup, true);
    document.removeEventListener("focus", onFocusCapturePhase, true);
    document.removeEventListener("blur", onBlurCapturePhase, true);
    document.removeEventListener("DOMActivate", onDOMActivate, true);
    return isEnabledForUrl = false;
  };

  window.addEventListener("focus", function() {
    settings.load();
    return chrome.extension.sendRequest({
      handler: "frameFocused",
      frameId: frameId
    });
  });

  initializeOnDomReady = function() {
    registerFrameIfSizeAvailable(window.top === window.self);
    if (isEnabledForUrl) {
      enterInsertModeIfElementIsFocused();
    }
    return chrome.extension.connect({
      name: "domReady"
    });
  };

  registerFrameIfSizeAvailable = function(is_top) {
    if (innerWidth !== void 0 && innerWidth !== 0 && innerHeight !== void 0 && innerHeight !== 0) {
      return chrome.extension.sendRequest({
        handler: "registerFrame",
        frameId: frameId,
        area: innerWidth * innerHeight,
        is_top: is_top,
        total: frames.length + 1
      });
    } else {
      return setTimeout((function() {
        return registerFrameIfSizeAvailable(is_top);
      }), 100);
    }
  };

  enterInsertModeIfElementIsFocused = function() {
    if (document.activeElement && isEditable(document.activeElement) && !findMode) {
      return enterInsertModeWithoutShowingIndicator(document.activeElement);
    }
  };

  onDOMActivate = function(event) {
    return activatedElement = event.target;
  };

  executePageCommand = function(request) {
    var i, _i, _ref;
    if (frameId !== request.frameId) {
      return;
    }
    if (request.passCountToFunction) {
      Utils.invokeCommandString(request.command, [request.count]);
    } else {
      for (i = _i = 0, _ref = request.count; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        Utils.invokeCommandString(request.command);
      }
    }
    return refreshCompletionKeys(request);
  };

  scrollActivatedElementBy = function(direction, amount) {
    var element, isRendered, lastElement, oldScrollValue, rect, scrollName;
    if (!document.body) {
      if (direction === "x") {
        window.scrollBy(amount, 0);
      } else {
        window.scrollBy(0, amount);
      }
      return;
    }
    isRendered = function(element) {
      var computedStyle;
      computedStyle = window.getComputedStyle(element, null);
      return !(computedStyle.getPropertyValue("visibility") !== "visible" || computedStyle.getPropertyValue("display") === "none");
    };
    if (!activatedElement || !isRendered(activatedElement)) {
      activatedElement = document.body;
    }
    scrollName = direction === "x" ? "scrollLeft" : "scrollTop";
    if (amount !== 0) {
      element = activatedElement;
      while (true) {
        oldScrollValue = element[scrollName];
        element[scrollName] += amount;
        lastElement = element;
        element = element.parentElement || document.body;
        if (!(lastElement[scrollName] === oldScrollValue && lastElement !== document.body)) {
          break;
        }
      }
    }
    rect = activatedElement.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight || rect.right < 0 || rect.left > window.innerWidth) {
      return activatedElement = lastElement;
    }
  };

  setScrollPosition = function(scrollX, scrollY) {
    if (scrollX > 0 || scrollY > 0) {
      return DomUtils.documentReady(function() {
        return window.scrollBy(scrollX, scrollY);
      });
    }
  };

  window.focusThisFrame = function(shouldHighlight) {
    var borderWas;
    window.focus();
    if (document.body && shouldHighlight) {
      borderWas = document.body.style.border;
      document.body.style.border = '5px solid yellow';
      return setTimeout((function() {
        return document.body.style.border = borderWas;
      }), 200);
    }
  };

  extend(window, {
    scrollToBottom: function() {
      return window.scrollTo(window.pageXOffset, document.body.scrollHeight);
    },
    scrollToTop: function() {
      return window.scrollTo(window.pageXOffset, 0);
    },
    scrollToLeft: function() {
      return window.scrollTo(0, window.pageYOffset);
    },
    scrollToRight: function() {
      return window.scrollTo(document.body.scrollWidth, window.pageYOffset);
    },
    scrollUp: function() {
      return scrollActivatedElementBy("y", -1 * settings.get("scrollStepSize"));
    },
    scrollDown: function() {
      return scrollActivatedElementBy("y", parseFloat(settings.get("scrollStepSize")));
    },
    scrollPageUp: function() {
      return scrollActivatedElementBy("y", -1 * window.innerHeight / 2);
    },
    scrollPageDown: function() {
      return scrollActivatedElementBy("y", window.innerHeight / 2);
    },
    scrollFullPageUp: function() {
      return scrollActivatedElementBy("y", -window.innerHeight);
    },
    scrollFullPageDown: function() {
      return scrollActivatedElementBy("y", window.innerHeight);
    },
    scrollLeft: function() {
      return scrollActivatedElementBy("x", -1 * settings.get("scrollStepSize"));
    },
    scrollRight: function() {
      return scrollActivatedElementBy("x", parseFloat(settings.get("scrollStepSize")));
    }
  });

  extend(window, {
    reload: function() {
      return window.location.reload();
    },
    goBack: function(count) {
      return history.go(-count);
    },
    goForward: function(count) {
      return history.go(count);
    },
    goUp: function(count) {
      var url, urlsplit;
      url = window.location.href;
      if (url[url.length - 1] === "/") {
        url = url.substring(0, url.length - 1);
      }
      urlsplit = url.split("/");
      if (urlsplit.length > 3) {
        urlsplit = urlsplit.slice(0, Math.max(3, urlsplit.length - count));
        return window.location.href = urlsplit.join('/');
      }
    },
    toggleViewSource: function() {
      return chrome.extension.sendRequest({
        handler: "getCurrentTabUrl"
      }, function(url) {
        if (url.substr(0, 12) === "view-source:") {
          url = url.substr(12, url.length - 12);
        } else {
          url = "view-source:" + url;
        }
        return chrome.extension.sendRequest({
          handler: "openUrlInNewTab",
          url: url,
          selected: true
        });
      });
    },
    copyCurrentUrl: function() {
      chrome.extension.sendRequest({
        handler: "getCurrentTabUrl"
      }, function(url) {
        return chrome.extension.sendRequest({
          handler: "copyToClipboard",
          data: url
        });
      });
      return HUD.showForDuration("Yanked URL", 1000);
    },
    focusInput: function(count) {
      var element, hint, hintContainingDiv, hints, i, rect, resultSet, selectedInputIndex, tuple, visibleInputs;
      resultSet = DomUtils.evaluateXPath(textInputXPath, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
      visibleInputs = (function() {
        var _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = resultSet.snapshotLength; _i < _ref; i = _i += 1) {
          element = resultSet.snapshotItem(i);
          rect = DomUtils.getVisibleClientRect(element);
          if (rect === null) {
            continue;
          }
          _results.push({
            element: element,
            rect: rect
          });
        }
        return _results;
      })();
      if (visibleInputs.length === 0) {
        return;
      }
      selectedInputIndex = Math.min(count - 1, visibleInputs.length - 1);
      visibleInputs[selectedInputIndex].element.focus();
      if (visibleInputs.length === 1) {
        return;
      }
      hints = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = visibleInputs.length; _i < _len; _i++) {
          tuple = visibleInputs[_i];
          hint = document.createElement("div");
          hint.className = "vimiumReset internalVimiumInputHint vimiumInputHint";
          hint.style.left = (tuple.rect.left - 1) + window.scrollX + "px";
          hint.style.top = (tuple.rect.top - 1) + window.scrollY + "px";
          hint.style.width = tuple.rect.width + "px";
          hint.style.height = tuple.rect.height + "px";
          _results.push(hint);
        }
        return _results;
      })();
      hints[selectedInputIndex].classList.add('internalVimiumSelectedInputHint');
      hintContainingDiv = DomUtils.addElementList(hints, {
        id: "vimiumInputMarkerContainer",
        className: "vimiumReset"
      });
      return handlerStack.push({
        keydown: function(event) {
          if (event.keyCode === KeyboardUtils.keyCodes.tab) {
            hints[selectedInputIndex].classList.remove('internalVimiumSelectedInputHint');
            if (event.shiftKey) {
              if (--selectedInputIndex === -1) {
                selectedInputIndex = hints.length - 1;
              }
            } else {
              if (++selectedInputIndex === hints.length) {
                selectedInputIndex = 0;
              }
            }
            hints[selectedInputIndex].classList.add('internalVimiumSelectedInputHint');
            visibleInputs[selectedInputIndex].element.focus();
          } else if (event.keyCode !== KeyboardUtils.keyCodes.shiftKey) {
            DomUtils.removeElement(hintContainingDiv);
            this.remove();
            return true;
          }
          return false;
        }
      });
    }
  });

  onKeypress = function(event) {
    var keyChar;
    if (!handlerStack.bubbleEvent('keypress', event)) {
      return;
    }
    keyChar = "";
    if (event.keyCode > 31) {
      keyChar = String.fromCharCode(event.charCode);
      if (keyChar === "f" && KeyboardUtils.isPrimaryModifierKey(event)) {
        enterInsertModeWithoutShowingIndicator();
        return;
      }
      if (keyChar) {
        if (findMode) {
          handleKeyCharForFindMode(keyChar);
          return DomUtils.suppressEvent(event);
        } else if (!isInsertMode() && !findMode) {
          if (currentCompletionKeys.indexOf(keyChar) !== -1) {
            DomUtils.suppressEvent(event);
          }
          return keyPort.postMessage({
            keyChar: keyChar,
            frameId: frameId
          });
        }
      }
    }
  };

  onKeydown = function(event) {
    var i, keyChar, modifiers;
    if (!handlerStack.bubbleEvent('keydown', event)) {
      return;
    }
    keyChar = "";
    if (((event.metaKey || event.ctrlKey || event.altKey) && event.keyCode > 31) || event.keyIdentifier.slice(0, 2) !== "U+") {
      keyChar = KeyboardUtils.getKeyChar(event);
      if (keyChar !== "") {
        modifiers = [];
        if (event.shiftKey) {
          keyChar = keyChar.toUpperCase();
        }
        if (event.metaKey) {
          modifiers.push("m");
        }
        if (event.ctrlKey) {
          modifiers.push("c");
        }
        if (event.altKey) {
          modifiers.push("a");
        }
        for (i in modifiers) {
          keyChar = modifiers[i] + "-" + keyChar;
        }
        if (modifiers.length > 0 || keyChar.length > 1) {
          keyChar = "<" + keyChar + ">";
        }
      }
    }
    if (isInsertMode() && KeyboardUtils.isEscape(event)) {
      if (!isEmbed(event.srcElement)) {
        if (isEditable(event.srcElement)) {
          event.srcElement.blur();
        }
        exitInsertMode();
        DomUtils.suppressEvent(event);
      }
    } else if (findMode) {
      if (KeyboardUtils.isEscape(event)) {
        handleEscapeForFindMode();
        DomUtils.suppressEvent(event);
      } else if (event.keyCode === keyCodes.backspace || event.keyCode === keyCodes.deleteKey) {
        handleDeleteForFindMode();
        DomUtils.suppressEvent(event);
      } else if (event.keyCode === keyCodes.enter) {
        handleEnterForFindMode();
        DomUtils.suppressEvent(event);
      } else if (!modifiers) {
        event.stopPropagation();
      }
    } else if (isShowingHelpDialog && KeyboardUtils.isEscape(event)) {
      hideHelpDialog();
    } else if (!isInsertMode() && !findMode) {
      if (keyChar) {
        if (currentCompletionKeys.indexOf(keyChar) !== -1) {
          DomUtils.suppressEvent(event);
        }
        keyPort.postMessage({
          keyChar: keyChar,
          frameId: frameId
        });
      } else if (KeyboardUtils.isEscape(event)) {
        keyPort.postMessage({
          keyChar: "<ESC>",
          frameId: frameId
        });
      }
    }
    if (keyChar === "" && !isInsertMode() && (currentCompletionKeys.indexOf(KeyboardUtils.getKeyChar(event)) !== -1 || isValidFirstKey(KeyboardUtils.getKeyChar(event)))) {
      return event.stopPropagation();
    }
  };

  onKeyup = function(event) {
    if (!handlerStack.bubbleEvent('keyup', event)) {

    }
  };

  checkIfEnabledForUrl = function() {
    var url;
    url = window.location.toString();
    return chrome.extension.sendRequest({
      handler: "isEnabledForUrl",
      url: url
    }, function(response) {
      isEnabledForUrl = response.isEnabledForUrl;
      if (isEnabledForUrl) {
        return initializeWhenEnabled();
      } else if (HUD.isReady()) {
        return HUD.hide();
      }
    });
  };

  refreshCompletionKeys = function(response) {
    if (response) {
      currentCompletionKeys = response.completionKeys;
      if (response.validFirstKeys) {
        return validFirstKeys = response.validFirstKeys;
      }
    } else {
      return chrome.extension.sendRequest({
        handler: "getCompletionKeys"
      }, refreshCompletionKeys);
    }
  };

  isValidFirstKey = function(keyChar) {
    return validFirstKeys[keyChar] || /[1-9]/.test(keyChar);
  };

  onFocusCapturePhase = function(event) {
    if (isFocusable(event.target) && !findMode) {
      return enterInsertModeWithoutShowingIndicator(event.target);
    }
  };

  onBlurCapturePhase = function(event) {
    if (isFocusable(event.target)) {
      return exitInsertMode(event.target);
    }
  };

  isFocusable = function(element) {
    return isEditable(element) || isEmbed(element);
  };

  isEmbed = function(element) {
    return ["embed", "object"].indexOf(element.nodeName.toLowerCase()) > 0;
  };

  isEditable = function(target) {
    var focusableElements, noFocus, nodeName;
    if (target.isContentEditable) {
      return true;
    }
    nodeName = target.nodeName.toLowerCase();
    noFocus = ["radio", "checkbox"];
    if (nodeName === "input" && noFocus.indexOf(target.type) === -1) {
      return true;
    }
    focusableElements = ["textarea", "select"];
    return focusableElements.indexOf(nodeName) >= 0;
  };

  window.enterInsertMode = function(target) {
    enterInsertModeWithoutShowingIndicator(target);
    return HUD.show("Insert mode");
  };

  enterInsertModeWithoutShowingIndicator = function(target) {
    return insertModeLock = target;
  };

  exitInsertMode = function(target) {
    if (target === void 0 || insertModeLock === target) {
      insertModeLock = null;
      return HUD.hide();
    }
  };

  isInsertMode = function() {
    return insertModeLock !== null;
  };

  updateFindModeQuery = function() {
    var hasNoIgnoreCaseFlag, pattern, text;
    findModeQuery.isRegex = settings.get('regexFindMode');
    hasNoIgnoreCaseFlag = false;
    findModeQuery.parsedQuery = findModeQuery.rawQuery.replace(/\\./g, function(match) {
      switch (match) {
        case "\\r":
          findModeQuery.isRegex = true;
          return "";
        case "\\R":
          findModeQuery.isRegex = false;
          return "";
        case "\\I":
          hasNoIgnoreCaseFlag = true;
          return "";
        case "\\\\":
          return "\\";
        default:
          return match;
      }
    });
    findModeQuery.ignoreCase = !hasNoIgnoreCaseFlag && !/[A-Z]/.test(findModeQuery.parsedQuery);
    if (findModeQuery.isRegex) {
      try {
        pattern = new RegExp(findModeQuery.parsedQuery, "g" + (findModeQuery.ignoreCase ? "i" : ""));
      } catch (error) {
        return;
      }
      text = document.body.innerText;
      findModeQuery.regexMatches = text.match(pattern);
      return findModeQuery.activeRegexIndex = 0;
    }
  };

  handleKeyCharForFindMode = function(keyChar) {
    findModeQuery.rawQuery += keyChar;
    updateFindModeQuery();
    performFindInPlace();
    return showFindModeHUDForQuery();
  };

  handleEscapeForFindMode = function() {
    var range, selection;
    exitFindMode();
    document.body.classList.remove("vimiumFindMode");
    selection = window.getSelection();
    if (!selection.isCollapsed) {
      range = window.getSelection().getRangeAt(0);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    }
    return focusFoundLink() || selectFoundInputElement();
  };

  handleDeleteForFindMode = function() {
    if (findModeQuery.rawQuery.length === 0) {
      exitFindMode();
      return performFindInPlace();
    } else {
      findModeQuery.rawQuery = findModeQuery.rawQuery.substring(0, findModeQuery.rawQuery.length - 1);
      updateFindModeQuery();
      performFindInPlace();
      return showFindModeHUDForQuery();
    }
  };

  handleEnterForFindMode = function() {
    exitFindMode();
    focusFoundLink();
    document.body.classList.add("vimiumFindMode");
    return settings.set("findModeRawQuery", findModeQuery.rawQuery);
  };

  performFindInPlace = function() {
    var cachedScrollX, cachedScrollY, query;
    cachedScrollX = window.scrollX;
    cachedScrollY = window.scrollY;
    query = findModeQuery.isRegex ? getNextQueryFromRegexMatches(0) : findModeQuery.parsedQuery;
    executeFind(query, {
      backwards: true,
      caseSensitive: !findModeQuery.ignoreCase
    });
    window.scrollTo(cachedScrollX, cachedScrollY);
    return findModeQueryHasResults = executeFind(query, {
      caseSensitive: !findModeQuery.ignoreCase
    });
  };

  executeFind = function(query, options) {
    var oldFindMode, result;
    options = options || {};
    oldFindMode = findMode;
    findMode = true;
    document.body.classList.add("vimiumFindMode");
    HUD.hide(true);
    document.removeEventListener("selectionchange", restoreDefaultSelectionHighlight, true);
    result = window.find(query, options.caseSensitive, options.backwards, true, false, true, false);
    setTimeout(function() {
      return document.addEventListener("selectionchange", restoreDefaultSelectionHighlight, true);
    }, 0);
    findMode = oldFindMode;
    findModeAnchorNode = document.getSelection().anchorNode;
    return result;
  };

  restoreDefaultSelectionHighlight = function() {
    return document.body.classList.remove("vimiumFindMode");
  };

  focusFoundLink = function() {
    var link;
    if (findModeQueryHasResults) {
      link = getLinkFromSelection();
      if (link) {
        return link.focus();
      }
    }
  };

  isDOMDescendant = function(parent, child) {
    var node;
    node = child;
    while (node !== null) {
      if (node === parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  };

  selectFoundInputElement = function() {
    if (findModeQueryHasResults && document.activeElement && DomUtils.isSelectable(document.activeElement) && isDOMDescendant(findModeAnchorNode, document.activeElement)) {
      DomUtils.simulateSelect(document.activeElement);
      return enterInsertModeWithoutShowingIndicator(document.activeElement);
    }
  };

  getNextQueryFromRegexMatches = function(stepSize) {
    var totalMatches;
    if (!findModeQuery.regexMatches) {
      return "";
    }
    totalMatches = findModeQuery.regexMatches.length;
    findModeQuery.activeRegexIndex += stepSize + totalMatches;
    findModeQuery.activeRegexIndex %= totalMatches;
    return findModeQuery.regexMatches[findModeQuery.activeRegexIndex];
  };

  findAndFocus = function(backwards) {
    var elementCanTakeInput, mostRecentQuery, query;
    mostRecentQuery = settings.get("findModeRawQuery") || "";
    if (mostRecentQuery !== findModeQuery.rawQuery) {
      findModeQuery.rawQuery = mostRecentQuery;
      updateFindModeQuery();
    }
    query = findModeQuery.isRegex ? getNextQueryFromRegexMatches(backwards ? -1 : 1) : findModeQuery.parsedQuery;
    findModeQueryHasResults = executeFind(query, {
      backwards: backwards,
      caseSensitive: !findModeQuery.ignoreCase
    });
    if (!findModeQueryHasResults) {
      HUD.showForDuration("No matches for '" + findModeQuery.rawQuery + "'", 1000);
      return;
    }
    elementCanTakeInput = document.activeElement && DomUtils.isSelectable(document.activeElement) && isDOMDescendant(findModeAnchorNode, document.activeElement);
    if (elementCanTakeInput) {
      handlerStack.push({
        keydown: function(event) {
          this.remove();
          if (KeyboardUtils.isEscape(event)) {
            DomUtils.simulateSelect(document.activeElement);
            enterInsertModeWithoutShowingIndicator(document.activeElement);
            return false;
          }
          return true;
        }
      });
    }
    return focusFoundLink();
  };

  window.performFind = function() {
    return findAndFocus();
  };

  window.performBackwardsFind = function() {
    return findAndFocus(true);
  };

  getLinkFromSelection = function() {
    var node;
    node = window.getSelection().anchorNode;
    while (node && node !== document.body) {
      if (node.nodeName.toLowerCase() === "a") {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  };

  followLink = function(linkElement) {
    if (linkElement.nodeName.toLowerCase() === "link") {
      return window.location.href = linkElement.href;
    } else {
      linkElement.scrollIntoView();
      linkElement.focus();
      return DomUtils.simulateClick(linkElement);
    }
  };

  findAndFollowLink = function(linkStrings) {
    var boundingClientRect, candidateLink, candidateLinks, computedStyle, exactWordRegex, i, link, linkMatches, linkString, links, linksXPath, _i, _j, _k, _l, _len, _len1, _len2, _len3, _m, _ref;
    linksXPath = DomUtils.makeXPath(["a", "*[@onclick or @role='link' or contains(@class, 'button')]"]);
    links = DomUtils.evaluateXPath(linksXPath, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
    candidateLinks = [];
    for (i = _i = _ref = links.snapshotLength - 1; _i >= 0; i = _i += -1) {
      link = links.snapshotItem(i);
      boundingClientRect = link.getBoundingClientRect();
      if (boundingClientRect.width === 0 || boundingClientRect.height === 0) {
        continue;
      }
      computedStyle = window.getComputedStyle(link, null);
      if (computedStyle.getPropertyValue("visibility") !== "visible" || computedStyle.getPropertyValue("display") === "none") {
        continue;
      }
      linkMatches = false;
      for (_j = 0, _len = linkStrings.length; _j < _len; _j++) {
        linkString = linkStrings[_j];
        if (link.innerText.toLowerCase().indexOf(linkString) !== -1) {
          linkMatches = true;
          break;
        }
      }
      if (!linkMatches) {
        continue;
      }
      candidateLinks.push(link);
    }
    if (candidateLinks.length === 0) {
      return;
    }
    for (_k = 0, _len1 = candidateLinks.length; _k < _len1; _k++) {
      link = candidateLinks[_k];
      link.wordCount = link.innerText.trim().split(/\s+/).length;
    }
    candidateLinks.forEach(function(a, i) {
      return a.originalIndex = i;
    });
    candidateLinks = candidateLinks.sort(function(a, b) {
      if (a.wordCount === b.wordCount) {
        return a.originalIndex - b.originalIndex;
      } else {
        return a.wordCount - b.wordCount;
      }
    }).filter(function(a) {
      return a.wordCount <= candidateLinks[0].wordCount + 1;
    });
    for (_l = 0, _len2 = linkStrings.length; _l < _len2; _l++) {
      linkString = linkStrings[_l];
      exactWordRegex = /\b/.test(linkString[0]) || /\b/.test(linkString[linkString.length - 1]) ? new RegExp("\\b" + linkString + "\\b", "i") : new RegExp(linkString, "i");
      for (_m = 0, _len3 = candidateLinks.length; _m < _len3; _m++) {
        candidateLink = candidateLinks[_m];
        if (exactWordRegex.test(candidateLink.innerText)) {
          followLink(candidateLink);
          return true;
        }
      }
    }
    return false;
  };

  findAndFollowRel = function(value) {
    var element, elements, relTags, tag, _i, _j, _len, _len1;
    relTags = ["link", "a", "area"];
    for (_i = 0, _len = relTags.length; _i < _len; _i++) {
      tag = relTags[_i];
      elements = document.getElementsByTagName(tag);
      for (_j = 0, _len1 = elements.length; _j < _len1; _j++) {
        element = elements[_j];
        if (element.hasAttribute("rel") && element.rel === value) {
          followLink(element);
          return true;
        }
      }
    }
  };

  window.goPrevious = function() {
    var previousPatterns, previousStrings;
    previousPatterns = settings.get("previousPatterns") || "";
    previousStrings = previousPatterns.split(",").filter(function(s) {
      return s.length;
    });
    return findAndFollowRel("prev") || findAndFollowLink(previousStrings);
  };

  window.goNext = function() {
    var nextPatterns, nextStrings;
    nextPatterns = settings.get("nextPatterns") || "";
    nextStrings = nextPatterns.split(",").filter(function(s) {
      return s.length;
    });
    return findAndFollowRel("next") || findAndFollowLink(nextStrings);
  };

  showFindModeHUDForQuery = function() {
    if (findModeQueryHasResults || findModeQuery.parsedQuery.length === 0) {
      return HUD.show("/" + findModeQuery.rawQuery);
    } else {
      return HUD.show("/" + findModeQuery.rawQuery + " (No Matches)");
    }
  };

  window.enterFindMode = function() {
    findModeQuery = {
      rawQuery: ""
    };
    findMode = true;
    return HUD.show("/");
  };

  exitFindMode = function() {
    findMode = false;
    return HUD.hide();
  };

  window.showHelpDialog = function(html, fid) {
    var VimiumHelpDialog, container;
    if (isShowingHelpDialog || !document.body || fid !== frameId) {
      return;
    }
    isShowingHelpDialog = true;
    container = document.createElement("div");
    container.id = "vimiumHelpDialogContainer";
    container.className = "vimiumReset";
    document.body.appendChild(container);
    container.innerHTML = html;
    container.getElementsByClassName("closeButton")[0].addEventListener("click", hideHelpDialog, false);
    VimiumHelpDialog = {
      getShowAdvancedCommands: function() {
        return settings.get("helpDialog_showAdvancedCommands");
      },
      init: function() {
        this.dialogElement = document.getElementById("vimiumHelpDialog");
        this.dialogElement.getElementsByClassName("toggleAdvancedCommands")[0].addEventListener("click", VimiumHelpDialog.toggleAdvancedCommands, false);
        this.dialogElement.style.maxHeight = window.innerHeight - 80;
        return this.showAdvancedCommands(this.getShowAdvancedCommands());
      },
      toggleAdvancedCommands: function(event) {
        var showAdvanced;
        event.preventDefault();
        showAdvanced = VimiumHelpDialog.getShowAdvancedCommands();
        VimiumHelpDialog.showAdvancedCommands(!showAdvanced);
        return settings.set("helpDialog_showAdvancedCommands", !showAdvanced);
      },
      showAdvancedCommands: function(visible) {
        var advancedEls, el, _i, _len, _results;
        VimiumHelpDialog.dialogElement.getElementsByClassName("toggleAdvancedCommands")[0].innerHTML = visible ? "Hide advanced commands" : "Show advanced commands";
        advancedEls = VimiumHelpDialog.dialogElement.getElementsByClassName("advanced");
        _results = [];
        for (_i = 0, _len = advancedEls.length; _i < _len; _i++) {
          el = advancedEls[_i];
          _results.push(el.style.display = visible ? "table-row" : "none");
        }
        return _results;
      }
    };
    VimiumHelpDialog.init();
    return container.getElementsByClassName("optionsPage")[0].addEventListener("click", function() {
      return chrome.extension.sendRequest({
        handler: "openOptionsPageInNewTab"
      });
    }, false);
  };

  hideHelpDialog = function(clickEvent) {
    var helpDialog;
    isShowingHelpDialog = false;
    helpDialog = document.getElementById("vimiumHelpDialogContainer");
    if (helpDialog) {
      helpDialog.parentNode.removeChild(helpDialog);
    }
    if (clickEvent) {
      return clickEvent.preventDefault();
    }
  };

  toggleHelpDialog = function(html, fid) {
    if (isShowingHelpDialog) {
      return hideHelpDialog();
    } else {
      return showHelpDialog(html, fid);
    }
  };

  HUD = {
    _tweenId: -1,
    _displayElement: null,
    _upgradeNotificationElement: null,
    showForDuration: function(text, duration) {
      HUD.show(text);
      return HUD._showForDurationTimerId = setTimeout((function() {
        return HUD.hide();
      }), duration);
    },
    show: function(text) {
      if (!HUD.enabled()) {
        return;
      }
      clearTimeout(HUD._showForDurationTimerId);
      HUD.displayElement().innerHTML = text;
      clearInterval(HUD._tweenId);
      HUD._tweenId = Tween.fade(HUD.displayElement(), 1.0, 150);
      return HUD.displayElement().style.display = "";
    },
    showUpgradeNotification: function(version) {
      var links;
      HUD.upgradeNotificationElement().innerHTML = "Vimium has been updated to      <a class='vimiumReset'      href='https://chrome.google.com/extensions/detail/dbepggeogbaibhgnhhndojpepiihcmeb'>      " + version + "</a>.<a class='vimiumReset close-button' href='#'>x</a>";
      links = HUD.upgradeNotificationElement().getElementsByTagName("a");
      links[0].addEventListener("click", HUD.onUpdateLinkClicked, false);
      links[1].addEventListener("click", function(event) {
        event.preventDefault();
        return HUD.onUpdateLinkClicked();
      });
      return Tween.fade(HUD.upgradeNotificationElement(), 1.0, 150);
    },
    onUpdateLinkClicked: function(event) {
      HUD.hideUpgradeNotification();
      return chrome.extension.sendRequest({
        handler: "upgradeNotificationClosed"
      });
    },
    hideUpgradeNotification: function(clickEvent) {
      return Tween.fade(HUD.upgradeNotificationElement(), 0, 150, function() {
        return HUD.upgradeNotificationElement().style.display = "none";
      });
    },
    displayElement: function() {
      if (!HUD._displayElement) {
        HUD._displayElement = HUD.createHudElement();
        HUD._displayElement.style.right = "150px";
      }
      return HUD._displayElement;
    },
    upgradeNotificationElement: function() {
      if (!HUD._upgradeNotificationElement) {
        HUD._upgradeNotificationElement = HUD.createHudElement();
        HUD._upgradeNotificationElement.style.right = "315px";
      }
      return HUD._upgradeNotificationElement;
    },
    createHudElement: function() {
      var element;
      element = document.createElement("div");
      element.className = "vimiumReset vimiumHUD";
      document.body.appendChild(element);
      return element;
    },
    hide: function(immediate) {
      clearInterval(HUD._tweenId);
      if (immediate) {
        return HUD.displayElement().style.display = "none";
      } else {
        return HUD._tweenId = Tween.fade(HUD.displayElement(), 0, 150, function() {
          return HUD.displayElement().style.display = "none";
        });
      }
    },
    isReady: function() {
      return document.body !== null;
    },
    enabled: function() {
      return !settings.get("hideHud");
    }
  };

  Tween = {
    fade: function(element, toAlpha, duration, onComplete) {
      var state;
      state = {};
      state.duration = duration;
      state.startTime = (new Date()).getTime();
      state.from = parseInt(element.style.opacity) || 0;
      state.to = toAlpha;
      state.onUpdate = function(value) {
        element.style.opacity = value;
        if (value === state.to && onComplete) {
          return onComplete();
        }
      };
      state.timerId = setInterval((function() {
        return Tween.performTweenStep(state);
      }), 50);
      return state.timerId;
    },
    performTweenStep: function(state) {
      var elapsed, value;
      elapsed = (new Date()).getTime() - state.startTime;
      if (elapsed >= state.duration) {
        clearInterval(state.timerId);
        return state.onUpdate(state.to);
      } else {
        value = (elapsed / state.duration) * (state.to - state.from) + state.from;
        return state.onUpdate(value);
      }
    }
  };

  initializePreDomReady();

  window.addEventListener("DOMContentLoaded", initializeOnDomReady);

  window.onbeforeunload = function() {
    return chrome.extension.sendRequest({
      handler: "updateScrollPosition",
      scrollX: window.scrollX,
      scrollY: window.scrollY
    });
  };

  root = typeof exports !== "undefined" && exports !== null ? exports : window;

  root.settings = settings;

  root.HUD = HUD;

  root.handlerStack = handlerStack;

  root.frameId = frameId;

}).call(this);
