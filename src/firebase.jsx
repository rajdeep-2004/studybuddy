import {initializeApp} from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAmvF05CiYXoSFmBfVLYew7q10Vb2mFHsw",
  authDomain: "studybuddycapstone-88b2c.firebaseapp.com",
  projectId: "studybuddycapstone-88b2c",
  storageBucket: "studybuddycapstone-88b2c.firebasestorage.app",
  messagingSenderId: "290630671342",
  appId: "1:290630671342:web:767d36bbb1ed2804368cff",
  measurementId: "G-606LB9ZQEY"
};

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app);
export const storage = getStorage(app);
