
function saveSettings(){
    $('#saved_text').fadeIn(1000,function(){
        setTimeout(function(){
            $('#saved_text').fadeOut(1000);
        },3000);
    });
}
function setStats(){
    if(getPref('stats')){
        document.getElementById('stats_check').removeAttribute('checked');
    }else{
        document.getElementById('stats_check').setAttribute('checked');
    }
    setPref('stats',document.getElementById('stats_check').checked);
    renderStats();
    saveSettings();
}
function setList(){
    console.log(getPref('whitelist'));
    if(getPref('whitelist')){
        if(getPref("BlockedSites")!=undefined){
            var BlockedSites=JSON.parse(getPref("BlockedSites"));
            for(var i=0;i<BlockedSites.length;i++)
                BlockedSites[i].count=0;
            setPref('BlockedSites',JSON.stringify(BlockedSites));
        }
        document.getElementById('blacklist_check').checked=true;
        document.getElementById('whitelist_check').checked=false;
        document.getElementById('list_title').innerHTML=translate("blacklist_title");
    }else{
        setPref("whitelistCount",0);
        document.getElementById('whitelist_check').checked=true;
        document.getElementById('blacklist_check').checked=false;
        document.getElementById('list_title').innerHTML=translate("whitelist_title");
    }
    setPref('whitelist',document.getElementById('whitelist_check').checked);
    saveSettings();
}
function setAuth(){
    if(getPref('AuthEnabled')){
        document.getElementById('auth_check').checked=false;
        setPref('AuthEnabled',false);
        setPref('passwd','');
    }else{
        document.getElementById('auth_check').checked=true;
    }
    
    saveSettings();
}
function setPasswd(){
    var passwd = document.getElementById('passwd').value;
    if(passwd.length<5){
        $('#password_set_label').html(translate("short_passwd"));
    }else{
        var hash = CryptoJS.MD5(document.getElementById('passwd').value);
        setPref('passwd',hash);
        document.getElementById('auth_check').checked=true;
        setPref('AuthEnabled',true);
        $('#password_set_label').html(translate('password_set_label'));
        saveSettings();
    }
    
    document.getElementById('passwd').value="";
    $('#password_set_label').show();
    
    
}
function setBlockSite(){
    setPref("EnabledBlockSite",document.getElementById('enable_check').checked);
    if(getPref('EnabledBlockSite')){
        chrome.browserAction.setIcon({
            path:"img/icon19.png"
        });
    }else{
        chrome.browserAction.setIcon({
            path:"img/icon19-grayscale.png"
        });
    }
    saveSettings();
}
function hideIcon(){
    if(document.getElementById('warning_check').checked){
        chrome.tabs.getAllInWindow(null, function(tabs) {
            for(var i = 0; i < tabs.length; i++) {
                console.log(tabs[i])
                chrome.pageAction.hide(tabs[i].id);
            }
        });
    }else{
        chrome.tabs.getAllInWindow(null, function(tabs) {
            for(var i = 0; i < tabs.length; i++) {
                console.log(tabs[i])
                chrome.pageAction.show(tabs[i].id);
            }
        });
    }
    saveSettings();
}
function addPageToStorage(){
    var pageToBlock = document.getElementById('block_page').value;
    if(isURL(pageToBlock)){
        
    
        $('#page_exist').hide();
        $('#wrong_url').hide();
        pageToBlock = pageToBlock.toLowerCase();
        $('#block_page').val("");
        //console.log(pageToBlock);
        if(pageToBlock=="" || pageToBlock==null) return;
        pageToBlock=cropUrl(pageToBlock);
        var splited = pageToBlock.split(".");
        if(splited[0]=="www"){
            splited.splice(0,1);
            pageToBlock=splited.join(".");
        }
    
        if(localStorage.BlockedSites){
            var BlockedSites = JSON.parse(localStorage.BlockedSites);
            for(var i=0;i<BlockedSites.length;i++){
                if(BlockedSites[i].url==pageToBlock || "www." + BlockedSites[i].url==pageToBlock
                    || BlockedSites[i].url=="www."+pageToBlock) {
                    $('#page_exist').show();
                    return;
                } 
            }
            var Site=new Object();
            Site.url=pageToBlock;
            Site.count=0;
            BlockedSites.push(Site);
            localStorage['BlockedSites']=JSON.stringify(BlockedSites);
        }else{
            var BlockedSites=[];
            var Site=new Object();
            Site.url=pageToBlock;
            Site.count=0;
            BlockedSites.push(Site);
            localStorage['BlockedSites']=JSON.stringify(BlockedSites);
        }
    }else{
        //console.log('wrong url');
        $('#wrong_url').show();
    }
    pageToBlock.value="";
}
function removeFromList(index){
    var BlockedSites = JSON.parse(localStorage.BlockedSites);
    BlockedSites.splice(index, 1);
    localStorage['BlockedSites']=JSON.stringify(BlockedSites);
    renderBlockList();
    
}
function renderStats(){
    if(getPref('stats')){
        document.getElementById('stats_check').setAttribute('checked','checked');
    }
}
function renderBlockList(){
    var BlockedSites = JSON.parse(localStorage.BlockedSites);
    var ul = document.createElement('ul');
    var blockedList = document.getElementById('blockedlist');
    blockedList.innerHTML="";
    blockedList.appendChild(ul);
    for(var i =BlockedSites.length-1;i>=0;i--){
        var li = document.createElement('li');
        var img = document.createElement('img');
        var tmp = document.createElement('div')
        
        img.setAttribute('src', 'img/remove.gif');
        img.setAttribute('id', 'remove'+i);
        //input.setAttribute('value', translate('remove'));
        tmp.appendChild(img);
        li.innerHTML =tmp.innerHTML + BlockedSites[i].url;
        ul.appendChild(li);
        img=document.getElementById('remove'+i);
        li.addEventListener("click", (function(index){
            return function () {
                removeFromList(index);
            };
        })(i), false);
    }
}
function renderNonAuthZone(){
    document.getElementById('h1').innerHTML = translate('optionstitle');
    document.getElementById('left_h2').innerHTML = '<img src="img/icon40.png" alt="wips" />' + translate('options');
}
function renderAuthZone(){
    
    //titles
    $('#h1').html(chrome.app.getDetails().name);
    document.getElementById('func_title').innerHTML = translate('func_title');
    document.getElementById('auth_title').innerHTML = translate('auth_title');
    if(getPref('whitelist')){
        document.getElementById('list_title').innerHTML = translate('whitelist_title');
    }else{
        document.getElementById('list_title').innerHTML = translate('blacklist_title');
    }
    
    //labels
    document.getElementById('stats_label').innerHTML = translate('stats');
    document.getElementById('blacklist_label').innerHTML = translate('blacklist');
    document.getElementById('whitelist_label').innerHTML = translate('whitelist');
    document.getElementById('auth_label').innerHTML=translate('auth_label');
    //document.getElementById('warning_label').innerHTML=translate('hide_label');
    document.getElementById('enable_label').innerHTML=translate('enable_label');
    $('#saved_text').html(translate('saved_text'));
    $('#page_exist').html(translate('page_exist'));
    $('#wrong_url').html(translate('wrong_url'));
    
    
    document.getElementById('enable_check').addEventListener("change",function(){  
        setBlockSite();  
    },false);
//    document.getElementById('warning_check').addEventListener("change",function(){  
//        hideIcon();  
//    },false);
    
    
    //checks
    document.getElementById('whitelist_check').checked=getPref('whitelist');
    document.getElementById('blacklist_check').checked=!getPref('whitelist');
    
    if(!localStorage.EnabledBlockSite){
        document.getElementById('enable_check').checked=true;
        setBlockSite();
    } else{
        document.getElementById('enable_check').checked=getPref('EnabledBlockSite');
    }
//    if(!localStorage.hideIcon){
//        document.getElementById('warning_check').checked=true;
//        hideIcon();
//    } else{
//        document.getElementById('warning_check').checked=getPref('hideIcon');
//    }
    document.getElementById('auth_check').checked=getPref('AuthEnabled');
    document.getElementById('set_password').value=translate('set_password');
    
    
    //listeners
   
    document.getElementById('stats_check').addEventListener("change",function(){  
        setStats();  
    },false);
    document.getElementById('blacklist_check').addEventListener("change",function(){
        setList();
    } , false);
    
    document.getElementById('whitelist_check').addEventListener("change",function(){
        setList();
    } , false);
    document.getElementById('auth_check').addEventListener("change",function(){  
        setAuth();  
    },false);
    document.getElementById('set_password').addEventListener("click",function(){  
        setPasswd();  
    },false);
    
    
    //buttons
    $('#close_button').val(translate('close_button'));
    $('#close_button').click(function(){
        if(getPref('AuthEnabled') && (getPref('passwd')=="" || getPref('passwd')==undefined )){
            setPref('AuthEnabled',false);
        }else{
            
        }
        chrome.tabs.getCurrent(function(tab){
            chrome.tabs.getAllInWindow(null, function(tabs) {
                for(var i = 0; i < tabs.length; i++) {
                    if(tabs[i].id==tab.id) continue;
                    chrome.tabs.update(tabs[i].id, {
                        url: tabs[i].url
                    });
                }
                window.close();
            });
        });
    })
    
    var addPage=document.getElementById('add_page');
    addPage.setAttribute('value', translate('add_page'))
    addPage.addEventListener("click",function(){
        addPageToStorage();
        
        renderBlockList();
    },false);
    $('#block_page').keydown(function(e){
        if(e.keyCode==13){
            
            addPageToStorage();
            renderBlockList();
        }
    });

}
function init(){
    renderNonAuthZone();
    renderAuthZone();
    renderStats();
    renderBlockList();
}
function login(){
    $('#login_password').focus();
    document.getElementById('login_label').innerHTML=translate('login_label');
    var auth=document.getElementById('login_button');
    auth.setAttribute('value', translate('login_button'))
    auth.addEventListener("click",function(){
        if(passwordIsCorrect()){
            document.getElementById('login').style.visibility="hidden";
            document.getElementById('auth_zone').style.visibility="visible";
            init();
        }else{
            document.getElementById('login_label').innerHTML=translate('wrongpasswd');
        }
    },false);
    $('#login_password').keydown(function(e){
        if(e.keyCode==13){
            if(passwordIsCorrect()){
                document.getElementById('login').style.visibility="hidden";
                document.getElementById('auth_zone').style.visibility="visible";
                init();
            }else{
                document.getElementById('login_label').innerHTML=translate('wrongpasswd');
            }
        } 
    });
}
function passwordIsCorrect(){
    var passwd=document.getElementById('login_password').value;
    var hash=CryptoJS.MD5(passwd);
    //console.log(hash + "===" + getPref("passwd"));
    if(getPref("passwd") == hash){
        return true;
    }else{
        return false;
    }
}

window.addEventListener("load",function(){
    
    if(getPref('AuthEnabled')){
        document.getElementById('auth_zone').style.visibility="hidden";
        renderNonAuthZone();
        login();
    }else{
        document.getElementById('login').style.visibility="hidden";
        init();
    }
    
},false);
setInterval(function(){
    renderBlockList();
},2000);