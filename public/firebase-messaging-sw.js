importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyCyQakgCxDFYw31wXdSO4G39cIfumf4-vw",
  authDomain: "laziri.com",
  databaseURL: "https://projects-cd348-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "projects-cd348",
  storageBucket: "projects-cd348.appspot.com",
  messagingSenderId: "755621396570",
  appId: "1:755621396570:web:5c8dde99a5b583bfec9863",
  measurementId: "G-RMEMK35D5N"
});

class CustomPushEvent extends Event {
  constructor(data) {
    super("push");
    Object.assign(this, data);
    this.custom = true;
  }
}

self.addEventListener("push", (e) => {
  if (e.custom) return;

  const oldData = e.data;

  const newEvent = new CustomPushEvent({
    data: {
      ehheh: oldData.json(),
      json() {
        const newData = oldData.json();
        newData.data = {
          ...newData.data,
          ...newData.notification,
        };
        delete newData.notification;
        return newData;
      },
    },
    waitUntil: e.waitUntil.bind(e),
  });

  e.stopImmediatePropagation();

  dispatchEvent(newEvent);
});

if (firebase.messaging.isSupported()) {
  firebase.messaging().onBackgroundMessage((message) => {
    
    const showNotification = (language) => {
    
      const { title, body, icon, ...restMessage } = message.data;
      
      const fr = language == "fr";

      const translate = () => {
        if (title == "newOrder") {
          return {
            title: fr?"Nouvelle commande":"طلبية جديدة",
            body: fr?`Vous avez une commande avec le code ${body.substring(0,6)}`:`لديك طلبية تحمل الرمز ${body.substring(0,6)}`,
          };
        } else if (title == "storeCanceledOrder") {
          return {
            title: fr?"Commande annulée":"تم إلغاء الطلبية",
            body: fr?
            `${body.substring(6)} a annulé la commande avec le code ${body.substring(0,6)}`:
            `قام متجر ${body.substring(6)} بإلغاء الطلبية التي تحمل الرمز ${body.substring(0,6)}`,
          };
        } else if (title == "userCanceledOrder") {
          return {
            title: fr?"Commande annulée":"تم إلغاء الطلبية",
            body: fr?
            `La commande avec le code ${body.substring(0,6)} a été annulée.`:
            `تم إلغاء الطلبية التي تحمل الرمز ${body.substring(0,6)}`,
          };
        } else if (title == "orderDelivered") {
          return {
            title: fr?"La commande a été livrée":"تم إيصال الطلبية",
            body: fr?
            `${body.substring(6)} a livré la commande avec le code ${body.substring(0,6)}`:
            `قام متجر ${body.substring(6)} بإيصال الطلبية التي تحمل الرمز ${body.substring(0,6)}`,
          };
        } else {
          return message.data;
        }
      };
      
      const options = {
        data: restMessage,
        body: translate().body,
        icon: "img/icons/android-chrome-192x192.png",
        badge: "img/icons/badge-48x48.png",
        vibrate: [400, 100, 400, 100, 400, 100, 400],
        dir: fr?"ltr":"rtl",
        lang: fr?"fr":"ar",
      };

      return self.registration.showNotification(translate().title, options);
    };

    try {
      var db;
      const request = indexedDB.open("db");
      request.onsuccess = () => {
        db = request.result;
        let objectStore = db.transaction("account").objectStore("account").get("userId");
        objectStore.onsuccess = () => {
          try {
            showNotification(objectStore.result.language);
          } catch (error) {
            showNotification("ar");
          }
        };
        objectStore.onerror = () => {
          showNotification("ar");
        };
      };
      request.onerror = () => {
        showNotification("ar");
      };
    } catch (error) {
      showNotification("ar");
    }
  });

  self.addEventListener("notificationclick", (event) => {
    
    if (event.notification.data.url) {
      self.clients.openWindow(event.notification.data.url);
    } else {
      self.clients.openWindow(event.currentTarget.origin);
    }

    event.notification.close();

  });

}
