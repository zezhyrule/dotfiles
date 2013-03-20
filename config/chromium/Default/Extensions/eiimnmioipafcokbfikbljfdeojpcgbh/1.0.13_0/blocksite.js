

var BlockedSites;
var warningPage = chrome.extension.getURL('blocked.html');

function IsAllowed(url){
    var array=url.split("/");
    if(array[0]=="chrome:" || array[0]=="chrome-extension:" ||array[0]=="chrome-devtools:" )
        return true;
    
    for(var i=0;i<BlockedSites.length;i++){
        if(BlockedSites[i].url==array[2] || "www."+BlockedSites[i].url==array[2])
            return true;
    }
    
    return false;
}
function IsBlocked(url){
    var array=url.split("/");
    url=array[2];
    //console.log(url);
    for(var i=0; i < BlockedSites.length;i++){
        if(BlockedSites[i].url==url){
            wips.setPref("currentBlockedIndex",i);
            return true;
        }
        if("www."+BlockedSites[i].url==url){
            wips.setPref("currentBlockedIndex",i);
            return true;
        }
        if(BlockedSites[i].url=="www."+url){
            wips.setPref("currentBlockedIndex",i);
            return true;
        }
    }
    return false;
}
var contextClick=function(e){
    var url=e.pageUrl.toLowerCase();
    if(isURL(url)){
        
        url=cropUrl(url);
        var splited = url.split(".");
        if(splited[0]=="www"){
            splited.splice(0,1);
            url=splited.join(".");
        }        
        if(localStorage.BlockedSites){
            var BlockedSites = JSON.parse(localStorage.BlockedSites);
            for(var i=0;i<BlockedSites.length;i++){
                if(BlockedSites[i].url==url || "www." + BlockedSites[i].url==url
                    || BlockedSites[i].url=="www."+url) {                    
                    return;
                } 
            }
            var Site=new Object();
            Site.url=url;
            Site.count=0;
            BlockedSites.push(Site);
            localStorage['BlockedSites']=JSON.stringify(BlockedSites);
        }else{
            var BlockedSites=[];
            var Site=new Object();
            Site.url=url;
            Site.count=0;
            BlockedSites.push(Site);
            localStorage['BlockedSites']=JSON.stringify(BlockedSites);
        }  
    }
}
    


///LISTENERS
chrome.contextMenus.create({
    "type":"normal",
    "title":"Block this site",
    "contexts":["page"],
    "onclick":contextClick
});


chrome.tabs.onCreated.addListener(function(tab) {
    //    if(tab.status=="complete"){
    //console.log("created");
    if(wips.getPref("EnabledBlockSite")){
        if(wips.getPref("BlockedSites")==undefined)return;
        BlockedSites=JSON.parse(wips.getPref("BlockedSites"));
        if(tab.url==warningPage){
            return;
        
        //                console.log("tab.url==warningPage")
        //                if(wips.getPref("whitelist")){
        //                    var count=wips.getPref("whitelistCount");
        //                    count++;
        //                    wips.setPref("whitelistCount",count);
        //                    wips.setPref('BlockedSites',JSON.stringify(BlockedSites));
        //                }else{
        //                    var index=getPref("currentBlockedIndex");
        //                    BlockedSites[index].count++;
        //                    wips.setPref('BlockedSites',JSON.stringify(BlockedSites));
        //                }
        //                wips.setPref('BlockedSites',JSON.stringify(BlockedSites));
                
        }else{
            if(wips.getPref("BlockedSites")==undefined)return;
            BlockedSites=JSON.parse(wips.getPref("BlockedSites"));
            
            if(wips.getPref("whitelist")){
                if(!IsAllowed(tab.url)){
                    //                        var count=wips.getPref("whitelistCount");
                    //                        count++;
                    //                        wips.setPref("whitelistCount",count);
                    wips.setPref("actualBlockedSite",cropUrl(tab.url));
                    chrome.tabs.update(tab.id, {
                        url: warningPage
                    });
                }
            }else{
                if(IsBlocked(tab.url)){
                        
                    wips.setPref('BlockedSites',JSON.stringify(BlockedSites));
                    chrome.tabs.update(tab.id, {
                        url: warningPage
                    });
                }
            }
        }
    }
//    }
});

chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
    
    if(changeInfo.status=="loading"){
        //console.log("update: ");
        if(wips.getPref("EnabledBlockSite")){
            if(wips.getPref("BlockedSites")==undefined)return;
            BlockedSites=JSON.parse(wips.getPref("BlockedSites"));
            
            
            if(tab.url==warningPage){
                return;
            //                console.log("tab.url==warningPage")
            //                if(wips.getPref("whitelist")){
            //                    var count=wips.getPref("whitelistCount");
            //                    count++;
            //                    wips.setPref("whitelistCount",count);
            //                    wips.setPref('BlockedSites',JSON.stringify(BlockedSites));
            //                }else{
            //                    var index=getPref("currentBlockedIndex");
            //                    BlockedSites[index].count++;
            //                    wips.setPref('BlockedSites',JSON.stringify(BlockedSites));
            //                }
                
            }else{
                
                if(wips.getPref("BlockedSites")==undefined)return;
                BlockedSites=JSON.parse(wips.getPref("BlockedSites"));
                
                if(wips.getPref("whitelist")){
                    if(!IsAllowed(tab.url)){
                        //                        var count=wips.getPref("whitelistCount");
                        //                        count++;
                        //                        wips.setPref("whitelistCount",count);
                        wips.setPref("actualBlockedSite",cropUrl(tab.url));
                        chrome.tabs.update(tab.id, {
                            url: warningPage
                        });
                    }
                }else{
                    if(IsBlocked(tab.url)){
                        wips.setPref('BlockedSites',JSON.stringify(BlockedSites));
                        chrome.tabs.update(tab.id, {
                            url: warningPage
                        });
                    }
                }
            }
        } 
    }
});


//chrome.tabs.executeScript(null, {
//            code: "chrome.extension.sendRquest({ref: document.location.href}, function(response) {})"
//        });
//        
//        
//chrome.tabs.onActiveChanged.addListener(function(tabId,changeInfo){
//    chrome.tabs.get(tabId, function(tab){
//        console.log(tab);
//    });
//});



////var warningPage = chrome.extension.getURL('blocked.html');
//chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
//    switch(request.method){
//        case "getPrefs":{
//            sendResponse({
//                BlockedSites:wips.getPref("BlockedSites"),
//                EnabledBlockSite:wips.getPref("EnabledBlockSite"),
//                whitelist:wips.getPref("whitelist")
//            });
//            break;
//        }
//        case "urlIndex":{
//            var BlockedSites=JSON.parse(wips.getPref("BlockedSites"));
//            BlockedSites[request.urlIndex].count++;
//            wips.setPref('BlockedSites',JSON.stringify(BlockedSites));
//            wips.setPref("currentBlockedIndex",request.urlIndex);
//            sendResponse({});
//            break;
//        }
//        case "whitelistCount":{
//            var count=wips.getPref("whitelistCount");
//            count++;
//            wips.setPref("whitelistCount",count);
//            wips.setPref("actualBlockedSite",request.blockedSite);
//            sendResponse({});     
//        }
//        case "navigateTo":{
//            if(sender.tab.index!=-1){
//                console.log(sender);
//            
//                if(warningPage==chrome.extension.getURL('blocked.html')){
//                    warningPage=chrome.extension.getURL('asd.html')
//                }else{
//                    warningPage=chrome.extension.getURL('blocked.html')
//                }
//                chrome.tabs.update(sender.tab.id, {
//                    url: warningPage
//                });
//            }
//        }
//    }
//});

function addPage(url){
    url=cropUrl(url);
    if(localStorage.BlockedSites){
        var BlockedSites = JSON.parse(wips.getPref("BlockedSites"));
        for(var i=0;i<BlockedSites.length;i++){
            if(BlockedSites[i].url==url || "www." + BlockedSites[i].url==url
                || BlockedSites[i].url=="www."+url) {                    
                return;
            } 
        }
        var Site=new Object();
        Site.url=url;
        Site.count=0;
        BlockedSites.push(Site);
        wips.setPref("BlockedSites",JSON.stringify(BlockedSites));
    }else{
        var BlockedSites=[];
        var Site=new Object();
        Site.url=url;
        Site.count=0;
        BlockedSites.push(Site);
        wips.setPref("BlockedSites",JSON.stringify(BlockedSites));
    }
}
