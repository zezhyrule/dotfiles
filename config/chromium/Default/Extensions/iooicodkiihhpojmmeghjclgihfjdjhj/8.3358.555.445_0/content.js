
	//	events
	//	======
	
		//	include
			
	/*
		first three variables will be defined
	*/

	var 
		__custom_events__names_to_keys = {},
		__custom_events__keys_to_names = {},
		__custom_events__names_to_objects = {},
		
		__custom_events =
		[
			['to-extension--open-settings', 				        'click-111-111-111-111-1-1-1'],
			['to-extension--open-settings-theme', 			        'click-112-112-112-112-1-1-1'],
			['to-extension--open-settings-speech', 			        'click-113-113-113-113-1-1-1'],
			['to-extension--open-premium', 			                'click-114-114-114-114-1-1-1'],
			
			['to-extension--evernote-clip', 				        'click-121-121-121-121-1-1-1'],
			['to-extension--evernote-clip-highlights', 		        'click-122-122-122-122-1-1-1'],
			['to-extension--evernote-speech', 		                'click-123-123-123-123-1-1-1'],

			/*['to-extension--evernote-unset-tag', 				    'click-123-123-123-123-1-1-1'],*/
			/*['to-extension--evernote-unset-notebook', 		    'click-124-124-124-124-1-1-1'],*/
			
            ['to-extension--evernote-login', 				        'click-131-131-131-131-1-1-1'],
			['to-extension--evernote-login--switch-to-cn',          'click-132-132-132-132-1-1-1'],
            ['to-extension--evernote-login--switch-to-in',          'click-133-133-133-133-1-1-1'],

            ['to-extension--evernote-get-recommendation', 		    'click-141-141-141-141-1-1-1'],
            ['to-extension--evernote-get-user', 		            'click-142-142-142-142-1-1-1'],
            
			['to-extension--select-theme-1', 			    	    'click-151-151-151-151-1-1-1'],
			['to-extension--select-theme-2', 				        'click-152-152-152-152-1-1-1'],
			['to-extension--select-theme-3', 		    		    'click-153-153-153-153-1-1-1'],
			['to-extension--select-theme-custom', 	    		    'click-154-154-154-154-1-1-1'],

			['to-extension--select-size-small',     			    'click-161-161-161-161-1-1-1'],
			['to-extension--select-size-medium', 			        'click-162-162-162-162-1-1-1'],
			['to-extension--select-size-large', 		    	    'click-163-163-163-163-1-1-1'],

			['to-extension--select-related-notes-just-at-bottom',   'click-171-171-171-171-1-1-1'],
			['to-extension--select-related-notes-disabled', 		'click-172-172-172-172-1-1-1'],
            
			['to-extension--track--view', 			                'click-181-181-181-181-1-1-1'],
			['to-extension--track--clip', 		    	            'click-182-182-182-182-1-1-1'],
			['to-extension--track--theme-popup', 			        'click-183-183-183-183-1-1-1'],
			['to-extension--track--settings', 			            'click-184-184-184-184-1-1-1'],
			['to-extension--track--speech', 			            'click-185-185-185-185-1-1-1'],

			['to-extension--first-show--check', 			        'click-191-191-191-191-1-1-1'],
			['to-extension--first-show--mark', 			            'click-192-192-192-192-1-1-1'],
            
            /* ================================================================================= */
            
            ['to-browser--evernote-login-show', 		            'click-211-211-211-211-1-1-1'],
            ['to-browser--evernote-login-show--in',     		    'click-212-212-212-212-1-1-1'],
            ['to-browser--evernote-login-show--in-cn', 	    	    'click-213-213-213-213-1-1-1'],
			['to-browser--evernote-login-show--cn', 	            'click-214-214-214-214-1-1-1'],
            ['to-browser--evernote-login-show--cn-in',  		    'click-215-215-215-215-1-1-1'],

            ['to-browser--evernote-speech-start',  		            'click-216-216-216-216-1-1-1'],
            
			['to-browser--evernote-login-failed', 		    	    'click-221-221-221-221-1-1-1'],
			['to-browser--evernote-login-failed--username',         'click-222-222-222-222-1-1-1'],
			['to-browser--evernote-login-failed--password',         'click-223-223-223-223-1-1-1'],
			['to-browser--evernote-login-failed--password-reset',   'click-225-225-225-225-1-1-1'],
			['to-browser--evernote-login-successful', 		        'click-224-224-224-224-1-1-1'],

			['to-browser--evernote-clip-successful', 		        'click-231-231-231-231-1-1-1'],
			['to-browser--evernote-clip-failed', 			        'click-232-232-232-232-1-1-1'],

			['to-browser--evernote-clip-highlights-successful',     'click-241-241-241-241-1-1-1'],
			['to-browser--evernote-clip-highlights-failed',         'click-242-242-242-242-1-1-1'],

			['to-browser--evernote-get-recommendation-successful',  'click-251-251-251-251-1-1-1'],
			['to-browser--evernote-get-recommendation-failed',      'click-252-252-252-252-1-1-1'],
            
			['to-browser--first-show--all-features',                'click-261-261-261-261-1-1-1'],
			['to-browser--first-show--new-features',                'click-262-262-262-262-1-1-1'],
            
			['to-browser--show--speech--need-login',                'click-263-263-263-263-1-1-1'],
            ['to-browser--show--speech--need-login--in',     		'click-264-264-264-264-1-1-1'],
            ['to-browser--show--speech--need-login--in-cn', 	    'click-265-265-265-265-1-1-1'],
			['to-browser--show--speech--need-login--cn', 	        'click-266-266-266-266-1-1-1'],
            ['to-browser--show--speech--need-login--cn-in',  		'click-267-267-267-267-1-1-1'],
			['to-browser--show--speech--need-premium',              'click-269-269-269-269-1-1-1']
            
        ]
	;

	for (var i=0,_i=__custom_events.length,e=false,k=false; i<_i; i++)
	{
		e = __custom_events[i];
		k = e[1].split('-');
		
		__custom_events__names_to_keys[e[0]] = e[1];
		__custom_events__keys_to_names[e[1]] = e[0];
		__custom_events__names_to_objects[e[0]] =
		{
			'_1': k[1],
			'_2': k[2],
			'_3': k[3],
			'_4': k[4],
			'_5': (k[5] == 1 ? true : false),
			'_6': (k[6] == 1 ? true : false),
			'_7': (k[7] == 1 ? true : false)
		};
	}
	
	var __custom_events__get_key = function (_event)
	{
		return 'click'
			+'-'+_event.screenX
			+'-'+_event.screenY
			+'-'+_event.clientX
			+'-'+_event.clientY
			+'-'+(_event.ctrlKey ? 1 : 0)
			+'-'+(_event.altKey ? 1 : 0)
			+'-'+(_event.shiftKey ? 1 : 0)
		;
	};
	
	var __custom_events__dispatch = function (_custom_event_object, _document, _window)
	{
		var _e = _document.createEvent("MouseEvents");
		
		_e.initMouseEvent(
			"click", true, true, _window, 0, 
                _custom_event_object['_1'], _custom_event_object['_2'], 
                _custom_event_object['_3'], _custom_event_object['_4'], 
                _custom_event_object['_5'], 
                _custom_event_object['_6'], 
                _custom_event_object['_7'], 
			false, 0, null
		);
		
		_document.dispatchEvent(_e);
	};
	

		//	browser and content
		
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse)
	{
		//	invalid
		if (request._type); else { sendResponse({}); }

        //  first switch
        switch (request._type)
        {
			case 'to-content--evernote-get-recommendation-successful':
				var 
					_iframe = document.getElementById('readable_iframe'),
                    
					_recommendationInject_documentToInjectInto = (_iframe.contentDocument || _iframe.contentWindow.document),
                    _recommendationInject_filingRecommendation = request._recommendation
                ;

				//	include
				
    //  global vars
    //      _recommendationInject_documentToInjectInto
    //      _recommendationInject_filingRecommendation

    //  log
    //  console.log(_recommendationInject_filingRecommendation);
        
    
    //  RelatedNotes
    //  ============
    
        (function () 
        {
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

        
            //  return?
            //  =======
                var _injected_element = _recommendationInject_documentToInjectInto.getElementById('relatedNotes__injected');
                
                //  check
                if (_injected_element.innerHTML == 'yup') { return; }
                
                //  set
                _injected_element.innerHTML = 'yup';
                
            //  notes & inject
            //  ==============
                var 
                    _notes = [],
                    _recommendationInject_injectNote = function (_html_id, _note_index)
                    {
                        var
                            _element = _recommendationInject_documentToInjectInto.getElementById(_html_id),
                            _data = _notes[_note_index]
                        ;
                        
                        //  invalid
                        if (_element && _data); else { return; }

                        //  thumbnail
                        var _thumbnail = _data.absoluteURL__thumbnail;
                        
                        //  thumbnail retina
                        if (true
                            && (_recommendationInject_documentToInjectInto.defaultView)
                            && (_recommendationInject_documentToInjectInto.defaultView.devicePixelRatio)
                            && (_recommendationInject_documentToInjectInto.defaultView.devicePixelRatio == 2))
                        { _thumbnail = _thumbnail.replace(/size=75$/, 'size=150'); }
                        
                        //  write
                        _element.innerHTML = ''
                            + '<div class="text">'
                            +   '<a target="_blank" href="'+__escapeForHTML(_data.absoluteURL__noteView)+'" class="title">'+__escapeForHTML(_data.title)+'</a>'
                          //+   '<a target="_blank" href="'+__escapeForHTML(_data.absoluteURL__noteView)+'" class="date">'+__escapeForHTML(((new Date(_data.created)).toDateString()))+'</a>'
                            +   '<a target="_blank" href="'+__escapeForHTML(_data.absoluteURL__noteView)+'" class="snippet">'+__escapeForHTML(_data.snippet)+'</a>'
                            +   '<a target="_blank" href="'+__escapeForHTML(_data.absoluteURL__noteView)+'" class="img" style="background-image: url(\''+__escapeForHTML(_thumbnail)+'\')"></a>'
                            + '</div>'
                        ;
                        
                        //  opening evernote links
                        var _e_links = _element.getElementsByTagName('a');
                        for (var i=0, _i=_e_links.length; i<_i; i++)
                        {
                            if (_e_links[i].getAttribute('href').match(/^evernote:\/\/\//gi))
                                { _e_links[i].setAttribute('target', ''); }
                        }
                    }
                ;
                
            //  which notes
            //  ===========
                var 
                    _hasNotes = false, 
                    _hasBusinessNotes = false
                ;
                
                //  personal
                if (true
                    && _recommendationInject_filingRecommendation.relatedNotes 
                    && _recommendationInject_filingRecommendation.relatedNotes.list 
                    && _recommendationInject_filingRecommendation.relatedNotes.list.length
                    && _recommendationInject_filingRecommendation.relatedNotes.list.length > 0) { _hasNotes = true; }
                
                //  business
                if (true
                    && _recommendationInject_filingRecommendation.businessRecommendation
                    && _recommendationInject_filingRecommendation.businessRecommendation.relatedNotes 
                    && _recommendationInject_filingRecommendation.businessRecommendation.relatedNotes.list 
                    && _recommendationInject_filingRecommendation.businessRecommendation.relatedNotes.list.length
                    && _recommendationInject_filingRecommendation.businessRecommendation.relatedNotes.list.length > 0) { _hasBusinessNotes = true; }

                //  cases
                switch (true)
                {
                    case (_hasNotes && _hasBusinessNotes):
                        _notes = [
                            _recommendationInject_filingRecommendation.relatedNotes.list[0],
                            _recommendationInject_filingRecommendation.businessRecommendation.relatedNotes.list[0]
                        ];
                        break;
                        
                    case (_hasNotes && !_hasBusinessNotes):
                        _notes = _recommendationInject_filingRecommendation.relatedNotes.list;
                        break;
                        
                    case (_hasBusinessNotes && !_hasNotes):
                        _notes = _recommendationInject_filingRecommendation.businessRecommendation.relatedNotes.list;
                        break;
                }
                    
            //  actually inject
            //  ===============
                if (_notes.length > 0)
                {
                    //  show
                    var _notesElement = _recommendationInject_documentToInjectInto.getElementById('relatedNotes');
                    if (_notesElement) { _notesElement.className = 'none'; }
                    
                    //  need to be in this order
                    _recommendationInject_injectNote('relatedNotes__first', 0);
                    _recommendationInject_injectNote('relatedNotes__second', 1);
                }
            
        })();

				break;

            case 'to-content--evernote-clip-successful':
			case 'to-content--evernote-clip-highlights-successful':
				var 
					_iframe = document.getElementById('readable_iframe'),
                    
					_infoInject_documentToInjectInto = (_iframe.contentDocument || _iframe.contentWindow.document),
                    _infoInject_filingInfo = request._info
                ;

				//	include
				    //  global vars
    //      _infoInject_documentToInjectInto
    //      _infoInject_filingInfo

    //  log
    //  console.log(_infoInject_filingInfo);

    //  FilingInfo
    //  ==========
    
        (function ()
        {
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


            //  return?
            //  =======
                var _injected_element = _infoInject_documentToInjectInto.getElementById('filingInfo_injected');
                
                //  check
                if (_injected_element.innerHTML == 'yup') { return; }
                
                //  set
                _injected_element.innerHTML = 'yup';
        

            //  notebook
            //  ========
                var _notebook_name = (_infoInject_filingInfo.notebook_name);
                    _notebook_name = (_notebook_name > '' ? _notebook_name : _infoInject_documentToInjectInto.getElementById('filingInfo_notebook_default').innerHTML);
        
                _infoInject_documentToInjectInto.getElementById('filingInfo_notebook').innerHTML = __escapeForHTML(_notebook_name);

                
            //  tags
            //  ====
                var _tags_element = _infoInject_documentToInjectInto.getElementById('filingInfo_tags');
                for (var _s=false, i=0, _i=_infoInject_filingInfo.tag_names.length; i<_i; i++)
                {
                    _s = _infoInject_documentToInjectInto.createElement('span');
                    _s.innerHTML = __escapeForHTML(_infoInject_filingInfo.tag_names[i]);
                    _tags_element.appendChild(_s);
                }
                
            
            //  url
            //  ===
                var _links = _infoInject_documentToInjectInto.getElementById('filingInfo_links');
                    _links.innerHTML = _links.innerHTML.replace('#url-edit', _infoInject_filingInfo.url_edit);
                  //_links.innerHTML = _links.innerHTML.replace('#url-view', _infoInject_filingInfo.url_view);
                  
                  
            //  opening evernote links
            //  ======================
                var _e_links = _links.getElementsByTagName('a');
                for (var i=0, _i=_e_links.length; i<_i; i++)
                {
                    if (_e_links[i].getAttribute('href').match(/^evernote:\/\/\//gi))
                        { _e_links[i].setAttribute('target', ''); }
                }
                
        })();

                break;
        }
		
		//	switch
		switch (request._type)
		{
			//case 'to-content--evernote-login-show':                   __custom_events__dispatch(__custom_events__names_to_objects['to-browser--evernote-login-show'],                     window.document, window); break;
			case 'to-content--evernote-login-show--in':                 __custom_events__dispatch(__custom_events__names_to_objects['to-browser--evernote-login-show--in'],                 window.document, window); break;
			case 'to-content--evernote-login-show--in-cn':              __custom_events__dispatch(__custom_events__names_to_objects['to-browser--evernote-login-show--in-cn'],              window.document, window); break;
			case 'to-content--evernote-login-show--cn':                 __custom_events__dispatch(__custom_events__names_to_objects['to-browser--evernote-login-show--cn'],                 window.document, window); break;
			case 'to-content--evernote-login-show--cn-in':              __custom_events__dispatch(__custom_events__names_to_objects['to-browser--evernote-login-show--cn-in'],              window.document, window); break;

			case 'to-content--evernote-speech-start':                   __custom_events__dispatch(__custom_events__names_to_objects['to-browser--evernote-speech-start'],                   window.document, window); break;
            
			case 'to-content--evernote-login-failed':                   __custom_events__dispatch(__custom_events__names_to_objects['to-browser--evernote-login-failed'],                   window.document, window); break;
			case 'to-content--evernote-login-failed--username':		    __custom_events__dispatch(__custom_events__names_to_objects['to-browser--evernote-login-failed--username'],         window.document, window); break;
			case 'to-content--evernote-login-failed--password':         __custom_events__dispatch(__custom_events__names_to_objects['to-browser--evernote-login-failed--password'],         window.document, window); break;
			case 'to-content--evernote-login-failed--password-reset':   __custom_events__dispatch(__custom_events__names_to_objects['to-browser--evernote-login-failed--password-reset'],   window.document, window); break;
			case 'to-content--evernote-login-successful':               __custom_events__dispatch(__custom_events__names_to_objects['to-browser--evernote-login-successful'],               window.document, window); break;
				
			case 'to-content--evernote-clip-successful':                __custom_events__dispatch(__custom_events__names_to_objects['to-browser--evernote-clip-successful'],                window.document, window); break;
			case 'to-content--evernote-clip-failed':                    __custom_events__dispatch(__custom_events__names_to_objects['to-browser--evernote-clip-failed'],                    window.document, window); break;

			case 'to-content--evernote-clip-highlights-successful':     __custom_events__dispatch(__custom_events__names_to_objects['to-browser--evernote-clip-highlights-successful'],     window.document, window); break;
			case 'to-content--evernote-clip-highlights-failed':         __custom_events__dispatch(__custom_events__names_to_objects['to-browser--evernote-clip-highlights-failed'],         window.document, window); break;

			case 'to-content--first-show--all-features':                __custom_events__dispatch(__custom_events__names_to_objects['to-browser--first-show--all-features'],                window.document, window); break;
			case 'to-content--first-show--new-features':                __custom_events__dispatch(__custom_events__names_to_objects['to-browser--first-show--new-features'],                window.document, window); break;

			case 'to-content--show--speech--need-login':                __custom_events__dispatch(__custom_events__names_to_objects['to-browser--show--speech--need-login'],                window.document, window); break;
			case 'to-content--show--speech--need-login--in':            __custom_events__dispatch(__custom_events__names_to_objects['to-browser--show--speech--need-login--in'],            window.document, window); break;
			case 'to-content--show--speech--need-login--in-cn':         __custom_events__dispatch(__custom_events__names_to_objects['to-browser--show--speech--need-login--in-cn'],         window.document, window); break;
			case 'to-content--show--speech--need-login--cn':            __custom_events__dispatch(__custom_events__names_to_objects['to-browser--show--speech--need-login--cn'],            window.document, window); break;
			case 'to-content--show--speech--need-login--cn-in':         __custom_events__dispatch(__custom_events__names_to_objects['to-browser--show--speech--need-login--cn-in'],         window.document, window); break;
			case 'to-content--show--speech--need-premium':              __custom_events__dispatch(__custom_events__names_to_objects['to-browser--show--speech--need-premium'],              window.document, window); break;
            
			case 'to-content--evernote-get-recommendation-failed':      __custom_events__dispatch(__custom_events__names_to_objects['to-browser--evernote-get-recommendation-failed'],      window.document, window); break;
			case 'to-content--evernote-get-recommendation-successful':  __custom_events__dispatch(__custom_events__names_to_objects['to-browser--evernote-get-recommendation-successful'],  window.document, window); break;
        }
		
		//	blank on all
		sendResponse({});
	});

	
		//	extension and chrome
		
	window.document.addEventListener('click', function(_event)
	{
		var 
			_event_key = __custom_events__get_key(_event),
			_event_name = __custom_events__keys_to_names[_event_key],
			_stop = false
		;
		
		switch (_event_name)
		{
			case 'to-extension--open-settings':			chrome.extension.sendRequest({ '_type': 'to-chrome--open-settings' });          _stop = true; break;
			case 'to-extension--open-settings-theme':	chrome.extension.sendRequest({ '_type': 'to-chrome--open-settings-theme' });    _stop = true; break;
			case 'to-extension--open-settings-speech':	chrome.extension.sendRequest({ '_type': 'to-chrome--open-settings-speech' });   _stop = true; break;
			case 'to-extension--open-premium':	        chrome.extension.sendRequest({ '_type': 'to-chrome--open-premium' });           _stop = true; break;

			case 'to-extension--select-theme-1':        chrome.extension.sendRequest({ '_type': 'to-chrome--select-theme-1' });         _stop = true; break;
			case 'to-extension--select-theme-2':        chrome.extension.sendRequest({ '_type': 'to-chrome--select-theme-2' });         _stop = true; break;
			case 'to-extension--select-theme-3':        chrome.extension.sendRequest({ '_type': 'to-chrome--select-theme-3' });         _stop = true; break;

			case 'to-extension--select-theme-custom':   chrome.extension.sendRequest({ '_type': 'to-chrome--select-theme-custom' });    _stop = true; break;
			
			case 'to-extension--select-size-small': 	chrome.extension.sendRequest({ '_type': 'to-chrome--select-size-small' }); 	    _stop = true; break;
			case 'to-extension--select-size-medium': 	chrome.extension.sendRequest({ '_type': 'to-chrome--select-size-medium' });     _stop = true; break;
			case 'to-extension--select-size-large':		chrome.extension.sendRequest({ '_type': 'to-chrome--select-size-large' }); 	    _stop = true; break;

			case 'to-extension--select-related-notes-just-at-bottom': 	chrome.extension.sendRequest({ '_type': 'to-chrome--select-related-notes-just-at-bottom' });   _stop = true; break;
			case 'to-extension--select-related-notes-disabled': 	    chrome.extension.sendRequest({ '_type': 'to-chrome--select-related-notes-disabled' });         _stop = true; break;
            
            case 'to-extension--evernote-login--switch-to-cn':  chrome.extension.sendRequest({ '_type': 'to-chrome--evernote-login--switch-to-cn'});     _stop = true; break;
            case 'to-extension--evernote-login--switch-to-in':  chrome.extension.sendRequest({ '_type': 'to-chrome--evernote-login--switch-to-in'});     _stop = true; break;
            
            case 'to-extension--first-show--check':     chrome.extension.sendRequest({ '_type': 'to-chrome--first-show--check'});     _stop = true; break;
            case 'to-extension--first-show--mark':      chrome.extension.sendRequest({ '_type': 'to-chrome--first-show--mark'});      _stop = true; break;

			case 'to-extension--track--view':
                chrome.extension.sendRequest({
                    '_type':      'to-chrome--track--view',
                    '_domain':    (window.location && window.location.href && (window.location.href.indexOf('/', 8) > -1) ? window.location.href.substr(0, (window.location.href.indexOf('/', 8)+1)) : 'blank-domain'),
                    '_theme':     (document.getElementById('__readable_var__theme') && document.getElementById('__readable_var__theme').innerHTML ? __decodeURIComponentForReadable(document.getElementById('__readable_var__theme').innerHTML) : 'blank-theme')
                }); 
                _stop = true;
                break;
            
			case 'to-extension--track--clip':
                /* will be done from inside extension code */
                /* here just for uniformity's sake */
                _stop = true;
                break;

            case 'to-extension--track--theme-popup':
                chrome.extension.sendRequest({ '_type': 'to-chrome--track--theme-popup' });
                _stop = true;
                break;

			case 'to-extension--track--settings':
                chrome.extension.sendRequest({ '_type': 'to-chrome--track--settings' });
                _stop = true;
                break;

			case 'to-extension--track--speech':
                chrome.extension.sendRequest({ '_type': 'to-chrome--track--speech' });
                _stop = true;
                break;

                
			case 'to-extension--evernote-speech':
                chrome.extension.sendRequest({ '_type': 'to-chrome--evernote-speech' });
                _stop = true;
                break;
                
			case 'to-extension--evernote-get-recommendation':
				//	include
				
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
	
	

			
				var 
					_iframe = document.getElementById('readable_iframe'),
					_doc = (_iframe.contentDocument || _iframe.contentWindow.document),
					
                    __id = _doc.getElementById('body').getAttribute('readable__page_id'),
					__url = window.location.href, 
					__title = document.title, 
					__body = ''
				;

                //  include prepare/clean
				
    //  global vars
    //      _iframe, _doc
    //      __id, __url, __title
    //      __body == ''

    
    //  get all "page_content" child elements of all "page" elements of the "#pages" element
    //  =======
    
        //  pages
        __body += '<div id="pages">';
        
        //  loop through pages
            var _pages = _doc.getElementById('pages');
            for (var _i_p=0, _ii_p=_pages.childNodes.length, _page=false, _page_html=false, _page_start_duplicate=false; _i_p<_ii_p; _i_p++)
            {
                //  the page
                _page = _pages.childNodes[_i_p];
                _page_html = _page.innerHTML;
                _page_start_duplicate = _page_html.indexOf('<div class="page_duplicateForSpeech">');
                
                //  remove duplicate
                if (_page_start_duplicate > -1) { _page_html = _page_html.substr(0, _page_start_duplicate); }

                //  append content
                __body += '<div id="page'+(_i_p+1)+'" class="page">';
                __body +=   _page_html;
                __body += '</div>';
            }
        
        //  end pages
        __body += '</div>';
    
    
    //  remove all spans
    //  ================
        __body = __body.replace(/<span([^>]*?)>/gi, '');
        __body = __body.replace(/<\/span>/gi, '');
        
    //  remove delete buttons
    //  =====================
        __body = __body.replace(/<em ([^>]*?)highlight([^>]*?)><a ([^>]*?)delete([^>]*?)><\/a>([\s\S]*?)<\/em>/gi, '<em class="highlight">$5</em>');
    
    //  highlight element
    //  =================
        __body = __body.replace(/<em ([^>]*?)highlight([^>]*?)>([^>]+?)<\/em>/gi, '<highlight>$3</highlight>');
    
    //  double EMs
    //  ==========
        while (true && __body.match(/<highlight>([\s\S]*?)<\/highlight>([\n\r\t]*?)<highlight>([\s\S]*?)<\/highlight>/gi)) {
            __body = __body.replace(/<highlight>([\s\S]*?)<\/highlight>([\n\r\t]*?)<highlight>([\s\S]*?)<\/highlight>/gi, '<highlight>$1$3</highlight>');
        }
    
    //  replace EMs
    //  ===========
        __body = __body.replace(/<highlight>([\s\S]*?)<\/highlight>/gi, '<span style="x-evernote: highlighted; background-color: #f6ee96">$1</span>');
    
    //  remove link footnotes
    //  =====================
        __body = __body.replace(/<sup class="readableLinkFootnote">([^<]*)<\/sup>/gi, '');


                //  do
				chrome.extension.sendRequest({
					'_type': 'to-chrome--evernote-get-recommendation',
					'_id': __id,
					'_url': __url,
					'_body': __body
				});
				_stop = true;
				break;
                
                
			case 'to-extension--evernote-clip':
				//	include
				
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
	
	

			
				var 
					_iframe = document.getElementById('readable_iframe'),
					_doc = (_iframe.contentDocument || _iframe.contentWindow.document),
					
                    __id = _doc.getElementById('body').getAttribute('readable__page_id'),
					__url = window.location.href, 
					__title = document.title, 
					__body = ''
				;

                //  include prepare/clean
				
    //  global vars
    //      _iframe, _doc
    //      __id, __url, __title
    //      __body == ''

    
    //  get all "page_content" child elements of all "page" elements of the "#pages" element
    //  =======
    
        //  pages
        __body += '<div id="pages">';
        
        //  loop through pages
            var _pages = _doc.getElementById('pages');
            for (var _i_p=0, _ii_p=_pages.childNodes.length, _page=false, _page_html=false, _page_start_duplicate=false; _i_p<_ii_p; _i_p++)
            {
                //  the page
                _page = _pages.childNodes[_i_p];
                _page_html = _page.innerHTML;
                _page_start_duplicate = _page_html.indexOf('<div class="page_duplicateForSpeech">');
                
                //  remove duplicate
                if (_page_start_duplicate > -1) { _page_html = _page_html.substr(0, _page_start_duplicate); }

                //  append content
                __body += '<div id="page'+(_i_p+1)+'" class="page">';
                __body +=   _page_html;
                __body += '</div>';
            }
        
        //  end pages
        __body += '</div>';
    
    
    //  remove all spans
    //  ================
        __body = __body.replace(/<span([^>]*?)>/gi, '');
        __body = __body.replace(/<\/span>/gi, '');
        
    //  remove delete buttons
    //  =====================
        __body = __body.replace(/<em ([^>]*?)highlight([^>]*?)><a ([^>]*?)delete([^>]*?)><\/a>([\s\S]*?)<\/em>/gi, '<em class="highlight">$5</em>');
    
    //  highlight element
    //  =================
        __body = __body.replace(/<em ([^>]*?)highlight([^>]*?)>([^>]+?)<\/em>/gi, '<highlight>$3</highlight>');
    
    //  double EMs
    //  ==========
        while (true && __body.match(/<highlight>([\s\S]*?)<\/highlight>([\n\r\t]*?)<highlight>([\s\S]*?)<\/highlight>/gi)) {
            __body = __body.replace(/<highlight>([\s\S]*?)<\/highlight>([\n\r\t]*?)<highlight>([\s\S]*?)<\/highlight>/gi, '<highlight>$1$3</highlight>');
        }
    
    //  replace EMs
    //  ===========
        __body = __body.replace(/<highlight>([\s\S]*?)<\/highlight>/gi, '<span style="x-evernote: highlighted; background-color: #f6ee96">$1</span>');
    
    //  remove link footnotes
    //  =====================
        __body = __body.replace(/<sup class="readableLinkFootnote">([^<]*)<\/sup>/gi, '');

			
            
				chrome.extension.sendRequest({
					'_type': 'to-chrome--evernote-clip',
                    '_id': __id,
					'_url': __url,
					'_title': __title,
					'_body': __body
				});
				_stop = true;
				break;

                
			case 'to-extension--evernote-clip-highlights':
				//	include
				
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
	
	

			
				var 
					_iframe = document.getElementById('readable_iframe'),
					_doc = (_iframe.contentDocument || _iframe.contentWindow.document),
					
                    __id = _doc.getElementById('body').getAttribute('readable__page_id'),
					__url = window.location.href, 
					__title = document.title, 
					__body = ''
				;

                //  include prepare/clean
				
    //  global vars
    //      _iframe, _doc
    //      __id, __url, __title
    //      __body == ''

    
    //  get all "page_content" child elements of all "page" elements of the "#pages" element
    //  =======
    
        //  pages
        __body += '<div id="pages">';
        
        //  loop through pages
            var _pages = _doc.getElementById('pages');
            for (var _i_p=0, _ii_p=_pages.childNodes.length, _page=false, _page_html=false, _page_start_duplicate=false; _i_p<_ii_p; _i_p++)
            {
                //  the page
                _page = _pages.childNodes[_i_p];
                _page_html = _page.innerHTML;
                _page_start_duplicate = _page_html.indexOf('<div class="page_duplicateForSpeech">');
                
                //  remove duplicate
                if (_page_start_duplicate > -1) { _page_html = _page_html.substr(0, _page_start_duplicate); }

                //  append content
                __body += '<div id="page'+(_i_p+1)+'" class="page">';
                __body +=   _page_html;
                __body += '</div>';
            }
        
        //  end pages
        __body += '</div>';
    
    
    //  remove all spans
    //  ================
        __body = __body.replace(/<span([^>]*?)>/gi, '');
        __body = __body.replace(/<\/span>/gi, '');
        
    //  remove delete buttons
    //  =====================
        __body = __body.replace(/<em ([^>]*?)highlight([^>]*?)><a ([^>]*?)delete([^>]*?)><\/a>([\s\S]*?)<\/em>/gi, '<em class="highlight">$5</em>');
    
    //  highlight element
    //  =================
        __body = __body.replace(/<em ([^>]*?)highlight([^>]*?)>([^>]+?)<\/em>/gi, '<highlight>$3</highlight>');
    
    //  double EMs
    //  ==========
        while (true && __body.match(/<highlight>([\s\S]*?)<\/highlight>([\n\r\t]*?)<highlight>([\s\S]*?)<\/highlight>/gi)) {
            __body = __body.replace(/<highlight>([\s\S]*?)<\/highlight>([\n\r\t]*?)<highlight>([\s\S]*?)<\/highlight>/gi, '<highlight>$1$3</highlight>');
        }
    
    //  replace EMs
    //  ===========
        __body = __body.replace(/<highlight>([\s\S]*?)<\/highlight>/gi, '<span style="x-evernote: highlighted; background-color: #f6ee96">$1</span>');
    
    //  remove link footnotes
    //  =====================
        __body = __body.replace(/<sup class="readableLinkFootnote">([^<]*)<\/sup>/gi, '');

			
            
				chrome.extension.sendRequest({
					'_type': 'to-chrome--evernote-clip-highlights',
                    '_id': __id,
					'_url': __url,
					'_title': __title,
					'_body': __body
				});
				_stop = true;
				break;

                
			/*case 'to-extension--evernote-unset-tag':
				//	include
				
			
				var 
					_iframe = document.getElementById('readable_iframe'),
					_doc = (_iframe.contentDocument || _iframe.contentWindow.document),
					
					_tagElement = _doc.getElementById('filingInfo__unset_tag'),
					
                    __id = _doc.getElementById('body').getAttribute('readable__page_id'),
					__tag = _tagElement.innerHTML
				;
            
				chrome.extension.sendRequest({
					'_type': 'to-chrome--evernote-unset-tag',
                    '_id': __id,
					'_tag': __tag
				});
				_stop = true;
				break;*/

                
			/*case 'to-extension--evernote-unset-notebook':
				//	include
				
			
				var 
					_iframe = document.getElementById('readable_iframe'),
					_doc = (_iframe.contentDocument || _iframe.contentWindow.document),
					
                    __id = _doc.getElementById('body').getAttribute('readable__page_id')
				;
            
				chrome.extension.sendRequest({
					'_type': 'to-chrome--evernote-unset-notebook',
                    '_id': __id
				});
				_stop = true;
				break;*/

				
			case 'to-extension--evernote-login':
				var 
					_iframe = document.getElementById('readable_iframe'),
					_doc = (_iframe.contentDocument || _iframe.contentWindow.document),
					
					_userElement = _doc.getElementById('evernote_login__username'),
					_passElement = _doc.getElementById('evernote_login__password'),
					_rememberMeElement = _doc.getElementById('evernote_login__rememberMe'),

					__user = (_userElement.value > '' ? _userElement.value : ''),
					__pass = (_userElement.value > '' ? _passElement.value : ''),
					__rememberMe = (_rememberMeElement.checked == true ? true : false)
				;
			
				chrome.extension.sendRequest({
					'_type': 'to-chrome--evernote-login',
					'_user': __user,
					'_pass': __pass,
					'_rememberMe': __rememberMe
				});
				_stop = true;
				break;

        }
	
		if (_stop)
		{
			_event.stopPropagation();
			_event.preventDefault();
		}
	
	}, true);

	
	
	//	keyboard hook
	//	=============
		
	//	keyboard hook
	chrome.extension.sendRequest({ '_type': "to-chrome--get-keyboard-info" }, function(response)
	{
		//	decode
		
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
	
	


		//	global vars
		var 
			__definition_items_html = response._definition_items_html,
			
			__key_activation = __decodeURIComponentForReadable(response._key_activation),
			__key_clip = __decodeURIComponentForReadable(response._key_clip),
            __key_highlight = __decodeURIComponentForReadable(response._key_highlight),
            __key_speak = __decodeURIComponentForReadable(response._key_speak)
		;
		
		//	the event
		window.addEventListener('keydown', function(_event)
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
				case ((__key_activation > '') && (_key_combo == __key_activation)):
				case ((__key_clip > '') && (_key_combo == __key_clip)):
				case ((__key_highlight > '') && (_key_combo == __key_highlight)):
				case ((__key_speak > '') && (_key_combo == __key_speak)):
					
					//	also?
                    //  =====
                        
                        //  clip
						var __clip_on_launch = ((__key_clip > '') && (_key_combo == __key_clip));

                        //	highlight
						var __highlight_on_launch = ((__key_highlight > '') && (_key_combo == __key_highlight));
                        
                        //	speak
						var __speak_on_launch = ((__key_speak > '') && (_key_combo == __key_speak));
                        
					//	stop
					//	====
						_event.stopPropagation();
						_event.preventDefault();

					//	inject
					//	======
						var code = ""
							+	"var "
+	"	_d = document, "
+	"	_b = _d.getElementsByTagName('body')[0], "
+	"	_o = _d.getElementById('__readable_extension_definitions'), "
+	"	_l = _d.createElement('script')"
+	";"

+	"if (_o); else"
+	"{"
+	"	_o = _d.createElement('dl');"
+	"	_o.setAttribute('style', 'display: none;');"
+	"	_o.setAttribute('id', '__readable_extension_definitions');"
+	"	_b.appendChild(_o);"
+	"}"
+	"_o.innerHTML = '"+__definition_items_html+"';"

+	"_l.setAttribute('src', 'chrome-extension://iooicodkiihhpojmmeghjclgihfjdjhj/js/__bookmarklet_to_inject"+(__clip_on_launch ? "__andClipOnLaunch" : (__highlight_on_launch ? "__andHighlightOnLaunch" : (__speak_on_launch ? "__andSpeakOnLaunch" : "")))+".js');"
+	"_l.className = 'bookmarklet_launch';"
+	"_b.appendChild(_l);";
						eval(code);
						
					break;
			}
			
		}, true);
	});


        
    //  expose clearly
    //  ==============
		
    //  expose clearly
    //  ==============
    
        (function ()
        {
        
            //  return
            if (window.location.hostname.match(/(evernote|yinxiang).com$/gi)); else { return; }
            
            //  add to head
            try
            {
                var _meta = document.createElement("meta");
                    _meta.name = "evernote-clearly-extension";
                    _meta.content = "installed";
                
                document.head.appendChild(meta);
            }
            catch (e) {}
            
            //  add to body
            try
            {
                document.body.className += ' evernote-clearly-extension';
            }
            catch (e) {}
            
        })();
        
    
    