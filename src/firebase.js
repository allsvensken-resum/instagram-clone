import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDOctQNyuVXKFaD3f22SfcZoT4Jw0YSAxs",
  authDomain: "instagram-clone-9a95e.firebaseapp.com",
  databaseURL: "https://instagram-clone-9a95e.firebaseio.com",
  projectId: "instagram-clone-9a95e",
  storageBucket: "instagram-clone-9a95e.appspot.com",
  messagingSenderId: "137412251874",
  appId: "1:137412251874:web:765c36b4554a487e660ebb"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const storage = firebase.storage();
const auth = firebase.auth();
const storageRef = storage.ref();

export { db, storage, auth, storageRef };