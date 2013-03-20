
    //  set to live
    
    __readable_by_evernote.__evernote_bootstrap.set_servers_to_live();
    
    
    //  set locale
    __readable_by_evernote.__evernote_bootstrap.setLocale(window.navigator.language);

    //  server
    if ($options['storedLogin']) { __readable_by_evernote.__evernote_bootstrap.saved_server = $options['storedLogin']['server']; }

    //  vars
    __readable_by_evernote.__evernote_remote.setting__related_notes = 'disabled';
    __readable_by_evernote.__evernote_remote.setting__smart_filing = 'disabled';
    __readable_by_evernote.__evernote_remote.setting__smart_filing_for_business = 'disabled';
    __readable_by_evernote.__evernote_remote.setting__open_notes_in = 'web';
    __readable_by_evernote.__evernote_remote.setting__clip_tag = '';
    __readable_by_evernote.__evernote_remote.setting__clip_notebook = '';
    __readable_by_evernote.__evernote_remote.setting__clip_notebook_guid = '';
