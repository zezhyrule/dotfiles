
	//	chrome model
	
	//	translation
	//	===========
		function __get_translation(_key)
		{
            //  default
            var _t = chrome.i18n.getMessage('options__'+_key);
            
            //  custom
            switch (true)
            {
                case (_key.match(/^features__/) != null):
                case (_key.match(/^menu__speak__/) != null):
                    _t = chrome.i18n.getMessage('inside__'+_key);
                    break;
            }
            
            //  return
			return (_t > '' ? _t : '');
		}

		
	//	get options
	//	===========
		function __get_saved__options()
		{
			
	//	encode
	//	======
		function __encodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == '') { return 'none'; }
			
			//	encode
			return encodeURIComponent(_string)
				.replace(/!/g, '%21')
				.replace(/'/g, '%27')
				.replace(/\(/g, '%28')
				.replace(/\)/g, '%29')
				.replace(/\*/g, '%2A')
			;
		}

		
	//	decode
	//	======
		function __decodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == 'none') { return ''; }
			
			//	decode
			return decodeURIComponent(_string);
		}
	
	

			
	//	__encodeURIComponentForReadable must be defined

	var __default_options = 
	{
		'text_font': 			__encodeURIComponentForReadable('"PT Serif"'),
		'text_font_header': 	__encodeURIComponentForReadable('"PT Serif"'),
		'text_font_monospace': 	__encodeURIComponentForReadable('Inconsolata'),
		'text_size': 			__encodeURIComponentForReadable('16px'),
		'text_line_height': 	__encodeURIComponentForReadable('1.5em'),
		'box_width': 			__encodeURIComponentForReadable('36em'),
		'color_background': 	__encodeURIComponentForReadable('#f3f2ee'),
		'color_text': 			__encodeURIComponentForReadable('#1f0909'),
		'color_links': 			__encodeURIComponentForReadable('#065588'),
		'text_align': 			__encodeURIComponentForReadable('normal'),
		'base': 				__encodeURIComponentForReadable('theme-1'),
		'footnote_links': 		__encodeURIComponentForReadable('on_print'),
		'large_graphics': 		__encodeURIComponentForReadable('do_nothing'),
		'custom_css': 			__encodeURIComponentForReadable('')
	};

		
			var _return = {};

			for (var _x in __default_options) { _return[_x] = localStorage[_x]; }
			return _return;
		}
		
		
	//	get vars	
	//	========
		function __get_saved__vars()
		{
			
	//	encode
	//	======
		function __encodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == '') { return 'none'; }
			
			//	encode
			return encodeURIComponent(_string)
				.replace(/!/g, '%21')
				.replace(/'/g, '%27')
				.replace(/\(/g, '%28')
				.replace(/\)/g, '%29')
				.replace(/\*/g, '%2A')
			;
		}

		
	//	decode
	//	======
		function __decodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == 'none') { return ''; }
			
			//	decode
			return decodeURIComponent(_string);
		}
	
	

			
	//	__encodeURIComponentForReadable must be defined

	var __default_vars = 
	{
		'theme': 				    __encodeURIComponentForReadable('theme-1'),     /* theme-1, theme-2, theme-3, custom */
		
		'keys_activation': 		    __encodeURIComponentForReadable('Control + Alt + Right Arrow'),
		'keys_clip': 			    __encodeURIComponentForReadable('Control + Alt + Up Arrow'),
		'keys_highlight': 		    __encodeURIComponentForReadable('Control + Alt + H'),
		'keys_speech': 		        __encodeURIComponentForReadable('Control + Alt + S'),

		'clip_tag': 			    __encodeURIComponentForReadable(''),
		'clip_notebook': 			__encodeURIComponentForReadable(''),
		'clip_notebook_guid': 		__encodeURIComponentForReadable(''),
		
        'related_notes':            __encodeURIComponentForReadable('enabled'),     /* enabled, just_at_bottom, disabled */
        'smart_filing':             __encodeURIComponentForReadable('enabled'),     /* enabled, just_notebooks, just_tags, disabled */
        'smart_filing_for_business':__encodeURIComponentForReadable('disabled'),    /* enabled, disabled */

		'speech_speed': 			__encodeURIComponentForReadable('normal'),      /* slowest, slow, slower, normal, faster, fast, fastest */
		'speech_gender': 			__encodeURIComponentForReadable('default'),     /* default, female, male */
        
        'open_notes_in':            __encodeURIComponentForReadable('web'),         /* web, desktop */
        
		'custom_theme_options':	    __encodeURIComponentForReadable('')             /* the custom theme options get serialized into this */
	};

		
			var _return = {};
			for (var _x in __default_vars) { _return[_x] = localStorage[_x]; }
			
			return _return;
		}
	
		
	//	save
	//	====
		function __save_someStuff(_to_save)
		{
			for (var _x in _to_save)
				{ localStorage[_x] = _to_save[_x]; }
		}

		
	//	get evernote credentials
	//	========================
		function __get_stored_evernote_credentials()
		{
			switch (true)
			{
				case (!(localStorage['storedEvernoteUsername'] > '')):
				case (!(localStorage['storedEvernotePassword'] > '')):
					return false;
			}
		
			var _r = {};
				_r.username = localStorage['storedEvernoteUsername'];
                _r.server = ((localStorage['storedEvernoteServer'] == 'main' || localStorage['storedEvernoteServer'] == 'china') ? localStorage['storedEvernoteServer'] : 'none');
				_r.password = 'encrypted';
                _r.password = __readable_by_evernote.__evernote_xor.decrypt(localStorage['storedEvernotePassword'], _r.username);
			return _r;
		}

		
	//	forget evernote credentials
	//	===========================
		function __forget_stored_evernote_credentials()
		{
			//	save
			__save_someStuff({
				'storedEvernoteUsername': '',
				'storedEvernotePassword': '',
                'storedEvernoteServer': '',
				'storedEvernoteLogoutOnNextAction' : 'yes'
			});
		}
		
        
    //  qa events
    //  =========
    
        function __set_servers_to_stage()
        {
            var w = chrome.extension.getBackgroundPage();
                w.__readable_by_evernote.__evernote_bootstrap.set_servers_to_stage();
                w.__readable_by_evernote.__evernote_bootstrap.disconnect();
                w.__readable_by_evernote.__evernote_remote.disconnect();
        }
        
        function __set_servers_to_live()
        {
            var w = chrome.extension.getBackgroundPage();
                w.__readable_by_evernote.__evernote_bootstrap.set_servers_to_live();
                w.__readable_by_evernote.__evernote_bootstrap.disconnect();
                w.__readable_by_evernote.__evernote_remote.disconnect();
        }
        
        function __set_simulate_chinese_locale()
        {
            var w = chrome.extension.getBackgroundPage();
                w.__readable_by_evernote.__evernote_bootstrap.set_simulate_chinese_locale();
                w.__readable_by_evernote.__evernote_bootstrap.disconnect();
                w.__readable_by_evernote.__evernote_remote.disconnect();
        }
        
        function __set_do_not_simulate_chinese_locale()
        {
            var w = chrome.extension.getBackgroundPage();
                w.__readable_by_evernote.__evernote_bootstrap.set_do_not_simulate_chinese_locale();
                w.__readable_by_evernote.__evernote_bootstrap.disconnect();
                w.__readable_by_evernote.__evernote_remote.disconnect();
        }
        
	
	//	firefox model
	

	//	main vars
    $options.paths = 
    {
        'main':		'chrome-extension://iooicodkiihhpojmmeghjclgihfjdjhj/',
        'evernote':	'https://www.evernote.com/'
    };
    
    $options.versioning =
    {
        'file_name_bulk_js': 		        'bulk.js',
        'file_name_bulk_css':		        'bulk.css',
        'file_name_jQuery_js':		        'jQuery.js',
        'file_name_audio_js':	            'audio.js',
        
        'file_name_base--theme-1_css':	    'base--theme-1.css',
        'file_name_base--theme-2_css':	    'base--theme-2.css',
        'file_name_base--theme-3_css':	    'base--theme-3.css',
        'file_name_base--blueprint_css':    'base--theme-blueprint.css',

        'file_name_defined--theme-1_css':	'defined--theme-1.css',
        'file_name_defined--theme-2_css':	'defined--theme-2.css',
        'file_name_defined--theme-3_css':	'defined--theme-3.css'
    };
    
    
    //  stored login
    $options['storedLogin'] = __get_stored_evernote_credentials();
	
	//	translations
	
	$options['__translations'] =
	{
		'title__page': 				                'Clearly / Options',
		'title__general': 			                'Options',
		'title__custom': 			                'Custom Theme',
		'title__speech': 			                'Text To Speech',
		'title__features': 			                'Clearly Features',
		
		'title__sub__keyboard':		                'Keyboard shortcuts',
		'message__keys':			                'To change, place cursor in field and strike key combination on your keyboard.',
		'message__keys_firefox':	                'Restart your browser, afer saving.',
		'keys_activation__label': 	                'View page in Clearly',
		'keys_clip__label': 		                'Clip to Evernote',
        'keys_highlight__label':                    'Highlight',
        'keys_speech__label':                       'Text To Speech',

		'title__sub__tags':			                'Tags',
		'message__tags':			                'Tags to apply, when you Clip to Evernote.',
        'clip_tag__no__label': 		                'Don\'t tag',
		'clip_tag__yes__label': 	                'Tag with',

		'title__sub__notebook':			            'Notebook',
		'message__notebook':			            'Notebook to clip to, when you Clip to Evernote.',
        'clip_notebook__no__label': 		        'Use Default Notebook',
		'clip_notebook__yes__label': 	            'Use this Notebook',
        'clip_notebook__your': 		                'Your Notebooks',
        'clip_notebook__shared': 		            'Shared Notebooks',
        'clip_notebook__business': 		            'Business Notebooks',
        
        'title__sub__smart_filing':                 'Smart Filing',
		'message__smart_filing':	                'Let Evernote determine what Notebook clips should go into, and what Tags they should get.',
        'smart_filing__enabled__label':             'Enable Smart Filing',
        'smart_filing__just_notebooks__label':      'Enable Smart Filing, but just for Notebboks',
        'smart_filing__just_tags__label':           'Enable Smart Filing, but just for Tags',
        'smart_filing__disabled__label':            'Disable Smart Filing',
        'smart_filing_for_business__label':         'Allow Smart Filing into Business Notebooks',

        'title__sub__related_notes':                'Related Notes',
		'message__related_notes':	                'Let Evernote fetch clips from your account that might be relevant to what you are reading now.',
        'related_notes__enabled__label':            'Enable Related Notes',
        'related_notes__just_at_bottom__label':     'Only show Related Notes at the bottom',
        'related_notes__disabled__label':           'Disable Related Notes',

        'title__sub__open_notes_in':                'Open notes in',
		'message__open_notes_in':	                'When openinig notes from Clearly, use a specific Evernote client.',
        'open_notes_in__web__label':                'Web client',
        'open_notes_in__desktop__label':            'Desktop client',
        
		'title__sub__account':		                'Account',
		'account__sign_out': 		                'Permanently signed in as [[=username]].',
		'account__sign_out_link': 	                'Sign out.',
		'account__signed_out': 		                'You are not permanently signed in. Click on the Evernote icon, in the Clearly sidebar, to sign in.',
		
		'text_font__label': 			            'Body Font',
		'text_font_header__label':		            'Header Font',
		'text_font_monospace__label':	            'Monospace Font',
		'text_size__label': 			            'Base Font Size',
		'text_line_height__label': 		            'Line Height',
		'box_width__label': 		    	        'Line Width',
		'color_background__label': 		            'Background Color',
		'color_text__label': 			            'Foreground Color',
		'color_links__label': 			            'Links Color',
		'text_align__label': 			            'Text Align',
		'base__label': 					            'Base CSS',
		'custom_css__label':			            'Custom CSS',
		'footnote_links__label':		            'Links as Footnotes',
		'large_graphics__label': 		            'Large Graphics',
		
		'values__text_align__Normal': 		        'Normal',
		'values__text_align__Justified': 	        'Justified',

		'values__base__Blueprint__not_translated': 	'Blueprint',
		'values__base__Theme_1__not_translated': 	'Newsprint',
		'values__base__Theme_2__not_translated': 	'Notable',
		'values__base__Theme_3__not_translated': 	'Night Owl',
        
		'values__base__Blueprint': 	                'Blueprint',
		'values__base__Theme_1': 	                'Newsprint',
		'values__base__Theme_2': 	                'Notable',
		'values__base__Theme_3': 	                'Night Owl',
		'values__base__None': 		                'None',
		
		'values__footnote_links__On_Print':         'On Print',
		'values__footnote_links__Always': 	        'Always',
		'values__footnote_links__Never': 	        'Never',
		
		'values__large_graphics__Do_Nothing': 		'Show Always',
		'values__large_graphics__Hide_on_Print': 	'Hide on Print',
		'values__large_graphics__Hide_Always': 		'Hide Always',
		
		'values__menu_placement__Top_Right': 	    'Top Right',
		'values__menu_placement__Bottom_Right':     'Bottom Right',
		
        'speech_speed__label':                      'Reading Speed',
        'values__speech_speed__fastest':            'Fastest',
        'values__speech_speed__fast':               'Fast',
        'values__speech_speed__faster':             'Faster',
        'values__speech_speed__normal':             'Normal',
        'values__speech_speed__slower':             'Slower',
        'values__speech_speed__slow':               'Slow',
        'values__speech_speed__slowest':            'Slowest',

        'speech_gender__label':                     'Reading Voice',
        'values__speech_gender__default':           'Default',
        'values__speech_gender__female':            'Female (if available)',
        'values__speech_gender__male':              'Male (if available)',

        'speech_demo__label':                       'Demo',
        'menu__speak__tooltip':                     'Text To Speech',
        'menu__speak__play__tooltip':               'Play',
        'menu__speak__pause__tooltip':              'Pause',
        'menu__speak__forward__tooltip':            'Go Forwards',
        'menu__speak__rewind__tooltip':             'Go Backwards',
        
		'button__save_general':                     'Save Options',
		'button__save_custom': 	                    'Save Theme',
		'button__more_options':                     'More Options',
		'button__reset_custom':                     'Reset',

        
        /* copied from bulk translations */
        /* ============================= */
        
        'features__speech__title':                      'Text To Speech',
        'features__speech__text':                       'Sit back and let Clearly read blog posts, articles, and web pages to you thanks to the new Text To Speech feature, available exclusively for Evernote Premium subscribers.',
        'features__speech__text__powered':              'Evernote Clearly is powered by [=service].',
        'features__speech__text__requires':             'Requires [=product].',
        'features__speech__text__available':            'Text To Speech in 21 languages:',
        'features__speech__text__available_languages':  'English, Japanese, Spanish, French, German, Chinese, Korean, Arabic, Czech, Danish, Dutch, Finnish, Greek, Hungarian, Italian, Norwegian, Polish, Portuguese, Russian, Swedish and Turkish.',
        'features__speech__text__try':                  'Try Text To Speech',
        'features__speech__text__upgrade':              'Upgrade to Evernote Premium',
        'features__speech__text__language':             'Language not supported',
        'features__speech__text__play':                 'Play using this language',
        'features__speech__text__cancel':               'Cancel',
        'features__speech__no_language_title':          'Language not supported',
        'features__speech__no_language_explanation':    'Evernote Clearly was not able to determine the language of this article. If you recognize the language, select it below and we\'ll play it.',
        
        'features__clipping__title': 'Clip to Evernote',
        'features__clipping__text':  'Save what you\'re reading to your Evernote account with one click. Access clips from any device, anytime in Evernote.',

        'features__highlighting__title': 'Highlighting',
        'features__highlighting__text':  'Highlight text you want to remember & quickly find it in your Evernote account. Highlighting changes you make in Clearly will be updated in your Evernote account automatically.',

        'features__related_notes__title': 'Related Notes',
        'features__related_notes__text':  'Magically rediscover notes from your Evernote account that are related to the page you are viewing. Related Notes are displayed at the bottom of the article or on the right side if space permits.',

        'features__smart_filing__title': 'Smart Filing',
        'features__smart_filing__text':  'Automatically assign tags to your Web clips and saves them to the appropriate notebook, so you don\'t have to.',
        
        'features__eula_notice':    'By using Clearly, you agree to our [=eula].',
        'features__close2':         'Close',
        
        
		'message__saved':			                'Settings will be in effect on any new tabs you use Clearly on.'
	};
	
	//	get from extension
	for (var x in $options.__translations)
	{
		var _t = __get_translation(x);
		if (_t > ''); else { continue; }
		
		$options.__translations[x] = _t;
	}
	
	//	custom firefox, keys message
	

	
	$('[translate]').each(function()
	{
		var 
			_$t = $(this),
            _tk = _$t.attr('translate'),
			_tt = $options.__translations[_tk],
            _tt = (_tt > '' ? _tt : '[' + _tk + ']')
		;
		
		//	X parameter
		if (_tt.indexOf('[=x]') > -1)
		{
			var _x = _$t.attr('translate_x');
				_t = _tt.replace('[=x]', _x);
		}
		
        //  __escapeForHTML
        
    //  escapeForHTML
    //  =============
        function __escapeForHTML(_string)
        {
            var _replace = {
                "&": "amp", 
                '"': "quot", 
                "<": "lt", 
                ">": "gt"
            };
            
            return _string.replace(
                /[&"<>]/g,
                function (_match) { return ("&" + _replace[_match] + ";"); }
            );
        }


        //  general or button
		switch (true)
		{
			case (_$t.attr('type') == 'button' && this.tagName.toLowerCase() == 'input'):
				_$t.attr('value', __escapeForHTML(_tt));
				break;
		
			default:
				_$t.html(__escapeForHTML(_tt));
				break;
		}
	});


	//	values
	
	//	general
	//	=======
		$options.__values_put__general = function ()
		{
			//	include
			//	=======
				
	//	encode
	//	======
		function __encodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == '') { return 'none'; }
			
			//	encode
			return encodeURIComponent(_string)
				.replace(/!/g, '%21')
				.replace(/'/g, '%27')
				.replace(/\(/g, '%28')
				.replace(/\)/g, '%29')
				.replace(/\*/g, '%2A')
			;
		}

		
	//	decode
	//	======
		function __decodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == 'none') { return ''; }
			
			//	decode
			return decodeURIComponent(_string);
		}
	
	

		
			//	vars
			//	====
				var _vars = __get_saved__vars();
				var _varsDecoded = {};

			//	decode
			//	======
				for (var _x in _vars)
					{ _varsDecoded[_x] = __decodeURIComponentForReadable(_vars[_x]); }
			
			//	set
			//	===
				$('#keys_activation__control').val(_varsDecoded['keys_activation']);
				$('#keys_clip__control').val(_varsDecoded['keys_clip']);
				$('#keys_highlight__control').val(_varsDecoded['keys_highlight']);
				$('#keys_speech__control').val(_varsDecoded['keys_speech']);

                var _clip_tag = _varsDecoded['clip_tag'];
				$('#clip_tag__control').val(_clip_tag);
				$('#clip_tag__radio__no').attr('checked', (!(_clip_tag > '')));
				$('#clip_tag__radio__yes').attr('checked', (_clip_tag > ''));

                var _clip_notebook_guid = _varsDecoded['clip_notebook_guid'];
				$('#clip_notebook_guid__control').attr('_selected', _clip_notebook_guid);
				$('#clip_notebook__radio__no').attr('checked', true);
				$('#clip_notebook__radio__yes').attr('checked', false);

                var _smart_filing_for_business = _varsDecoded['smart_filing_for_business'];
                if (_smart_filing_for_business == 'enabled') { $('#smart_filing_for_business__control').attr('checked', true); }
                
                var _smart_filing = _varsDecoded['smart_filing'];
                switch (true)
                {
                    case (_smart_filing == 'enabled'):
                        $('#smart_filing__radio__enabled').attr('checked', true); break;
                    case (_smart_filing == 'just_notebooks'):
                        $('#smart_filing__radio__just_notebooks').attr('checked', true); break;
                    case (_smart_filing == 'just_tags'):
                        $('#smart_filing__radio__just_tags').attr('checked', true); break;
                    case (_smart_filing == 'disabled'):
                        $('#smart_filing__radio__disabled').attr('checked', true); break;
                }
                
                var _related_notes = _varsDecoded['related_notes'];
                switch (true)
                {
                    case (_related_notes == 'enabled'):
                        $('#related_notes__radio__enabled').attr('checked', true); break;
                    case (_related_notes == 'just_at_bottom'):
                        $('#related_notes__radio__just_at_bottom').attr('checked', true); break;
                    case (_related_notes == 'disabled'):
                        $('#related_notes__radio__disabled').attr('checked', true); break;
                }

                var _open_notes_in = _varsDecoded['open_notes_in'];
                switch (true)
                {
                    case (_open_notes_in == 'web'):
                        $('#open_notes_in__radio__web').attr('checked', true); break;
                    case (_open_notes_in == 'desktop'):
                        $('#open_notes_in__radio__desktop').attr('checked', true); break;
                }
        };
		
        
	//	speech
	//	======
		$options.__values_put__speech = function ()
		{
			//	include
			//	=======
				
	//	encode
	//	======
		function __encodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == '') { return 'none'; }
			
			//	encode
			return encodeURIComponent(_string)
				.replace(/!/g, '%21')
				.replace(/'/g, '%27')
				.replace(/\(/g, '%28')
				.replace(/\)/g, '%29')
				.replace(/\*/g, '%2A')
			;
		}

		
	//	decode
	//	======
		function __decodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == 'none') { return ''; }
			
			//	decode
			return decodeURIComponent(_string);
		}
	
	

		
			//	vars
			//	====
				var _vars = __get_saved__vars();
				var _varsDecoded = {};

			//	decode
			//	======
				for (var _x in _vars)
					{ _varsDecoded[_x] = __decodeURIComponentForReadable(_vars[_x]); }
			
			//	set
			//	===
				$('#speech_speed__control').val(_varsDecoded['speech_speed']);
				$('#speech_gender__control').val(_varsDecoded['speech_gender']);
		};

		
	//	custom
	//	======
		$options.__values_put__custom = function ()
		{
			//	include
			//	=======
				
	//	encode
	//	======
		function __encodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == '') { return 'none'; }
			
			//	encode
			return encodeURIComponent(_string)
				.replace(/!/g, '%21')
				.replace(/'/g, '%27')
				.replace(/\(/g, '%28')
				.replace(/\)/g, '%29')
				.replace(/\*/g, '%2A')
			;
		}

		
	//	decode
	//	======
		function __decodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == 'none') { return ''; }
			
			//	decode
			return decodeURIComponent(_string);
		}
	
	

				
	//	__encodeURIComponentForReadable must be defined

	var __default_options = 
	{
		'text_font': 			__encodeURIComponentForReadable('"PT Serif"'),
		'text_font_header': 	__encodeURIComponentForReadable('"PT Serif"'),
		'text_font_monospace': 	__encodeURIComponentForReadable('Inconsolata'),
		'text_size': 			__encodeURIComponentForReadable('16px'),
		'text_line_height': 	__encodeURIComponentForReadable('1.5em'),
		'box_width': 			__encodeURIComponentForReadable('36em'),
		'color_background': 	__encodeURIComponentForReadable('#f3f2ee'),
		'color_text': 			__encodeURIComponentForReadable('#1f0909'),
		'color_links': 			__encodeURIComponentForReadable('#065588'),
		'text_align': 			__encodeURIComponentForReadable('normal'),
		'base': 				__encodeURIComponentForReadable('theme-1'),
		'footnote_links': 		__encodeURIComponentForReadable('on_print'),
		'large_graphics': 		__encodeURIComponentForReadable('do_nothing'),
		'custom_css': 			__encodeURIComponentForReadable('')
	};

		
			//	reset options
			//	=============
				$options._resetOptions = __get_saved__options();
				$options._resetOptionsDecoded = {};
				
				for (var _x in $options._resetOptions)
					{ $options._resetOptionsDecoded[_x] = __decodeURIComponentForReadable($options._resetOptions[_x]); }
				
			//	custom options -- [[=option_name][=option_value]]
			//	==============
				var 
					_vars = __get_saved__vars(),
					_customOptionsAggregate = __decodeURIComponentForReadable(_vars['custom_theme_options']),
					_customOptions = {},
					_customOptionsDecoded = {},
					_customOptionsUse = true
				;
				
				_customOptionsAggregate.replace
				(
					/\[\[=(.*?)\]\[=(.*?)\]\]/gi,
					function (_match, _name, _value)
					{
						_customOptions[_name] = _value;
						_customOptionsDecoded[_name] = __decodeURIComponentForReadable(_value);
					}
				);
				
				for (var _option in __default_options)
				{
					if (_option in _customOptionsDecoded); else
					{
						_customOptionsUse = false;
						break;
					}
				}
				
				if (_customOptionsUse)
				{
					$options._resetOptions = _customOptions;
					$options._resetOptionsDecoded = _customOptionsDecoded;
				}
				
				
			//	put in ui
			//	=========
				$options.__values_put__custom__from_reset();
		};

		$options.__values_put__custom__from_reset = function ()
		{
			//	list
			//	====
				var _normalOptionsList =
				[
					'color_background', 'color_text', 'color_links',
					'text_size', 'box_width', 'text_line_height',
					'base',	'text_align', 'footnote_links',	'large_graphics'
				];
			
			//	normal options
			//	==============
				for (var i=0, _i=_normalOptionsList.length; i<_i; i++)
					{ $('#'+_normalOptionsList[i]+'__control').val($options._resetOptionsDecoded[_normalOptionsList[i]]); }
					
			//	fonts
			//	=====
				$('#text_font__control').val($options.__values_put__custom__unquoteFonts($options._resetOptionsDecoded['text_font']));
				$('#text_font_header__control').val($options.__values_put__custom__unquoteFonts($options._resetOptionsDecoded['text_font_header']));
				$('#text_font_monospace__control').val($options.__values_put__custom__unquoteFonts($options._resetOptionsDecoded['text_font_monospace']));
				
			//	custom
			//	======
				$('#custom_css__control').val($options._resetOptionsDecoded['custom_css'].replace(/\}/gi, '}\n'));
		};
		
		$options.__values_put__custom__unquoteFonts = function (_s)
		{
			return _s.replace(/"([^"]+)"/gi, '$1');
		};
	
	
	//	general
	//	=======
		$options.__values_get__general = function()
		{
			//	include
			//	=======
				
	//	encode
	//	======
		function __encodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == '') { return 'none'; }
			
			//	encode
			return encodeURIComponent(_string)
				.replace(/!/g, '%21')
				.replace(/'/g, '%27')
				.replace(/\(/g, '%28')
				.replace(/\)/g, '%29')
				.replace(/\*/g, '%2A')
			;
		}

		
	//	decode
	//	======
		function __decodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == 'none') { return ''; }
			
			//	decode
			return decodeURIComponent(_string);
		}
	
	


			//	vars
			//	====
				var 
					_varsDecoded = {},
					_vars = {}
				;

			//	get
			//	===
			
				_varsDecoded['keys_activation'] = $('#keys_activation__control').val();
				_varsDecoded['keys_clip'] = $('#keys_clip__control').val();
				_varsDecoded['keys_highlight'] = $('#keys_highlight__control').val();
				_varsDecoded['keys_speech'] = $('#keys_speech__control').val();
				
				_varsDecoded['clip_tag'] = $('#clip_tag__control').val();
				_varsDecoded['clip_tag'] = (($('#clip_tag__radio__no').attr('checked') == 'checked') ? '' : _varsDecoded['clip_tag']);

				_varsDecoded['clip_notebook_guid'] = $('#clip_notebook_guid__control').val();
				_varsDecoded['clip_notebook_guid'] = (($('#clip_notebook__radio__no').attr('checked') == 'checked') ? '' : _varsDecoded['clip_notebook_guid']);
                _varsDecoded['clip_notebook_guid'] = (_varsDecoded['clip_notebook_guid'] > '' ? _varsDecoded['clip_notebook_guid'] : '');
                _varsDecoded['clip_notebook'] = '';
                
                
                //  smart filing
                _varsDecoded['smart_filing_for_business'] = (($('#smart_filing_for_business__control').attr('checked') == 'checked') ? 'enabled' : 'disabled');
                switch (true)
                {
                    case ($('#smart_filing__radio__enabled').attr('checked') == 'checked'):
                        _varsDecoded['smart_filing'] = 'enabled'; break;
                    case ($('#smart_filing__radio__just_notebooks').attr('checked') == 'checked'):
                        _varsDecoded['smart_filing'] = 'just_notebooks'; break;
                    case ($('#smart_filing__radio__just_tags').attr('checked') == 'checked'):
                        _varsDecoded['smart_filing'] = 'just_tags'; break;
                    case ($('#smart_filing__radio__disabled').attr('checked') == 'checked'):
                        _varsDecoded['smart_filing'] = 'disabled'; break;
                }
                
                //  related notes
                switch (true)
                {
                    case ($('#related_notes__radio__enabled').attr('checked') == 'checked'):
                        _varsDecoded['related_notes'] = 'enabled'; break;
                    case ($('#related_notes__radio__just_at_bottom').attr('checked') == 'checked'):
                        _varsDecoded['related_notes'] = 'just_at_bottom'; break;
                    case ($('#related_notes__radio__disabled').attr('checked') == 'checked'):
                        _varsDecoded['related_notes'] = 'disabled'; break;
                }

                //  open notes in
                switch (true)
                {
                    case ($('#open_notes_in__radio__web').attr('checked') == 'checked'):
                        _varsDecoded['open_notes_in'] = 'web'; break;
                    case ($('#open_notes_in__radio__desktop').attr('checked') == 'checked'):
                        _varsDecoded['open_notes_in'] = 'desktop'; break;
                }
                
			//	encode
			//	======
				for (var _x in _varsDecoded)
					{ _vars[_x] = __encodeURIComponentForReadable(_varsDecoded[_x]); }
			
			//	return
			return _vars;
		};

	//	general
	//	=======
		$options.__values_get__speech = function()
		{
			//	include
			//	=======
				
	//	encode
	//	======
		function __encodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == '') { return 'none'; }
			
			//	encode
			return encodeURIComponent(_string)
				.replace(/!/g, '%21')
				.replace(/'/g, '%27')
				.replace(/\(/g, '%28')
				.replace(/\)/g, '%29')
				.replace(/\*/g, '%2A')
			;
		}

		
	//	decode
	//	======
		function __decodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == 'none') { return ''; }
			
			//	decode
			return decodeURIComponent(_string);
		}
	
	


			//	vars
			//	====
				var 
					_varsDecoded = {},
					_vars = {}
				;

			//	get
			//	===
				_varsDecoded['speech_speed'] = $('#speech_speed__control').val();
				_varsDecoded['speech_gender'] = $('#speech_gender__control').val();
                
			//	encode
			//	======
				for (var _x in _varsDecoded)
					{ _vars[_x] = __encodeURIComponentForReadable(_varsDecoded[_x]); }
			
			//	return
			return _vars;
		};
        
	//	custom
	//	======
		$options.__values_get__custom = function()
		{
			//	include
			//	=======
				
	//	encode
	//	======
		function __encodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == '') { return 'none'; }
			
			//	encode
			return encodeURIComponent(_string)
				.replace(/!/g, '%21')
				.replace(/'/g, '%27')
				.replace(/\(/g, '%28')
				.replace(/\)/g, '%29')
				.replace(/\*/g, '%2A')
			;
		}

		
	//	decode
	//	======
		function __decodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == 'none') { return ''; }
			
			//	decode
			return decodeURIComponent(_string);
		}
	
	


			//	vars
			//	====
				var 
					_optionsDecoded = {},
					_options = {},
					_optionsList =
					{
						'color_background': 	'',
						'color_text': 			'',
						'color_links': 			'',
						
						'text_size': 			'',
						'box_width': 			'',
						'text_line_height': 	'',

						'base': 				'',
						'text_align': 			'',
						'footnote_links': 		'',
						'large_graphics': 		''
					}
				;
			
			//	normal options
			//	==============
				for (var _x in _optionsList)
					{ _optionsDecoded[_x] = $('#'+_x+'__control').val(); }
					
			//	fonts
			//	=====
				_optionsDecoded['text_font'] = $options.__values_get__custom__quoteFonts($('#text_font__control').val());
				_optionsDecoded['text_font_header'] = $options.__values_get__custom__quoteFonts($('#text_font_header__control').val());
				_optionsDecoded['text_font_monospace'] = $options.__values_get__custom__quoteFonts($('#text_font_monospace__control').val());
				
			//	custom
			//	======
				_optionsDecoded['custom_css'] = $('#custom_css__control').val().replace(/[\r\n]/gi, '');
			
			//	encode
			//	======
				for (var _x in _optionsDecoded)
					{ _options[_x] = __encodeURIComponentForReadable(_optionsDecoded[_x]); }
				
			//	return	
			return _options;
		};
		
		$options.__values_get__custom__quoteFonts = function (_val)
		{
			var _r='', _v='', _m = _val.split(',');
			for (var i=0, _i=_m.length; i<_i; i++)
			{
				_v = _m[i].replace(/\s+/gi, ' ').replace(/^\s/, '').replace('\s$/', '');
				_r += ', '+(_v.indexOf(' ') > -1 ? '"'+_v+'"' : _v);
			}
			
			return _r.substr(2);
		};


    //  speech
    
    //  hold demo values -- reset on change
    //  ================
        $options.speech__demoingWith = {};
    
    //  the languages
    //  =============
        (function (){
            //  scope
            var $R = {};
            
            //  include
            
    $R.speech__voices = {
    
        /* supported */
        /* ========= */

        'en':       { 'f': 'usenglishfemale',       'm': 'usenglishmale',       'd': 'f',   'n': 'English'              },
        'ja':       { 'f': 'jpjapanesefemale',      'm': 'jpjapanesemale',      'd': 'f',   'n': 'Japanese'             },
        'es':       { 'f': 'eurspanishfemale',      'm': 'eurspanishmale',      'd': 'f',   'n': 'Spanish'              },
        'fr':       { 'f': 'eurfrenchfemale',       'm': 'eurfrenchmale',       'd': 'f',   'n': 'French'               },
        'de':       { 'f': 'eurgermanfemale',       'm': 'eurgermanmale',       'd': 'f',   'n': 'German'               },
        'zh-cn':    { 'f': 'chchinesefemale',       'm': 'chchinesemale',       'd': 'f',   'n': 'Chinese'              },
        'ko':       { 'f': 'krkoreanfemale',        'm': 'krkoreanmale',        'd': 'f',   'n': 'Korean'               },
        'ar':       { 'm': 'arabicmale',                                        'd': 'm',   'n': 'Arabic'               },
        'cs':       { 'f': 'eurczechfemale',                                    'd': 'f',   'n': 'Czech'                },
        'da':       { 'f': 'eurdanishfemale',                                   'd': 'f',   'n': 'Danish'               },
        'nl':       { 'f': 'eurdutchfemale',                                    'd': 'f',   'n': 'Dutch'                },
        'fi':       { 'f': 'eurfinnishfemale',                                  'd': 'f',   'n': 'Finnish'              },
        'el':       { 'f': 'eurgreekfemale',                                    'd': 'f',   'n': 'Greek'                },
        'hu':       { 'f': 'huhungarianfemale',                                 'd': 'f',   'n': 'Hungarian'            },
        'it':       { 'f': 'euritalianfemale',      'm': 'euritalianmale',      'd': 'f',   'n': 'Italian'              },
        'no':       { 'f': 'eurnorwegianfemale',                                'd': 'f',   'n': 'Norwegian'            },
        'pl':       { 'f': 'eurpolishfemale',                                   'd': 'f',   'n': 'Polish'               },
        'pt':       { 'f': 'eurportuguesefemale',   'm': 'eurportuguesemale',   'd': 'f',   'n': 'Portugese'            },
        'ru':       { 'f': 'rurussianfemale',       'm': 'rurussianmale',       'd': 'f',   'n': 'Russian'              },
        'sv':       { 'f': 'swswedishfemale',                                   'd': 'f',   'n': 'Sweedish'             },
        'tr':       { 'f': 'eurturkishfemale',      'm': 'eurturkishmale',      'd': 'f',   'n': 'Turkish'              },
        
        
        /* plus */
        /* ==== */
        
        'ca':       { 'f': 'eurcatalanfemale',                                  'd': 'f',   'n': 'Catalan',                 'u': true   },
        'zh-tw':    { 'f': 'twchinesefemale',                                   'd': 'f',   'n': 'Chinese (Traditional)',   'u': true   },
        
        
        /* variants we don't currently use */
        /* =============================== */
        
        'zh-hk':    { 'f': 'hkchinesefemale',                                   'd': 'f',   'n': 'Hong Kong',               'u': true   },

        'en-uk':    { 'f': 'ukenglishfemale',       'm': 'ukenglishmale',       'd': 'f',   'n': 'English (Britain)',       'u': true   },
        'en-au':    { 'f': 'auenglishfemale',                                   'd': 'f',   'n': 'English (Australia)',     'u': true   },
        'en-ca':    { 'f': 'caenglishfemale',                                   'd': 'f',   'n': 'English (Canada)',        'u': true   },
        
        'fr-ca':    { 'f': 'cafrenchfemale',        'm': 'cafrenchmale',        'd': 'f',   'n': 'French (Canada)',         'u': true   },

        'pt-br':    { 'f': 'brportuguesefemale',                                'd': 'f',   'n': 'Portugese (Brazil)',      'u': true   }
        
    };

            
            //  remove unsupported
            for (var _l in $R.speech__voices) { if ($R.speech__voices[_l].u) { delete $R.speech__voices[_l]; } }
            
            //  import
            $options.speech__languages = $R.speech__voices;
        })();
        
        
    //  play / pause
    //  ============
        $options.speech__doPlay = function ()
        {
            //  loading
            document.getElementById('view__speech__content').className = 'speakLoading';
        
            (function ($R)
            {
                //  set stuff
                $R.speech__language = $('#speech_demo__control').val();
                $R.vars['speech_speed'] = $('#speech_speed__control').val();
                $R.vars['speech_gender'] = $('#speech_gender__control').val();

                //  reset position
                $R.speech__posSpeaking__page = 1;
                $R.speech__posSpeaking__fragmentInPage = 1;
                $R.speech__posLoading__page = 1;
                $R.speech__posLoading__fragmentInPage = 1;

                //  speed
                if ($R.speech__speeds[$R.vars['speech_speed']]) { $R.speech__speed = $R.speech__speeds[$R.vars['speech_speed']]; }
                
                //  language and gender
                var _v = $R.speech__voices[$R.speech__language];
                if (_v) {
                    switch (true) {
                        case (($R.vars) && ($R.vars['speech_gender'] == 'male') && ('m' in _v)): $R.speech__voice = _v.m; break;
                        case (($R.vars) && ($R.vars['speech_gender'] == 'female') && ('f' in _v)): $R.speech__voice = _v.f; break;
                        default: $R.speech__voice = _v[_v.d]; break;
                    }
                }
                else {
                    $R.speech__language = 'en';
                    $R.speech__voice = 'usenglishfemale';
                }
                
                //  play
                $R.speech__doPlay();
            }
            )(window.$readableForSpeechDemo);
        };
        
        $options.speech__doPause = function () { window.$readableForSpeechDemo.speech__doPause(); };
        
    
    //  get demo text - for selected language
    //  =============
        $options.speech__updateFrame = function ()
        {
            //  code
            var _language_code = $('#speech_demo__control').val();
            
            //  load in frame
            $('#speech_frame_language').attr('src', $options.paths['main'] + 'options/__speech_demo/'+_language_code+'.html');
            
            //  timeout
            window.setTimeout(function ()
            {
                //  the demo language
                var _html = $('#speech_frame_language').contents().find('body').html();
                
                //  add separators
                _html = _html.replace(/<\/(h6|p)>/gi, '<b class="speechFragmentSeparator">&nbsp;</b></$1>');
                _html = _html.replace(/<h6>(.)/i, '<h6><b class="speechFragmentSeparator">$1</b>');
                
                //  pause, if palying
                var _$p_html = $($options.__speech_document).find('html');
                if (_$p_html.hasClass('speakPlaying')) { window.$readableForSpeechDemo.speech__doPause(); }
                
                //  the demo frame
                $($options.__speech_document).find('#page1 div.page_content').html(_html);
                
                //  add IDs to fragment separators
                $($options.__speech_document).find('div.page_content b.speechFragmentSeparator')
                    .each(function (_i, _e)
                    {
                        $(_e).attr(
                            'id', 
                            'speechFragmentSeparator__' + '1' + '_' + _i
                        );
                    });
                
                //  add duplicate
                $($options.__speech_document).find('#page1').each(function (_i, _e) {
                    window.$readableForSpeechDemo.speech__addDuplicateToPage(_e, (_i+1));
                });
            },
            500);
        };
    
    
    //  ui
	
	//	controls and load -- this order
	//	=================

		//	flexSelect
		//	==========
			$('#text_font__select, #text_font_header__select, #text_font_monospace__select').flexselect({
				'allowMismatch': true, 
				'inputIdTransform': function(id) {
					return id.replace('__select', '__control');
				}
			});

			
		//	put values
		//	==========
			$options.__values_put__general();
			$options.__values_put__custom();
			$options.__values_put__speech();

			
		//	miniColors
		//	==========
			$('#color_background__control, #color_text__control, #color_links__control')
				.miniColors({'change': function () { $options.__preview('preview'); }});

				
	//	controls events
	//	===============
	
		//	selects
		//	=======
			$('#view__custom table.controlTable select')
				.change(function() { $options.__preview('preview'); });

                
		//	textboxes
		//	=========
			$('#text_size__control').keyup(function() { $options.__preview('preview'); });
			$('#box_width__control').keyup(function() { $options.__preview('preview'); });
			$('#text_line_height__control').keyup(function() { $options.__preview('preview'); });

			$('#text_font__control').keyup(function() { $options.__preview('preview'); });
			$('#text_font_header__control').keyup(function() { $options.__preview('preview'); });
			$('#text_font_monospace__control').keyup(function() { $options.__preview('preview'); });
			
			$('#custom_css__control').keyup(function() { $options.__preview('preview'); });

			
		//	keyboard shortcuts
		//	==================
			$('#keys_activation__control, #keys_clip__control, #keys_highlight__control, #keys_speech__control').keydown(function (_event)
			{
				//	include key combo detection
					
	/*
		_event must be defined
		_key_combo and _key_code will be defined at end of code
	*/

	var _key_code = 'NONE';
	switch (true)
	{
		case (_event.keyCode && (_event.keyCode >= 65 && _event.keyCode <= 90)):
			_key_code = String.fromCharCode(_event.keyCode).toUpperCase();
			break;
			
		case (_event.keyCode == 27):	_key_code = 'Escape';		break;
		case (_event.keyCode == 37):	_key_code = 'Left Arrow';	break;
		case (_event.keyCode == 39):	_key_code = 'Right Arrow';	break;
		case (_event.keyCode == 38):	_key_code = 'Up Arrow';		break;
		case (_event.keyCode == 40):	_key_code = 'Down Arrow';	break;
	}

	//	get
	//	===
		var _modifierKeys = (_event.originalEvent ? _event.originalEvent : _event);
		//	jQuery screws up -- fucks up the metaKey property badly
		
		var _key_combo = ''
			+ (_modifierKeys.ctrlKey ? 'Control + ' : '')
			+ (_modifierKeys.shiftKey ? 'Shift + ' : '')
			+ (_modifierKeys.altKey ? 'Alt + ' : '')
			+ (_modifierKeys.metaKey ? 'Command + ' : '')
			+ _key_code
		;

	//	needs a modifier -- if not just Escape key
	//	================
		if ((_key_code != 'Escape') && (_key_code == _key_combo))
		{
			_key_code = 'NONE';
			_key_combo = 'NONE';
		}

				
				switch (true)
				{
					case (_event.keyCode == 46):
					case (_event.keyCode == 8):
						$(this).val('');
						break;
				
					case (_key_code != 'NONE'):
						$(this).val(_key_combo);
						break;
				}
				
				//	stop
				_event.preventDefault();
				_event.stopPropagation();
			});

				
	//	buttons
	//	=======
	
		$('#button__save_general').click(function()
		{
			$('#button__save_general__spinner').show();
			window.setTimeout(function() { $('#button__save_general__spinner').hide(); }, 500);
			
			//	get
			var _to_save = $options.__values_get__general();
			
			//	save
			__save_someStuff(_to_save);
		});

		$('#button__save_speech').click(function()
		{
			$('#button__save_speech__spinner').show();
			window.setTimeout(function() { $('#button__save_speech__spinner').hide(); }, 500);
			
			//	get
			var _to_save = $options.__values_get__speech();
			
			//	save
			__save_someStuff(_to_save);
		});
		
		$('#button__save_custom').click(function()
		{
			//	check
			//	=====
				if ($options.__validate_options()); else { return; }
		
			//	include
			//	=======
				
	//	encode
	//	======
		function __encodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == '') { return 'none'; }
			
			//	encode
			return encodeURIComponent(_string)
				.replace(/!/g, '%21')
				.replace(/'/g, '%27')
				.replace(/\(/g, '%28')
				.replace(/\)/g, '%29')
				.replace(/\*/g, '%2A')
			;
		}

		
	//	decode
	//	======
		function __decodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == 'none') { return ''; }
			
			//	decode
			return decodeURIComponent(_string);
		}
	
	

		
			$('#button__save_custom__spinner').show();
			window.setTimeout(function() { $('#button__save_custom__spinner').hide(); }, 500);
			
			//	get
			var 
				_to_save = {},
				_custom_values = $options.__values_get__custom(),
				_custom_options_aggregate = ''
			;
				
			//	aggregate	
			for (var _option in _custom_values)
			{
				//	apply
				_to_save[_option] = _custom_values[_option];
				
				//	and save
				_custom_options_aggregate += ''
					+ '['
					+	'[='+_option+']'
					+	'[='+__encodeURIComponentForReadable(_custom_values[_option])+']'
					+ ']'
				;
			}
				
			//	save
			_to_save['theme'] = 'custom';
			_to_save['custom_theme_options'] = _custom_options_aggregate;
				
			__save_someStuff(_to_save);
		});
		
		$('#button__reset_custom').click(function()
		{
			$options.__values_put__custom__from_reset();
			$options.__preview('preview');
		});
		
        
	//	tabs
	//	====
		$('#sidebar__menu__general').click(function()  { $('body').removeClass('showGeneral showCustom showSpeech showFeatures').addClass('showGeneral'); return false; });
		$('#sidebar__menu__custom').click(function()   { $('body').removeClass('showGeneral showCustom showSpeech showFeatures').addClass('showCustom'); return false; });	
		$('#sidebar__menu__speech').click(function()   { $('body').removeClass('showGeneral showCustom showSpeech showFeatures').addClass('showSpeech'); return false; });	
		$('#sidebar__menu__features').click(function() { $('body').removeClass('showGeneral showCustom showSpeech showFeatures').addClass('showFeatures'); return false; });	

        $('#sidebar__licenses a').click(function() { $('body').addClass('showLicenses'); return false; });
        $('#licenses div.overlay').click(function() { $('body').removeClass('showLicenses'); return false; });
        $('#eula div.overlay').click(function() { $('body').removeClass('showEula'); return false; });
    
        var _$eula = $('#features__eula_notice span');
            _$eula.html(_$eula.html().replace('[=eula]', '<a href="#">End User License Agreement</a>'));
            $('#features__eula_notice span a').click(function () { $('body').addClass('showEula'); return false; });
    
        var _$powered = $('#features__speech__text__powered');
            _$powered.html(_$powered.html().replace('[=service]', 'iSpeech - <a href="http://www.ispeech.org/text.to.speech" target="_blank">Text To Speech</a>'));
            
        var _$requires = $('#features__speech__text__requires');
            _$requires.html(_$requires.html().replace('[=product]', '<a href="http://get.adobe.com/flashplayer/" target="_blank">Flash Player</a>'));

            
	//	account
	//	=======
	
		$options.account__sign_out = function()
		{
			//	forget
			__forget_stored_evernote_credentials();

			//	wait
			$('#account__spinner').show();
			window.setTimeout(function()
			{
                //  refresh
                $options['storedLogin'] = __get_stored_evernote_credentials();
				
                //  reshow
                $options.account__show_state();
				
                //  spinner
                $('#account__spinner').hide();
			}, 500);
		};
	
		$options.account__show_state = function()
		{
			var _result = '';
			
            //  __escapeForHTML
            
    //  escapeForHTML
    //  =============
        function __escapeForHTML(_string)
        {
            var _replace = {
                "&": "amp", 
                '"': "quot", 
                "<": "lt", 
                ">": "gt"
            };
            
            return _string.replace(
                /[&"<>]/g,
                function (_match) { return ("&" + _replace[_match] + ";"); }
            );
        }

            
			//	which
			if ($options['storedLogin'] == false)
			{
				_result = ''
					+ '<div id="account__signed_out">'
					+   __escapeForHTML($options.__translations['account__signed_out'])
					+ '</div>'
				;
                
                $('#body').attr('logged_into', 'none');
			}
			else
			{
				_result = ''
					+ __escapeForHTML($options.__translations['account__sign_out']).replace('[=username]', __escapeForHTML($options['storedLogin']['username']))+' '
					+ '<a href="#" id="account__sign_out">'
					+ 	__escapeForHTML($options.__translations['account__sign_out_link'])
					+ '</a>'
					+ '<div class="saveSpinner" id="account__spinner"></div>'
				;
                
                $('#body').attr('logged_into', $options['storedLogin']['server']);
			}
			
			//	set
			$('#account__container').html(_result);
            
            //  set sign-out link
            $('#account__container #account__sign_out').click(function () { $options.account__sign_out(); return false; });
		};
	
		//	get state on load
		$options.account__show_state();
		
		
	//	custom buttons
	//	==============
		$('#button__more_options').click(function()
		{
			$('#view__custom__frameAndButtons__container').animate(
				{'top': '335px' },
				500,
				'readablePreviewFrameShow',
				function ()
				{
					$('#view__custom__miscSettings__container').fadeIn(500);
					$('#button__more_options').css({'display' : 'none'});
				}
			);
		});


    //  speech demo
    //  ===========
        

            //  add languages to speech combo
            //  =============================
                var _vs = [];
                for (var _l in $options.speech__languages) { _vs.push({ 'code': _l, 'name': $options.speech__languages[_l].n }); }
                _vs.sort(function (a, b) { return ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0)); });
                for (var _i=0, _ii=_vs.length; _i<_ii; _i++) { $('#speech_demo__control').append('<option value="'+_vs[_i].code+'">'+_vs[_i].name+'</option>'); }
                
            //  dynamic translations
            //  ====================
                var _$requires = $('#speech__needFlash');
                    _$requires.html(_$requires.html().replace('[=product]', '<a href="http://get.adobe.com/flashplayer/" target="_blank">Flash Player</a>'));
                    
                $('#speech__controls__init').attr('title', $options.__translations['menu__speak__play__tooltip']);
                $('#speech__controls__play').attr('title', $options.__translations['menu__speak__play__tooltip']);
                $('#speech__controls__pause').attr('title', $options.__translations['menu__speak__pause__tooltip']);
                $('#speech__controls__loading').attr('title', $options.__translations['menu__speak__tooltip']);
                $('#speech__controls__forward').attr('title', $options.__translations['menu__speak__forward__tooltip']);
                $('#speech__controls__rewind').attr('title', $options.__translations['menu__speak__rewind__tooltip']);
                
            //  speech demo controls
            //  ====================
                $('#speech_demo__control').change(function () { $options.speech__updateFrame(); });
                
                $('#speech__controls__play').click(function () { $options.speech__doPlay(); return false; });
                $('#speech__controls__pause').click(function () { $options.speech__doPause(); return false; });
                $('#speech__controls__loading').click(function () { return false; });
        
        
        
        
	//	custom easing
	//	=============
		$.easing['readablePreviewFrameShow'] = function (x, t, b, c, d)
		{
			/* out cubic :: variation */
			var ts=(t/=d)*t;
			var tc=ts*t;
			return b+c*(-2.5*tc*ts + 10*ts*ts + -14*tc + 7*ts + 0.5*t);
		};

        
    //  qa events
    //  =========
        
        function __show_spinner__servers() { $('#button__servers__spinner').show(); window.setTimeout(function() { $('#button__servers__spinner').hide(); }, 500); }
        function __show_spinner__simulate_chinese() { $('#button__simulate_chinese__spinner').show(); window.setTimeout(function() { $('#button__simulate_chinese__spinner').hide(); }, 500); }
        
        $('#button__set__servers_to_stage').click(function () { __set_servers_to_stage(); __show_spinner__servers(); });
        $('#button__set__servers_to_live').click(function () { __set_servers_to_live(); __show_spinner__servers(); });
        
        $('#button__set__simulate_chinese_locale').click(function () { __set_simulate_chinese_locale(); __show_spinner__simulate_chinese(); });
        $('#button__set__do_not_simulate_chinese_locale').click(function () { __set_do_not_simulate_chinese_locale(); __show_spinner__simulate_chinese(); });

	
    //  preview
	
	$options.appliedOptions = { 'preview': {}, 'speech': {} };
	$options.loadedGoogleFonts = {};

	$options.__validate_options = function ()
	{
		//	include defaults
		//	================
			
	//	encode
	//	======
		function __encodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == '') { return 'none'; }
			
			//	encode
			return encodeURIComponent(_string)
				.replace(/!/g, '%21')
				.replace(/'/g, '%27')
				.replace(/\(/g, '%28')
				.replace(/\)/g, '%29')
				.replace(/\*/g, '%2A')
			;
		}

		
	//	decode
	//	======
		function __decodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == 'none') { return ''; }
			
			//	decode
			return decodeURIComponent(_string);
		}
	
	

			
	//	__encodeURIComponentForReadable must be defined

	var __default_options = 
	{
		'text_font': 			__encodeURIComponentForReadable('"PT Serif"'),
		'text_font_header': 	__encodeURIComponentForReadable('"PT Serif"'),
		'text_font_monospace': 	__encodeURIComponentForReadable('Inconsolata'),
		'text_size': 			__encodeURIComponentForReadable('16px'),
		'text_line_height': 	__encodeURIComponentForReadable('1.5em'),
		'box_width': 			__encodeURIComponentForReadable('36em'),
		'color_background': 	__encodeURIComponentForReadable('#f3f2ee'),
		'color_text': 			__encodeURIComponentForReadable('#1f0909'),
		'color_links': 			__encodeURIComponentForReadable('#065588'),
		'text_align': 			__encodeURIComponentForReadable('normal'),
		'base': 				__encodeURIComponentForReadable('theme-1'),
		'footnote_links': 		__encodeURIComponentForReadable('on_print'),
		'large_graphics': 		__encodeURIComponentForReadable('do_nothing'),
		'custom_css': 			__encodeURIComponentForReadable('')
	};


		//	list	
		var _validateOptionsList =
		[
			'text_font', 'text_font_header', 'text_font_monospace',
			'color_background', 'color_text', 'color_links',
			'text_size', 'box_width', 'text_line_height'
		];
			
		//	remove errors	
		$('#view__custom table.controlTable').removeClass('error');	
			
			
		//	add errors
		var 
			_hasError = false,
			_options = $options.__values_get__custom()
		;
		
		for (var i=0, _i=_validateOptionsList.length; i<_i; i++)
		{
			if (_options[_validateOptionsList[i]] == 'none')
			{
				_hasError = true;
				$('#'+_validateOptionsList[i]+'__controlTable').addClass('error');
			}
		}
		
		//	false
		if (_hasError) { return false; }

		//	true
		$options.options = _options;
		return true;
	};
	
	$options.__preview = function (__document_target, __resetBase)
	{
        var __document = false;
        switch (true)
        {
            case (__document_target == 'preview'):
                __document = $options.__preview_document;
                break;
                
            case (__document_target == 'speech'):
                __document = $options.__speech_document;
                break;
        }
    
		//	check and set .options
		if ($options.__validate_options()); else { return; }

		//	include defaults
		//	================
			
	//	encode
	//	======
		function __encodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == '') { return 'none'; }
			
			//	encode
			return encodeURIComponent(_string)
				.replace(/!/g, '%21')
				.replace(/'/g, '%27')
				.replace(/\(/g, '%28')
				.replace(/\)/g, '%29')
				.replace(/\*/g, '%2A')
			;
		}

		
	//	decode
	//	======
		function __decodeURIComponentForReadable(_string)
		{
			//	none
			if (_string == 'none') { return ''; }
			
			//	decode
			return decodeURIComponent(_string);
		}
	
	

			
	//	__encodeURIComponentForReadable must be defined

	var __default_options = 
	{
		'text_font': 			__encodeURIComponentForReadable('"PT Serif"'),
		'text_font_header': 	__encodeURIComponentForReadable('"PT Serif"'),
		'text_font_monospace': 	__encodeURIComponentForReadable('Inconsolata'),
		'text_size': 			__encodeURIComponentForReadable('16px'),
		'text_line_height': 	__encodeURIComponentForReadable('1.5em'),
		'box_width': 			__encodeURIComponentForReadable('36em'),
		'color_background': 	__encodeURIComponentForReadable('#f3f2ee'),
		'color_text': 			__encodeURIComponentForReadable('#1f0909'),
		'color_links': 			__encodeURIComponentForReadable('#065588'),
		'text_align': 			__encodeURIComponentForReadable('normal'),
		'base': 				__encodeURIComponentForReadable('theme-1'),
		'footnote_links': 		__encodeURIComponentForReadable('on_print'),
		'large_graphics': 		__encodeURIComponentForReadable('do_nothing'),
		'custom_css': 			__encodeURIComponentForReadable('')
	};


		//	what to do
		//	==========
		
			var 
				_resetOptions = false, 
				_resetBase = (__resetBase || false),
				_optionsToApply = {}
			;

			//	set _resetBase
			switch (true)
			{
				case (!('base' in  $options.appliedOptions[__document_target])):
				case (!($options.options['base'] == $options.appliedOptions[__document_target]['base'])):
					_resetBase = true;
					break;
			}
		
			//	set _resetOptions
			for (var _option in __default_options)
			{
				switch (true)
				{
					case (!(_option in $options.appliedOptions[__document_target])):
					case (!($options.options[_option] == $options.appliedOptions[__document_target][_option])):
						_resetOptions = true;
						break;
				}
				
				//	stop
				if (_resetOptions) { break; }
			}	
		
		//	set appliedOptions
		//	set optionToApply
		//	=================
			for (var _option in __default_options)
			{
				$options.appliedOptions[__document_target][_option] = $options.options[_option];
				_optionsToApply[_option] = __decodeURIComponentForReadable($options.options[_option]);
			}

			
		//	apply base
		//	==========
			if (_resetBase)
			{
				//	remove old
				$(__document).find('#baseCSS').remove();
				
				//	add new
				if (_optionsToApply['base'] > '')
				{
					$(__document).find('head').append(''
						+ '<link id="baseCSS" href="'
						+ $options.paths['main'] + 'css/' + $options.versioning['file_name_base--'+_optionsToApply['base']+'_css']
						+ '" rel="stylesheet" type="text/css" />'
					);
				}
			}
		
		//	apply options
		//	=============
			
			//	finish, if not resetting options
			if (_resetOptions); else { return; }

			//	google fonts
			//	============

				//	get
				
	function __options__get_google_fonts (_options)
	{
		
	var 
		__google_fonts_index = {},
		__google_fonts_array =
		[
			'Arvo',
			'Bentham',
			'Cardo',
			'Copse',
			'Corben',
			'Crimson Text',
			'Droid Serif',
			'Goudy Bookletter 1911',
			'Gruppo',
			'IM Fell',
			'Josefin Slab',
			'Kreon',
			'Meddon',
			'Merriweather',
			'Neuton',
			'OFL Sorts Mill Goudy TT',
			'Old Standard TT',
			'Philosopher',
			'PT Serif',
			'Radley',
			'Tinos',
			'Vollkorn',
			
			'Allerta',
			'Anton',
			'Arimo',
			'Bevan',
			'Buda',
			'Cabin',
			'Cantarell',
			'Coda',
			'Cuprum',
			'Droid Sans',
			'Geo',
			'Josefin Sans',
			'Lato',
			'Lekton',
			'Molengo',
			'Nobile',
			'Orbitron',
			'PT Sans',
			'Puritan',
			'Raleway',
			'Syncopate',
			'Ubuntu',
			'Yanone Kaffeesatz',
			
			'Anonymous Pro',
			'Cousine',
			'Droid Sans Mono',
			'Inconsolata'
		];

	//	create index
	for (var i=0, ii=__google_fonts_array.length; i<ii; i++){
		__google_fonts_index[__google_fonts_array[i]] = 1;
	}

		
		var 
			_fonts = {},
			_fonts_urls = [],
			_check_font = function (_match, _font)
				{ if (_font in __google_fonts_index) { _fonts[_font] = 1; } }
		;
		
		//	body
		//	====
			_options['text_font'].replace(/"([^",]+)"/gi, _check_font);
			_options['text_font'].replace(/([^",\s]+)/gi, _check_font);				
		
		//	headers
		//	=======
			_options['text_font_header'].replace(/"([^",]+)"/gi, _check_font);
			_options['text_font_header'].replace(/([^",\s]+)/gi, _check_font);				
		
		//	monospace
		//	=========
			_options['text_font_monospace'].replace(/"([^",]+)"/gi, _check_font);
			_options['text_font_monospace'].replace(/([^",\s]+)/gi, _check_font);				

		//	custom css
		//	==========
			_options['custom_css'].replace(/font-family: "([^",]+)"/gi, _check_font);
			_options['custom_css'].replace(/font-family: ([^",\s]+)/gi, _check_font);
	
	
		//	return
		//	======
		
			//	transform to array
			for (var _font in _fonts)
			{
				_fonts_urls.push(''
					+ 'http://fonts.googleapis.com/css?family='
					+ _font.replace(/\s+/g, '+')
					+ ':regular,bold,italic'
				);
			}
		
			//	return
			return _fonts_urls;
	}

				var _fonts_urls = __options__get_google_fonts(_optionsToApply);

				//	apply
				for (var i=0,_i=_fonts_urls.length; i<_i; i++)
				{
					//	loaded?
					if ($options.loadedGoogleFonts[_fonts_urls[i]]) { continue; }
					
					//	load
					$(__document).find('head').append('<link href="'+_fonts_urls[i]+'" rel="stylesheet" type="text/css" />');
				
					//	mark
					$options.loadedGoogleFonts[_fonts_urls[i]] = 1;
				}
			
				
			//	the css
			//	=======
				
	function __options__get_css (_options)
	{
		var _cssText = (''
		+	'#body { '
		+		'font-family: [=text_font]; '
		+		'font-size: [=text_size]; '
		+		'line-height: [=text_line_height]; '
		+		'color: [=color_text]; '
		+		'text-align: '+(_options['text_align'] == 'justified' ? 'justify' : 'left')+'; '
		+	'} '
		
		+	'#background { background-color: [=color_background]; } '
		
		+	'.setTextColorAsBackgroundColor { background-color: [=color_text]; } '
		+	'.setBackgroundColorAsTextColor { color: [=color_background]; } '
		
		+	'#box, .setBoxWidth { width: [=box_width]; } '
		
		+	'a { color: [=color_links]; } '
		+	'a:visited { color: [=color_text]; } '
        
        +   '#text div.page_duplicateForSpeech #nowSpeaking span { color: [=color_text]; } '
        +   '#text div.page_duplicateForSpeech #nowSpeaking:before { '
        +       'background-color: [=color_links]; '
        +       'opacity: 0.25; '
        +   '} '
     /* +   '#text div.page_duplicateForSpeech #nowSpeaking:before { '
        +       'opacity: 0.25; '
        +       'background-image: linear-gradient(left , [=color_background] 0%, [=color_links] 85%, [=color_background] 100%); '
        +       'background-image: -o-linear-gradient(left , [=color_background] 0%, [=color_links] 85%, [=color_background] 100%); '
        +       'background-image: -moz-linear-gradient(left , [=color_background] 0%, [=color_links] 85%, [=color_background] 100%); '
        +       'background-image: -webkit-linear-gradient(left , [=color_background] 0%, [=color_links] 85%, [=color_background] 100%); '
        +       'background-image: -ms-linear-gradient(left , [=color_background] 0%, [=color_links] 85%, [=color_background] 100%); '
        +       'background-image: -webkit-gradient(linear, left top, right top, color-stop(0.01, [=color_background]), color-stop(0.85, [=color_links]), color-stop(1, [=color_background])); '
        +   '} ' */
        
        /*
        +   '#text div.page_duplicateForSpeech #nowSpeaking span { color: [=color_background]; } '
        +   '#text div.page_duplicateForSpeech #nowSpeaking:before { background-color: [=color_text]; opacity: 1; } '
        */
        
		+	'@media print { body.footnote_links__on_print a, body.footnote_links__on_print a:hover { color: [=color_text] !important; text-decoration: none !important; } } '
		+	'body.footnote_links__always a, body.footnote_links__always a:hover { color: [=color_text] !important; text-decoration: none !important; } '
		
		+	'img { border-color: [=color_text]; } '
		+	'a img { border-color: [=color_links]; } '
		+	'a:visited img { border-color: [=color_text]; } '

		+	'h1 a, h2 a, a h1, a h2 { color: [=color_text]; } '
		+	'h1, h2, h3, h4, h5, h6 { font-family: [=text_font_header]; } '

		+	'pre { background-color: [=color_background]; } '
		+	'pre, code { font-family: [=text_font_monospace]; } '
		+	'hr { border-color: [=color_text]; } '

		+	'#rtl_box { background-color: [=color_text]; color: [=color_background]; } '
		+	'#rtl_box a { color: [=color_background]; } '

		+	'html.rtl #body #text { text-align: ' + (_options['text_align'] == 'justified' ? 'justify' : 'right')+' !important; } '
		+	'h1, h2, h3, h4, h5, h6 { text-align: left; } '
		+	'html.rtl h1, html.rtl h2, html.rtl h3, html.rtl h4, html.rtl h5, html.rtl h6 { text-align: right !important; } '

		+	'[=custom_css] '
		).replace(
			/\[=([a-z_]+?)\]/gi,
			function (_match, _key) { return _options[_key]; }
		);
		
		return _cssText;
	}
				var _cssText = __options__get_css(_optionsToApply);
			
				//	remove old
				//	==========
					$(__document).find('#optionsCSS').remove();
				
				//	new
				//	===
					var _cssElement = __document.createElement('style');
						_cssElement.setAttribute('type', 'text/css');
						_cssElement.setAttribute('id', 'optionsCSS');
						
					if (_cssElement.styleSheet) { _cssElement.styleSheet.cssText = _cssText; }
						else { _cssElement.appendChild(__document.createTextNode(_cssText)); }
				

					$(__document).find('head').append(_cssElement);
					
					
			//	the colors
			//	==========
				$($('#color_background__control').get(0).parentNode).find('a').css({'background-color': _optionsToApply['color_background']});
				$($('#color_text__control').get(0).parentNode).find('a').css({'background-color': _optionsToApply['color_text']});
				$($('#color_links__control').get(0).parentNode).find('a').css({'background-color': _optionsToApply['color_links']});
	};


    //  init
	
	//	show specific tab
    switch (true)
    {
        case (window.location.hash == '#showCustom'):
            $('body').removeClass('showGeneral').addClass('showCustom');
            break;
            
        case (window.location.hash == '#showSpeech'):
            $('body').removeClass('showGeneral').addClass('showSpeech');
            break;
    }

	//	write preview frame
	window.setTimeout(function ()
	{
        //  preview
        //  =======
            var _iframeHTML__preview = ''
                +	'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"'
                +		' "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">'
                +	'<html id="html" xmlns="http://www.w3.org/1999/xhtml">'
                +	'<head>'
                +		'<style type="text/css">'
                +			'#background	{ position: fixed; top: 0; left: 0;	width: 100%; height: 100%; } '
                +			'#box 			{ padding-left: 2em; padding-right: 2em; margin-left: auto; margin-right: auto; position: relative; } '
                +			'#box_inner 	{ position: relative; } '
                +			'#text 			{ padding-top: 1em; } '
                +			'#background 	{ z-index: 10; } '
                +			'#box 			{ z-index: 20; } '
                +		'</style>'
                +	'</head>'
                +	'<body id="body">'
                +		'<div id="bodyContent">'
                +			'<div id="box">'
                +				'<div id="box_inner">'
                +					'<div id="text">'
                +					    '<div id="pages">'
                +					        '<div id="page1" class="page">'
                +					            '<div class="page_content">'
                +						            $('#preview_frame_contents').html()
                +                               '</div>'
                +                           '</div>'
                +                       '</div>'
                +					'</div>'
                +				'</div>'
                +			'</div>'
                +			'<div id="background"></div>'
                +		'</div>'
                +	'</body>'
                +	'</html>'
            ;
        
            $options.__preview_document = $('#preview_frame iframe').contents().get(0);
            $options.__preview_document.open();
            $options.__preview_document.write(_iframeHTML__preview);
            $options.__preview_document.close();

        
        //  speech demo
        //  ===========
            
            
                var _iframeHTML__speech = ''
                    +	'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"'
                    +		' "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">'
                    +	'<html id="html" xmlns="http://www.w3.org/1999/xhtml">'
                    +	'<head>'
                    +		'<link rel="stylesheet" href="'+$options.paths['main']+'css/'+$options.versioning['file_name_bulk_css']+'" type="text/css" />'
                    +		'<style type="text/css">'
                    +			'#background	{ position: fixed; top: 0; left: 0;	width: 100%; height: 100%; } '
                    +			'#box 			{ padding-left: 2em; padding-right: 2em; margin-left: auto; margin-right: auto; position: relative; } '
                    +			'#box_inner 	{ position: relative; margin-left: 0 !important; margin-right: 0 !important; } '
                    +			'#text 			{ padding-top: 2em !important; padding-bottom: 2em !important; } '
                    +			'#background 	{ z-index: 10; } '
                    +			'#box 			{ z-index: 20; } '
                    +           '#body          { font-size: 18px !important; } '
                    +           '#text h6       { margin-bottom: 0.25em !important; font-size: 1.25em !important; } '
                    +           '#text          { padding-top: 2em !important; } '
                    +		'</style>'
                    +	'</head>'
                    +	'<body id="body">'
                    +		'<div id="bodyContent">'
                    +			'<div id="box">'
                    +				'<div id="box_inner">'
                    +					'<div id="text">'
                    +					    '<div id="pages">'
                    +					        '<div id="page1" class="page">'
                    +					            '<div class="page_content"></div>'
                    +                           '</div>'
                    +                       '</div>'
                    +					'</div>'
                    +				'</div>'
                    +			'</div>'
                    +			'<div id="background"></div>'
                    +	        '<div id="audio_elements_container"></div>'
                    +		'</div>'
                    +		'<script type="text/javascript" src="'+$options.paths['main']+'libs/'+$options.versioning['file_name_jQuery_js']+'"></script>'
                    +		'<script type="text/javascript" src="'+$options.paths['main']+'libs/'+$options.versioning['file_name_audio_js']+'"></script>'
                    +		'<script type="text/javascript" src="'+$options.paths['main']+'options/bulk__forSpeechDemo.js"></script>'
                    +	'</body>'
                    +	'</html>'
                ;
            
                //  init readable object
                //  ====================
                    window.$readableForSpeechDemo = {
                        'win': window,
                        'document': document,
                        'vars': { 
                            'speech_speed':     'normal',
                            'speech_gender':    'default'
                        },
                        'visible': true
                    };
                    
                //  write
                //  =====
                    $options.__speech_document = $('#speech_frame iframe').contents().get(0);
                    $options.__speech_document.open();
                    $options.__speech_document.write(_iframeHTML__speech);
                    $options.__speech_document.close();

            
                    
        
		//	wait again
        //  ==========
            window.setTimeout(function ()
            {
                //  preview
                //  =========
                    $options.__preview_document = $('#preview_frame iframe').contents().get(0);
                    $options.__preview('preview', true);

                //  speech demo
                //  ===========
                    

                        //  speech preview
                        //  ==============
                            $options.__speech_document = $('#speech_frame iframe').contents().get(0);
                            $options.__preview('speech', true);

                        //  detect flash
                        //  ============
                            (function ($R)
                            {
                                if (window.$readableForSpeechDemo.speech__detectFlash())
                                {
                                    //  init audio for demo
                                    //  ===================
                                        $R.speech__initAudio();
                                    
                                    //  add second timer
                                    //  ================
                                        var _s = $R.speech__onStartPlaying, _e = $R.speech__onEndPlaying;
                                        $R.speech__onStartPlaying = function () { _s(); document.getElementById('view__speech__content').className = 'speakPlaying'; };
                                        $R.speech__onEndPlaying = function () { _e(); document.getElementById('view__speech__content').className = 'speakPaused'; };
                                }
                                else
                                {
                                    //  no flash
                                    $('#view__speech__content').addClass('needFlash');
                                }
                            }
                            )(window.$readableForSpeechDemo);

                            
                        //  demo with default language -- en
                        //  ==========================
                            $('#speech_demo__control').val('en');
                            window.setTimeout(function () { $('#speech_demo__control').change(); }, 500)
                            
                    
            }, 
            500);
	}, 
	250);

