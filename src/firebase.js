import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBX62PJArnNNIwwXkayNEQsw-pIn8pAoFc",
  authDomain: "splitwise-88c30.firebaseapp.com",
  databaseURL: "https://splitwise-88c30-default-rtdb.firebaseio.com",
  projectId: "splitwise-88c30",
  storageBucket: "splitwise-88c30.appspot.com",
  messagingSenderId: "120400310351",
  appId: "1:120400310351:web:3f32e835abd0d14c123a3a",
  measurementId: "G-MHH3XP4PYD",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
