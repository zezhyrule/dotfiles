(function(){function e(){return window.chrome!==undefined}function t(){return window.safari!==undefined}function n(n){e()?window.chrome.extension.onMessage?chrome.extension.onMessage.addListener(n):chrome.extension.onRequest.addListener(n):t()&&window.safari.self.addEventListener("message",function(e){n(e.message,e,function(){})})}function r(n,r){e()?chrome.extension.sendMessage?chrome.extension.sendMessage(n,r):chrome.extension.sendRequest(n,r):t()&&(r&&(n.__cbId=Callbacker.addCb(r)),safari.self.tab.dispatchMessage("message",n))}function i(){r({action:"getSetting",key:"keyboard-shortcut-add"},function(e){s(),key(e.value,function(e,t){var n={id:"keyboard-shortcut",action:"addURL",showSavedToolbarIcon:!0,title:document.title,url:window.location.toString()};r(n,function(e){window.thePKT_BM.handleMessageResponse(e)})})})}function s(){key.deleteScope("all")}function o(){r({action:"getSetting",key:"keyboard-shortcut"},function(e){e.value==="true"||e.value===!0?i():(e.value==="false"||e.value===!1)&&key.deleteScope("all")})}if(t()&&window.top!=window)return;(function(e){function f(e,t){var n=e.length;while(n--)if(e[n]===t)return n;return-1}function c(e){for(t in r)r[t]=e[l[t]]}function h(e,t){var i,o,u,l,h;i=e.keyCode,f(a,i)==-1&&a.push(i);if(i==93||i==224)i=91;if(i in r){r[i]=!0;for(u in s)s[u]==i&&(v[u]=!0);return}c(e);if(!v.filter.call(this,e))return;if(!(i in n))return;for(l=0;l<n[i].length;l++){o=n[i][l];if(o.scope==t||o.scope=="all"){h=o.mods.length>0;for(u in r)if(!r[u]&&f(o.mods,+u)>-1||r[u]&&f(o.mods,+u)==-1)h=!1;(o.mods.length==0&&!r[16]&&!r[18]&&!r[17]&&!r[91]||h)&&o.method(e,o)===!1&&(e.preventDefault?e.preventDefault():e.returnValue=!1,e.stopPropagation&&e.stopPropagation(),e.cancelBubble&&(e.cancelBubble=!0))}}}function p(e){var t=e.keyCode,n,i=f(a,t);i>=0&&a.splice(i,1);if(t==93||t==224)t=91;if(t in r){r[t]=!1;for(n in s)s[n]==t&&(v[n]=!1)}}function d(){for(t in r)r[t]=!1;for(t in s)v[t]=!1}function v(e,t,r){var i,o,a,f;r===undefined&&(r=t,t="all"),e=e.replace(/\s/g,""),i=e.split(","),i[i.length-1]==""&&(i[i.length-2]+=",");for(a=0;a<i.length;a++){o=[],e=i[a].split("+");if(e.length>1){o=e.slice(0,e.length-1);for(f=0;f<o.length;f++)o[f]=s[o[f]];e=[e[e.length-1]]}e=e[0],e=u(e),e in n||(n[e]=[]),n[e].push({shortcut:i[a],scope:t,method:r,key:i[a],mods:o})}}function m(e){return typeof e=="string"&&(e=u(e)),f(a,e)!=-1}function g(){return a.slice(0)}function y(e){var t=(e.target||e.srcElement).tagName;return t!="INPUT"&&t!="SELECT"&&t!="TEXTAREA"}function b(e){i=e||"all"}function w(){return i||"all"}function E(e){var t,r,i;for(t in n){r=n[t];for(i=0;i<r.length;)r[i].scope===e?r.splice(i,1):i++}}function S(e,t,n){e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent&&e.attachEvent("on"+t,function(){n(window.event)})}function T(){var t=e.key;return e.key=x,t}var t,n={},r={16:!1,18:!1,17:!1,91:!1},i="all",s={"⇧":16,shift:16,SHIFT:16,"⌥":18,alt:18,option:18,OPTION:18,"⌃":17,ctrl:17,control:17,CTRL:17,CONTROL:17,"⌘":91,command:91},o={backspace:8,tab:9,clear:12,enter:13,"return":13,esc:27,escape:27,space:32,left:37,up:38,right:39,down:40,del:46,"delete":46,home:36,end:35,pageup:33,pagedown:34,",":188,".":190,"/":191,"`":192,"-":189,"=":187,";":186,"'":222,"[":219,"]":221,"\\":220},u=function(e){return o[e]||e.toUpperCase().charCodeAt(0)},a=[];for(t=1;t<20;t++)s["f"+t]=111+t;var l={16:"shiftKey",18:"altKey",17:"ctrlKey",91:"metaKey"};for(t in s)v[t]=!1;S(document,"keydown",function(e){h(e,i)}),S(document,"keyup",p),S(window,"focus",d);var x=e.key;e.key=v,e.key.setScope=b,e.key.getScope=w,e.key.deleteScope=E,e.key.filter=y,e.key.isPressed=m,e.key.getPressedKeyCodes=g,e.key.noConflict=T,typeof module!="undefined"&&(module.exports=key)})(this),n(function(e,t,n){e.action==="settingChanged"&&(e.key==="keyboard-shortcut"||e.key==="keyboard-shortcut-add")&&o()}),o()})();