const firebase = require("firebase");
const admin = require("firebase-admin");

const serviceAccount = require("./credential/account.json");
const firebaseConfig = require("./credential/config.json");

class Firebase {
  constructor(type) {
    this.type = type || "admin";
    this.sdk();
  }

  dbUsers() {
    return admin.firestore().collection("users");
  }

  dbAdmins() {
    return admin.firestore().collection("admins");
  }

  dbProjects() {
    return admin.firestore().collection("projects");
  }

  realtime() {
    return admin.database();
  }

  bucket() {
    return admin.storage().bucket();
  }

  storage() {
    return firebase.storage();
  }

  FieldValue() {
    return admin.firestore.FieldValue;
  }

  firestore() {
    return admin.firestore();
  }

  serverTimestamp() {
    return admin.firestore.Timestamp.now();
  }

  authAdmin() {
    return admin.auth();
  }

  authClient() {
    return firebase.auth();
  }

  sdk() {
    if (this.type === "client") {
      if (!firebase.default.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
    } else {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: firebaseConfig.databaseURL,
          storageBucket: firebaseConfig.storageBucket
        });
      }
    }
  }
}

module.exports = Firebase;
