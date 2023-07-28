import {initializeApp} from "firebase/app";
import {getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDi7VRfl-OPapOzimTbiTPsGQ5nhA3ceBM",
    authDomain: "vot-app-7edc2.firebaseapp.com",
    databaseURL: "https://vot-app-7edc2-default-rtdb.firebaseio.com",
    projectId: "vot-app-7edc2",
    storageBucket: "vot-app-7edc2.appspot.com",
    messagingSenderId: "19475931826",
    appId: "1:19475931826:web:f1a96e5ca9f18809da1fab"
  };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);


export  {app, db, auth};
