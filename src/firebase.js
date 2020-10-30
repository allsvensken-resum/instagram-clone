import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyC8LWdnbOcrLaOdozdX1bgw7Ol7NotpJ3s",
  authDomain: "instagram-clone-deploy.firebaseapp.com",
  databaseURL: "https://instagram-clone-deploy.firebaseio.com",
  projectId: "instagram-clone-deploy",
  storageBucket: "instagram-clone-deploy.appspot.com",
  messagingSenderId: "140933495687",
  appId: "1:140933495687:web:b09bb189f6e28130977122"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const storage = firebase.storage();
const auth = firebase.auth();
const storageRef = storage.ref();

export { db, storage, auth, storageRef };