import { initializeApp } from "firebase/app"; 
const firebaseConfig = {
    apiKey: "AIzaSyCK1dm17IFDcfwt7dQZ1yRnV618zMA3RR8",
    authDomain: "studybuddy-2004.firebaseapp.com",
    projectId: "studybuddy-2004",
    storageBucket: "studybuddy-2004.firebasestorage.app",
    messagingSenderId: "1034602423130",
    appId: "1:1034602423130:web:0cc46dde830d165b02c963",
    measurementId: "G-1M4EHWY23E"
};

export const app = initializeApp(firebaseConfig) // firebase app connected to firebase account