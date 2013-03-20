$(function ()
{
	(function ($R)
	{
        //  debug
        //  =====
            
    //  random number
    $R.rand = function (_min, _max) {
        return (Math.floor(Math.random() * (_max - _min + 1)) + _min);
    };

	//	defaults to false
	if ($R.debug); else { $R.debug = false; }

	//	make it faster -- when not debugging
	//	==============
	if (!($R.debug))
	{
		$R.debugRemember = {};
		
		$R.writeLog 		= function () { return false; };
		$R.log 				= function () { return false; };
		
		$R.debugTimerStart 	= function () { return false; };
		$R.debugTimerEnd 	= function () { return false; };
		
		$R.debugPrint 		= function () { return false; };
		$R.printDebugOutput = function () { return false; };
		
		$R.debugOutline 	= function () { return false; };
	}
	else
	{
		//	remember stuff
			$R.debugRemember = {};

		//	vars
		//	====
			$R.debugStuff = [];
			$R.debugTimers = [];
			
		//	write log
		//	=========
			$R.initializeWriteLogFunction = function ()
			{
				switch (true)
				{
					case (!(!($R.win.console && $R.win.console.log))):
						$R.writeLog = function (msg) { $R.win.console.log(msg); };
						break;
						
					case (!(!($R.win.opera && $R.win.opera.postError))):
						$R.writeLog = function (msg) { $R.win.opera.postError(msg); };
						break;
						
					default:
						$R.writeLog = function (msg) {};
						break;
				}
			};
			
		//	log
		//	===
			$R.initializeWriteLogFunction();
			$R.log = function ()
			{
                if ($R.debug); else { return; }

				for (var i=0, il=arguments.length; i<il ; i++)
					{ $R.writeLog(arguments[i]); }
					
				$R.writeLog('-----------------------------------------');
			};
		
		//	outline
		//	=======
			$R.debugOutline = function (_element, _category, _reason)
			{
				switch (true)
				{
                    case (!$R.debug):
					case (!(_element.nodeType === 1)):
					case (!(_element.tagName > '')):
					case (_element.tagName.toLowerCase() == 'onject'):
					case (_element.tagName.toLowerCase() == 'embed'):
						return;
                }
                
                var 
                    _outline = '#ff5500',
                    _background = 'rgba(255, 85, 0, 0.5)'
                ;
                
                //  choose
                switch (true)
                {
                    case (_category == 'target' && _reason == 'first'):
                        _outline = '#00cc00';
                        _background = 'rgba(0, 255, 0, 0.5)';
                        break;
                        
                    case (_category == 'target' && _reason == 'second'):
                        _outline = '#0000cc';
                        _background = 'rgba(0, 0, 255, 0.5)';
                        break;
                    
                    //  =====
                    
                    case (_category == 'target' && _reason == 'next-page'):
                        _outline = '#FF80C0';
                        _background = 'rgba(255, 128, 192, 0.5)';
                        break;
                        
                    case (_category == 'target' && _reason == 'add-above'):
                        _outline = '#804000';
                        _background = 'rgba(128, 64, 0, 0.5)';
                        break;
                    
                    //  =====
                    
                    case (_category == 'clean-before' && _reason == 'floating'):
                        _outline = '#808080';
                        _background = 'rgba(128, 128, 128, 0.5)';
                        break;
                        
                    case (_category == 'clean-after' && _reason == 'missing-density'):
                        _outline = '#C0C0C0';
                        _background = 'rgba(192, 192, 192, 0.5)';
                        break;
                    
                    case (_category == 'clean-after' || _category == 'clean-before'):
                        _outline = '#000000';
                        _background = 'rgba(0, 0, 0, 0.5)';
                        break;
                }
                
                //  do
                $(_element).attr('readable__outline', (_category + ': ' + _reason));
                $(_element).css({
                    'outline': '5px solid ' + _outline,
                    'background-color': '' + _background
                });
			};
            
            $R.debugBackground = function (_element, _category, _reason)
            {
                if ($R.debug); else { return; }
                
				switch (true)
				{
					case (!(_element.nodeType === 1)):
					case (!(_element.tagName > '')):
					case (_element.tagName.toLowerCase() == 'onject'):
					case (_element.tagName.toLowerCase() == 'embed'):
						//	don't outline
						break;
						
					default:
						var _color = 'transparent';
						switch (true)
						{
							case (_category == 'target' && _reason == 'first'): 				_color = '';	break;
							case (_category == 'target' && _reason == 'second'): 				_color = '';	break;
                            
							case (_category == 'target' && _reason == 'next-page'):				_color = '#FF80C0'; break;
							case (_category == 'target' && _reason == 'add-above'): 			_color = '#804000'; break;
							
							case (_category == 'clean-before' && _reason == 'floating'): 		_color = '#808080'; break;
							case (_category == 'clean-after' && _reason == 'missing-density'): 	_color = '#C0C0C0'; break;
							
							case (_category == 'clean-after' || _category == 'clean-before'):	_color = '#000000'; break;
						}
						
						$(_element).css('outline','5px solid '+_color);
						$(_element).attr('readable__outline', (_category + ': ' + _reason));
						break;
				}
            };
			
		//	timers
		//	======
			$R.debugTimerStart = function (timerName)
			{
				$R.debugTimers.push({
					'name': timerName,
					'start': (new Date()).getTime()
				});
			};
			
			$R.debugTimerEnd = function ()
			{
				var _t = $R.debugTimers.pop(), _time = ((new Date()).getTime() - _t.start);
				$R.log('TIMER / '+_t.name+': ' + _time);
				return _time;
			};
		
		//	output -- will be shown in Show function
		//	======
			$R.debugPrint = function (_key, _value)
				{ $R.debugStuff[_key] = _value; };
			
			$R.printDebugOutput = function ()
			{
				//	return
					if ($R.debug); else { return; }
					if ($R.customScript) { return; }

				//	first
					var _first =
					[
                        'Language',
						'ExploreAndGetStuff',
						'ProcessFirst',
						'ProcessSecond',
						'BuildHTML',
						'BuildHTMLPregs',
                        'PointsFirst',
                        'PointsSecond',
                        'Target',
						'NextPage',
                        'TitleSource'
					];

				//	get and clean
					_$debug = $('#debugOutput');
					_$debug.html('');
				
				//	write
					var _debug_write = function (_key, _value)
					{
						_$debug.append(''
							+ '<tr>'
							+ 	'<td class="caption">'
							+		_key
							+ 	'</td>'
							+ 	'<td id="debugOutput__value__'+_key+'" class="value">'
							+		_value
							+ 	'</td>'
							+ '</tr>'	
						);
					}

				//	first
					for (var i=0, _i=_first.length; i<_i; i++)
						{ _debug_write(_first[i], $R.debugStuff[_first[i]]); delete($R.debugStuff[_first[i]]); }
				
				//	the rest
					for (var _k in $R.debugStuff)
						{ _debug_write(_k, $R.debugStuff[_k]); }
					
				//	end; stop
					$R.debugPrint = function () {};
					$R.printDebugOutput = function () {};
			};
			
		//	scriptable scrolling
			$R.debugScroll__before1 = function () { $R.win.scrollTo(0, 0); };
			$R.debugScroll__before2 = function () { $R.win.scrollTo(0, $R.$win.height()); };
			$R.debugScroll__before3 = function () { if ($($R.debugRemember['theTarget']).height() > 0) { $R.debugRemember['theTarget'].scrollIntoView(false); } else { $R.debugRemember['firstCandidate'].scrollIntoView(false); } $R.win.scrollBy(0, 100); };
			
			$R.debugScroll__after1 = function () { window.scrollTo(0, 0); };
			$R.debugScroll__after2 = function () { window.scrollTo(0, $R.$win.height()); };
			$R.debugScroll__after3 = function () { $('#page1').get(0).scrollIntoView(false); window.scrollBy(0, 100); };
	}

            
        //  paths
        //  =====
            $R.paths = 
            {
                'main':		'chrome-extension://iooicodkiihhpojmmeghjclgihfjdjhj/',
                'evernote':	'https://www.evernote.com/'
            };
            
		//	vars
		//	====
			$R.$win = $($R.win);
			$R.$document = $($R.document);
            $R.pagesCount = 1;  // there's always at least 1 page
	
		//	RUN: inside frame
		//	================
            $R.$html = $('#html');
            $R.$body = $('#body');
            $R.$box = $('#box');
            $R.$audioElements = $('#audio_elements_container');
            $R.$text = $('#text');
            $R.$pages = $('#pages');
            $R.$footnotedLinks = $('#footnotedLinks');
            
        //  highlighting
        //  ============
            
	//	options
	//	=======
		$R.parsingOptions =
		{
			'_elements_ignore': 			        '|button|input|select|textarea|optgroup|command|datalist|--|frame|frameset|noframes|--|style|link|script|noscript|--|canvas|applet|map|--|marquee|area|base|',
			'_elements_ignore_tag': 		        '|form|fieldset|details|dir|--|center|font|span|',
			
			'_elements_container': 			        '|body|--|article|section|--|div|--|td|--|li|--|dd|dt|',
            '_elements_self_closing': 		        '|br|hr|--|img|--|col|--|source|--|embed|param|--|iframe|',

			'_elements_visible': 			        '|article|section|--|ul|ol|li|dd|--|table|tr|td|--|div|--|p|--|h1|h2|h3|h4|h5|h6|--|span|',
			'_elements_too_much_content': 	        '|b|i|em|strong|--|h1|h2|h3|h4|h5|--|td|',
			'_elements_link_density':		        '|div|--|table|ul|ol|--|section|aside|header|',
			'_elements_floating':			        '|div|--|table|',
			'_elements_above_target_ignore':        '|br|--|ul|ol|dl|--|table|',
            
            '_elements_highlight_protect':          '|video|audio|source|--|object|param|embed|',
			
            '_elements_keep_attributes':
			{
				'a': 		['href', 'title', 'name'],
				'img': 		['src', 'width', 'height', 'alt', 'title'],

				'video': 	['src', 'width', 'height', 'poster', 'audio', 'preload', 'autoplay', 'loop', 'controls'],
				'audio': 	['src', 'preload', 'autoplay', 'loop', 'controls'],		 
				'source': 	['src', 'type'],
					 
				'object': 	['data', 'type', 'width', 'height', 'classid', 'codebase', 'codetype'],						
				'param': 	['name', 'value'],
				'embed': 	['src', 'type', 'width', 'height', 'flashvars', 'allowscriptaccess', 'allowfullscreen', 'bgcolor'],
					
				'iframe':	['src', 'width', 'height', 'frameborder', 'scrolling'],
					
				'td':		['colspan', 'rowspan'],			
				'th':		['colspan', 'rowspan']
			}
		};

		
	//	next page keywords -- (?? charCodeAt() > 127)
	//	==================
		$R.nextPage__captionKeywords = 
		[
			/* english */
			'next page', 'next',
			
			/* german */
			'vorw&#228;rts', 'weiter',

			/* japanese */
			'&#27425;&#12408;'
		];

		$R.nextPage__captionKeywords__not =
		[
			/* english */
			'article', 'story', 'post', 'comment', 'section', 'chapter'
			
		];
		
		
	//	skip links
	//	==========
		$R.skipStuffFromDomains__links = 
		[
			'doubleclick.net',
            'fastclick.net',
			'adbrite.com',
			'adbureau.net',
			'admob.com',
			'bannersxchange.com',
			'buysellads.com',
			'impact-ad.jp',
			'atdmt.com',
			'advertising.com',
			'itmedia.jp',
			'microad.jp',
			'serving-sys.com',
            'adplan-ds.com'
		];
		
		
	//	skip images
	//	===========
		$R.skipStuffFromDomain__images = 
		[
			'googlesyndication.com',
            'fastclick.net',
			'.2mdn.net',
			'de17a.com',
			'content.aimatch.com',
			'bannersxchange.com',
			'buysellads.com',
			'impact-ad.jp',
			'atdmt.com',
			'advertising.com',
			'itmedia.jp',
			'microad.jp',
			'serving-sys.com',
            'adplan-ds.com'
		];

		
	//	keep video
	//	==========
	
		$R.keepStuffFromDomain__video = 
		[
			'youtube.com',
			'youtube-nocookie.com',
			
			'vimeo.com',
			'hulu.com',
			'yahoo.com',
			'flickr.com',
			'newsnetz.ch'
		];


            
    $R.highlight__doCurentSelection = function ()
    {
        //  vars
        //  ====
            var 
                _selection = $R.sel.getSelection(window),
                _range = $R.sel.getRange(_selection),
                _text = $R.sel.getRangeText(_range),
                
                _good_range = (_range ? {
                    'commonAncestorContainer':  _range.commonAncestorContainer,
                    'startContainer':           _range.startContainer,
                    'endContainer':             _range.endContainer,
                    'startOffset':              _range.startOffset,
                    'endOffset':                _range.endOffset
                } : false)
            ;
        
        //  some exception rules
        //  ====================
            switch (true)
            {
                case (!(_text)):
                case (!(_text.length > 0)):
                case (!(_good_range)):
                    return false;
            }
        
        //  some corrections
        //  ================
        
            //  Firefox fucks up -- https://developer.mozilla.org/en/DOM/range.startOffset
            //  Offsets mean two differet things

            //  start container
            if (_good_range.startContainer.nodeType == 1)
            {
                if (_good_range.startContainer.childNodes[_good_range.startOffset])
                {
                    _good_range.startContainer = _good_range.startContainer.childNodes[_good_range.startOffset];
                    _good_range.startOffset = 0;
                }
            }
            
            //  end container
            if (_good_range.endContainer.nodeType == 1)
            {
                if (_good_range.endContainer.childNodes[_good_range.endOffset])
                {
                    _good_range.endContainer = _good_range.endContainer.childNodes[_good_range.endOffset];
                    _good_range.endOffset = 0;
                }
            }

        //  highlight range
        //  ===============
            var _highlighted_range = $R.highlight__doRange(_good_range);
            if (_highlighted_range === false) { return; }
            
        //  clear selection
        //  ===============
            try { _selection.removeAllRanges(); } catch (e) {}

        //  correct double highlights
        //  =========================
            var _parents_double_to_clean = [];
            $('em.highlight em.highlight').each(function (_i, _e)
            {
                //  remove inner button
                    $(_e).find('a.delete').remove();
            
                //  create
                var _newElement = document.createElement('span');
                    _newElement.innerHTML = _e.innerHTML;

                //  repalce
                _e.parentNode.replaceChild(_newElement, _e);
                
                //  add
                _parents_double_to_clean.push(_newElement.parentNode);
            });
            
            //  clean
            $R.highlight__deleteSpansFromParents(_parents_double_to_clean);
            
        //  remove buttons and classes
        //  ==========================
            //  delete buttons
            $('em.highlight a.delete').remove();
            
            //  first, last
            $('em.highlight.first').removeClass('first');
            $('em.highlight.last').removeClass('last');

            
        //  add buttons and classes
        //  =======================
            var 
                _highlights_collection = $('em.highlight'),
                _highlights_collection_ids = [],
                _curr_delete_button = false
            ;
            
            //  get all ids
            _highlights_collection.each(function (_i, _e) { _highlights_collection_ids.push($(_e).attr('highlight_id')); });
            
            //  add button, classes
            _highlights_collection.each(function (_i, _e)
            {
                var
                    _isFirst = (_highlights_collection_ids[(_i-1)] ? (_highlights_collection_ids[_i] != _highlights_collection_ids[(_i-1)]) : true),
                    _isLast = (_highlights_collection_ids[(_i+1)] ? (_highlights_collection_ids[_i] != _highlights_collection_ids[(_i+1)]) : true)
                ;

                if (_isFirst)
                {
                    //  class
                    $(_e).addClass('first');
                    
                    //  create button
                    _curr_delete_button = document.createElement('a');
                    _curr_delete_button.className = 'delete';
                    _curr_delete_button.id = 'highlight_delete__' + _highlights_collection_ids[_i];
                    
                    //  add button
                    _e.insertBefore(_curr_delete_button, _e.firstChild);
                }
                
                if (_isLast)
                {
                    //  class
                    $(_e).addClass('last');
                }
            });
    };

            
    $R.highlight__doRange = function (_range_to_highlight)
    {
        //  get referrence elements
        //  =======================
            var
                _commonAncestorElement = $R.highlight__getParentElementOfNode(_range_to_highlight.commonAncestorContainer),
                _startElement = $R.highlight__getParentElementOfNodeWithThisParent(_range_to_highlight.startContainer, _commonAncestorElement),
                _endElement = $R.highlight__getParentElementOfNodeWithThisParent(_range_to_highlight.endContainer, _commonAncestorElement)
            ;
            
            
        //  some rules
        //  ==========
            switch (true)
            {
                case ((_startElement.tagName) && (_startElement.tagName.toLowerCase() == 'div') && ($(_startElement).hasClass('page_content') || $(_startElement).hasClass('page_duplicateForSpeech'))):
                case ((_endElement.tagName) && (_endElement.tagName.toLowerCase() == 'div') && ($(_endElement).hasClass('page_content') || $(_endElement).hasClass('page_duplicateForSpeech'))):
                case ((_commonAncestorElement.tagName) && !($.contains($R.$pages.get(0).childNodes[0], _commonAncestorElement) || $.contains($R.$pages.get(0).childNodes[1], _commonAncestorElement))):
                    return false;
            }
            
            /* $R.log(
                _range.startContainer, _range.endContainer, _range.startOffset, _range.endOffset, 
                _range_to_highlight, 
                _commonAncestorElement, _startElement, _endElement
            ); */
            
            
        //  selection id
        //  ============
            var _selection_id = $R.rand(1, 1000);
            while (true)
            {
                //  nothing found
                if ($('em.highlight[highlight_id="'+_selection_id+'"]').length > 0); else { break; }
                
                //  new id
                _selection_id = $R.rand(1, 1000);
            }
        
        
        //  chainging elements
        //  ==================
            var 
                _chaingingElements = [],
                
                _currElement = _startElement,
                _currChainging = false
            ;
            
            while (true)
            {
                //  object
                _currChainging = {
                    '_element': _currElement,
                    '_tagName': (_currElement.nodeType === 3 ? '#text' : ((_currElement.nodeType === 1 && _currElement.tagName && _currElement.tagName > '') ? _currElement.tagName.toLowerCase() : '#invalid'))
                };
                
                //  add
                _chaingingElements.push(_currChainging);

                //  break
                if (_currElement == _endElement) { break; }
                
                //  next
                _currElement = _currElement.nextSibling;
                
                //  error?
                if (_currElement); else { break; }
            }

            
        //  rewrite elements
        //  ================
            var _parents_to_clean = [];
            for (var i=0, _i=_chaingingElements.length, _currElement=false; i<_i; i++)
            {
                var 
                    _currElement = _chaingingElements[i],
                    _currNode = _currElement._element,
                    _currTag = _currElement._tagName,
                    _boundry_mode = '',
                    _currBuiltHTML = false,
                    _resNode = false
                ;

                //  get html / mode
                //  ===============
                    switch (true)
                    {
                        case ((_i == 1) && (i == 0)):       _boundry_mode = 'boundry-both';     break;
                        case ((_i > 1) && (i == 0)):        _boundry_mode = 'boundry-start';    break;
                        case ((_i > 1) && (i == (_i-1))):   _boundry_mode = 'boundry-end';      break;
                        default:                            _boundry_mode = 'everything';       break;
                    }

                //  get html
                //  ========
                    _currBuiltHTML = $R.highlight__buildHTMLForElementWithSelectedRange(_currNode, _boundry_mode, _range_to_highlight);

                
                //  write
                //  =====
                    switch (true)
                    {
                        case ((_currTag == '#text')):
                        
                            //  resulting html might be something like "<em>something</em> something else"
                            //  so we create a dummy span tag to eomcompass it, and then repalce the old text node with that
                        
                            //  create
                            var _newElement = document.createElement('span');
                                _newElement.innerHTML = _currBuiltHTML;

                            //  result
                            _resNode = _newElement;
                                
                            //  replace
                            _currNode.parentNode.replaceChild(_resNode, _currNode);
                            
                            break;
                            
                        case (($R.parsingOptions._elements_self_closing.indexOf('|'+_currTag+'|') > -1)):
                            
                            //  result
                            _resNode = _currNode;

                            /* nothing */ /*
                                var _newElement = document.createElement('em');
                                    _newElement.className = 'highlight';
                                    _newElement.innerHTML = _currBuiltHTML;
                                _currNode.parentNode.replaceChild(_newElement, _currNode);
                            */
                            
                            break;

                            
                        default:
                            
                            //  result
                            _resNode = _currNode;

                            //  innerHTML
                            _currBuiltHTML = _currBuiltHTML.substr((_currBuiltHTML.indexOf('>')+1));
                            _currBuiltHTML = _currBuiltHTML.substr(0, _currBuiltHTML.lastIndexOf('<'));
                            
                            //  highlighted anything?
                            if (_currBuiltHTML.indexOf('<em class="highlight">') > - 1); else { break; }
                            
                            //  do it
                            _currNode.innerHTML = _currBuiltHTML;
                            break;
                    }
                    
                    
                //  set highlight class 
                //  ===================
                    
                    //  inside node
                    $(_resNode).find('em.highlight:not([highlight_id])').attr('highlight_id', _selection_id);
                    
                    //  on node
                    if ((_currTag == 'em') && $(_resNode).hasClass('highlight'))
                        { $(_resNode).attr('highlight_id', _selection_id); }
                        
                    //  clean::add
                    _parents_to_clean.push(_resNode.parentNode);
            }

            //  clean::do
            $R.highlight__deleteSpansFromParents(_parents_to_clean);
    };

            
    $R.highlight__deleteSpansFromParents = function (_parents)
    {
        var 
            _done = [], 
            _this_done = false,
            _inner = ''
        ;
        
        //  main loop
        for (var i=0, _i=_parents.length; i<_i; i++)
        {
            //  init
            _this_done = false;
            
            //  check
            for (var ii=0, _ii=_done.length; ii<_ii; ii++)
            {
                if (_done[ii] == _parents[i])
                {
                    _this_done = true;
                    break;
                }
            }    
             
            //  skip
            if (_this_done) { continue; }
            
            
            //  actually do
            //  ===========
            
                //  add
                _done.push(_parents[i]);
            
                //  get
                _inner = _parents[i].innerHTML;
            
                //  check
                if (_inner.indexOf('<span') > -1); else { continue; }
                
                //  replace
                _inner = _inner.replace(/<span([^>]*?)>/gi, '');
                _inner = _inner.replace(/<\/span>/gi, '');
                _parents[i].innerHTML = _inner;
        }
    };


    $R.highlight__getDeepestTextNode = function (_node)
    {
        var _n = _node;
        
        while (true)
        {
            switch (true)
            {
                //  text
                case (_n.nodeType && _n.nodeType == 3): return _n;
                
                //  single child
                case (_n.nodeType && _n.nodeType == 1 && _n.childNodes.length > 0): _n = _n.childNodes[0]; break;
                
                //  no children but has sibling
                case (_n.nodeType && _n.nodeType == 1 && _n.childNodes.length == 0 && _n.nextSibling): _n = _n.nextSibling; break;
                
                //  default
                default: return _node;
            }
        }
    };

    
    $R.highlight__getCommonAncestorContainerForNodes = function (_node1, _node2, _fallback)
    {
        var 
            _parent1 = _node1, 
            _parent2 = _node2
        ;
        
        while (true)
        {
            //  next
            _parent1 = _parent1.parentNode;
            _parent2 = _parent2.parentNode;

            //  break
            switch (true)
            {
                case (!(_parent1)):
                case (!(_parent2)):
                case (_parent1 == _fallback):
                case (_parent2 == _fallback):
                    return _fallback;
            }
            
            //  maybe
            switch (true)
            {
                case (_parent1 == _parent2): return _parent1;

                case ($.contains(_parent1, _node2)): return _parent1;
                case ($.contains(_parent2, _node1)): return _parent2;
                
                case ($.contains(_parent1, _parent2)): return _parent1;
                case ($.contains(_parent2, _parent1)): return _parent2;
            }
        }
    };

    
    $R.highlight__getParentElementOfNode = function (_thisNode)
    {
        var _element = _thisNode;
        while (true) {
            //  correct
            if (_element.nodeType == 1) { break; }
            
            //  continue
            _element = _element.parentNode;
        }
        return _element;
    };
            
            
    $R.highlight__getParentElementOfNodeWithThisParent = function (_thisNode, _thisParent)
    {
        //  impossible
        switch (true)
        {
            case (_thisNode == _thisParent):
                return _thisNode;
                
            case (!($.contains(_thisParent, _thisNode))):
                return _thisNode;
        }
        
        //  do
        var _element = _thisNode;
        while (true) {
            //  correct
            if (_element.parentNode == _thisParent) { break; }
            
            //  continue
            _element = _element.parentNode;
        }
        return _element;
    };

            
    $R.highlight__buildHTMLForElementWithSelectedRange = function (_elementToBuildHTMLFor, _modeToBuildHTMLIn, _rangeToBuildHTMLWith)
    {
        var 
            _global__element_index = 0,
            _global__the_html = '',
            _global__highlight_on = ((_modeToBuildHTMLIn == 'boundry-end') ? true : false)
        ;

        //	recursive function
        //	==================
        var _recursive = function (_node)
        {
            //	increment index -- starts with 1
            //	===============
                _global__element_index++;

            //	vars
            //	====
                var 
                    _explored = false,
                    _tag_name = (_node.nodeType === 3 ? '#text' : ((_node.nodeType === 1 && _node.tagName && _node.tagName > '') ? _node.tagName.toLowerCase() : '#invalid')),
                    _tag_is_ignored = ($R.parsingOptions._elements_ignore_tag.indexOf('|'+_tag_name+'|') > -1),
                    _tag_is_ignored = (_tag_is_ignored ? ((_tag_name == 'span') ? false : true) : false),
                    _pos__start__before = 0,
                    _pos__start__after = 0,
                    _pos__end__before = 0,
                    _pos__end__after = 0,
                    _to_write = '',
                    _selection_starts_here = false,
                    _selection_ends_here = false
                ;

            //	fast return
            //	===========
                switch (true)
                {
                    case ((_tag_name == '#invalid')):
                    case (($R.parsingOptions._elements_ignore.indexOf('|'+_tag_name+'|') > -1)):
                        return;
                        
                    case (_tag_name == '#text'):
                        //  get value
                        //  =========
                            _to_write = _node.nodeValue.replace(/</gi, '&lt;').replace(/>/gi, '&gt;');

                        //  mode?
                        //  =====
                            switch (true)
                            {
                                case (_modeToBuildHTMLIn == 'nothing'):
                                    break;
                                    
                                case (_modeToBuildHTMLIn == 'everything'):
                                    _to_write = ''
                                        + '<highlight>' 
                                        +   _to_write 
                                        + '</highlight>'
                                    ;
                                    break;
                                    
                                case (_modeToBuildHTMLIn == 'boundry-start'):
                                case (_modeToBuildHTMLIn == 'boundry-end'):
                                case (_modeToBuildHTMLIn == 'boundry-both'):
                                    
                                    //  end of range?
                                    //  =============
                                        if (_node == _rangeToBuildHTMLWith.endContainer)
                                        {
                                            _to_write = ''
                                                + '<highlight>'
                                                +   _to_write.substr(0, _rangeToBuildHTMLWith.endOffset)
                                                + '</highlight>'
                                                + _to_write.substr(_rangeToBuildHTMLWith.endOffset)
                                            ;
                                            
                                            _global__highlight_on = false;
                                            _selection_ends_here = true;
                                        }
                                    
                                    //  start of range?
                                    //  ===============
                                        if (_node == _rangeToBuildHTMLWith.startContainer)
                                        {
                                            _to_write = ''
                                                + _to_write.substr(0, _rangeToBuildHTMLWith.startOffset)
                                                + '<highlight>'
                                                +   _to_write.substr(_rangeToBuildHTMLWith.startOffset)
                                                + '</highlight>'  
                                            ;
                                            
                                            _global__highlight_on = true;
                                            _selection_starts_here = true;
                                        }
                                        
                                    //  correction
                                    //  ==========
                                        if (_selection_starts_here && _selection_ends_here)
                                        {
                                            _to_write = _node.nodeValue.replace(/</gi, '&lt;').replace(/>/gi, '&gt;');
                                            _to_write = ''
                                                + _to_write.substr(0, _rangeToBuildHTMLWith.startOffset)
                                                + '<highlight>'
                                                +   _to_write.substr(_rangeToBuildHTMLWith.startOffset, (_rangeToBuildHTMLWith.endOffset - _rangeToBuildHTMLWith.startOffset))
                                                + '</highlight>'
                                                + _to_write.substr(_rangeToBuildHTMLWith.endOffset)
                                            ;

                                            _global__highlight_on = false;
                                        }
                                        
                                    //  snap-to
                                    //  =======
                                        if (_selection_starts_here && (_rangeToBuildHTMLWith.startOffset > 0))
                                        {
                                            //  before
                                            _to_write = _to_write.replace(/([ .,;?!])([a-z0-9]{1,2})<highlight>/gi, '$1<highlight>$2');
                                            
                                            //  space at begining
                                            _to_write = _to_write.replace(/<highlight>([\s])([^\s])/gi, '$1<highlight>$2');

                                            //  too much
                                            _to_write = _to_write.replace(/<highlight>([a-z0-9])([ ])([a-z0-9])/gi, '$1$2<highlight>$3');
                                        }
                                        
                                        if (_selection_ends_here && (_rangeToBuildHTMLWith.endOffset > 0))
                                        {
                                            var _do_end = true;
                                            
                                            if (_rangeToBuildHTMLWith.endContainer && _rangeToBuildHTMLWith.endContainer.nodeValue && _rangeToBuildHTMLWith.endContainer.nodeValue.length)
                                                { _do_end = (_rangeToBuildHTMLWith.endOffset < _rangeToBuildHTMLWith.endContainer.nodeValue.length); }
                                        
                                            if (_do_end)
                                            {
                                                //  after
                                                _to_write = _to_write.replace(/<\/highlight>([a-z0-9]{0,2})([ .,;?!])/gi, '$1$2</highlight>');

                                                //  space at end
                                                _to_write = _to_write.replace(/([^\s])([\s])<\/highlight>/gi, '$1</highlight>$2');

                                                //  too much
                                                _to_write = _to_write.replace(/([ ])([a-z0-9])<\/highlight>([a-z0-9])/gi, '</highlight>$1$2$3');
                                            }
                                        }
                                        
                                    //  other
                                    //  =====
                                        if (!(_selection_starts_here) && !(_selection_ends_here))
                                        {
                                            _to_write = _node.nodeValue.replace(/</gi, '&lt;').replace(/>/gi, '&gt;');
                                            if (_global__highlight_on)
                                            {
                                                _to_write = ''
                                                    + '<highlight>' 
                                                    +   _to_write 
                                                    + '</highlight>'
                                                ;
                                            }
                                        }
                                
                                    break;
                            }
                            
                        //  write value
                        //  ===========
                            _global__the_html += _to_write;
                        
                        return;
                }
            
            
            //  range anchors are elements instead of text-nodes
            //  ================================================
            
                //  end of range?
                if ((_rangeToBuildHTMLWith.endContainer.nodeType == 1) && (_node == _rangeToBuildHTMLWith.endContainer)) {
                    _global__highlight_on = false;
                    _selection_ends_here = true;
                }
                
                //  start of range?
                if ((_rangeToBuildHTMLWith.startContainer.nodeType == 1) && (_node == _rangeToBuildHTMLWith.startContainer)) {
                    _global__highlight_on = true;
                    _selection_starts_here = true;
                }
            
                //  correction
                if (_selection_starts_here && _selection_ends_here) {
                    _global__highlight_on = false;
                }

                
            //	start tag
            //	=========
                if (_tag_is_ignored); else
                {
                    /* mark */	_pos__start__before = _global__the_html.length;
                    /* add */	_global__the_html += '<'+_tag_name;
                    
                    //	attributes
                    //	==========
                        
	//	allowed attributes
	//	==================
		if (_tag_name in $R.parsingOptions._elements_keep_attributes)
		{
			for (var i=0, _i=$R.parsingOptions._elements_keep_attributes[_tag_name].length; i<_i; i++)
			{
				var 
					_attribute_name = $R.parsingOptions._elements_keep_attributes[_tag_name][i],
					_attribute_value = _node.getAttribute(_attribute_name)
				;
				
				//	if present
				if (_attribute_value > '')
					{ _global__the_html += ' '+_attribute_name+'="'+(_attribute_value)+'"'; }
			}
		}
	
	//	keep ID for all elements
	//	========================
		var _id_attribute = _node.getAttribute('id');
		if (_id_attribute > '')
			{ _global__the_html += ' id="'+_id_attribute+'"'; }

	//	links target NEW
	//	================
		if (_tag_name == 'a')
			{ _global__the_html += ' target="_blank"'; }
		
                    
                    //  add class name
                    //  ==============
                        var _class_attribute = _node.getAttribute('class');
                        if (_class_attribute > '')
                            { _global__the_html += ' class="'+_class_attribute+'"'; }

                    //  add highlight id -- for EMs that are outside the global highlight
                    //  ================
                        if (_tag_name == 'em' && _modeToBuildHTMLIn != 'everything')
                        {
                            //  with a fix for when an em is the first thing inside a parent element
                            
                            switch (true)
                            {
                                case (_global__highlight_on):
                                case ((_rangeToBuildHTMLWith.startOffset == 0) && (_node.firstChild) && (_node.firstChild == _rangeToBuildHTMLWith.startContainer)):
                                    break;
                                    
                                default:
                                    var _highlight_id_attribute = _node.getAttribute('highlight_id');
                                    if (_highlight_id_attribute > '')
                                        { _global__the_html += ' highlight_id="'+_highlight_id_attribute+'"'; }
                                    break;
                            }
                        }
                            
                    //	close start
                    //	===========
                        if ($R.parsingOptions._elements_self_closing.indexOf('|'+_tag_name+'|') > -1) { _global__the_html += ' />'; }
                        else { _global__the_html += '>';}
                    
                    /* mark */ _pos__start__after = _global__the_html.length;
                }
            
            
            //	child nodes
            //	===========
                if ($R.parsingOptions._elements_self_closing.indexOf('|'+_tag_name+'|') > -1); else
                {
                    for (var i=0, _i=_node.childNodes.length; i<_i; i++)
                        { _recursive(_node.childNodes[i]); }
                }

                
            //	end tag
            //	=======
                switch (true)
                {
                    case (_tag_is_ignored):
                        return;
                        
                    case (($R.parsingOptions._elements_self_closing.indexOf('|'+_tag_name+'|') > -1)):
                        /* mark */ 	_pos__end__before = _global__the_html.length;
                        /* mark */ 	_pos__end__after = _global__the_html.length;
                        break;
                        
                    default:
                        /* mark */ 	_pos__end__before = _global__the_html.length;
                        /* end */ 	_global__the_html += '</'+_tag_name+'>';
                        /* mark */ 	_pos__end__after = _global__the_html.length;
                        break;
                }

                
            //  protected elements
            //  ==================
                switch (true)
                {
                    //  some elemnts are protected from highlighting
                    case (($R.parsingOptions._elements_highlight_protect.indexOf('|'+_tag_name+'|') > -1)):
                    case ((_tag_name == 'em') && $(_node).hasClass('highlight')):
                    
                        //  so, if highlights are inside an already highlighted element --or an unhighlightable one-- remove
                    
                        _global__the_html = ''
                            + _global__the_html.substr(0, _pos__start__after)
                            +   _global__the_html.substr(_pos__start__after, (_pos__end__before - _pos__start__after))
                                    .replace(/<highlight>/gi, '')
                                    .replace(/<\/highlight>/gi, '')
                            + _global__the_html.substr(_pos__end__before)
                        ;
                        
                        break;
                        
                    //  some elements are invalid completely
                    case ((_tag_name == 'a') && (_node.className == 'deleteHighlight')):

                        _global__the_html = ''
                            + _global__the_html.substr(0, _pos__start__before)
                            + _global__the_html.substr(_pos__end__after)
                        ;
                        
                        break;
                        
                    //  some elements need to have their tags ignored
                    /*case (_tag_name == 'span'):

                        _global__the_html = ''
                            + _global__the_html.substr(0, _pos__start__before)
                            + _global__the_html.substr(_pos__start__after, (_pos__end__before - _pos__start__after))
                            + _global__the_html.substr(_pos__end__after)
                        ;
                        
                        break;*/
                }
                
            //	return
                return;
        };
        
        //	actually do it
        _recursive(_elementToBuildHTMLFor);
        
        //  use em, instead of highlight
        _global__the_html = _global__the_html
            .replace(/<highlight>/gi, '<em class="highlight">')
            .replace(/<\/highlight>/gi, '</em>')
        ;
        
        //	return
        return _global__the_html;
    };

            
        //  speech
        //  ======
			
    //  vars
    //  ====
        $R.speech__addDuplicateToFuturePages = false;
        $R.speech__instances = {};
        $R.speech__instances_nr = 5;
        $R.speech__fragmentsPerPage = {};
        $R.speech__doAutoScrollTimer = false;
        $R.speech__lastMouseAction = false;
        
    //  iSppech
    //  =======
        $R.speech__language = 'en';
        $R.speech__voice = 'usenglishfemale';
        $R.speech__speed = 0;
        $R.speech__iSpeechKey = '3978df11a257506e97a0ac37b10f955f';
        $R.speech__googleTranslateKey = 'AIzaSyAWTU5wG9dASurJBsgZVCRROM2-v_xLDgk';
        
        //  speed
        //  =====
        
            //  define
            $R.speech__speeds = {
                'fastest':   4,
                'fast':      2,
                'faster':    1,
                'normal':    0,
                'slower':   -1,
                'slow':     -2,
                'slowest':  -4
            };
            
            //  set
            if ($R.speech__speeds[$R.vars['speech_speed']])
                {  $R.speech__speed = $R.speech__speeds[$R.vars['speech_speed']]; }

                
        //  voices
        //  ======
            
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


            
        $R.speech__createRequestURL = function (_action, _text)
        {
            return ''
                + 'http://api.ispeech.org/api/rest'
                + '?apikey=' + encodeURIComponent($R.speech__iSpeechKey)
                + '&action=' + encodeURIComponent(_action) 
                + '&voice=' + encodeURIComponent($R.speech__voice) 
                + '&speed=' + encodeURIComponent($R.speech__speed)
                + '&format=mp3'
                + '&e=.mp3'
                + '&text=' + encodeURIComponent(_text) 
            ;
        };

        
    //  position -- they all start at 1, not 0
    //  ========
        $R.speech__posSpeaking__instance = 1;
        $R.speech__posSpeaking__page = 1;
        $R.speech__posSpeaking__fragmentInPage = 1;

        $R.speech__posSpeaking__marker = 1;
        $R.speech__posSpeaking__partialElement = 1;
        $R.speech__posSpeaking__partialElement__index = 1;
        
        $R.speech__posLoading__page = 1;
        $R.speech__posLoading__fragmentInPage = 1;
        
        $R.speech__getInstanceIndex__next = function (_relativeTo) { return ((_relativeTo == $R.speech__instances_nr) ? 1 : (_relativeTo+1)); }
        $R.speech__getInstanceIndex__previous = function (_relativeTo) { return ((_relativeTo == 1) ? $R.speech__instances_nr : (_relativeTo-1)); }
        

    /* include */
    /* ======= */

        
    //  actions
    //  =======
    
        $R.speech__doDetectFlashAndPlay = function ()
        {
            if ($R.speech__detectFlash())
            {
                //  continue
                $R.speech__doInitAndPlay();
            }
            else
            {
                //  stop initializing
                $R.$html.removeClass('speakInitializing');
            
                //  need premium
                $('#dialog__speech__content').removeClass('needLogin needPremium noLanguage').addClass('needFlash');
                
                //  open dialog
                $R.showDialog('speech');
            }
        };
    
        $R.speech__doInitAndPlay = function ()
        {
            //  initializing spinner -- should already be set, but just to be sure
            //  ====================
                $R.$html.addClass('speakInitializing');
                
            //  detect language
            //  ===============
            
                //  get text
                $R.textForlanguageDetection2 = $R.$text.html();

                //  tidy up
                $R.textForlanguageDetection2 = $R.textForlanguageDetection2.replace(/<([^>]+?)>/gi, '');
                $R.textForlanguageDetection2 = $R.textForlanguageDetection2.replace(/([ \n\r\t]+)/gi, ' ');
                
                //  cut
                $R.textForlanguageDetection2 = $R.textForlanguageDetection2.substr(0, ($R.language == 'cjk' ? 150 : 300));
                
                //  submit
				$.ajax
				({
					'url' : 
                        'https://www.googleapis.com/language/translate/v2/detect?key=[=key]&q=[=text]'
                            .replace('[=key]', encodeURIComponent($R.speech__googleTranslateKey))
                            .replace('[=text]', encodeURIComponent($R.textForlanguageDetection2)),

					'dataType' : 'jsonp',
					'async' : true,
					'timeout': (3 * 1000),
					
					'success' : function (_response, _textStatus, _xhr)	{ $R.speech__doInitAndPlay_go(_response); },
					'error' : 	function (_xhr, _textStatus, _error)	{ $R.speech__doInitAndPlay__noLanguage(); }
				});
        };

        $R.speech__doInitAndPlay__noLanguage = function ()
        {
            //  stop initializing
            $R.$html.removeClass('speakInitializing');
        
            //  no language
            //  $('#dialog__speech__content').removeClass('needLogin needPremium needFlash').addClass('noLanguage');
            
            //  open dialog
            //  $R.showDialog('speech');
            
            //  open custom dialog
            $R.showDialog('speech_language');
        };
        
        $R.speech__doInitAndPlay_go = function (_detected_language)
        {
            //  no longer visible
            //  =================
                if ($R.visible); else
                {
                    $R.$html.removeClass('speakInitializing');
                    return;
                }
            
            //  detected language
            //  =================
                if (_detected_language)
                {
                    //$R.log('language detection', _detected_language);
                    
                    if (true
                        && _detected_language.data 
                        && _detected_language.data.detections
                        && _detected_language.data.detections[0]
                        && _detected_language.data.detections[0][0]
                        && _detected_language.data.detections[0][0].language
                    ) {
                        //  got it
                        $R.speech__language = _detected_language.data.detections[0][0].language;
                        
                        //  choose voice
                        if ($R.speech__voices[$R.speech__language])
                        {
                            var _v = $R.speech__voices[$R.speech__language];
                            
                            //  select gender
                            switch (true)
                            {
                                case (($R.vars) && ($R.vars['speech_gender'] == 'male') && ('m' in _v)):
                                    $R.speech__voice = _v.m;
                                    break;
                                    
                                case (($R.vars) && ($R.vars['speech_gender'] == 'female') && ('f' in _v)):
                                    $R.speech__voice = _v.f;
                                    break;

                                default:
                                    $R.speech__voice = _v[_v.d];
                                    break;
                            }
                        }
                        else
                        {
                            $R.speech__doInitAndPlay__noLanguage();
                            return;
                        }
                    }
                }
                else
                {
                    $R.speech__doInitAndPlay__noLanguage();
                    return;
                }
                
                if ($R.debug)
                {
                    var _$languageDebug = $('#debugOutput__value__Language');
                        _$languageDebug.html(_$languageDebug.html() + ' / ' + $R.speech__language + ' / ' + $R.speech__voice)
                }
        
            //  initialize audio elements
            //  =========================
                $R.speech__initAudio();
        
            //  add duplicate to future pages
            //  =============================
                $R.speech__addDuplicateToFuturePages = true;
                
            //  add duplicate to current pages
            //  ==============================
                $R.$pages.find('> div.page').each(function (_i, _e) {
                    $R.speech__addDuplicateToPage(_e, (_i+1));
                });

            //  show bar / hide button
            //  ======================
                $R.$html.addClass('speakShowActions');

            //  no bar to animate
            //  =================
                if ($R.$sidebarSpeakSection); else
                {
                    $R.$html.removeClass('speakInitializing');
                    $R.speech__doPlay();
                    return;
                }
                
            //  animate bar
            //  ===========
                $R.$sidebarSpeakSection.animate
                (
                    {'height': '132px'},
                    $R.appearTimes__show__sidebar,
                    'readableEasingSidebarShow',
                    function ()
                    {
                        //  remove initializing
                            $R.$html.removeClass('speakInitializing');
                            
                        //  play
                            $R.speech__doPlay();
                    }
                );
        };
        
        
        $R.speech__doPlay = function ()
        {
            //  start spinning
            //  ==============
                $R.$html.addClass('speakLoading');

            //  clear previous nowSpeaking
            //  ==========================
                $R.speech__clearCurrentNowSpeaking();
                
            //  nullify all instances
            //  =====================
                for (var _i=1; _i<=$R.speech__instances_nr; _i++) { $R.speech__initAudio__setInstanceToNull(_i); }
                
            //  load up all instances
            //  =====================
                $R.speech__loadAllInstances(function ()
                {
                    //  stop spinning
                    //  =============
                        $R.$html.removeClass('speakPaused').addClass('speakPlaying').removeClass('speakLoading');
                    
                    //  reset position
                    //  ==============
                        $R.speech__posSpeaking__instance = 1;
                        $R.speech__posSpeaking__marker = 1;
                        $R.speech__posSpeaking__partialElement = 1;
                        $R.speech__posSpeaking__partialElement__index = 1;

                    //  no longer visible
                    //  =================
                        if ($R.visible); else
                        {
                            //  stop spinning; reset
                            $R.$html.removeClass('speakPaused').removeClass('speakLoading').removeClass('speakShowActions');
                            return;
                        }
                        
                    //  start playing
                    //  =============
                        $R.speech__instanceEvent__tryPlay(1);
                        $R.speech__onStartPlaying();
                });
        };

        
        $R.speech__doPause = function ()
        {
            //  already paused
            //  ==============
                if ($R.$html.hasClass('speakPaused')) { return; }
                
            //  actally pause
            //  =============
                $R.speech__instances['instance_'+$R.speech__posSpeaking__instance].audioJs.pause();
                
            //  switch buttons
            //  ==============
                $R.$html.addClass('speakPaused').removeClass('speakPlaying');
                
            //  update for next play
            //  ====================
                $R.speech__posLoading__page = $R.speech__posSpeaking__page;
                $R.speech__posLoading__fragmentInPage = $R.speech__posSpeaking__fragmentInPage;
                
            //  end
            //  ===
                $R.speech__onEndPlaying();
        };
        
        
        $R.speech__doForward = function ()
        {
            //  return
                switch (true)
                {
                    case ($R.$html.hasClass('speakInitializing')):
                    case ($R.$html.hasClass('speakLoading')):
                        return;
                }
        
            //  first, pause
                $R.speech__doPause();
            
            //  get next fragment
                $R.speech__posLoadingIncrement();
            
            //  clear
                $R.speech__clearCurrentNowSpeaking();
            
            //  highlight first word in next fragment
                $R.speech__highlightFirstWordInFragment($R.speech__posLoading__page, $R.speech__posLoading__fragmentInPage);
                
            //  auto scroll
                $R.speech__doAutoScroll(true);
        };
        
        
        $R.speech__doRewind = function ()
        {
            //  return
                switch (true)
                {
                    case ($R.$html.hasClass('speakInitializing')):
                    case ($R.$html.hasClass('speakLoading')):
                        return;
                }
                
            //  first, pause
                $R.speech__doPause();
            
            //  get previous fragment
                $R.speech__posLoadingDecrement();

            //  clear
                $R.speech__clearCurrentNowSpeaking();
                
            //  highlight first word in next fragment
                $R.speech__highlightFirstWordInFragment($R.speech__posLoading__page, $R.speech__posLoading__fragmentInPage);

            //  auto scroll
                $R.speech__doAutoScroll(true);
        };


        $R.speech__clearCurrentNowSpeaking = function ()
        {
            //  get; check
                var _prevNowSpeaking = document.getElementById('nowSpeaking');
                if (_prevNowSpeaking); else { return; }

            //  delete
                _prevNowSpeaking.parentNode.replaceChild(
                    _prevNowSpeaking.firstChild.firstChild, 
                    _prevNowSpeaking
                );
        };
        
        $R.speech__highlightFirstWordInFragment = function (_page_nr, _fragment_nr)
        {
            var 
                _$partials = $('#page'+_page_nr+' div.page_duplicateForSpeech em.speechFragmentPartial[speech_fragment_id="page_'+_page_nr+'__fragment_'+_fragment_nr+'"]'),
                _first = false,
                _first_html = ''
            ;
            
            //  get first
                _$partials.each(function (_i, _e)
                {
                    //  get
                        _first_html = _e.innerHTML;
                    
                    //  replace
                        if ($R.language == 'cjk')
                        {
                            _first_html = _first_html.replace(
                                /(\S)/i,
                                '<em id="nowSpeaking"><span>$1</span></em>'
                            );
                        }
                        else
                        {
                            _first_html = _first_html.replace(
                                /(\S+)(\s)/i,
                                '<em id="nowSpeaking"><span>$1</span></em>$2'
                            );
                        }
                    
                    //  valid?
                        if (_first_html.indexOf('<em id="nowSpeaking">') > -1); else { return; }
                        
                    //  yup
                        _first = _e;
                        return false;
                });
            
            //  valid first?
                if (_first); else { return; }
            
            //  write
                _first.innerHTML = _first_html;
        };
        
        $R.speech__onStartPlaying = function ()
        {
            $R.speech__doAutoScrollTimer = window.setInterval(function () { $R.speech__doAutoScroll(); }, 1000);
            $R.$body.bind('mousemove', $R.speech__mouseAction);
        };
        
        $R.speech__onEndPlaying = function ()
        {
            window.clearInterval($R.speech__doAutoScrollTimer);
            $R.$body.unbind('mousemove', $R.speech__mouseAction);
        };        
        
        
    $R.speech__detectFlash = function ()
    {
        var a = !1,
            b = "";

        function c(d) {
            d = d.match(/[\d]+/g);
            d.length = 3;
            return d.join(".")
        }
        if (navigator.plugins && navigator.plugins.length) {
            var e = navigator.plugins["Shockwave Flash"];
            e && (a = !0, e.description && (b = c(e.description)));
            navigator.plugins["Shockwave Flash 2.0"] && (a = !0, b = "2.0.0.11")
        } else {
            if (navigator.mimeTypes && navigator.mimeTypes.length) {
                var f = navigator.mimeTypes["application/x-shockwave-flash"];
                (a = f && f.enabledPlugin) && (b = c(f.enabledPlugin.description))
            } else {
                try {
                    var g = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7"),
                        a = !0,
                        b = c(g.GetVariable("$version"))
                } catch (h) {
                    try {
                        g = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"), a = !0, b = "6.0.21"
                    } catch (i) {
                        try {
                            g = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"), a = !0, b = c(g.GetVariable("$version"))
                        } catch (j) {}
                    }
                }
            }
        }
        var k = b;
        
        //  k is the flash version
        return !!a;
    };

    
    $R.speech__initAudio = function ()
    {
        for (var _i=1; _i<=$R.speech__instances_nr; _i++)
        {
            (function (_ii)
            {
                //  create audio -- new scope, to preserve _i
                //  ============
                
                var _audio = document.createElement('audio');
                    _audio.setAttribute('id', 'audioElement_' + _ii);
                    $R.$audioElements.append(_audio);    
                
                //  create
                    $R.speech__instances['instance_'+_ii] = {
                        'audioJs': audiojs.create(
                            _audio,
                            {
                                'autoplay': false,
                                'loop': false,
                                'preload': true,
                                
                                'swfLocation':      'http://www.ispeech.org/Flash/taudiojs.swf',
                                'imageLocation':    $R.paths['main'] + 'img/' + 'player-graphics.gif',
                                
                                'loadProgress':     function (_ratioLoaded) { $R.speech__instanceEvent__loadProgress(_ii, (_ratioLoaded * 100)); },
                                'updatePlayhead':   function (_ratioPlayed) { $R.speech__instanceEvent__updatePlayhead(_ii, (_ratioPlayed * 100), (_ratioPlayed * this.duration * 1000)); },
                                'trackEnded':       function ()             { $R.speech__instanceEvent__trackEnded(_ii); },
                                'loadError':        function ()             { $R.speech__instanceEvent__loadError__audio(_ii); }
                            }
                        ),
                    };
                
                //  set to null
                    $R.speech__initAudio__setInstanceToNull(_ii);
            })(_i);
        }
    };

    
    $R.speech__initAudio__setInstanceToNull = function (_instance_nr)
    {
        var _instance = $R.speech__instances['instance_'+_instance_nr];
            _instance['url__markers'] = false;
            _instance['url__audio'] = false;
            _instance['loaded__markers'] = false;
            _instance['loaded__audio'] = false;
            _instance['playing'] = false;
            _instance['markers'] = false;
            _instance['fragmentPartials__elements'] = [];
            _instance['fragmentPartials__text'] = [];
            _instance['pos__page'] = false;
            _instance['pos__fragmentInPage'] = false;
            _instance['errorCount__audio'] = 0;
            _instance['errorCount__markers'] = 0;
            _instance['errorCount__play'] = 0;
            _instance['skip'] = false;
    };
        
    $R.speech__loadAllInstances = function (_callback)
    {
        $R.speech__loadOneInstanceAndThenTheRest(
            1,
            ($R.speech__instances_nr-1),
            _callback
        );
    };


    $R.speech__loadOneInstanceAndThenTheRest = function (_instance_nr, _the_rest, _final_callback)
    {
        //  do final callback
        //  =================
            if (_the_rest < 0)
            {
                _final_callback();
                return;
            }

        //  load next into this instance
        //  ============================

            //  check function
                var _check = function ()
                {
                    //  the instance
                        var _i = $R.speech__instances['instance_'+_instance_nr];
                    
                    //  do next fragment
                        if (_i['loaded__markers'] && _i['loaded__audio'])
                        {
                            $R.speech__loadOneInstanceAndThenTheRest
                            (
                                (_instance_nr + 1), 
                                (_the_rest - 1), 
                                _final_callback
                            );
                            
                            return;
                        }
                        
                    //  check again
                        window.setTimeout(_check, 250);
                };
        
            //  load
                $R.speech__loadInstanceWithFragmentAndThen
                (
                    _instance_nr,
                    $R.speech__posLoading__page,
                    $R.speech__posLoading__fragmentInPage,
                    function ()
                    {
                        //  what fragment to load next
                            $R.speech__posLoadingIncrement();
                    
                        //  start checking
                            window.setTimeout(_check, 250);
                    }
                );
    };

    
    $R.speech__posLoadingIncrement = function ()
    {
        //  increment loaded fragments
            $R.speech__posLoading__fragmentInPage++;
        
        //  end of page
            if ($R.speech__posLoading__fragmentInPage > $R.speech__fragmentsPerPage['page_' + $R.speech__posLoading__page])
            {
                //  last page
                    if ($R.speech__posLoading__page < $R.pagesCount)
                    {
                        $R.speech__posLoading__page++;
                        $R.speech__posLoading__fragmentInPage = 1;
                    }
                    else
                    {
                        $R.speech__posLoading__page = $R.pagesCount;
                        $R.speech__posLoading__fragmentInPage = $R.speech__fragmentsPerPage['page_' + $R.speech__posLoading__page];
                    }
            }
    };

    $R.speech__posLoadingDecrement = function ()
    {
        //  increment loaded fragments
            $R.speech__posLoading__fragmentInPage--;
        
        //  start of page
            if ($R.speech__posLoading__fragmentInPage > 1); else
            {
                //  first page?
                    if ($R.speech__posLoading__page > 1)
                    {
                        $R.speech__posLoading__page--;
                        $R.speech__posLoading__fragmentInPage = $R.speech__fragmentsPerPage['page_' + $R.speech__posLoading__page];
                    }
                    else
                    {
                        $R.speech__posLoading__fragmentInPage = 1;
                        $R.speech__posLoading__page = 1;
                    }
            }
    };

    

    $R.speech__loadInstanceWithFragmentAndThen = function (_instanceIndex, _page_nr, _fragment_nr, _and_then)
    {
        //  asynchronously
        window.setTimeout(function ()
        {
            //  ths instance we're using
                var _instance = $R.speech__instances['instance_' + _instanceIndex];

            //  nullify instance
                $R.speech__initAudio__setInstanceToNull(_instanceIndex);                    
                _instance['markers'] = [false];
                _instance['fragmentPartials__elements'] = [false];
                _instance['fragmentPartials__text'] = [false];
                
            //  the fragment    
                _instance['pos__page'] = _page_nr;
                _instance['pos__fragmentInPage'] = _fragment_nr; 
                
            //  partials for this fragment
            //  ==========================
                var _$partials = $('#page'+_page_nr+' div.page_duplicateForSpeech em.speechFragmentPartial[speech_fragment_id="page_'+_page_nr+'__fragment_'+_fragment_nr+'"]');
                
            //  loop through partials to get text
            //  =================================
                var _text_to_speak = '';
                _$partials.each(function (_i, _e)
                {
                    //  get text
                        var _e_text = _e.innerHTML.replace('&nbsp;', ' ');
                    
                    //  blank
                        switch (true)
                        {
                            case (_e_text == ''):               _text_to_speak += '';  return;
                            case (_e_text.match(/^\s+$/gi)):    _text_to_speak += ' '; return;
                        }
                    
                    //  add element
                        _instance['fragmentPartials__elements'].push(_e);
                        
                    //  add element text
                        _instance['fragmentPartials__text'].push(_e_text);
                        
                    //  full text
                        _text_to_speak += _e_text + ' ';
                });
            
            //  format text
            //  ===========
                _text_to_speak = _text_to_speak.replace(/^\s+/gi, '');
                _text_to_speak = _text_to_speak.replace(/\s+$/gi, '');
                _text_to_speak = _text_to_speak.replace(/[\n\r\t]+/gi, ' ');
                //_text_to_speak = _text_to_speak.replace(/ ([.?!])/gi, '$1');
                //_text_to_speak = _text_to_speak.replace(/ 's /gi, '\'s ');
            
            //  urls
            //  ====
                _instance['url__markers'] = $R.speech__createRequestURL('markers', _text_to_speak);
                _instance['url__audio'] = $R.speech__createRequestURL('convert', _text_to_speak);
            
            //  skip?
            //  =====
                if (_text_to_speak.match(/^\s*$/gi))
                {
                    _instance['loaded__markers'] = true;
                    _instance['loaded__audio'] = true;
                    _instance['skip'] = true;
                }
                else
                {
                    //  load audio
                    _instance.audioJs.load(_instance['url__audio']);
                
                    //  load markers
                    $R.speech__loadInstanceWithMarkers(_instanceIndex);
                }
                
            //  and then
            //  ========
                _and_then();
        }, 1);
    };

    
    $R.speech__loadInstanceWithMarkers = function (_instanceIndex)
    {
        //  ths instance we're using
            var _instance = $R.speech__instances['instance_' + _instanceIndex];

        //  ajax do
            $.ajax(_instance['url__markers'],
            {
                'cache': false,
                
                'error': function (_xhr, _status, _error)
                {
                    //  try again
                    $R.speech__instanceEvent__loadError__markers(_instanceIndex);
                },
                
                'success': function(_data, _status, _xhr) 
                {
                    //  invalid?
                    //  ========
                        switch (true)
                        {
                            case (!(_data)):
                            case (!(_data.childNodes)):
                            case (!(_data.childNodes[0])):
                            case (!(_data.childNodes[0].childNodes)):
                                $R.speech__instanceEvent__loadError__markers(_instanceIndex);
                                return;
                        }
                        
                    //  parse markers
                    //  =============
                        for (var _d=_data.childNodes[0], _i=0, _ii=_d.childNodes.length; _i<_ii; _i++)
                        {
                            //  this node
                                var _n = _d.childNodes[_i];
                            
                            //  skip not-words
                                if (_n.nodeName == 'word'); else { continue; }
                                
                            //  a word
                                _instance['markers'].push({
                                    'start':    parseInt(_n.childNodes[0].textContent),
                                    'end':      parseInt(_n.childNodes[1].textContent),
                                    'length':   parseInt(_n.childNodes[3].textContent),
                                    'text':     _n.childNodes[4].textContent
                                });
                        }
                    
                    //  set loaded
                        _instance['loaded__markers'] = true;
                }
            });
    };

        
    $R.speech__instanceEvent__loadProgress = function (_instanceIndex, _percentLoaded)
    {
        //  loading
            if (_percentLoaded < 90) { return; }
            
        //  instance
            var _instance = $R.speech__instances['instance_' + _instanceIndex];
        
        //  already loaded
            if (_instance['loaded__audio']) { return; }
        
        //  loaded
            _instance['loaded__audio'] = true;
    };

    
    $R.speech__instanceEvent__updatePlayhead = function (_instanceIndex, _percentPlayed, _playedToThisTime)
    {
        var 
            //  delay
            _playedToThisTimeDelayed = _playedToThisTime,
        
            //  this instance
            _instance = $R.speech__instances['instance_' + _instanceIndex],
            
            //  just switched
            _playingNewInstance = false
        ;
            
        //  not loaded    
            if (_instance['loaded__audio']); else { return; }
            
        //  percent played > 0
            if (_percentPlayed > 0); else { return; }
            
        //  playing new instance
        //  ====================
            if (_instanceIndex == $R.speech__posSpeaking__instance); else
            {
                _playingNewInstance = true;
                
                //  _instanceIndex is the instance now playing
                //  $R.speech__posSpeaking__instance is the instance that was playing
            
                //  load new stuff into old instance
                //  ================================

                    //  load
                        $R.speech__loadInstanceWithFragmentAndThen
                        (
                            $R.speech__posSpeaking__instance,
                            $R.speech__posLoading__page,
                            $R.speech__posLoading__fragmentInPage,
                            function ()
                            {
                                //  what fragment to load next
                                    $R.speech__posLoadingIncrement();
                            }
                        );
                        
                //  update playing
                //  ==============
                    $R.speech__posSpeaking__instance = _instanceIndex;

                    $R.speech__posSpeaking__page = _instance['pos__page'];
                    $R.speech__posSpeaking__fragmentInPage = _instance['pos__fragmentInPage'];
                    
                    $R.speech__posSpeaking__marker = 1;
                    $R.speech__posSpeaking__partialElement = 1;
                    $R.speech__posSpeaking__partialElement__index = 1;
            }
            
        //  very first play of very first fragment/instance
        //  ===================
            if (_playingNewInstance); else
            {
                if ((_instance['pos__page'] == 1) && (_instance['pos__fragmentInPage'] == 1))
                {
                    _playingNewInstance = true;
                }
            }
            
        //  highlight spoken word
        //  =====================
            var _marker_word = false;
            for (var _marker_i=$R.speech__posSpeaking__marker; _marker_i<_instance['markers'].length; _marker_i++)
            {
                if (true
                    && (_instance['markers'][_marker_i].end >= _playedToThisTimeDelayed)
                    && (_instance['markers'][_marker_i].start <= _playedToThisTimeDelayed)
                ) {
                    //  same word
                        if ((!_playingNewInstance) && (_marker_i == $R.speech__posSpeaking__marker)) { break; }
                
                    //  different word
                        _marker_word = _instance['markers'][_marker_i].text;
                        $R.speech__posSpeaking__marker = _marker_i;
                        break;
                }
            }
            
            if (_marker_word == false); else
            {
                for (var _element_i=$R.speech__posSpeaking__partialElement; _element_i<_instance['fragmentPartials__elements'].length; _element_i++)
                {
                    //  find word
                    //  =========
                        var _pos_index = _instance['fragmentPartials__text'][_element_i].indexOf(_marker_word, ((_element_i == $R.speech__posSpeaking__partialElement) ? ($R.speech__posSpeaking__partialElement__index-1) : 0));
                        if (_pos_index > -1)
                        {
                            $R.speech__posSpeaking__partialElement = _element_i;
                            $R.speech__posSpeaking__partialElement__index = (_pos_index + _marker_word.length);
                            break;
                        }
                    
                    //  redraw element -- only after we've passed it
                    //  ==============
                        _instance['fragmentPartials__elements'][_element_i].innerHTML = _instance['fragmentPartials__text'][_element_i];
                }
                
                //  redraw this element
                //  ===================
                    _instance['fragmentPartials__elements'][$R.speech__posSpeaking__partialElement].innerHTML = ''
                        + _instance['fragmentPartials__text'][$R.speech__posSpeaking__partialElement].substr(0, ($R.speech__posSpeaking__partialElement__index - _marker_word.length))
                        + '<em id="nowSpeaking">'
                        +   '<span>' + _marker_word + '</span>'
                        + '</em>'
                        + _instance['fragmentPartials__text'][$R.speech__posSpeaking__partialElement].substr(($R.speech__posSpeaking__partialElement__index - 0))
                    ;
            }
    };

    $R.speech__instanceEvent__trackEnded = function (_instanceIndex)
    {
        //  this instance
            var _instance = $R.speech__instances['instance_' + _instanceIndex];

        //  redraw last element
        //  ===================
            if (_instance['fragmentPartials__elements'][$R.speech__posSpeaking__partialElement])
                { _instance['fragmentPartials__elements'][$R.speech__posSpeaking__partialElement].innerHTML = _instance['fragmentPartials__text'][$R.speech__posSpeaking__partialElement]; }

        //  stop this instance
        //  ==================
            _instance['playing'] = false;
            
        //  last instance
        //  =============
            if (true
                && (_instance['pos__page'] == $R.pagesCount)
                && (_instance['pos__fragmentInPage'] == $R.speech__fragmentsPerPage['page_' + _instance['pos__page']])
            ){
                $R.$html.addClass('speakPaused').removeClass('speakPlaying');
                $R.speech__onEndPlaying();
                return;
            }
            
        //  next instance
        //  =============
            var 
                _next_instance_index = $R.speech__getInstanceIndex__next(_instanceIndex),
                _next_instance = $R.speech__instances['instance_' + _next_instance_index]
            ;
            
            //  already started
            if (_next_instance['playing']) { return; }
                    
            //  play next -- everything else gets handled at the begining of updatePlayhead, in the next instance
            _next_instance['playing'] = true;
            $R.speech__instanceEvent__tryPlay(_next_instance_index);
    };
    
    $R.speech__mouseAction = function ()
    {
        $R.speech__lastMouseAction = (new Date()).getTime();
    };
    
    $R.speech__doAutoScroll = function (_skip_mouse_check)
    {
        //  mouse moved recently
        //  ====================
            if (_skip_mouse_check); else {
                if (true
                    && $R.speech__lastMouseAction 
                    && (((new Date()).getTime() - $R.speech__lastMouseAction) < 10000)
                )
                { return }
            }
            
        //  data
        //  ====
            var 
                _pos = $('#nowSpeaking').offset(),
                _scroll = $(window).scrollTop(),
                _height = $(window).height()
            ;
        
        //  valid?
        //  ======
            if (_pos && _pos.top && _pos.left); else { return; }
            _pos = _pos.top;
        
        //  scrolling
            if (true
                && (_pos - _scroll) > (_height * 0.20)
                && (_pos - _scroll) < (_height * 0.80)
            ); else
            {
                $('html, body').animate({ scrollTop: Math.floor(_pos - (_height * 0.20)) }, 500);
            }
    };
    
        
    $R.speech__instanceEvent__tryPlay = function (_instanceIndex)
    {
        //  the instance we're using
            var _instance = $R.speech__instances['instance_' + _instanceIndex];

        //  skip
        //  ====
            if (_instance['skip'])
            {
                $R.speech__instanceEvent__trackEnded(_instanceIndex);
                return;
            }
            
        //  ready
        //  =====
            if (_instance['loaded__audio'] && _instance['loaded__markers'])
            {
                _instance.audioJs.play();
                return;
            }

        //  not ready
        //  =========
        
            $R.log('error: play', _instanceIndex, $R.speech__instances['instance_'+_instanceIndex]);

            //  increment count
                _instance['errorCount__play']++;
                    
            //  stop? skip to next
                if (_instance['errorCount__play'] > 3)
                {
                    $R.speech__instanceEvent__trackEnded(_instanceIndex);
                    return;
                }
            
            //  again, in a little bit
                window.setTimeout(function () { $R.speech__instanceEvent__tryPlay(_instanceIndex); }, 250);
    };

    $R.speech__instanceEvent__loadError__audio = function (_instanceIndex)
    {
        $R.log('error: audio', _instanceIndex, $R.speech__instances['instance_'+_instanceIndex]);
        
        //  the instance we're using
            var _instance = $R.speech__instances['instance_' + _instanceIndex];

        //  increment count
            _instance['errorCount__audio']++;
            
        //  stop?
            if (_instance['errorCount__audio'] > 3) { return; }
            
        //  try again
            _instance.audioJs.load(_instance['url__audio']);
    };
    
    $R.speech__instanceEvent__loadError__markers = function (_instanceIndex)
    {
        $R.log('error: markers', _instanceIndex, $R.speech__instances['instance_'+_instanceIndex]);
        
        //  the instance we're using
            var _instance = $R.speech__instances['instance_' + _instanceIndex];

        //  increment count
            _instance['errorCount__markers']++;
            
        //  stop?
            if (_instance['errorCount__markers'] > 3) { return; }
            
        //  try again
            $R.speech__loadInstanceWithMarkers(_instanceIndex);
    };

        
    $R.speech__addDuplicateToPage = function (_page, _page_nr)
    {
        //  has duplicate?
        //  ==============
            var _$duplicate = $($(_page).find('> div.page_duplicateForSpeech').get(0));
            if (_$duplicate.get(0)); else
            {
                //  add duplicate
                var _page_d = document.createElement('div');
                    _page_d.className = 'page_duplicateForSpeech';
                    _page_d = _page.appendChild(_page_d);
            
                //  get duplicate
                _$duplicate = $(_page_d);
            }

        //  duplicate html
        //  ==============
            _$duplicate
                .html(_page.childNodes[0].innerHTML
                    .replace(
                        /id\s*=\s*"speechFragmentSeparator__([0-9]+)_([0-9]+)"/gi, 
                        'id="speechFragmentSeparator__duplicate__$1_$2"'
                    )
                );
        
        //  things that were highlighted
        //  ============================
            _$duplicate.find('em.highlight').removeClass('highlight').addClass('highlightInOriginal');
            _$duplicate.find('em.highlight a.delete').remove();

        //  link footnotes
        //  ==============
            _$duplicate.find('sup.readableLinkFootnote').remove();
            
        //  add sentence highlights
        //  =======================
            _$duplicate.find('b.speechFragmentSeparator').each(function (_ii, _ee)
            {
                //  skip first
                //  ==========
                    if (_ii > 0); else { return; }
                
                //  valid?
                //  ======
                    var
                        _s = document.getElementById('speechFragmentSeparator__duplicate__'+_page_nr+'_'+(_ii-1)),
                        _e = document.getElementById('speechFragmentSeparator__duplicate__'+_page_nr+'_'+_ii)
                    ;
                
                //  invalid?
                //  ========
                    if (_s && _e); else { return; }
                    if (_s.firstChild && _e.firstChild); else { return; }
                
                //  create range
                //  ============
                    var _range = {
                        'startContainer': $R.highlight__getDeepestTextNode(_s.firstChild),
                        'endContainer': $R.highlight__getDeepestTextNode(_e.firstChild),
                        'startOffset': (_ii == 1 ? 0 : 1),
                        'endOffset': 1
                    };
                    _range['commonAncestorContainer'] = $R.highlight__getCommonAncestorContainerForNodes(
                        _range.startContainer, 
                        _range.endContainer, 
                        _$duplicate.get(0)     //  default to duplicate itlsef
                    );
                        
                //  highlight
                //  =========
                    $R.highlight__doRange(_range);
                    
                //  next
                //  ====
                    _lastFragmentSeparator = _ee;
            });
            
        //  remove first separator
        //  ======================
            var
                _firstSeparator = document.getElementById('speechFragmentSeparator__duplicate__'+_page_nr+'_0'),
                _firstFragmentInFirstSentence = _$duplicate.find('em.highlight[highlight_id="'+$(_firstSeparator.firstChild).attr('highlight_id')+'"]').get(1)
            ;

            if (_firstSeparator && _firstFragmentInFirstSentence)
            {
                _firstSeparator = _firstSeparator.parentNode.removeChild(_firstSeparator);
                $(_firstFragmentInFirstSentence).html($(_firstSeparator.firstChild).html() + $(_firstFragmentInFirstSentence).html());
            }   
            
        //  remove blanks
        //  =============
        /*  _$duplicate.find('em.highlight').each(function (_ii, _ee)
            {
                var _h = _ee.innerHTML.replace('&nbsp;', ' ');
                
                if (_h.match(/^[\s\n\r\t]*$/gi))
                {
                    var _s = document.createElement('span');
                        _s.innerHTML = _h;
                        
                    _ee.parentNode.replaceChild(_s, _ee);
                }
            });
        */
        
        //  transform highlights
        //  ====================
            var _fragment_count = 0;
            _$duplicate.find('b.speechFragmentSeparator em.highlight').each(function (_ii, _ee)
            {
                //  increment
                    _fragment_count++;

                //  current highlight id
                    var _current_highlight_id = $(_ee).attr('highlight_id');
            
                //  remove fragment separators
                    _ee.parentNode.parentNode.replaceChild(_ee, _ee.parentNode);
                    
                //  add fragment stuff; remove highlight stuff
                    _$duplicate.find('em.highlight[highlight_id="'+_current_highlight_id+'"]')
                        .removeClass('highlight')
                        .addClass('speechFragmentPartial')
                        .removeAttr('highlight_id')
                        .attr('speech_fragment_id', 'page_' + _page_nr + '__fragment_' + _fragment_count)
                    ;
            });
            
        //  set count -- minus the last one
        //  =========
            $R.speech__fragmentsPerPage['page_'+_page_nr] = _fragment_count;
    };


            
	})(window.parent.$readableForSpeechDemo);
});