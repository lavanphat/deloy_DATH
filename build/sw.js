var serviceWorkerOption = {
  "assets": [
    "/d4363adf77d123661ff8d936709d95fd.png",
    "/f85ed116ee572d891840f6d83ecf9e36.png",
    "/04eb8fc57f27498e5ae37523e3bfb2c7.woff",
    "/17629a5dfe0d3c3946cf401e1895f091.ttf",
    "/2feb69ccb596730c72920c6ba3e37ef8.eot",
    "/bundle.js",
    "/vendor.js",
    "/index.html"
  ]
};
        
        !function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/",n(n.s=0)}([function(e,t){importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js"),importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js");firebase.initializeApp({apiKey:"AIzaSyBrA3K8b_fHpjRUtsoM1pR5_zaAXE7Xkr0",authDomain:"fcm-dath.firebaseapp.com",databaseURL:"https://fcm-dath.firebaseio.com",projectId:"fcm-dath",storageBucket:"fcm-dath.appspot.com",messagingSenderId:"490276637382",appId:"1:490276637382:web:8c49e770945cbd5038e5c7"}),firebase.messaging().setBackgroundMessageHandler((function(e){return clients.matchAll({type:"window",includeUncontrolled:!0}).then((function(t){for(var n=0;n<t.length;n++){t[n].postMessage(e)}})).then((function(){return registration.showNotification(e.data.title,{body:e.data.body,icon:"/img/logo-black.png"})}))})),self.addEventListener("notificationclick",(function(e){e.notification.close(),e.waitUntil(clients.matchAll({type:"window"}).then((function(e){for(var t=0;t<e.length;t++){var n=e[t];if("/"==n.url&&"focus"in n)return n.focus()}if(clients.openWindow)return clients.openWindow("/")})))}))}]);