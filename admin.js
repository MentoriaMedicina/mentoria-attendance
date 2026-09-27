/* ==================================================
   FIREBASE
================================================== */

import {
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


alert("Admin JS loaded successfully");

console.log("ADMIN JS IS LOADED");

/* ==================================================
   FIREBASE CONFIG
================================================== */

const firebaseConfig = {

    apiKey:
        "AIzaSyBPag4SLUqmdfAws0WFLV7FWp3X8_eLPQ",

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


/* ==================================================
   INITIALIZE FIREBASE
================================================== */

let app;
let auth;
let db;


try {

    app = initializeApp(firebaseConfig);

    auth = getAuth(app);

    db = getFirestore(app);

    console.log("=================================");
    console.log("Firebase initialized successfully");
    console.log("Project ID:", firebaseConfig.projectId);
    console.log("Auth Domain:", firebaseConfig.authDomain);
    console.log("=================================");

} catch (error) {

    console.error(
        "Firebase initialization error:",
        error
    );

}


/* ==================================================
   HTML ELEMENTS
================================================== */

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


/* ==================================================
   CHECK HTML ELEMENTS
================================================== */

if (!loginSection) {

    console.error(
        "ERROR: loginSection not found."
    );

}

if (!adminDashboard) {

    console.error(
        "ERROR: adminDashboard not found."
    );

}

if (!emailInput) {

    console.error(
        "ERROR: email input not found."
    );

}

if (!passwordInput) {

    console.error(
        "ERROR: password input not found."
    );

}

if (!loginBtn) {

    console.error(
        "ERROR: login button not found."
    );

}


/* ==================================================
   SHOW MESSAGE
================================================== */

function showMessage(
    message,
    type = "error"
) {

    if (!loginMessage) {

        return;

    }

    loginMessage.textContent =
        message;

    loginMessage.className =
        type;

}


/* ==================================================
   FIREBASE ERROR MESSAGE
================================================== */

function getFirebaseErrorMessage(error) {

    console.error(
        "Firebase error code:",
        error.code
    );

    console.error(
        "Firebase error message:",
        error.message
    );


    switch (error.code) {

        case "auth/api-key-not-valid":

            return (
                "Firebase API key is not valid. " +
                "Please check the Firebase Web App configuration."
            );


        case "auth/invalid-api-key":

            return (
                "Firebase API key is invalid."
            );


        case "auth/invalid-email":

            return (
                "Invalid email address."
            );


        case "auth/invalid-credential":

            return (
                "Invalid email or password."
            );


        case "auth/user-not-found":

            return (
                "No account found with this email."
            );


        case "auth/wrong-password":

            return (
                "Incorrect password."
            );


        case "auth/operation-not-allowed":

            return (
                "Email/Password login is not enabled in Firebase Authentication."
            );


        case "auth/too-many-requests":

            return (
                "Too many login attempts. Please wait and try again."
            );


        case "auth/network-request-failed":

            return (
                "Network error. Please check your internet connection."
            );


        case "auth/unauthorized-domain":

            return (
                "This website domain is not authorized in Firebase Authentication."
            );


        case "permission-denied":

            return (
                "Firestore permission denied. Check Firestore Security Rules."
            );


        default:

            return (
                error.code +
                " : " +
                error.message
            );

    }

}


/* ==================================================
   ADMIN VERIFICATION
================================================== */

async function checkAdmin(user) {

    if (!user) {

        return false;

    }


    console.log(
        "Checking admin account..."
    );

    console.log(
        "User email:",
        user.email
    );

    console.log(
        "User UID:",
        user.uid
    );


    try {

        const adminRef =
            doc(
                db,
                "admins",
                user.uid
            );


        const adminSnap =
            await getDoc(adminRef);


        if (!adminSnap.exists()) {

            console.log(
                "No admin document found."
            );

            return false;

        }


        const adminData =
            adminSnap.data();


        console.log(
            "Admin document:",
            adminData
        );


        if (
            adminData.role !== "admin"
        ) {

            console.log(
                "User role is not admin."
            );

            return false;

        }


        return true;


    } catch (error) {

        console.error(
            "Admin verification error:",
            error
        );

        showMessage(
            "Admin verification failed: " +
            error.message
        );

        return false;

    }

}


/* ==================================================
   LOGIN
================================================== */

if (loginBtn) {

    loginBtn.addEventListener(
        "click",
        async () => {

            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;


            showMessage("");


            if (!email || !password) {

                showMessage(
                    "Please enter email and password."
                );

                return;

            }


            loginBtn.disabled = true;

            loginBtn.textContent =
                "Logging in...";


            try {

                console.log(
                    "Starting Firebase login..."
                );


                const userCredential =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    userCredential.user;


                console.log(
                    "Firebase login successful."
                );

                console.log(
                    "UID:",
                    user.uid
                );


                /*
                   Check admin permission
                */

                const isAdmin =
                    await checkAdmin(user);


                if (!isAdmin) {

                    await signOut(auth);


                    showMessage(
                        "Login successful, but this account is not an admin."
                    );


                    return;

                }


                /*
                   Show dashboard
                */

                loginSection.style.display =
                    "none";

                adminDashboard.style.display =
                    "block";


                if (adminEmail) {

                    adminEmail.textContent =
                        user.email;

                }


                console.log(
                    "Admin dashboard opened."
                );


            } catch (error) {

                console.error(
                    "LOGIN ERROR:",
                    error
                );


                const message =
                    getFirebaseErrorMessage(
                        error
                    );


                showMessage(
                    message
                );

            } finally {

                loginBtn.disabled =
                    false;

                loginBtn.textContent =
                    "Login";

            }

        }
    );

}


/* ==================================================
   CHECK LOGIN STATE
================================================== */

if (auth) {

    onAuthStateChanged(
        auth,
        async (user) => {

            console.log(
                "Auth state changed:",
                user
                    ? user.email
                    : "Not logged in"
            );


            if (!user) {

                loginSection.style.display =
                    "block";

                adminDashboard.style.display =
                    "none";

                return;

            }


            /*
               User is already logged in.
               Check admin permission.
            */

            const isAdmin =
                await checkAdmin(user);


            if (isAdmin) {

                loginSection.style.display =
                    "none";

                adminDashboard.style.display =
                    "block";


                if (adminEmail) {

                    adminEmail.textContent =
                        user
