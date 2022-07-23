import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import "firebase/performance";
import "firebase/messaging";
import * as geofirestore from "geofirestore";

const firebaseConfig = {
  apiKey: "AIzaSyCyQakgCxDFYw31wXdSO4G39cIfumf4-vw",
  authDomain: "laziri.com",
  databaseURL:
    "https://projects-cd348-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "projects-cd348",
  storageBucket: "projects-cd348.appspot.com",
  messagingSenderId: "755621396570",
  appId: "1:755621396570:web:5c8dde99a5b583bfec9863",
  measurementId: "G-RMEMK35D5N",
};

const app = firebase;
const auth = app.auth;
const db = app.firestore;
const strg = app.storage;
const msg = app.messaging.isSupported() ? app.messaging : false;

app.initializeApp(firebaseConfig);
app.analytics();
app.performance();

const srv = db.FieldValue;
const dbUs = db().collection("users");
const dbSs = db().collection("stores");
const dbOs = db().collection("orders");
const dbPs = db().collection("products");

const GeoFirestore = geofirestore.initializeApp(db());
const geocollection = GeoFirestore.collection("stores");

if (msg) {
  msg().onMessage((message) => {
    if (Notification.permission == "granted") {
      navigator.serviceWorker.getRegistration().then((notice) => {
        const { title, body } = message.data;

        const fr = localStorage.language == "fr";

        const translate = () => {
          if (title == "newOrder") {
            return {
              title: fr ? "Nouvelle commande" : "طلبية جديدة",
              body: fr
                ? `Vous avez une commande avec le code ${body.substring(0, 6)}`
                : `لديك طلبية تحمل الرمز ${body.substring(0, 6)}`,
            };
          } else if (title == "storeCanceledOrder") {
            return {
              title: fr ? "Commande annulée" : "تم إلغاء الطلبية",
              body: fr
                ? `${body.substring(
                    6
                  )} a annulé la commande avec le code ${body.substring(0, 6)}`
                : `قام متجر ${body.substring(
                    6
                  )} بإلغاء الطلبية التي تحمل الرمز ${body.substring(0, 6)}`,
            };
          } else if (title == "userCanceledOrder") {
            return {
              title: fr ? "Commande annulée" : "تم إلغاء الطلبية",
              body: fr
                ? `La commande avec le code ${body.substring(
                    0,
                    6
                  )} a été annulée.`
                : `تم إلغاء الطلبية التي تحمل الرمز ${body.substring(0, 6)}`,
            };
          } else if (title == "orderDelivered") {
            return {
              title: fr ? "La commande a été livrée" : "تم إيصال الطلبية",
              body: fr
                ? `${body.substring(
                    6
                  )} a livré la commande avec le code ${body.substring(0, 6)}`
                : `قام متجر ${body.substring(
                    6
                  )} بإيصال الطلبية التي تحمل الرمز ${body.substring(0, 6)}`,
            };
          } else {
            return message.data;
          }
        };

        let options = {
          title: translate().title,
          body: translate().body,
          icon: "https://bit.ly/3NHsxHo",
          badge: "https://bit.ly/3MyaFxa",
          vibrate: [400, 100, 400, 100, 400, 100, 400],
          dir: fr ? "ltr" : "rtl",
          lang: fr ? "fr" : "ar",
        };
        notice.showNotification(options.title, options);
      });
    }
  });
}

const user = (type, opt) => {
  const data = auth().currentUser;

  if (!type) {
    return data;
  } else if (type == "dbRefUser") {
    let ref = dbUs.doc(data.uid);
    return ref;
  } else if (type == "dbRefStore") {
    let ref = dbSs.doc(data.uid);
    return ref;
  } else if (type == "geopoint") {
    let geoPoint = new db.GeoPoint(opt[0], opt[1]);
    return geoPoint;
  }
};

const getToken = async () => {
  if (msg) {
    let permission = Notification.permission;
    if (permission != "granted") {
      return permission;
    } else {
      try {
        const key =
          "BAlgzP7hIcXuecde1G9fLUkwYNPTjzBWRG_O2zkDdOA0Qa_vtyqEYk0rkcPPXjK2dzN-X9y2VQF0bnKKvhzkQx8";
        let token = await msg().getToken({ vapidKey: key });
        return token;
      } catch (err) {
        return "error";
      }
    }
  } else {
    return "notSupported";
  }
};

const db_path = (collectionId, docId) => {
  if (collectionId && docId) {
    return db().collection(collectionId).doc(docId);
  } else if (collectionId && !docId) {
    return db().collection(collectionId);
  }
};

export {
  db,
  db_path,
  dbUs,
  dbSs,
  dbOs,
  dbPs,
  auth,
  user,
  strg,
  msg,
  srv,
  getToken,
  geocollection,
};
