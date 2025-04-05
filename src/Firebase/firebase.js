// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyC998t2rePEe46_ZsRBzcJWpnKg6ea__-0",
    authDomain: "votesphere-d8fac.firebaseapp.com",
    projectId: "votesphere-d8fac",
    storageBucket: "votesphere-d8fac.firebasestorage.app",
    messagingSenderId: "556589487791",
    appId: "1:556589487791:web:81020da6ae2cb46e6e665a",
    measurementId: "G-J9WL3F3JJX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const storage = getStorage(app);

export { storage };