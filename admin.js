import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


console.log("ADMIN JS IS LOADED");


const firebaseConfig = {

    apiKey: "AIzaSyBPag4SLUqmdfAws0WFLV7FWp3X8_eLPQ",

    authDomain:
        "mentoria-medicina-attend-7d5ca.firebaseapp.com",

    projectId:
        "mentoria-medicina-attend-7d5ca",

    storageBucket:
        "mentoria-medicina-attend-7d5ca.firebasestorage.app",

    messagingSenderId:
        "238479536134",

    appId:
        "1:238479536134:web:3ff9a57dc1cb70dc8c9387"
};


const app =
    initializeApp(firebaseConfig);

console.log(
    "FIREBASE APP INITIALIZED"
);


const auth =
    getAuth(app);

console.log(
    "FIREBASE AUTH INITIALIZED"
);


const db =
    getFirestore(app);

console.log(
    "FIRESTORE INITIALIZED"
);
