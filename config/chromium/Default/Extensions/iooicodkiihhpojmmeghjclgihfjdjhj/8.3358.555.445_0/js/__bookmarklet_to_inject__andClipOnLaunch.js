(function()
{
	//	vars
	_readableTargetPath = 'chrome-extension://iooicodkiihhpojmmeghjclgihfjdjhj/js/target.js';

	
	//	if body is missing, stop
	if (document.getElementsByTagName('body').length > 0); else { return; }

	//	if bookmarklet was clicked but Readable hasn't returned yet, stop
	if (window.$readable) {	if (window.$readable.bookmarkletTimer) { return; } }

	//	if Readable doesn't yet exist, create it
	else { window.$readable = {}; }

	//	also do clip
	window.$readable.clipOnFirstLaunch = true;
	
	//	the bookmarklet was clicked
	window.$readable.bookmarkletTimer = true;

	//	if allready loaded, call
	if (window.$readable.bookmarkletClicked) { window.$readable.bookmarkletClicked(); return; }

	//	else, call script
	_readableScript = document.createElement('script');
	_readableScript.setAttribute('src', _readableTargetPath);
	document.getElementsByTagName('body')[0].appendChild(_readableScript);
})();
