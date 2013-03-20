
	//	launch function
	//	===============
		function __readable_launch ($R)
		{
			//	vars
			//	====
				$R.win = window;
				$R.document = window.document;
			
			//	init
			//	====
				
    //  version
    //  =======
        $R.version = '3358.253.544';

	//	paths	
	//	=====
		$R.paths = 
		{
			'main':		'chrome-extension://iooicodkiihhpojmmeghjclgihfjdjhj/',
			'evernote':	'https://www.evernote.com/'
		};

	//	versioning
	//	==========
		$R.versioning =
		{
			'file_name_bulk_js': 		        'bulk.js',
			'file_name_bulk_css':		        'bulk.css',
			'file_name_jQuery_js':		        'jQuery.js',
			'file_name_miniColors_js':	        'jquery.miniColors.js',
			'file_name_miniColors_css':	        'jquery.miniColors.css',
			'file_name_flexSelect_js':	        'jquery.flexSelect.js',
			'file_name_liquidMetal_js':	        'liquidMetal.js',
			'file_name_flexSelect_css':	        'flexSelect.css',
			'file_name_audio_js':	            'audio.js',
            
            'file_name_base--theme-1_css':	    'base--theme-1.css',
            'file_name_base--theme-2_css':	    'base--theme-2.css',
            'file_name_base--theme-3_css':	    'base--theme-3.css',
            'file_name_base--blueprint_css':    'base--theme-blueprint.css',

            'file_name_defined--theme-1_css':	'defined--theme-1.css',
            'file_name_defined--theme-2_css':	'defined--theme-2.css',
            'file_name_defined--theme-3_css':	'defined--theme-3.css'
        };

			
			//	custom
			//	======
                $R.customScript = false;
				

			//	write
			//	=====
				
	//	iframe
	//	======
		var 
			_iframeElement = document.createElement('iframe'),
			_iframeHTML = ''
			+	'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"'
			+		' "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">'
			+	'<html id="html" xmlns="http://www.w3.org/1999/xhtml">'
			+	'<head>'
			+		'<link rel="stylesheet" href="'+$R.paths['main']+'css/'+$R.versioning['file_name_bulk_css']+'" type="text/css" />'
			+	'</head>'
			+	'<body id="body">'
			+		'<div id="bodyContent"></div>'
			+		'<script type="text/javascript" src="'+$R.paths['main']+'libs/'+$R.versioning['file_name_jQuery_js']+'"></script>'
			+		'<script type="text/javascript" src="'+$R.paths['main']+'libs/'+$R.versioning['file_name_audio_js']+'"></script>'
			+		(($R.customScript > '') ? '<script type="text/javascript" src="'+$R.customScript+'"></script>' : '')
			+		'<script type="text/javascript" src="'+$R.paths['main']+'js/'+$R.versioning['file_name_bulk_js']+'"></script>'
			+	'</body>'
			+	'</html>'
		;
		_iframeElement.setAttribute('id', 'readable_iframe');
		_iframeElement.setAttribute('frameBorder', '0');
		_iframeElement.setAttribute('allowTransparency', 'true');
		_iframeElement.setAttribute('scrolling', 'auto');
	

	//	css
	//	===
		var 
			_cssElement = document.createElement('style'),
			_cssText = ''
			+	'#readable_iframe { '
			+		'margin: 0; padding: 0; border: none; '
			+		'position: absolute; '
			+		'width: 100%; height: 100%; min-height: 100%; '
			+		'top: -100%; left: -100%; '
			+		'z-index: 2147483647 !important; '
			+	'} '
		;
		_cssElement.setAttribute('id', 'readableCSS1');
		_cssElement.setAttribute('type', 'text/css');
		if (_cssElement.styleSheet) { _cssElement.styleSheet.cssText = _cssText; }
			else { _cssElement.appendChild(document.createTextNode(_cssText)); }

		
	//	write
	//	=====

		var _body = document.getElementsByTagName('body')[0];
			_body.appendChild(_cssElement);
			_body.appendChild(_iframeElement);
		
		var _iframe = document.getElementById('readable_iframe');
		var _doc = (_iframe.contentDocument || _iframe.contentWindow.document);
			_doc.open();
			_doc.write(_iframeHTML);
			_doc.close();

		}

        
    //  $readable || $clearly
    //  =====================
        switch (true)
        {
            case ((window.$readable) && !(window.$clearly)):
                window.$clearly = window.$readable;
                break;
                
            case ((window.$clearly) && !(window.$readable)):
                window.$readable = window.$clearly;
                break;
        }
        
		
	//	no readyState
	//	=============
		if (document.readyState); else { __readable_launch(window.$readable); } 
		
		
	//	with ready state
	//	================
		function __readable_launch_ready(delayedNrTimes)
		{
			//if (window.console && window.console.log) { window.console.log('launch ready '+delayedNrTimes);}
			
			if (document.readyState != 'complete' && delayedNrTimes < 30)
				{ setTimeout(function () { __readable_launch_ready(delayedNrTimes + 1); }, 100); return; }
			
			__readable_launch(window.$readable);
		}

		__readable_launch_ready(0);
