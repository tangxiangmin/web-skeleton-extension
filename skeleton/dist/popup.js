!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=18)}({0:function(e,t){let n=[];chrome.runtime&&chrome.runtime.onMessage.addListener((e,t,r)=>{let{command:o,content:i}=e;Array.isArray(n[o])&&n[o].forEach(e=>{e(i,t,r)})}),e.exports={on(e,t,r=!1){n[e]||(n[e]=[]),"function"==typeof t&&(n[e].length&&console.log(`${e} 事件在其他地方已经监听，默认会覆盖其他地方的事件处理函数，如需要请传入第三个参数mult为true`),r?n[e].push(t):n[e]=[t])},emit(e,t,n){n?chrome.tabs.sendMessage(n,{command:e,content:t}):chrome.runtime.sendMessage({command:e,content:t})},showAllListener(){console.log(n)}}},18:function(e,t,n){let r=n(0),o=n(19);new Vue({el:"#app",data:()=>({params:{root:"body",config:JSON.stringify({ignore:"",selector:{block:{include:""},list:{exclude:""},button:{}}})}}),methods:{createSkeleton(){let e=this.params;o.getCurrentTab().then(t=>{let{id:n}=t,o={...e};try{o.config=JSON.parse(o.config||"")||{}}catch(e){return void alert("请传入正确的JSON配置项:"+e)}r.emit("createSkeleton",e,n)})}}})},19:function(e,t){e.exports={showTip(e,t){let n=Object.assign({type:"basic",iconUrl:"images/icon38.png",title:"",message:""},t);(e=e.replace("\n"," ")).length>35?n.message=e.substr(0,35)+"...":n.message=e;chrome.notifications.create("@@notify",n),setTimeout(()=>{chrome.notifications.clear("@@notify")},5e3)},sendMessageToCurrentTab:e=>new Promise((t,n)=>{chrome.tabs.query({active:!0,currentWindow:!0},function(n){chrome.tabs.sendMessage(n[0].id,e,function(e){t(e)})})}),getCurrentTab:()=>new Promise((e,t)=>{chrome.tabs.query({active:!0,currentWindow:!0},function(t){e(t[0])})}),reloadAndRefreshCurrentTab(){this.getCurrentTab().then(e=>{chrome.tabs.reload(e.id),chrome.runtime.reload()})},openExtensionPage:e=>`chrome-extension://${chrome.runtime.id}/${e}.html`}}});