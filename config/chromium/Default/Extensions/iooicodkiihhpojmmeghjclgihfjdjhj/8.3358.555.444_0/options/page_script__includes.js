
    //  bootstrap
    
	//	namespace
	//	=========
		__readable_by_evernote.__evernote_bootstrap =
		{
            /* predefined */
            'servers':                  false,
            'server_main':              '',     /* ends in slash */
            'server_china':             '',     /* ends in slash */
            
            /* set on load */
            'saved_server':             false,  /* main | china */
            'client_locale':            false,
            'has_chinese_locale':       false,
            'simulate_chinese_locale':  false,
            
            /* set on bootstrap() */
            'rpc__userStore':           false,
            'profiles':                 false,
            'profiles_as_string':       false,
            'server':                   false,
            'remote_domain':            false,  /* ends in slash */
            'remote_domain_marketing':  false,  /* ends in slash */
            'connected':                false
		};

        
    //  servers
    //  =======
        __readable_by_evernote.__evernote_bootstrap.servers = 
        {
            'live':
            {
                'main':      'https://www.evernote.com/',
                'china':     'https://app.yinxiang.com/'
            },
            'stage':
            {
                'main':      'https://stage.evernote.com/',
                'china':     'https://stage-china.evernote.com/'
            }
        };
        
        
    //  bootstrap
    //  =========
        __readable_by_evernote.__evernote_bootstrap.bootstrap = function (_onSuccess, _onFailure)
        {
            //  already connected
            //  =================
                if (__readable_by_evernote.__evernote_bootstrap.connected) { _onSuccess(); return; }
        
        
            //  figure out order
            //  ================
                var _order = [];
                switch (true)
                {
                    case (__readable_by_evernote.__evernote_bootstrap.saved_server == 'main'):      _order = ['main', 'china']; break;
                    case (__readable_by_evernote.__evernote_bootstrap.saved_server == 'china'):     _order = ['china', 'main']; break;
                    case (__readable_by_evernote.__evernote_bootstrap.has_chinese_locale):          _order = ['china', 'main']; break;
                    case (__readable_by_evernote.__evernote_bootstrap.simulate_chinese_locale):     _order = ['china', 'main']; break;
                    default:                                                                        _order = ['main', 'china']; break;
                }

                
            //  try connect to one
            //  ==================
                var _try_connect_to_one = function (_order_number)
                {
                    //  invalid number; failed
                    //  ======================
                        if (_order[_order_number]); else
                        {
                            //  failed
                            _onFailure('connection / invalid');
                            
                            //  break
                            return;
                        };

                    
                    //  try current number
                    //  ==================
                        var _rpcBootstrapClient = new __readable_by_evernote.JSONRpcClient
                        (
                            function ()
                            { 
                                //	error / timeout
                                //  ===============
                                    if (this.UserStore); else
                                    {
                                        //  next -- will kill self on invalid
                                        _try_connect_to_one(_order_number + 1);
                                    
                                        //  break
                                        return;
                                    }

                                    
                                //	set conected
                                //  ============
                                    __readable_by_evernote.__evernote_bootstrap.connected = true;
                                    __readable_by_evernote.__evernote_bootstrap.rpc__userStore = this;

                                
                                //  get profiles
                                //  ============
                                    __readable_by_evernote.__evernote_bootstrap.rpc__userStore.UserStore.getBootstrapInfo
                                    (
                                        function (_rpc_result, _rpc_exception)
                                        {
                                            var 
                                                _bootstrapInfoResult = _rpc_result,
                                                _bootstrapInfoError = _rpc_exception
                                            ;
                                        
                                            //  error
                                            //  =====
                                                if (_bootstrapInfoError)
                                                {
                                                    _bootstrapInfoResult = {
                                                        'profiles': {
                                                           'list': [ {
                                                                'name':         'Evernote',
                                                                
                                                                'setName':      true,
                                                                'setSettings':  true,
                                                                
                                                                'settings': {
                                                                    'marketingUrl': 'http://www.evernote.com',
                                                                    'serviceHost':  'www.evernote.com',
                                                                    'supportUrl':   'https://evernote.com/contact/support/'
                                                                }
                                                            } ] 
                                                        }
                                                    };
                                                }
                                            
                                            
                                            //  result
                                            //  ======
                                            
                                                //  set profiles
                                                //  ============
                                                    __readable_by_evernote.__evernote_bootstrap.profiles = _bootstrapInfoResult.profiles.list;
                                                
                                                
                                                //  profiles as string
                                                //  ==================
                                                    __readable_by_evernote.__evernote_bootstrap.profiles_as_string = '';
                                                    for (var zz=0,_zz=__readable_by_evernote.__evernote_bootstrap.profiles.length; zz<_zz; zz++)
                                                        { __readable_by_evernote.__evernote_bootstrap.profiles_as_string += '_' + __readable_by_evernote.__evernote_bootstrap.getProfileName__short(__readable_by_evernote.__evernote_bootstrap.profiles[zz]); }
                                                    __readable_by_evernote.__evernote_bootstrap.profiles_as_string = __readable_by_evernote.__evernote_bootstrap.profiles_as_string.substr(1);
                                                
                                                
                                                //  select first
                                                //  ============
                                                    __readable_by_evernote.__evernote_bootstrap.server = __readable_by_evernote.__evernote_bootstrap.getProfileName__long(__readable_by_evernote.__evernote_bootstrap.profiles[0]);
                                                    __readable_by_evernote.__evernote_bootstrap.remote_domain = __readable_by_evernote.__evernote_bootstrap['server_' + __readable_by_evernote.__evernote_bootstrap.server];
                                                    __readable_by_evernote.__evernote_bootstrap.remote_domain_marketing = __readable_by_evernote.__evernote_bootstrap.profiles[0].settings.marketingUrl + '/';
                                                
                                                
                                                //  first different than saved -- switch
                                                //  ==========================
                                                    if (true
                                                        && (__readable_by_evernote.__evernote_bootstrap.profiles_as_string == 'in_cn')
                                                        && (__readable_by_evernote.__evernote_bootstrap.server == 'main')
                                                        && (__readable_by_evernote.__evernote_bootstrap.saved_server == 'china')
                                                    ){
                                                        __readable_by_evernote.__evernote_bootstrap.server = 'china';
                                                        __readable_by_evernote.__evernote_bootstrap.remote_domain = __readable_by_evernote.__evernote_bootstrap['server_' + 'china'];
                                                        __readable_by_evernote.__evernote_bootstrap.remote_domain_marketing = __readable_by_evernote.__evernote_bootstrap.profiles[1].settings.marketingUrl + '/';
                                                        __readable_by_evernote.__evernote_bootstrap.profiles_as_string == 'cn_in';
                                                    }
                                                    else if (true
                                                        && (__readable_by_evernote.__evernote_bootstrap.profiles_as_string == 'cn_in')
                                                        && (__readable_by_evernote.__evernote_bootstrap.server == 'china')
                                                        && (__readable_by_evernote.__evernote_bootstrap.saved_server == 'main')
                                                    ){
                                                        __readable_by_evernote.__evernote_bootstrap.server = 'main';
                                                        __readable_by_evernote.__evernote_bootstrap.remote_domain = __readable_by_evernote.__evernote_bootstrap['server_' + 'main'];
                                                        __readable_by_evernote.__evernote_bootstrap.remote_domain_marketing = __readable_by_evernote.__evernote_bootstrap.profiles[1].settings.marketingUrl + '/';
                                                        __readable_by_evernote.__evernote_bootstrap.profiles_as_string == 'in_cn';
                                                    }
                                                
                                                
                                                //  run sucess
                                                //  ==========
                                                    _onSuccess();
                                        },
                                        (__readable_by_evernote.__evernote_bootstrap.simulate_chinese_locale ? 'zh_cn' : __readable_by_evernote.__evernote_bootstrap.client_locale)
                                    );
                            }, 
                            __readable_by_evernote.__evernote_bootstrap['server_' + _order[_order_number]] + 'json'
                        );
                };

                
            //  try first
            //  =========
                _try_connect_to_one(0);
        };
        
        
    //  profile name
    //  ============
        __readable_by_evernote.__evernote_bootstrap.getProfileName__short = function (_profile)
        {
            switch (_profile.name.toLowerCase())
            {
                case 'evernote':            return 'in';
                case 'evernote-china':      return 'cn';
            }
            
            return '';
        };
        
        __readable_by_evernote.__evernote_bootstrap.getProfileName__long = function (_profile)
        {
            switch (_profile.name.toLowerCase())
            {
                case 'evernote':            return 'main';
                case 'evernote-china':      return 'china';
            }
            
            return '';
        };
    
    
    //  set locale
    //  ==========
        __readable_by_evernote.__evernote_bootstrap.setLocale = function (_browser_locale)
        {
            //  which
            var _locale = _browser_locale;
                _locale = _locale.replace(/[-]/gi, '_');
                _locale = _locale.replace(/\s+/gi, '');
                _locale = _locale.toLowerCase()
            
            //   set
            __readable_by_evernote.__evernote_bootstrap.client_locale = _locale;
            
            //  chinese?
            __readable_by_evernote.__evernote_bootstrap.has_chinese_locale = ('|zh|zh_cn|zh_hans|zh_hans_cn|'.indexOf('|'+_locale+'|') > -1);
        };
    
    
    //  QA testing
    //  ==========
    
        __readable_by_evernote.__evernote_bootstrap.set_servers_to_stage = function ()
        {
            __readable_by_evernote.__evernote_bootstrap['server_main'] = __readable_by_evernote.__evernote_bootstrap.servers['stage']['main'];
            __readable_by_evernote.__evernote_bootstrap['server_china'] = __readable_by_evernote.__evernote_bootstrap.servers['stage']['china'];
        };
        
        __readable_by_evernote.__evernote_bootstrap.set_servers_to_live = function ()
        {
            __readable_by_evernote.__evernote_bootstrap['server_main'] = __readable_by_evernote.__evernote_bootstrap.servers['live']['main'];
            __readable_by_evernote.__evernote_bootstrap['server_china'] = __readable_by_evernote.__evernote_bootstrap.servers['live']['china'];
        };

        __readable_by_evernote.__evernote_bootstrap.set_simulate_chinese_locale = function ()
        {
            __readable_by_evernote.__evernote_bootstrap.simulate_chinese_locale = true;
        };
        
        __readable_by_evernote.__evernote_bootstrap.set_do_not_simulate_chinese_locale = function ()
        {
            __readable_by_evernote.__evernote_bootstrap.simulate_chinese_locale = false;
        };

        __readable_by_evernote.__evernote_bootstrap.disconnect = function ()
        {
            __readable_by_evernote.__evernote_bootstrap['connected'] =      false;
            __readable_by_evernote.__evernote_bootstrap['profiles'] =       false;
            __readable_by_evernote.__evernote_bootstrap['server'] =         false;
            __readable_by_evernote.__evernote_bootstrap['remote_domain'] =  false;
            __readable_by_evernote.__evernote_bootstrap['rpc__userStore'] = false;
        };
        

    //  remote
    
	//	included code
	//	json-rpc must exist in context

	
	//	namespace
	//	=========
		__readable_by_evernote.__evernote_remote =
		{
            /* predefined */
			'api__key': 		'en-clearly-new',
			'api__secret': 		'cdcd3859599a1454',

            /* set on init */
            'setting__related_notes':               '',
            'setting__smart_filing':                '',
            'setting__smart_filing_for_business':   '',
            
            'setting__clip_tag':                    '',
            'setting__clip_notebook':               '',
            'setting__clip_notebook_guid':          '',

            'setting__open_notes_in':               '',
            
            /* stores */
            'store__id_to_guid':            {},
            'store__id_to_info':            {},
            'store__id_to_recommendation':  {},
            
            /* set on login */
			'rpc__userStore': 	false,
			'rpc__noteStore': 	false,
			
			'user__authToken': 	false,
			'user__expires': 	false,
            
            'user__id':         false,
			'user__shardId': 	false,
			'user__privilege': 	false,
            'user__username':   false,
            'user__email':      false,
			
			'is__connected': 	false,
			'is__loggedIn': 	false,
            
            /* business */
            'is__business': 	    false,
            
            'business__authToken':  false,
            'business__expires':    false,

            'business__shardId':    false,
            'business__noteStore':  false
		};
        
	//  include
    //  =======
    
        
	//	connect
	//	=======
		__readable_by_evernote.__evernote_remote.connect = function (_onSuccess, _onFailure)
		{
            //  bootstrap first
            //  ===============
                __readable_by_evernote.__evernote_bootstrap.bootstrap
                (
                    function ()
                    {
                        //  bootstrap succesfull
                        //  ====================
                        try
                        {
                            var _rpcUserStoreClient = new __readable_by_evernote.JSONRpcClient
                            (
                                function ()
                                {
                                    //	error / timeout
                                    //  ===============
                                        if (this.UserStore); else
                                        {
                                            //  fail
                                            _onFailure('connection / invalid');
                                            
                                            //  break
                                            return;
                                        }
                                
                                    //	set conected
                                    //  ============
                                        __readable_by_evernote.__evernote_remote.is__connected = true;
                                        __readable_by_evernote.__evernote_remote.rpc__userStore = this;
                                    
                                    //  run success
                                    //  ===========
                                        _onSuccess();
                                }, 
                                __readable_by_evernote.__evernote_bootstrap.remote_domain + 'json'
                            );
                        }
                        catch (_error) { _onFailure('connection / invalid'); return; }
                    },
                    function () { _onFailure('connection / invalid'); }
                );
		};

        
    //  not expired
    //  ===========
        __readable_by_evernote.__evernote_remote.is__notExpired = function ()
        {
            //  invalid
            switch (true)
            {
                case (!__readable_by_evernote.__evernote_remote.is__connected):
                case (!__readable_by_evernote.__evernote_remote.is__loggedIn):
                case (!__readable_by_evernote.__evernote_remote.user__expires):
                    return false;
            }
            
            //  now
            var _now = new Date().getTime();

            //  not within 3 minutes of expiration
            if (_now > (__readable_by_evernote.__evernote_remote.user__expires - (3 * 60 * 1000))) return false;
            
            //  check business too
            if (__readable_by_evernote.__evernote_remote.is__business)
            {
                //  not within 3 minutes of expiration
                if (_now > (__readable_by_evernote.__evernote_remote.business__expires - (3 * 60 * 1000))) return false;
                
                //  business too, is not expired
                return true;
            }
            else
            {
                //  not business, and user not expired
                return true;
            }
        };

        
	//	login
	//	=====
		__readable_by_evernote.__evernote_remote.login = function (_user, _pass, _onSuccess, _onFailure)
		{
            //  login sucess
            //  ============
                var _doSuccess = function () { _onSuccess(); };
        
            //  login function
            //  ===============
                var _loginFunction = function ()
                {
                    //	login
                    //	=====
                        __readable_by_evernote.__evernote_remote.rpc__userStore.UserStore.authenticate
                        (
                            function (_rpc_result, _rpc_exception)
                            {
                                var 
                                    _loginResult = _rpc_result,
                                    _loginError = _rpc_exception
                                ;
                            
                                //  error
                                //  =====
                                
                                    if (_loginError)
                                    {
                                        //	unknown error
                                        //	=============
                                            switch (true)
                                            {
                                                case (!(_loginError.trace)):
                                                case (!(_loginError.trace.indexOf)):
                                                case (!(_loginError.trace.indexOf(')') > -1)):
                                                    _onFailure('login / exception / no trace');
                                                    return;
                                            }
                                        
                                        //	figure out error
                                        //	================
                                            var _trace = _loginError.trace.substr(0, _loginError.trace.indexOf(')')+1);
                                            switch (_trace)
                                            {
                                                case 'EDAMUserException(errorCode:INVALID_AUTH, parameter:username)':
                                                    _onFailure('username');
                                                    return;

                                                case 'EDAMUserException(errorCode:INVALID_AUTH, parameter:password)':
                                                    _onFailure('password');
                                                    return;
                                            }

                                        //	could not figure out error
                                        //	==========================
                                            _onFailure('login / exception / unknown');
                                            return;
                                    }
                                    
                                
                                //  result
                                //  ======
                                    
                                    //	check
                                    //	=====
                                        switch (true)
                                        {
                                            case (!(_loginResult.authenticationToken)):
                                            case (!(_loginResult.user)):
                                            case (!(_loginResult.user.id)):
                                            case (!(_loginResult.user.shardId)):
                                                _onFailure('login / invalid result');
                                                return;
                                        }
                                        //  console.log(_loginResult);
                                        
                                    //	set userInfo
                                    //	============
                                        __readable_by_evernote.__evernote_remote.user__authToken = 		_loginResult.authenticationToken;
                                        __readable_by_evernote.__evernote_remote.user__expires =        _loginResult.expiration;

                                        __readable_by_evernote.__evernote_remote.user__id = 		    _loginResult.user.id;
                                        __readable_by_evernote.__evernote_remote.user__shardId = 		_loginResult.user.shardId;
                                        __readable_by_evernote.__evernote_remote.user__privilege = 		_loginResult.user.privilege.value;
                                        __readable_by_evernote.__evernote_remote.user__name = 		    _loginResult.user.name;
                                        __readable_by_evernote.__evernote_remote.user__username = 		_loginResult.user.username;
                                        __readable_by_evernote.__evernote_remote.user__email = 		    _loginResult.user.email;
                                    
                                        __readable_by_evernote.__evernote_remote.is__loggedIn = true;
                                        
                                        //  console.log(_loginResult);
                                        
                                        

                                    //	note store
                                    //	==========
                                        var _rpcNoteStoreClient = new __readable_by_evernote.JSONRpcClient
                                        (
                                            function ()
                                            {
                                                //	error / timeout
                                                //  ===============
                                                    if (this.NoteStore); else
                                                    {
                                                        //  failed
                                                        _onFailure('login / note store / invalid');
                                                        
                                                        //  break
                                                        return;
                                                    }

                                                //  set connected
                                                //  =============
                                                    __readable_by_evernote.__evernote_remote.rpc__noteStore = this;
                                                    
                                                //  not business
                                                //  ============
                                                    if (true
                                                        && _loginResult.user
                                                        && _loginResult.user.accounting
                                                        && _loginResult.user.accounting.businessId 
                                                        && _loginResult.user.accounting.businessId > 0); else
                                                    {
                                                        _doSuccess();
                                                        return;
                                                    }
                                                    
                                                //  is business -- try login
                                                //  ========================
                                                    __readable_by_evernote.__evernote_remote.loginToBusiness(_doSuccess, _doSuccess);
                                            },
                                            __readable_by_evernote.__evernote_bootstrap.remote_domain + 'shard/' + __readable_by_evernote.__evernote_remote.user__shardId + '/json'
                                        );
                                        
                            },
                            _user, 						                        	// username
                            _pass, 			                        				// password
                            __readable_by_evernote.__evernote_remote.api__key,		// consumer key
                            __readable_by_evernote.__evernote_remote.api__secret	// consumer secret
                        );
                };

                
			//	allready connected, connect, or error
			//	=====================================
				if (__readable_by_evernote.__evernote_remote.is__connected)
                {
                    //  do
                    _loginFunction();
                }
                else
				{
					//	connect
					__readable_by_evernote.__evernote_remote.connect
                    (
                        function () { _loginFunction(); },
                        function () { _onFailure('connection / invalid'); }
                    );
				}
        };

        
    //  login to business
    //  =================
        __readable_by_evernote.__evernote_remote.loginToBusiness = function (_onSuccess, _onFailure)
		{
            //  login sucess
            //  ============
                var _doSuccess = function () { _onSuccess(); };

            //  authenticate to business
            //  ========================
                __readable_by_evernote.__evernote_remote.rpc__userStore.UserStore.authenticateToBusiness
                (
                    function (_rpc_result, _rpc_exception)
                    {
                        var 
                            _loginResultBusiness = _rpc_result,
                            _loginErrorBusiness = _rpc_exception
                        ;
                        
                        //  error
                        //  =====
                            if (_loginErrorBusiness) { _doSuccess(); return; }
                            
                        //  result
                        //  ======
                            
                            //	check
                            //	=====
                                switch (true)
                                {
                                    case (!(_loginResultBusiness.authenticationToken)):
                                    case (!(_loginResultBusiness.user)):
                                    case (!(_loginResultBusiness.user.shardId)):
                                        _doSuccess();
                                        return;
                                }
                                //  console.log(_loginResultBusiness);

                            //	set business info
                            //	=================
                                __readable_by_evernote.__evernote_remote.business__authToken = 	_loginResultBusiness.authenticationToken;
                                __readable_by_evernote.__evernote_remote.business__expires =    _loginResultBusiness.expiration;

                                __readable_by_evernote.__evernote_remote.business__shardId =    _loginResultBusiness.user.shardId;
                                
                                //  console.log(_loginResultBusiness);
                                
                                
                            //	note store
                            //	==========
                                var _rpcNoteStoreClientBusiness = new __readable_by_evernote.JSONRpcClient
                                (
                                    function ()
                                    {
                                        //	error / timeout
                                        //  ===============
                                            if (this.NoteStore); else
                                            {
                                                _onFailure();
                                                return;
                                            }

                                        //  set connected
                                        //  =============
                                            __readable_by_evernote.__evernote_remote.is__business = true;
                                            __readable_by_evernote.__evernote_remote.business__noteStore = this;
                                            
                                        //  success
                                        //  =======
                                            _doSuccess();
                                    },
                                    __readable_by_evernote.__evernote_bootstrap.remote_domain + 'shard/' + __readable_by_evernote.__evernote_remote.business__shardId + '/json'
                                );
                    },
                    __readable_by_evernote.__evernote_remote.user__authToken
                );
        };
        
	//	clip
	//	====
		__readable_by_evernote.__evernote_remote.clip = function (_id, _url, _title, _body, _onSuccess, _onFailure)
		{
			//	preliminary check
			//	=================
				switch (true)
				{
					case (!(__readable_by_evernote.__evernote_remote.rpc__noteStore)):
					case (!(__readable_by_evernote.__evernote_remote.rpc__noteStore.NoteStore)):
					case (!(__readable_by_evernote.__evernote_remote.is__connected)):
					case (!(__readable_by_evernote.__evernote_remote.is__loggedIn)):
					case (!(__readable_by_evernote.__evernote_remote.is__notExpired())):
						_onFailure('login');
						return;
				}

            //  smart filing enabled -- but the recommendation hasn't been requested yet; turn around
            //  ====================
                if (__readable_by_evernote.__evernote_remote.setting__smart_filing == 'disabled'); else
                {
                    switch (true)
                    {
                        case (__readable_by_evernote.__evernote_remote.setting__smart_filing == 'enabled'):
                        case (__readable_by_evernote.__evernote_remote.setting__smart_filing == 'just_notebooks'):
                        case (__readable_by_evernote.__evernote_remote.setting__smart_filing == 'just_tags'):
                            if (__readable_by_evernote.__evernote_remote.store__id_to_recommendation[_id]); else
                            {
                                //  get recommendation
                                //  ==================
                                    __readable_by_evernote.__evernote_remote.get_recommendation
                                    (
                                        _id,
                                        _url,
                                        _body,
                                        function ()
                                        {
                                            //  do it again; recommendatin was added to the global store
                                            __readable_by_evernote.__evernote_remote.clip(
                                                _id, _url, _title, _body, _onSuccess, _onFailure
                                            );
                                        },
                                        function ()
                                        {
                                            //  set to dummy; only try this once
                                            __readable_by_evernote.__evernote_remote.store__id_to_recommendation[_id] = true;
                                            
                                            //  do it again -- with no smart filing
                                            __readable_by_evernote.__evernote_remote.clip(
                                                _id, _url, _title, _body, _onSuccess, _onFailure
                                            );
                                        }
                                    );
                                
                                //  turn around
                                //  ===========
                                    return;
                            }
                    }
				}
            
                
            //  the finling info object
            //  =======================
            
                var _filingInfo = {
                    'source':                   'Clearly',
                    
                    'notebookGuid':             __readable_by_evernote.__evernote_remote.setting__clip_notebook_guid,
                    'notebookName':             false,
                    'createNotebook':           false,
                    
                    'tagNameList':              [],
                    'tagNameObject':            {},
                    'tagNameRecommendation':    false,
                    'createTags':               true
                };
                
                //  previously clipped
                //  ==================
                    if (_id in __readable_by_evernote.__evernote_remote.store__id_to_guid) { _filingInfo['originalNoteGuid'] = __readable_by_evernote.__evernote_remote.store__id_to_guid[_id]; }
                
                //	tags from options
                //  =================
                    var _tags_from_options = __readable_by_evernote.__evernote_remote.setting__clip_tag.split(',');
                    for (var i=0, _i=_tags_from_options.length, _t=false; i<_i;i++)
                    {
                        _t = _tags_from_options[i].replace(/^ /, '').replace(/ $/, '')
                        if (_t > '' && !(_filingInfo.tagNameObject[_t]))
                        {
                            _filingInfo.tagNameList.push(_t);
                            _filingInfo.tagNameObject[_t] = true;
                        }
                    }

                //  personal smart-filing
                //  =====================
                
                    //  notebook
                    if (true
                        && (__readable_by_evernote.__evernote_remote.setting__smart_filing == 'enabled' || __readable_by_evernote.__evernote_remote.setting__smart_filing == 'just_notebooks')
                        && __readable_by_evernote.__evernote_remote.store__id_to_recommendation[_id]
                        && __readable_by_evernote.__evernote_remote.store__id_to_recommendation[_id].notebook
                        && __readable_by_evernote.__evernote_remote.store__id_to_recommendation[_id].notebook.guid
                        && __readable_by_evernote.__evernote_remote.store__id_to_recommendation[_id].notebook.name
                    )
                    {
                        _filingInfo['notebookGuid'] = __readable_by_evernote.__evernote_remote.store__id_to_recommendation[_id].notebook.guid;
                        _filingInfo['notebookName'] = __readable_by_evernote.__evernote_remote.store__id_to_recommendation[_id].notebook.name;
                    }
                
                    //  tags
                    if (true
                        && (__readable_by_evernote.__evernote_remote.setting__smart_filing == 'enabled' || __readable_by_evernote.__evernote_remote.setting__smart_filing == 'just_tags')
                        && __readable_by_evernote.__evernote_remote.store__id_to_recommendation[_id]
                        && __readable_by_evernote.__evernote_remote.store__id_to_recommendation[_id].tags
                        && __readable_by_evernote.__evernote_remote.store__id_to_recommendation[_id].tags.list
                        && __readable_by_evernote.__evernote_remote.store__id_to_recommendation[_id].tags.list.length
                    )
                    {
                        for (var i=0, _i=__readable_by_evernote.__evernote_remote.store__id_to_recommendation[_id].tags.list.length, _t=false; i<_i;i++)
                        {
                            _t = __readable_by_evernote.__evernote_remote.store__id_to_recommendation[_id].tags.list[i].name;
                            if (_t > '' && !(_filingInfo.tagNameObject[_t]))
                            {
                                _filingInfo.tagNameList.push(_t);
                                _filingInfo.tagNameObject[_t] = true;
                            }
                        }
                    }
                    
                //  business smart-filing
                //  =====================
                
                    //  notebook
                    if (true
                        && (__readable_by_evernote.__evernote_remote.setting__smart_filing == 'enabled' || __readable_by_evernote.__evernote_remote.setting__smart_filing == 'just_notebooks')
                        && (__readable_by_evernote.__evernote_remote.setting__smart_filing_for_business == 'enabled')
                        && __readable_by_evernote.__evernote_remote.is__business
                        && __readable_by_evernote.__evernote_remote.store__id_to_recommendation[_id]
                        && __readable_by_evernote.__evernote_remote.store__id_to_recommendation[_id].businessRecommendation
                        && __readable_by_evernote.__evernote_remote.store__id_to_recommendation[_id].businessRecommendation.notebook
                        && __readable_by_evernote.__evernote_remote.store__id_to_recommendation[_id].businessRecommendation.notebook.guid
                        && __readable_by_evernote.__evernote_remote.store__id_to_recommendation[_id].businessRecommendation.notebook.name
                    )
                    {
                        _filingInfo['notebookGuid'] = __readable_by_evernote.__evernote_remote.store__id_to_recommendation[_id].businessRecommendation.notebook.guid;
                        _filingInfo['notebookName'] = __readable_by_evernote.__evernote_remote.store__id_to_recommendation[_id].businessRecommendation.notebook.name;
                    }
                
			//	try and clip
			//	============

                //  final info
                //  ==========
                    //console.log('filing info');
                    //console.log(_filingInfo);
            
                //  clip do
                //  =======
                    var _clip_do = function (_do_filingInfo, _to_business)
                    {
                        //  which?
                        //  ======
                            var 
                                _noteStore = (
                                    _to_business 
                                    ? __readable_by_evernote.__evernote_remote.business__noteStore 
                                    : __readable_by_evernote.__evernote_remote.rpc__noteStore
                                ),
                                _authToken = (
                                    _to_business 
                                    ? __readable_by_evernote.__evernote_remote.business__authToken 
                                    : __readable_by_evernote.__evernote_remote.user__authToken
                                )
                            ;
                            
                        //  filing info -- for business, ignore tags
                        //  ===========
                        
                            //  properties
                            var _actualFilingInfoProperties = [ 'source', 'notebookGuid', 'originalNoteGuid' ];
                            if (_to_business); else
                            {
                                _actualFilingInfoProperties.push('tagNameList');
                                _actualFilingInfoProperties.push('createTags');
                            }
                            
                            //  copy to new filingInfo object
                            var _actualFilingInfo = {};
                            for (var z=0, _z=_actualFilingInfoProperties.length, _p=false; z<_z; z++)
                            {
                                _p = _actualFilingInfoProperties[z];
                                if (_do_filingInfo[_p]) { _actualFilingInfo[_p] = _do_filingInfo[_p]; }
                            }
                            //  console.log(_actualFilingInfo);
                            
                        //  clip
                        //  ====
                            _noteStore.NoteStoreExtra.clipNote
                            (
                                function (_rpc_result, _rpc_exception)
                                {
                                    var 
                                        _clipResult = _rpc_result,
                                        _clipError = _rpc_exception
                                    ;
                                
                                    //  error
                                    //  =====
                                    
                                        if (_clipError)
                                        {
                                            //  Firebug.Console.log(_clipError);
                                            //  console.log(_clipError);
                                            
                                            //	unknown error
                                            //	=============
                                                switch (true)
                                                {
                                                    case (!(_clipError.trace)):
                                                    case (!(_clipError.trace.indexOf)):
                                                    case (!(_clipError.trace.indexOf(')') > -1)):
                                                        _onFailure('clip / exception / no trace');
                                                        return;
                                                }
                                            
                                            //	figure out error
                                            //	================
                                                var _trace = _clipError.trace.substr(0, _clipError.trace.indexOf(')')+1);
                                                switch (_trace)
                                                {
                                                    case 'EDAMUserException(errorCode:BAD_DATA_FORMAT, parameter:authenticationToken)':
                                                    case 'EDAMSystemException(errorCode:INVALID_AUTH, message:authenticationToken)':
                                                    case 'EDAMUserException(errorCode:AUTH_EXPIRED, parameter:authenticationToken)':
                                                        _onFailure('login');
                                                        return;
                                                }

                                            //	could not figure out error
                                            //	==========================
                                                _onFailure('clip / exception / unknown');
                                                return;
                                        }
                                        
                                    //  result
                                    //  ======

                                        //	check
                                        //	=====
                                            switch (true)
                                            {
                                                case (!(_clipResult > '')):
                                                case (!(_clipResult.split('-').length == 5)):
                                                    _onFailure('clip / invalid result');
                                                    return;
                                            }
                                            
                                        //  store this version
                                        //  ==================
                                            
                                            //  guid
                                            __readable_by_evernote.__evernote_remote.store__id_to_guid[_id] = _clipResult;
                                            
                                            //  other details
                                            __readable_by_evernote.__evernote_remote.store__id_to_info[_id] =
                                            {
                                                'guid':             __readable_by_evernote.__evernote_remote.store__id_to_guid[_id],
                                                'tag_names':        (_do_filingInfo['tagNameList'] ? _do_filingInfo['tagNameList'] : []),
                                                'notebook_name':    (_do_filingInfo['notebookName'] ? _do_filingInfo['notebookName'] : ''),
                                                'notebook_guid':    (_do_filingInfo['notebookGuid'] ? _do_filingInfo['notebookGuid'] : '')
                                            };
                                            
                                            //  urls
                                            var 
                                                _n = __readable_by_evernote.__evernote_remote.store__id_to_info[_id],
                                                _nURL = __readable_by_evernote.__evernote_remote.get_note_link(_to_business, _n.guid, _n.notebook_guid)
                                            ;
                                                
                                            __readable_by_evernote.__evernote_remote.store__id_to_info[_id]['url_view'] = _nURL;
                                            __readable_by_evernote.__evernote_remote.store__id_to_info[_id]['url_edit'] = _nURL;
                                            
                                        //	success
                                        //	=======
                                            _onSuccess();
                                },
                                _authToken,                     // authentification token
                                _actualFilingInfo,              // filing information
                                (_title > '' ? _title : _url), 	// title
                                _url, 							// url
                                _body							// html
                            );
                    };
                        
                        
                //  do the clip -- but where?
                //  ===========
                    
                    //  the fallabck
                    //  ============
                        var _clip_to_user_default_notebook = function (_default_filingInfo)
                        {
                            __readable_by_evernote.__evernote_remote.rpc__noteStore.NoteStore.getDefaultNotebook
                            (
                                function (_rpc_result, _rpc_exception)
                                {
                                    var _getResult = _rpc_result, _getError = _rpc_exception;
                                    if (true
                                        && !(_getError)
                                        && _getResult
                                        && _getResult.guid
                                        && _getResult.name)
                                    {
                                        //  found default notebook
                                        //  ======================
                                            _default_filingInfo['notebookGuid'] = _getResult.guid;
                                            _default_filingInfo['notebookName'] = _getResult.name;
                                            _clip_do(_default_filingInfo, false);
                                    }
                                    else
                                    {
                                        //  didn't find default notebook
                                        //  ============================
                                            _default_filingInfo['notebookName'] = '';
                                            delete _default_filingInfo['notebookGuid'];
                                            _clip_do(_default_filingInfo, false);
                                    }
                                },
                                __readable_by_evernote.__evernote_remote.user__authToken 	// authentification token
                            );
                        };
                        
                        
                    //  clip to shared notebook
                    //  =======================
                        var _clip_to_shared_notebook_or_user_default_notebook = function (_filingInfo)
                        {
                        };
                        
                        
                    //  straight to user's default notebook
                    //  ===================================
                        if (_filingInfo['notebookGuid'] > ''); else
                        {
                            _clip_to_user_default_notebook(_filingInfo);
                            return;
                        }
                    
                    //  try one of the user's notebooks
                    //  ===============================
                        __readable_by_evernote.__evernote_remote.rpc__noteStore.NoteStore.getNotebook
                        (
                            function (_rpc_result, _rpc_exception)
                            {
                                var _getResult = _rpc_result, _getError = _rpc_exception;
                                if (true
                                    && !(_getError)
                                    && _getResult
                                    && _getResult.guid
                                    && _getResult.name)
                                {
                                    //  found user's notebook
                                    //  =====================
                                        _filingInfo['notebookName'] = _getResult.name;
                                        _clip_do(_filingInfo, false);
                                }
                                else if (__readable_by_evernote.__evernote_remote.is__business)
                                {
                                    //  try one of the user's business notebooks -- selected with proper guid
                                    //  ========================================
                                        __readable_by_evernote.__evernote_remote.business__noteStore.NoteStore.getNotebook
                                        (
                                            function (_rpc_result, _rpc_exception)
                                            {
                                                var _getResult = _rpc_result, _getError = _rpc_exception;
                                                if (true
                                                    && !(_getError)
                                                    && _getResult
                                                    && _getResult.guid
                                                    && _getResult.name)
                                                {
                                                    //  found business notebook
                                                    //  =======================
                                                        _filingInfo['notebookName'] = _getResult.name;
                                                        _clip_do(_filingInfo, true);
                                                }
                                                else
                                                {
                                                    //  user's default notebook
                                                    _clip_to_user_default_notebook(_filingInfo);
                                                }
                                            },
                                            __readable_by_evernote.__evernote_remote.business__authToken, 	// authentification token
                                            _filingInfo['notebookGuid']                                     // notebook guid
                                        );
                                }
                                else
                                {
                                    //  user's default notebook
                                    _clip_to_user_default_notebook(_filingInfo);
                                }
                            },
                            __readable_by_evernote.__evernote_remote.user__authToken, 	// authentification token
                            _filingInfo['notebookGuid']                                 // notebook guid
                        );
		};

        
