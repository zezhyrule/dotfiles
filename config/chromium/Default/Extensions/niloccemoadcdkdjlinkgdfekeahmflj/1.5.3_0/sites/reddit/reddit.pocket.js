(function(){if(isSafari()&&window.top!=window)return;var e="http://www.reddit.com/";$("head").append("<style>.pkt_added {text-decoration:none !important;}</style>");var t={};t.buttons=[{text:"pocket",successText:"saved to pocket",container:"div.entry ul.flat-list",className:"pocket-reddit-button",selector:".pocket-reddit-button",data:function(t){var n=$(t).closest(".entry").find("a.title");if(n===undefined||n.length===0)n=$(t).closest(".entry").find(".first a");var r=$(n).text().trim(),s=$(n).attr("href").trim();return s=i(s,e),{title:r,url:s}}}];var n=function(e){var t=document.createElement("a");t.setAttribute("class",e.className),t.setAttribute("href","#"),$(t).text(e.text);var n=document.createElement("li");return n.appendChild(t),n},r=function(){var e,i=t.buttons.length;for(e=0;e<i;e++){var s=t.buttons[e];$(s.container).each(function(){var e=$(this);if($(e).hasClass("pocket-inserted"))return;var t=$(e).parent().children(".morecomments");if(t.length!==0){var i=t.children("a");i.click(function(){setTimeout(function(){r()},1e3)});return}$(e).addClass("pocket-inserted");var o=n(s);$(e).append(o);var u=s.data;$(o).click(function(t){var n=u(o),r={id:"reddit",action:"addURL",url:n.url,title:n.title};sendMessage(r,function(e){e.status==="success"&&($(o).replaceWith($('<li><a class="'+s.className+' pkt_added">'+s.successText+"</a></li>")),document.body.style.cursor="default"),window.thePKT_BM.handleMessageResponse(e)}),t.preventDefault()})})}},i=function(e,t){if(/^https?:/.test(e))return e;var n=document,r=n.getElementsByTagName("base")[0],i=r&&r.href,s=n.head||n.getElementsByTagName("head")[0],o=r||s.appendChild(n.createElement("base")),u=n.createElement("a"),a;return o.href=t,u.href=e,a=u.href,r?r.href=i:s.removeChild(o),a};addMessageListener(function(e,t,n){e.action==="settingChanged"&&e.key==="reddit"&&(e.value==="true"||e.value===!0)&&r()}),sendMessage({action:"getSetting",key:"reddit"},function(e){(e.value==="true"||e.value===!0)&&r()})})();