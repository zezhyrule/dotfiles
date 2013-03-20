///Functions
function setBlockSite(){
    
    if(getPref('EnabledBlockSite')|| (!localStorage.EnabledBlockSite)){
        setPref('EnabledBlockSite','false');
        chrome.browserAction.setIcon({
            path:"img/icon19-grayscale.png"
        },reloadAllTabs());
    }else{
        setPref('EnabledBlockSite','true');
        chrome.browserAction.setIcon({
            path:"img/icon19.png"
        },reloadAllTabs());
    }
    renderText();
}

function renderText(){
    
    if(getPref('EnabledBlockSite') || (!localStorage.EnabledBlockSite) ){
        $('#menu_enable').html(translate('menu_disable'));
    }else{
        $('#menu_enable').html(translate('menu_enable'));
    }
    $('#menu_options').html(translate('menu_options'));
    
    $('#social_close').html(translate('social_close'));
    $('#login_label').html(translate('login_label'));
    $('#login_button').val(translate('login_button'));
    $('#social_show').html(translate('social_show'));
    $('#social .do_you_like').html(translate('do_you_like'));
    $('#social .share_it').html(translate('share_it'));
    socialStart();
}

function login(){
    $('#login_password').focus();
    $('#login_password').val("");
    $('#login').toggle();
    $('#menu-items').toggle();
    var auth=document.getElementById('login_button');
    auth.setAttribute('value', translate('login_button'))
    auth.addEventListener("click",function(){
        if(passwordIsCorrect()){
            this.removeEventListener('click', arguments.callee, false);
        }
    },false);
    $('#login_password').keydown(function(e){
        if(e.keyCode==13){
            if(passwordIsCorrect()){
            }
        }
    });
}
function reloadAllTabs (){
    chrome.tabs.getAllInWindow(null, function(tabs) {
        for(var i = 0; i < tabs.length; i++) {
            chrome.tabs.update(tabs[i].id, {
                url: tabs[i].url
            });
        }
    });
}
function passwordIsCorrect(){
    var passwd=document.getElementById('login_password').value;
    var hash=CryptoJS.MD5(passwd);
    console.log(hash + "===" + getPref("passwd"));
    if(getPref("passwd") == hash){
        setBlockSite();
        $('#login').hide();
        $('#menu-items').show();
        return true;
    }else{
        document.getElementById('login_label').innerHTML=translate('wrongpasswd');
        return false;
    }
}
function navigateToOptions(){
    chrome.tabs.create({
        'url': chrome.extension.getURL('options.html')
    }, function(tab) {
        // Tab opened.
        });
}
///MAIN
renderText();
var webstoreUrl = "https://chrome.google.com/webstore/detail/" + chrome.i18n.getMessage('@@extension_id');

//
////// twitter
//!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
//
//// g+
//(function() {
//    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
//    po.src = 'https://apis.google.com/js/plusone.js';
//    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
//})();

// Click handlers
$(function() {

 

    $("#menu_options").click(function() {
        navigateToOptions();
    });
    $("#menu_enable").click(function() {
        
        if(getPref('AuthEnabled')){
            login();
        }else{
            setBlockSite()
        }
    });
  
    $('#social_show').click(function(){
        
        $(this).css('display','none');
        $('#social_hide').css('display','block');
        $('#social').slideDown(400);
        
    });
    $('#social_hide').click(function(){
        $(this).css('display','none');
        $('#social_show').css('display','block');
        $('#social').slideUp(400);
    });

    $('.soc_left:first').append('<iframe src="http://www.facebook.com/plugins/like.php?href=' + encodeURIComponent(webstoreUrl) + '&amp;send=false&amp;layout=button_count&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font&amp;width=450&amp;height=35&amp;appId=381158701936486" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:450px; height:21px;" allowTransparency="true" id="share-facebook"></iframe>');
    document.getElementById('share-twitter').setAttribute("data-url", webstoreUrl);
    document.getElementById('share-gplus').setAttribute("data-href", webstoreUrl);  
});

//$(function() {
//  customize_for_this_tab();
//  maybe_show_badge();
//  localizePage();
//  $('#wrapper').fadeOut(500, function() { $(this).show() });
//});

