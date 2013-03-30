
    //  notebook selector
    //  =================
        (function ()
        {
            //  not logged in
            if ($options['storedLogin'] == false) { return; }

            //  control; selected
            //  =================
                var $select = $('#clip_notebook_guid__control'), _selected = $select.attr('_selected');
            
            //  add notebooks group
            //  ===================
                var _add_notebooks_group = function (_values, _header)
                {
                    //  blank
                    if (_values.length > 0); else { return false; }
                    
                    //  html
                    var _html = '';
                    
                    //  start group
                    _html += '<optgroup label="'+_header+'">';
                    
                    //  options
                    for (var _i=0, _ii=_values.length, _n=false; _i<_ii; _i++)
                    {
                        //  restricted? continue
                        if (true
                            && _values[_i].restrictions
                            && _values[_i].restrictions.noCreateNotes) { continue; }
                        
                        //  write
                        _html += ''
                            + '<option value="' + _values[_i].guid + '">' 
                            +   _values[_i].name 
                            + '</option>'
                        ;
                    }
                    
                    //  end group
                    _html += '</optgroup>'
                    
                    //  add _html
                    $select.append(_html);
                };

                
            //  sort function
            //  =============
                var _sortByName = function (a, b) { 
                    switch (true) { 
                        case (a.name < b.name): return -1; 
                        case (a.name > b.name): return 1; 
                        default: return 0; 
                    } 
                };

                
            //  show all
            //  ========
                var _show_all_notebooks = function (_personal_notebooks, _business_notebooks)
                {
                    //  personal notebooks
                    //  ==================
                        _personal_notebooks.sort(_sortByName);
                        _add_notebooks_group(_personal_notebooks, $options.__translations['clip_notebook__your']);
                        
                    //  business notebooks
                    //  ==================
                        _business_notebooks.sort(_sortByName);
                        _add_notebooks_group(_business_notebooks, $options.__translations['clip_notebook__business']);

                    //  currently selected
                    //  ==================
                        
                        //  do select
                        $select.val(_selected);

                        //  check if selected; do radios
                        if ($select.val())
                        {
                            $('#clip_notebook__radio__no').attr('checked', false);
                            $('#clip_notebook__radio__yes').attr('checked', true);
                        }
                };
            

            
            //  cascade call
            __readable_by_evernote.__evernote_bootstrap.bootstrap
            (
                //  success bootstrap
                function ()
                {
                    __readable_by_evernote.__evernote_remote.connect
                    (
                        //  success connect
                        function ()
                        {
                            __readable_by_evernote.__evernote_remote.login
                            (
                                $options['storedLogin'].username,
                                $options['storedLogin'].password,

                                //	success | login
                                function ()
                                {
                                    __readable_by_evernote.__evernote_remote.get_notebooks
                                    (
                                        //	success | get notebooks
                                        function (_personal_notebooks)
                                        {
                                            __readable_by_evernote.__evernote_remote.get_business_notebooks
                                            (
                                                //	success | get linked notebooks
                                                function (_business_notebooks)
                                                {
                                                    //  show notebooks
                                                    _show_all_notebooks(_personal_notebooks, _business_notebooks);
                                                },
                                                
                                                //	failure | get linked notebooks
                                                function (_failReason)
                                                {
                                                    //  just show personal notebooks
                                                    _show_all_notebooks(_personal_notebooks, []);
                                                }
                                            );
                                        },

                                        //	failure | get notebooks
                                        function (_failReason) { }
                                    );
                                },

                                //	failure | login
                                function (_failReason) { }
                            );
                            
                        },
                        
                        //  failed connect
                        function (_failReason) { }
                    );
                },
                
                //  failed bootstrap
                function (_failReason) { }
            );
        })();