/*

    //  clip to shared notebook, with a saved share.guid
    //  ============================================
    
        //  try one of the user's business notebooks -- selected by the user, as a shared/linked notebook
        //  ========================================
            __readable_by_evernote.__evernote_remote.get_linked_notebooks
            (
                //  got all linked notebooks
                //  ========================
                    function (_linked_notebooks)
                    {
                        //  loop through linked notebooks
                        //  =============================
                            for (var i=0, _i=_linked_notebooks.length; i<_i; i++)
                            {
                                if (_linked_notebooks[i].businessId && _linked_notebooks[i].guid == _filingInfo['notebookGuid'])
                                {
                                    var 
                                        _linkedNotebookShareKey = _linked_notebooks[i].shareKey,
                                        _linkedNotebookShareName = _linked_notebooks[i].shareName
                                    ;
                                    
                                    //  authenticate to shared notebook
                                    //  ===============================
                                        __readable_by_evernote.__evernote_remote.business__noteStore.NoteStore.authenticateToSharedNotebook
                                        (
                                            function (_rpc_result, _rpc_exception)
                                            {
                                                var _getResult = _rpc_result, _getError = _rpc_exception;
                                                if (true
                                                    && !(_getError)
                                                    && _getResult
                                                    && _getResult.authenticationToken)
                                                {
                                                    //  get shared notebook
                                                    //  ===================
                                                        var _sharedNotebookToken = _getResult.authenticationToken;
                                                        __readable_by_evernote.__evernote_remote.business__noteStore.NoteStore.getSharedNotebookByAuth
                                                        (
                                                            function (_rpc_result, _rpc_exception)
                                                            {
                                                                var _getResult = _rpc_result, _getError = _rpc_exception;
                                                                if (true
                                                                    && !(_getError)
                                                                    && _getResult
                                                                    && _getResult.notebookGuid)
                                                                {
                                                                    //  found business notebook
                                                                    //  =======================
                                                                        _filingInfo['notebookName'] = _linkedNotebookShareName;
                                                                        _filingInfo['notebookGuid'] = _getResult.notebookGuid;
                                                                        _clip_do(_filingInfo, true);
                                                                }
                                                                else
                                                                {
                                                                    //  user's default notebook
                                                                    _clip_to_user_default_notebook(_filingInfo);
                                                                }
                                                            },
                                                            _sharedNotebookToken
                                                        );    
                                                }
                                                else
                                                {
                                                    //  user's default notebook
                                                    _clip_to_user_default_notebook(_filingInfo);
                                                }
                                            },
                                            _linkedNotebookShareKey,
                                            __readable_by_evernote.__evernote_remote.user__authToken
                                        );
                                        
                                    //  break loop
                                    //  ==========
                                        return;
                                }
                            }
                        
                        //  user's default notebook
                        _clip_to_user_default_notebook(_filingInfo);
                    },
                
                //  failed to get linked notebooks
                //  ==============================
                    function ()
                    {
                        //  user's default notebook
                        _clip_to_user_default_notebook(_filingInfo);
                    }
            );
            
*/        
        
        
	//	recommendation
	//	==============
		__readable_by_evernote.__evernote_remote.get_recommendation = function (_id, _url, _body, _onSuccess, _onFailure)
		{
			//	preliminary check
			//	=================
				switch (true)
				{
					case (!(__readable_by_evernote.__evernote_remote.rpc__noteStore)):
					case (!(__readable_by_evernote.__evernote_remote.rpc__noteStore.NoteStore)):
					case (!(__readable_by_evernote.__evernote_remote.is__connected)):
					case (!(__readable_by_evernote.__evernote_remote.is__loggedIn)):
					case (!(__readable_by_evernote.__evernote_remote.is__notExpired())):
						_onFailure('login');
						return;
				}

            //  get scuccess
            //  ============
                var _doSuccess = function () { _onSuccess(); };
            
            
            //  default to false
            //  ================
                var _defaultResultToFalse = function (_thisResult)
                {
                    var _theResult = _thisResult;
                    
                    if (_theResult); else                  { _theResult = {}; }
                    if (_theResult.notebook); else         { _theResult.notebook = false; }
                    if (_theResult.tags); else             { _theResult.tags = false; }
                    if (_theResult.relatedNotes); else     { _theResult.relatedNotes = false; }
                    
                    return _theResult;
                };
            
            //  add absolute URLs
            //  =================
                var _addAbsoluteURLs = function (_addToThisResult, _use_business)
                {
                    var _theResult = _addToThisResult;
                    
                    //  check
                    if (true
                        && _theResult.relatedNotes 
                        && _theResult.relatedNotes.list 
                        && _theResult.relatedNotes.list.length > 0); else { return _theResult; }
                    
                    //  loop
                    //  ====
                        for (var i=0, _i=_theResult.relatedNotes.list.length; i<_i; i++)
                        {
                            var _n = _theResult.relatedNotes.list[i];
                            _theResult.relatedNotes.list[i]['absoluteURL__thumbnail'] = __readable_by_evernote.__evernote_remote.get_note_thumbnail(_use_business, _n.guid);
                            _theResult.relatedNotes.list[i]['absoluteURL__noteView'] = __readable_by_evernote.__evernote_remote.get_note_link(_use_business, _n.guid, _n.notebookGuid);
                        }
                    
                    //  return
                    return _theResult;
                };
                
            //  _body
            //  =====
                //  just text
                _body = _body.replace(/<[^>]+?>/gi, ' ');
                
                //  remove spaces
                _body = _body.replace(/\s+/gi, ' ');
                _body = _body.replace(/^\s+/gi, '');
                
                //  cut off
                _body = _body.substr(0, 5000);
                
            //  recommendation request
            //  ======================
                var _recommendationRequest = 
                {
                    'url': _url,
                    'text': _body,
                    'relatedNotesResultSpec':
                    {
                        'includeTitle': true,
                        'includeSnippet': true,
                        
                        'includeCreated': true,
                        
                        'includeLargestResourceMime': true,
                        'includeLargestResourceSize': true,
                        
                        'includeNotebookGuid': true,

                        'includeAttributes': false,
                        'includeTagNames': false
                    }
                };
                //  console.log('NoteStoreExtra.getFilingRecommendations Called with:');
                //  console.log(_recommendationRequest);
                
                
            //	try and get -- a FilingReccomendation object
			//	===========
                __readable_by_evernote.__evernote_remote.rpc__noteStore.NoteStoreExtra.getFilingRecommendations
                (
                    function (_rpc_result, _rpc_exception)
                    {
                        var 
                            _getResult = _rpc_result,
                            _getError = _rpc_exception
                        ;
                    
                        //  error
                        //  =====
                        
                            if (_getError)
                            {
                                //  Firebug.Console.log(_getError);
                                //  console.log(_getError);
                                
                                //	unknown error
                                //	=============
                                    switch (true)
                                    {
                                        case (!(_getError.trace)):
                                        case (!(_getError.trace.indexOf)):
                                        case (!(_getError.trace.indexOf(')') > -1)):
                                            _onFailure('get_recommendation / exception / no trace');
                                            return;
                                    }
                                
                                //	figure out error
                                //	================
                                    var _trace = _getError.trace.substr(0, _getError.trace.indexOf(')')+1);
                                    switch (_trace)
                                    {
                                        case 'EDAMUserException(errorCode:BAD_DATA_FORMAT, parameter:authenticationToken)':
                                        case 'EDAMSystemException(errorCode:INVALID_AUTH, message:authenticationToken)':
                                        case 'EDAMUserException(errorCode:AUTH_EXPIRED, parameter:authenticationToken)':
                                            _onFailure('login');
                                            return;
                                    }

                                //	could not figure out error
                                //	==========================
                                    _onFailure('get_recommendation / exception / unknown');
                                    return;
                            }
                            
                        //  result
                        //  ======
                        
                            //  fill in to false
                            //  ================
                                _getResult = _defaultResultToFalse(_getResult);
                            
                            //  add absoluteURLs
                            //  ================
                                _getResult = _addAbsoluteURLs(_getResult, false);
                                
                            //  store result
                            //  ============
                                __readable_by_evernote.__evernote_remote.store__id_to_recommendation[_id] = _getResult;
                                
                            //  not business; end
                            //  =================
                                if (true
                                    && __readable_by_evernote.__evernote_remote.is__business
                                    && __readable_by_evernote.__evernote_remote.business__noteStore
                                    && __readable_by_evernote.__evernote_remote.business__noteStore.NoteStore); else
                                {
                                    _doSuccess();
                                    return;
                                }
                                
                            //  is business; get second reccomendation
                            //  ======================================
                                __readable_by_evernote.__evernote_remote.store__id_to_recommendation[_id]['businessRecommendation'] = false;
                                
                                __readable_by_evernote.__evernote_remote.business__noteStore.NoteStoreExtra.getFilingRecommendations
                                (
                                    function (_rpc_result, _rpc_exception)
                                    {
                                        var 
                                            _getResultBusiness = _rpc_result,
                                            _getErrorBusiness = _rpc_exception
                                        ;
                                        
                                        //  error
                                        //  =====
                                            if (_getErrorBusiness) { _doSuccess(); return; }
                                            
                                        //  result
                                        //  ======
                                            
                                            //  fill in to false
                                            //  ================
                                                _getResultBusiness = _defaultResultToFalse(_getResultBusiness);
                                            
                                            //  add absoluteURLs
                                            //  ================
                                                _getResultBusiness = _addAbsoluteURLs(_getResultBusiness, true);
                                                
                                            //  store result
                                            //  ============
                                                __readable_by_evernote.__evernote_remote.store__id_to_recommendation[_id].businessRecommendation = _getResultBusiness;

                                        //  success
                                        //  =======
                                            //  console.log(__readable_by_evernote.__evernote_remote.store__id_to_recommendation[_id]);
                                            _doSuccess();
                                    },
                                    __readable_by_evernote.__evernote_remote.business__authToken,
                                    _recommendationRequest
                                );
                    },
                    __readable_by_evernote.__evernote_remote.user__authToken, 	// authentification token
                    _recommendationRequest                                      // recommendation request
                );
        };

        
	//	get notebooks
	//	=============
		__readable_by_evernote.__evernote_remote.get_notebooks = function (_onSuccess, _onFailure)
		{
			//	preliminary check
			//	=================
				switch (true)
				{
					case (!(__readable_by_evernote.__evernote_remote.rpc__noteStore)):
					case (!(__readable_by_evernote.__evernote_remote.rpc__noteStore.NoteStore)):
					case (!(__readable_by_evernote.__evernote_remote.is__connected)):
					case (!(__readable_by_evernote.__evernote_remote.is__loggedIn)):
					case (!(__readable_by_evernote.__evernote_remote.is__notExpired())):
						_onFailure('login');
						return;
				}

            //	try and get -- a list of notebooks
			//	===========
                __readable_by_evernote.__evernote_remote.rpc__noteStore.NoteStore.listNotebooks
                (
                    function (_rpc_result, _rpc_exception)
                    {
                        var 
                            _getResult = _rpc_result,
                            _getError = _rpc_exception
                        ;
                    
                        //  error
                        //  =====
                        
                            if (_getError)
                            {
                                //  Firebug.Console.log(_getError);
                                //  console.log(_getError);
                                
                                //	unknown error
                                //	=============
                                    switch (true)
                                    {
                                        case (!(_getError.trace)):
                                        case (!(_getError.trace.indexOf)):
                                        case (!(_getError.trace.indexOf(')') > -1)):
                                            _onFailure('get_notebooks / exception / no trace');
                                            return;
                                    }
                                
                                //	figure out error
                                //	================
                                    var _trace = _getError.trace.substr(0, _getError.trace.indexOf(')')+1);
                                    switch (_trace)
                                    {
                                        case 'EDAMUserException(errorCode:BAD_DATA_FORMAT, parameter:authenticationToken)':
                                        case 'EDAMSystemException(errorCode:INVALID_AUTH, message:authenticationToken)':
                                        case 'EDAMUserException(errorCode:AUTH_EXPIRED, parameter:authenticationToken)':
                                            _onFailure('login');
                                            return;
                                    }

                                //	could not figure out error
                                //	==========================
                                    _onFailure('get_notebooks / exception / unknown');
                                    return;
                            }
                            
                        //  result
                        //  ======
                        
                            //	check
                            //	=====
                            
                                switch (true)
                                {
                                    case (!(_getResult.list)):
                                    case (!(_getResult.list.length)):
                                        _onFailure('get_notebooks / invalid result');
                                        return;
                                }
                            
                            //	success
                            //	=======
                            
                                //  sort
                                //  ====
                                    _getResult.list.sort(function (a, b)
                                    {
                                        switch (true)
                                        {
                                            case (a.name < b.name): return -1;
                                            case (a.name > b.name): return 1;
                                            default: return 0;
                                        }
                                    });
                                
                                //  return
                                //  ======
                                    _onSuccess(_getResult.list);
                    },
                    __readable_by_evernote.__evernote_remote.user__authToken 	// authentification token
                );
        };


	//	get business notebooks
	//	======================
		__readable_by_evernote.__evernote_remote.get_business_notebooks = function (_onSuccess, _onFailure)
		{
			//	preliminary check
			//	=================
				switch (true)
				{
					case (!(__readable_by_evernote.__evernote_remote.business__noteStore)):
					case (!(__readable_by_evernote.__evernote_remote.business__noteStore.NoteStore)):
					case (!(__readable_by_evernote.__evernote_remote.is__business)):
					case (!(__readable_by_evernote.__evernote_remote.is__connected)):
					case (!(__readable_by_evernote.__evernote_remote.is__loggedIn)):
					case (!(__readable_by_evernote.__evernote_remote.is__notExpired())):
						_onFailure('login');
						return;
				}

            //	try and get -- a list of notebooks
			//	===========
                __readable_by_evernote.__evernote_remote.business__noteStore.NoteStore.listNotebooks
                (
                    function (_rpc_result, _rpc_exception)
                    {
                        var 
                            _getResult = _rpc_result,
                            _getError = _rpc_exception
                        ;
                    
                        //  error
                        //  =====
                        
                            if (_getError)
                            {
                                //  Firebug.Console.log(_getError);
                                //  console.log(_getError);
                                
                                //	unknown error
                                //	=============
                                    switch (true)
                                    {
                                        case (!(_getError.trace)):
                                        case (!(_getError.trace.indexOf)):
                                        case (!(_getError.trace.indexOf(')') > -1)):
                                            _onFailure('get_business_notebooks / exception / no trace');
                                            return;
                                    }
                                
                                //	figure out error
                                //	================
                                    var _trace = _getError.trace.substr(0, _getError.trace.indexOf(')')+1);
                                    switch (_trace)
                                    {
                                        case 'EDAMUserException(errorCode:BAD_DATA_FORMAT, parameter:authenticationToken)':
                                        case 'EDAMSystemException(errorCode:INVALID_AUTH, message:authenticationToken)':
                                        case 'EDAMUserException(errorCode:AUTH_EXPIRED, parameter:authenticationToken)':
                                            _onFailure('login');
                                            return;
                                    }

                                //	could not figure out error
                                //	==========================
                                    _onFailure('get_business_notebooks / exception / unknown');
                                    return;
                            }
                            
                        //  result
                        //  ======
                        
                            //	check
                            //	=====
                            
                                switch (true)
                                {
                                    case (!(_getResult.list)):
                                    case (!(_getResult.list.length)):
                                        _onFailure('get_business_notebooks / invalid result');
                                        return;
                                }
                            
                            //	success
                            //	=======
                            
                                //  sort
                                //  ====
                                    _getResult.list.sort(function (a, b)
                                    {
                                        switch (true)
                                        {
                                            case (a.name < b.name): return -1;
                                            case (a.name > b.name): return 1;
                                            default: return 0;
                                        }
                                    });
                                
                                //  return
                                //  ======
                                    _onSuccess(_getResult.list);
                    },
                    __readable_by_evernote.__evernote_remote.business__authToken 	// authentification token
                );
        };

        
	//	get linked notebooks
	//	====================
		__readable_by_evernote.__evernote_remote.get_linked_notebooks = function (_onSuccess, _onFailure)
		{
			//	preliminary check
			//	=================
				switch (true)
				{
					case (!(__readable_by_evernote.__evernote_remote.rpc__noteStore)):
					case (!(__readable_by_evernote.__evernote_remote.rpc__noteStore.NoteStore)):
					case (!(__readable_by_evernote.__evernote_remote.is__connected)):
					case (!(__readable_by_evernote.__evernote_remote.is__loggedIn)):
					case (!(__readable_by_evernote.__evernote_remote.is__notExpired())):
						_onFailure('login');
						return;
				}

            //	try and get -- a list of notebooks
			//	===========
                __readable_by_evernote.__evernote_remote.rpc__noteStore.NoteStore.listLinkedNotebooks
                (
                    function (_rpc_result, _rpc_exception)
                    {
                        var 
                            _getResult = _rpc_result,
                            _getError = _rpc_exception
                        ;
                    
                        //  error
                        //  =====
                        
                            if (_getError)
                            {
                                //  Firebug.Console.log(_getError);
                                //  console.log(_getError);
                                
                                //	unknown error
                                //	=============
                                    switch (true)
                                    {
                                        case (!(_getError.trace)):
                                        case (!(_getError.trace.indexOf)):
                                        case (!(_getError.trace.indexOf(')') > -1)):
                                            _onFailure('get_notebooks / exception / no trace');
                                            return;
                                    }
                                
                                //	figure out error
                                //	================
                                    var _trace = _getError.trace.substr(0, _getError.trace.indexOf(')')+1);
                                    switch (_trace)
                                    {
                                        case 'EDAMUserException(errorCode:BAD_DATA_FORMAT, parameter:authenticationToken)':
                                        case 'EDAMSystemException(errorCode:INVALID_AUTH, message:authenticationToken)':
                                        case 'EDAMUserException(errorCode:AUTH_EXPIRED, parameter:authenticationToken)':
                                            _onFailure('login');
                                            return;
                                    }

                                //	could not figure out error
                                //	==========================
                                    _onFailure('get_linked_notebooks / exception / unknown');
                                    return;
                            }
                            
                        //  result
                        //  ======
                        
                            //	check
                            //	=====
                                
                                switch (true)
                                {
                                    case (!(_getResult.list)):
                                    case (!(_getResult.list.length)):
                                        _onFailure('get_linked_notebooks / invalid result');
                                        return;
                                }
                            
                            //	success
                            //	=======
                            
                                //  sort
                                //  ====
                                    _getResult.list.sort(function (a, b)
                                    {
                                        switch (true)
                                        {
                                            case (a.name < b.name): return -1;
                                            case (a.name > b.name): return 1;
                                            default: return 0;
                                        }
                                    });
                                
                                //  return
                                //  ======
                                    _onSuccess(_getResult.list);
                    },
                    __readable_by_evernote.__evernote_remote.user__authToken 	// authentification token
                );
        };
        
        
    //  get note link
    //      takes into account the setting "open_notes_in"
    //      if for business, uses business shard id, if not uses user shard id
    //      ads the authToken automatically
    
    __readable_by_evernote.__evernote_remote.get_note_link = function (_for_business, _note_guid, _notebook_guid)
    {
        var
            _authToken = (
                _for_business 
                ? __readable_by_evernote.__evernote_remote.business__authToken 
                : __readable_by_evernote.__evernote_remote.user__authToken
            ),
            _shardId = (
                _for_business 
                ? __readable_by_evernote.__evernote_remote.business__shardId 
                : __readable_by_evernote.__evernote_remote.user__shardId
            )
        ;
        
        switch (true)
        {
            case (__readable_by_evernote.__evernote_remote.setting__open_notes_in == 'web'):
            //  ============================================================================
            
                switch (true)
                {
                    case (!!_for_business):
                        return __readable_by_evernote.__evernote_remote.get_setAuthAndRedirect_link(''
                            +   __readable_by_evernote.__evernote_bootstrap.remote_domain 
                            +   'shard/' +  _shardId + '/' 
                            +   'business/dispatch/' 
                            +   'view/' + _note_guid
                            +   '#st=b' + '&n=' + _note_guid + '&b=' + _notebook_guid
                        );
                        break;
                        
                    case (!_for_business):
                        return __readable_by_evernote.__evernote_remote.get_setAuthAndRedirect_link(''
                            +   __readable_by_evernote.__evernote_bootstrap.remote_domain 
                            +   'shard/' +  _shardId + '/' 
                            +   'view/' + _note_guid 
                            +   '#st=p' + '&n=' + _note_guid
                        );
                        break;
                }
            
                break;
                
            case (__readable_by_evernote.__evernote_remote.setting__open_notes_in == 'desktop'):
            //  ================================================================================

                switch (true)
                {
                    case (!!_for_business):
                        return __readable_by_evernote.__evernote_remote.get_setAuthAndRedirect_link(''
                            +   __readable_by_evernote.__evernote_bootstrap.remote_domain 
                            +   'shard/' +  _shardId + '/' 
                            +   'business/dispatch/' 
                            +   'view/' + _note_guid
                            +   '#st=b' + '&n=' + _note_guid + '&b=' + _notebook_guid
                        );
                        return ''
                            +   'evernote:///view/' 
                            +   __readable_by_evernote.__evernote_remote.user__id + '/' 
                            +   _shardId + '/' 
                            +   _note_guid + '/'
                            +   _note_guid + '/'
                            +   _notebook_guid + '/'
                            +   'sync/'
                        ;
                        break;
                        
                    case (!_for_business):
                        return ''
                            +   'evernote:///view/' 
                            +   __readable_by_evernote.__evernote_remote.user__id + '/' 
                            +   _shardId + '/' 
                            +   _note_guid + '/'
                            +   _note_guid + '/'
                            +   'sync/'
                        ;
                        break;
                }
            
                break;
        }
    };
    
    
    //  get SetAuthAndRedirect link
    //      if desktop client selected, will return the URL it was given
    //      to login on the web/client, before going to where we wnt to go
    
    __readable_by_evernote.__evernote_remote.get_setAuthAndRedirect_link = function (_link)
    {
        switch (true)
        {
            case (__readable_by_evernote.__evernote_remote.setting__open_notes_in == 'web'):
                return ''
                    + __readable_by_evernote.__evernote_bootstrap.remote_domain
                    + 'setAuthToken?auth=' + encodeURIComponent(__readable_by_evernote.__evernote_remote.user__authToken)
                    + '&redirect=' + encodeURIComponent(_link)
                ;
                break;
                
            case (__readable_by_evernote.__evernote_remote.setting__open_notes_in == 'desktop'):
                return _link;
                break;
        }        
    };
    
    
    //  get note thumbnail image
    //      will always get from the web
    //      will sue the business auth token to get a business thumnbail
    
    __readable_by_evernote.__evernote_remote.get_note_thumbnail = function (_for_business, _note_guid)
    {
        var
            _authToken = (
                _for_business 
                ? __readable_by_evernote.__evernote_remote.business__authToken 
                : __readable_by_evernote.__evernote_remote.user__authToken
            ),
            _shardId = (
                _for_business 
                ? __readable_by_evernote.__evernote_remote.business__shardId 
                : __readable_by_evernote.__evernote_remote.user__shardId
            )
        ;

        return ''
            + __readable_by_evernote.__evernote_bootstrap.remote_domain
            + 'shard/' +  _shardId + '/'
            + 'thm/note/'
            + _note_guid
            + '?auth=' + encodeURIComponent(_authToken)
            + '&size=75'
        ;
    };
    

	
	//	logout
	//	======
		__readable_by_evernote.__evernote_remote.logout = function ()
		{
			__readable_by_evernote.__evernote_remote['is__connected'] =     	false;
			__readable_by_evernote.__evernote_remote['is__loggedIn'] = 	        false;

			__readable_by_evernote.__evernote_remote['rpc__userStore'] = 	    false;
			__readable_by_evernote.__evernote_remote['rpc__noteStore'] = 	    false;

			__readable_by_evernote.__evernote_remote['user__authToken'] = 	    false;
            __readable_by_evernote.__evernote_remote['user__expires'] = 	    false;
            
            __readable_by_evernote.__evernote_remote['user__id'] = 	            false;
			__readable_by_evernote.__evernote_remote['user__shardId'] = 	    false;
			__readable_by_evernote.__evernote_remote['user__privilege'] = 	    false;
			__readable_by_evernote.__evernote_remote['user__username'] = 	    false;
			__readable_by_evernote.__evernote_remote['user__email'] = 	        false;

            
            __readable_by_evernote.__evernote_remote['is__business'] = 	        false;

            __readable_by_evernote.__evernote_remote['business__noteStore'] =   false;
            
            __readable_by_evernote.__evernote_remote['business__authToken'] =   false;
            __readable_by_evernote.__evernote_remote['business__expires'] =     false;

            __readable_by_evernote.__evernote_remote['business__shardId'] =     false;
		};

		
    //  disconnect -- QA testing
    //  ==========
        __readable_by_evernote.__evernote_remote.disconnect = function ()
        {
            __readable_by_evernote.__evernote_remote.logout();
        };
        

    //  xor
    /*
 * Evernote.XORCrypt
 * Evernote
 *
 * Created by Pavel Skaldin on 3/7/10
 * Copyright 2010-2012 Evernote Corp. All rights reserved
 */
