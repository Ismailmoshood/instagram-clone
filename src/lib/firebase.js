import Firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

// import { seedDatabase } from '../seed';

const config = {
   apiKey: "AIzaSyBX3xW9uRNUXf8LTKIC7JAO7MgJ1rLOnU8",
  authDomain: "instaclone-app-89305.firebaseapp.com",
  projectId: "instaclone-app-89305",
  storageBucket: "instaclone-app-89305.appspot.com",
  messagingSenderId: "534236981498",
  appId: "1:534236981498:web:03abb6bd5f0a32511c8143"
};

const firebase = Firebase.initializeApp(config);
const { FieldValue } = Firebase.firestore;
// const db = getFirestore(firebaseApp);

export const storage = firebase.storage();
// seedDatabase(firebase)

export { firebase, FieldValue}