// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: "inventory-manage-783ee.firebaseapp.com",
  projectId: "inventory-manage-783ee",
  storageBucket: "inventory-manage-783ee.appspot.com",
  messagingSenderId: "376966641119",
  appId: "1:376966641119:web:5303f45473ab642c2a406a",
  measurementId: "G-FMT152XX07"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };