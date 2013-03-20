// WIPS v2.0

var wips = {
    new_client_id: undefined,
    otherExt: [],
    delayId: [],
    // OBECNE FCE
    uuidGenerator: function(){
        var S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    },
    getPref: function(name){
        var value = localStorage[name];
        if(value == 'false') 
            return false; 
        else  
            return value;
    },
    setPref: function(name,value){
        localStorage[name] = value;
    },
    openUrl: function(url){
        chrome.tabs.create({
            url: url
        });
    },
    // HROMADNE CHOVANI
    detectAllExt: function(){
        //spusteni requestu pro vsechny aktivni extension krom aktualni
        chrome.management.getAll(function(list){
            var actualId = chrome.i18n.getMessage('@@extension_id');
            for(var i in list){
                var extInf = list[i];
                if(extInf.enabled && !extInf.isApp && extInf.id!=actualId){
                    chrome.extension.sendRequest(extInf.id,{getTargetData: true},function(response){
                        if(response.control == '7jsfj942j1asf32j8cj4gf6n5f1g8fgn1fg'){
                            if(response.id){
                                wips.otherExt[wips.otherExt.length] = {
                                    id: response.id,
                                    active: response.active
                                };
                            }
                            wips.delayId[wips.delayId.length] = response.delay_id;
                        }
                    });
                }
            }
        });
    },
    setThisExt: function(){
        //zadna dalsi ext + neni id -> registrace, nast. aktivni 
        if(!this.getPref('client_id') && this.otherExt.length==0){
            this.setPref('active',true);
            this.setPref('delay_id',1);
            this.new_client_id = this.uuidGenerator();
            wipstats.register();
        }
        //zadna dalsi ext + neni aktivni -> nast. aktivni
        else if(!this.getPref('active') && this.otherExt.length==0){
            this.setPref('active',true);
        }
        //min 1 dalsi ext -> prevzeti id + inverzni nast. aktivni
        else if(this.otherExt.length>0){
            var isOtherActive = false;
            for(var j in this.otherExt){
                if(this.otherExt[j].active){
                    this.setPref('client_id',this.otherExt[j].id);
                    isOtherActive = true;
                }
            }
            if(isOtherActive){
                this.setPref('active',false);
            }
            else{
                this.setPref('active',true);
            }
            var actualDelayId = parseInt(this.getPref('delay_id'));
            var maxDelayId = 0;
            var toMax = false;
            for(var i in this.delayId){
                if(this.delayId[i] > maxDelayId)
                    maxDelayId = this.delayId[i];
                if(this.delayId[i]==actualDelayId  && actualDelayId)
                    toMax = true;
            }
            if(actualDelayId){
                if(toMax)
                    this.setPref('delay_id',maxDelayId+1);
            }else{
                this.setPref('delay_id',maxDelayId+1);
            }    
        }
        //ostatni
        if(!this.getPref('extension_id') || this.getPref('version')!=chrome.app.getDetails().version){
            this.setPref('version',chrome.app.getDetails().version);
            setTimeout(function(){
                wipstats.registerExt();
            },20000);
        }
        if(this.getPref('active')){
            setTimeout(function(){
                wipstats.checkId();
            },25000);
        }
    },
    // INIT
    init: function(){
        if(!this.getPref('extension_id')){
            this.setPref('stats',true);
            if(config['thanks_url'])
                this.openUrl(config['thanks_url']);
        }
        var delay = 1000;
        if(this.getPref('delay_id')){
            var delayTmp = parseInt(this.getPref('delay_id'));
            delay = delayTmp * 3000;
        }
        setTimeout(function(){
            wips.detectAllExt();
        },delay);
        setTimeout(function(){
            wips.setThisExt();
        },delay+2000);
    }
}

// POSLUCHACE

// hromadne chovani
chrome.extension.onRequestExternal.addListener(function(request, sender, sendResponse){
    if(request.getTargetData)
        sendResponse({
            control: '7jsfj942j1asf32j8cj4gf6n5f1g8fgn1fg',
            id: wips.getPref('client_id'),
            active: wips.getPref('active'),
            delay_id: parseInt(wips.getPref('delay_id'))
        });
});

// load
window.addEventListener("load",function(){  
    wips.init();  
},false);