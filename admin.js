// =====================================================
// MENTORIA MEDICINA - ADMIN
// LOGIN + DASHBOARD TEST VERSION
// =====================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

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


// =====================================================
// FIREBASE CONFIG
// =====================================================

const firebaseConfig = {
    apiKey: "AIzaSyBPag4SLUqmdfAws0WFLV7FWp3X8_eLPQ",
    authDomain: "mentoria-medicina-attend-7d5ca.firebaseapp.com",
    projectId: "mentoria-medicina-attend-7d5ca",
    storageBucket: "mentoria-medicina-attend-7d5ca.firebasestorage.app",
    messagingSenderId: "238479536134",
    appId: "1:238479536134:web:3ff9a57dc1cb70dc8c9387",
    measurementId: "G-WEVCZ0JG2K"
};


// =====================================================
// INITIALIZE FIREBASE
// =====================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

console.log("=================================");
console.log("ADMIN.JS LOADED");
console.log("FIREBASE INITIALIZED");
console.log("=================================");


// =====================================================
// HTML ELEMENTS
// =====================================================

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

const logoutBtn =
    document.getElementById("logoutBtn");

const loginMessage =
    document.getElementById("loginMessage");

const adminEmail =
    document.getElementById("adminEmail");


// =====================================================
// CHECK HTML
// =====================================================

console.log("loginSection =", loginSection);
console.log("adminDashboard =", adminDashboard);
console.log("emailInput =", emailInput);
console.log("passwordInput =", passwordInput);
console.log("loginBtn =", loginBtn);
console.log("logoutBtn =", logoutBtn);
console.log("loginMessage =", loginMessage);
console.log("adminEmail =", adminEmail);


// =====================================================
// SAFETY CHECK
// =====================================================

if (
    !loginSection ||
    !adminDashboard ||
    !emailInput ||
    !passwordInput ||
    !loginBtn
) {

    console.error(
        "HTML ELEMENT ERROR: Required login elements are missing."
    );

} else {

    console.log(
        "All login HTML elements found successfully."
    );

}


// =====================================================
// LOGIN BUTTON
// =====================================================

if (loginBtn) {

    loginBtn.addEventListener(
        "click",
        loginAdmin
    );

}


// =====================================================
// LOGIN FUNCTION
// =====================================================

async function loginAdmin() {

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;


    if (!email || !password) {

        showMessage(
            "Please enter email and password.",
            "red"
        );

        return;

    }


    loginBtn.disabled = true;

    loginBtn.textContent =
        "Logging in...";


    showMessage(
        "Checking login...",
        "orange"
    );


    try {

        console.log(
            "Trying Firebase login:",
            email
        );


        const result =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user =
            result.user;


        console.log(
            "Firebase login successful.",
            user.uid
        );


        // =============================================
        // CHECK ADMIN DOCUMENT
        // =============================================

        const adminRef =
            doc(
                db,
                "admins",
                user.uid
            );


        console.log(
            "Checking admin document..."
        );


        const adminSnap =
            await getDoc(adminRef);


        if (!adminSnap.exists()) {

            console.error(
                "Admin document does not exist."
            );


            await signOut(auth);


            showMessage(
                "Login successful, but this account is not registered as admin.",
                "red"
            );


            return;

        }


        const adminData =
            adminSnap.data();


        console.log(
            "Admin data:",
            adminData
        );


        if (adminData.role !== "admin") {

            await signOut(auth);


            showMessage(
                "This account does not have admin permission.",
                "red"
            );


            return;

        }


        showMessage(
            "Login successful!",
            "green"
        );


        showDashboard(
            user,
            adminData
        );


    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        showMessage(
            getErrorMessage(error),
            "red"
        );

    }


    loginBtn.disabled = false;

    loginBtn.textContent =
        "Login";

}


// =====================================================
// AUTH STATE
// =====================================================

onAuthStateChanged(
    auth,
    async (user) => {

        console.log(
            "AUTH STATE:",
            user
        );


        if (!user) {

            showLogin();

            return;

        }


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
                    "User is not an admin."
                );


                await signOut(auth);

                showLogin();

                return;

            }


            const adminData =
                adminSnap.data();


            if (
                adminData.role !==
                "admin"
            ) {

                await signOut(auth);

                showLogin();

                return;

            }


            console.log(
                "Admin verified from auth state."
            );


            showDashboard(
                user,
                adminData
            );


        } catch (error) {

            console.error(
                "AUTH CHECK ERROR:",
                error
            );


            showLogin();

        }

    }
);


// =====================================================
// SHOW LOGIN
// =====================================================

function showLogin() {

    console.log(
        "SHOWING LOGIN PAGE"
    );


    if (loginSection) {

        loginSection.style.display =
            "flex";

    }


    if (adminDashboard) {

        adminDashboard.style.display =
            "none";

    }

}


// =====================================================
// SHOW DASHBOARD
// =====================================================

function showDashboard(
    user,
    adminData
) {

    console.log(
        "SHOWING ADMIN DASHBOARD"
    );


    if (loginSection) {

        loginSection.style.display =
            "none";

    }


    if (adminDashboard) {

        adminDashboard.style.display =
            "block";

    }


    if (adminEmail) {

        adminEmail.textContent =
            adminData.name ||
            user.email ||
            "Admin";

    }

}


// =====================================================
// LOGOUT
// =====================================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                await signOut(auth);

                console.log(
                    "Admin logged out."
                );

                showLogin();

            } catch (error) {

                console.error(
                    "LOGOUT ERROR:",
                    error
                );

            }

        }
    );

}


// =====================================================
// LOGIN MESSAGE
// =====================================================

function showMessage(
    message,
    color
) {

    if (!loginMessage) {

        console.log(
            message
        );

        return;

    }


    loginMessage.textContent =
        message;

    loginMessage.style.color =
        color;

}


// =====================================================
// FIREBASE ERROR MESSAGE
// =====================================================

function getErrorMessage(error) {

    console.error(
        "Firebase error code:",
        error.code
    );


    switch (error.code) {

        case "auth/invalid-credential":
            return "Incorrect email or password.";

        case "auth/invalid-email":
            return "Invalid email address.";

        case "auth/user-not-found":
            return "Admin account not found.";

        case "auth/wrong-password":
            return "Incorrect password.";

        case "auth/too-many-requests":
            return "Too many login attempts. Try again later.";

        case "auth/network-request-failed":
            return "Network error. Check your internet connection.";

        default:
            return (
                "Login failed: " +
                error.message
            );

    }

  }
