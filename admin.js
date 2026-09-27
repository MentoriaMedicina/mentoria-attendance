import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyBPag4SLUqmdfAws0WFLV7FWp3X8_eLPQ",
    authDomain: "mentoria-medicina-attend-7d5ca.firebaseapp.com",
    projectId: "mentoria-medicina-attend-7d5ca",
    storageBucket: "mentoria-medicina-attend-7d5ca.firebasestorage.app",
    messagingSenderId: "238479536134",
    appId: "1:238479536134:web:3ff9a57dc1cb70dc8c9387",
    measurementId: "G-WEVCZ0JG2K"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


const loginSection =
    document.getElementById("loginSection");

const adminDashboard =
    document.getElementById("adminDashboard");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const loginBtn =
    document.getElementById("loginBtn");

const loginMessage =
    document.getElementById("loginMessage");

const adminEmail =
    document.getElementById("adminEmail");

const logoutBtn =
    document.getElementById("logoutBtn");


/* =========================
   LOGIN
   ========================= */

loginBtn.addEventListener("click", async () => {

    const email = emailInput.value.trim();

    const password = passwordInput.value;

    loginMessage.textContent = "";

    if (!email || !password) {

        loginMessage.textContent =
            "Please enter email and password.";

        return;
    }


    loginBtn.disabled = true;

    loginBtn.textContent = "Logging in...";


    try {

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user =
            userCredential.user;


        console.log("Firebase login successful");

        console.log("UID:", user.uid);


        /*
         * Check whether this user is an admin
         */

        const adminRef =
            doc(db, "admins", user.uid);

        const adminSnap =
            await getDoc(adminRef);


        if (!adminSnap.exists()) {

            await signOut(auth);

            loginMessage.textContent =
                "Login successful, but this user is not an admin.";

            return;
        }


        const adminData =
            adminSnap.data();


        if (adminData.role !== "admin") {

            await signOut(auth);

            loginMessage.textContent =
                "This account does not have admin permission.";

            return;
        }


        loginMessage.textContent = "";

        loginSection.style.display = "none";

        adminDashboard.style.display = "block";

        adminEmail.textContent = user.email;


    } catch (error) {

        console.error(error);

        /*
         * Show the REAL Firebase error
         */

        loginMessage.textContent =
            error.code + " : " + error.message;
    }


    loginBtn.disabled = false;

    loginBtn.textContent = "Login";

});


/* =========================
   CHECK LOGIN STATE
   ========================= */

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        loginSection.style.display = "block";

        adminDashboard.style.display = "none";

        return;
    }


    try {

        const adminRef =
            doc(db, "admins", user.uid);

        const adminSnap =
            await getDoc(adminRef);


        if (
            adminSnap.exists() &&
            adminSnap.data().role === "admin"
        ) {

            loginSection.style.display = "none";

            adminDashboard.style.display = "block";

            adminEmail.textContent =
                user.email;

        } else {

            await signOut(auth);

            loginSection.style.display = "block";

            adminDashboard.style.display = "none";

        }

    } catch (error) {

        console.error(error);

        loginMessage.textContent =
            "Admin verification failed: " +
            error.message;

    }

});


/* =========================
   LOGOUT
   ========================= */

logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    loginSection.style.display = "block";

    adminDashboard.style.display = "none";

    emailInput.value = "";

    passwordInput.value = "";

});
