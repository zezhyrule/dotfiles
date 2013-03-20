function socialStart(){

    var shareUrl;
    
    if(config.webstoreId && config.webstoreId != ''){
        shareUrl = 'https://chrome.google.com/webstore/detail/' + config.webstoreId;
    }else{
        shareUrl = 'http://www.wips.com/showcase';
    }
                            
    document.getElementById('share-facebook-obal').innerHTML = '<iframe src="http://www.facebook.com/plugins/like.php?href=' + encodeURIComponent(shareUrl) + '&amp;send=false&amp;layout=button_count&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font&amp;width=450&amp;height=35&amp;appId=381158701936486" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:450px; height:21px;" allowTransparency="true" id="share-facebook"></iframe>';
    document.getElementById('share-twitter-obal').innerHTML = '<a id="share-twitter" href="https://twitter.com/share" class="twitter-share-button" data-url="' + shareUrl + '" data-text="' + config.tweetText + '">Tweet</a>';
    document.getElementById('share-google-obal').innerHTML = '<div class="g-plusone" id="share-gplus" data-size="medium" data-href="' + shareUrl + '"></div>';
    
    !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
    
    (function(){
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/plusone.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();

}