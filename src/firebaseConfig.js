import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA-Gtywr4ktX-JOq6bnIEfLibsh4Tly6-Q",
  authDomain: "movieflix-239fa.firebaseapp.com",
  projectId: "movieflix-239fa",
  storageBucket: "movieflix-239fa.appspot.com",
  messagingSenderId: "1093056072771",
  appId: "1:1093056072771:web:026fda502292cfada058f6",
};

const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);
const auth = getAuth(app);

export {
  app,
  firestore,
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
};
