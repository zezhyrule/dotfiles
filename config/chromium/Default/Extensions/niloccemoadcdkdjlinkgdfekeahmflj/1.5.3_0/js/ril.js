var ril=function(){function r(t){var r=e+t.path,i=t.data||{};i.consumer_key=n,$.ajax({url:r,type:"POST",data:i,success:t.success,error:t.error})}function i(n){n=n||{},cookieAuthAttempted===!1?$.ajax({url:e+"/token",type:"POST",data:{apikey:t},success:function(e){cookieAuthAttempted=1,setSetting("username",e.username),setSetting("token",e.token),n.success&&n.success()},error:function(){cookieAuthAttempted=2,n.failure&&n.failure()}}):cookieAuthAttempted===1?n.success()&&n.success():cookieAuthAttempted===2&&n.failure()&&n.failure()}function s(e){e=e||{};var t=getSetting("username"),n=this;r({path:"/oauth/authorize",data:{grant_type:"token",token:getSetting("token")},success:function(n){var r=n.split("&"),i=r[0].split("=")[1];setSetting("username",t),setSetting("oauth_token",i),setSetting("token",undefined),e.success()},error:function(){e.failure()}})}function o(e){e=e||{},r({path:"/oauth/is_valid_token",data:{access_token:getSetting("oauth_token")},success:function(t){e.success&&e.success()},error:function(t){e.failure&&e.failure()}})}function u(){return getSetting("username")!=undefined&&getSetting("oauth_token")!=undefined}function a(){setSetting("username",undefined),setSetting("oauth_token",undefined),setSetting("tagsFetchedSince",undefined),setSetting("tags",undefined),setSetting("usedTags",undefined),setSetting("password",undefined),setSetting("token",undefined)}function l(e,t,n){if(f)return;f=!0;try{var i=this;r({path:"/oauth/authorize",data:{username:e,password:t,grant_type:"credentials"},success:function(t){var r=t.split("&"),s=r[0].split("=")[1];setSetting("username",e),setSetting("oauth_token",s),f=!1,n.success(),i.afterLogin&&(i.afterLogin(),i.afterLogin=undefined),p()},error:function(){f=!1,n.error.apply(n,Array.apply(null,arguments))}})}catch(s){}}function c(e,t,n){var r={action:"add",url:t,title:e};this.sendAction(r,n)}function h(e,t){t.ref_id&&(e.ref_id=t.ref_id),r({path:"/send",data:{access_token:getSetting("oauth_token"),actions:JSON.stringify([e])},success:function(){t.success()},error:function(e){e.status===401&&a(),t.error(e.status,e)}})}function p(e){if(!u)return;e=e||{};var t=getSetting("tagsFetchedSince");r({path:"/get",data:{access_token:getSetting("oauth_token"),tags:1,taglist:1,since:t?t:0},success:function(t){t.tags&&setSetting("tags",JSON.stringify(t.tags)),setSetting("tagsFetchedSince",t.since),e.success&&e.success()},error:function(t){e.error&&e.error()}})}var e="https://getpocket.com/v3",t=window.safari?"135gbu4epq447VX194TjSfto95A0jbz0":"801p7PR9A5b78x11f4ghRD8CVFdrA689",n=window.safari?"9346-1e342af73fe11d5174042e9d":"7035-d3382df43fe0195174c42f9c";cookieAuthAttempted=!1;var f=!1;return function(){if(!u()){var t=function(){console.log("Migrated user."),p();if(isChrome())getAllTabs(function(e){$.each(e,function(e,t){chrome.browserAction.setPopup({tabId:t.id,popup:""})})});else if(isSafari){var e=safari.extension.toolbarItems;for(var t=0;t<e.length;t++){var n=e[t];n.idenfifier==="pocket"&&n.popover&&(n.popover=undefined),n.validate()}safari.extension.removePopover("com.ideashower.pocket.safari.login.popover")}},n=function(){console.log("Could not migrate user.")},r=getSetting("token");r!==undefined?s({success:t,failure:n}):i({success:function(){console.log("Authorized via cookie."),s({success:t,failure:n})},failure:function(){console.log("Could not authorize.")}})}else console.log("Already authorized.")}(),{isAuthorized:u,login:l,logout:a,add:c,sendAction:h,fetchTags:p,isValidToken:o}}();