/**
 * Naive implementation of XOR encryption with padding. It is not meant to be a
 * strong encryption of any kind, just an obfuscation. The algorithm uses a seed
 * string for XORing. The string to be encrypted is first XOR'd with a random
 * number to avoid recognizable patterns; the result is then padded and then
 * XOR'd with the seed string.
 * 
 * Make sure that XORCrypt.LENGTH is larger than the strings you're trying to
 * encrypt.
 * 
 * <pre>
 * Usage: 
 * var enc = Evernote.XORCrypt.encrypt(secret, seed); 
 * var dec = Evernote.XORCrypt.decrypt(enc, seed);
 * </pre>
 */
__readable_by_evernote.__evernote_xor = {
  DELIMIT : ":",
  LENGTH : 128,
  /**
   * Pads string to make it XORCrypt.LENGTH characters in length. Padding is
   * done by prepending the string with random chars from a range of printable
   * ascii chars.
   */
  _padString : function(str) {
    var counter = 0;
    if (str.length < 128) {
      for ( var i = str.length; i <= 128; i++) {
        str = String.fromCharCode(this._randomForChar()) + str;
        counter++;
      }
    }
    return counter + this.DELIMIT + str;
  },
  /**
   * Returns random number that would correspond to a printable ascii char.
   */
  _randomForChar : function() {
    var r = 0;
    var c = 0;
    while (r < 33 || r > 126) {
      // just a waiting... this shouldn't happen frequently
      r = parseInt(Math.random() * 150);
      c++;
    }
    return r;
  },
  /**
   * Returns random non-zero integer.
   */
  _randomNonZero : function() {
    var r = 0;
    while ((r = parseInt(Math.random() * 100)) == 0) {
      // just a waiting... this shouldn't happen frequently
    }
    return r;
  },
  /**
   * Shifts string by XOR'ing it with a number larger than 100 so as to avoid
   * non-printable characters. The resulting string will be prepended with the
   * number used to XOR followed by DELIMITER.
   */
  _shiftString : function(str) {
    var delta = this._randomNonZero() + 100;
    var shifted = [];
    for ( var i = 0; i < str.length; i++) {
      shifted.push(String.fromCharCode(str.charCodeAt(i) + delta));
    }
    return delta + this.DELIMIT + shifted.join("");
  },
  /**
   * Unshifts and returns a shifted string. The argument should be in a format
   * produced by _shitString(), i.e. begin with the shift coefficient followed
   * by DELIMITER, followed by the shifted string.
   */
  _unshiftString : function(str) {
    var delta = parseInt(str.substring(0, str.indexOf(this.DELIMIT)));
    var unshifted = [];
    if (!isNaN(delta)) {
      for ( var i = ((delta + "").length + this.DELIMIT.length); i < str.length; i++) {
        unshifted.push(String.fromCharCode(str.charCodeAt(i) - delta));
      }
    }
    return unshifted.join("");
  },
  /**
   * Encrypts string with a seed string and returns encrypted string padded to
   * be XORCrypt.LENGTH characters long.
   */
  encrypt : function(str, seed) {
    str += "";
    seed += "";
    var newStr = this._padString(this._shiftString(str));
    var enc = [];
    for ( var i = 0; i < newStr.length; i++) {
      var e = newStr.charCodeAt(i);
      for ( var j = 0; j < seed.length; j++) {
        e = seed.charCodeAt(j) ^ e;
      }
      enc.push(String.fromCharCode(e + 100));
    }
    return enc.join("");
  },
  /**
   * Decrypts string using seed string. The seed string has to be the same
   * string that was used in encrypt()ing.
   */
  decrypt : function(str, seed) {
    str += "";
    seed += "";
    var dec = [];
    for ( var i = 0; i < str.length; i++) {
      var e = str.charCodeAt(i) - 100;
      for ( var j = seed.length - 1; j >= 0; j--) {
        e = seed.charCodeAt(j) ^ e;
      }
      dec.push(String.fromCharCode(e));
    }
    var decStr = dec.join("");
    var pad = parseInt(decStr.substring(0, decStr.indexOf(this.DELIMIT)));
    if (!isNaN(pad)) {
      return this._unshiftString(decStr.substring(("" + pad).length
          + this.DELIMIT.length + pad));
    }
    return "";
  }
};

