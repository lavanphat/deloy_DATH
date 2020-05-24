importScripts('https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js');
// import logo from './img/logo-black.png';

const firebaseConfig = {
  apiKey: 'AIzaSyBrA3K8b_fHpjRUtsoM1pR5_zaAXE7Xkr0',
  authDomain: 'fcm-dath.firebaseapp.com',
  databaseURL: 'https://fcm-dath.firebaseio.com',
  projectId: 'fcm-dath',
  storageBucket: 'fcm-dath.appspot.com',
  messagingSenderId: '490276637382',
  appId: '1:490276637382:web:8c49e770945cbd5038e5c7',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  const promiseChain = clients
    .matchAll({
      type: 'window',
      includeUncontrolled: true,
    })
    .then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        windowClient.postMessage(payload);
      }
    })
    .then(() => {
      return registration.showNotification(payload.data.title, {
        body: payload.data.body,
        icon: './d4363adf77d123661ff8d936709d95fd.png',
      });
    });
  return promiseChain;
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
      })
      .then(function (clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url == '/' && 'focus' in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow('/');
      })
  );
});
