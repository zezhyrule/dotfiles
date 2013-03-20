// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * @fileoverview Content Script injected into page to send raw HTML to the
 * background page in response to the browser action. Since this file
 * is injected into the currently viewed page, we cannot
 * use Closure's goog.require().
 * @author jeffcon@google.com (Jeff Conrad)
 * @suppress {checkProvides} Suppress JSCompiler's warning
 *     about constructors that do not have a goog.provide().
 */


var gdocscsr = gdocscsr || {};



/**
 * Content Script to add an HTML comment about download time and
 * location, then send the raw HTML to the background apge.
 * @constructor
 */
gdocscsr.ContentScriptRaw = function() {
};


/**
 * Gets the entire document then sends the result to the background page.
 */
gdocscsr.ContentScriptRaw.prototype.init = function() {
  var htmlElem = document.getElementsByTagName('html')[0];
  var html = this.createHeader_() + htmlElem.outerHTML;
  chrome.extension.sendMessage(null, html);
};


/**
 * Creates a header comment which can be added to the HTML.
 * @return {string} An HTML-safe string indicating where the download
 *     originated.
 * @private
 */
gdocscsr.ContentScriptRaw.prototype.createHeader_ = function() {
  var date = new Date();
  return '<!-- Downloaded on ' + date.toLocaleString() +
      ' from ' + window.location + ' -->\n';
};


/**
 * Initializes this content script.
 */
var contentScriptRaw = new gdocscsr.ContentScriptRaw();
contentScriptRaw.init();
