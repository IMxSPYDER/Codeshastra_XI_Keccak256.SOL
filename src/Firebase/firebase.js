// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyB-sZKKGEi2RU17rsTBYbaDOM-sIWdFXzQ",
    authDomain: "votesphere-86a61.firebaseapp.com",
    projectId: "votesphere-86a61",
    storageBucket: "votesphere-86a61.firebasestorage.app",
    messagingSenderId: "855335981460",
    appId: "1:855335981460:web:a763ed36841785ee787f81",
    measurementId: "G-NQ2T8DBBPT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const storage = getStorage(app);

export { storage };