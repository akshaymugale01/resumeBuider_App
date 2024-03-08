import {getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';



// const firebaseConfig ={
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_PROJECTID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_APPID,
// }


const firebaseConfig = {
  apiKey: "AIzaSyCau3Nh0BH_pLCJ-MRLN2SocA01O07jCe8",
  authDomain: "resumebuild-app.firebaseapp.com",
  projectId: "resumebuild-app",
  storageBucket: "resumebuild-app.appspot.com",
  messagingSenderId: "256942391545",
  appId: "1:256942391545:web:dfc47da1a6e0f47e6d2228",
  measurementId: "G-R6DXS4P8YF"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);


const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
