// =====================================================
// MENTORIA MEDICINA - ADMIN PANEL
// Firebase Authentication + Firestore
// =====================================================

import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    addDoc,
    collection,
    getDocs,
    query,
    where,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// =====================================================
// FIREBASE CONFIG
// =====================================================

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


// =====================================================
// INITIALIZE FIREBASE
// =====================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

console.log("Firebase initialized");
console.log("Admin JS loaded");


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

const loginMessage =
    document.getElementById("loginMessage");

const logoutBtn =
    document.getElementById("logoutBtn");

const adminEmail =
    document.getElementById("adminEmail");

const groupFilter =
    document.getElementById("groupFilter");

const dateFilter =
    document.getElementById("dateFilter");

const absentList =
    document.getElementById("absentList");

const totalStudents =
    document.getElementById("totalStudents");

const absentCount =
    document.getElementById("absentCount");


// =====================================================
// STUDENT GROUPS
// =====================================================

const groups = {

    "7": [
        "Jayaram",
        "Nikhil",
        "Afsal",
        "Ashwin",
        "Vibin",
        "Arjun",
        "Revathy",
        "Aksa",
        "Vincy",
        "Abiya",
        "Nayana",
        "Jesna",
        "Ashina",
        "Devi Nandana",
        "Aleena",
        "Priya",
        "Riya",
        "Neenu",
        "Sona",
        "Avanthika"
    ],

    "9": [
        "Ajlan Mahmood",
        "Aliya naushad",
        "Almaz russel",
        "Persis Susan Sonu",
        "Fathima Abdul Rahman",
        "Ansa ajilal",
        "Ashmi ajmeer",
        "Aslam",
        "Alona",
        "Yuktha",
        "Razin",
        "Nifana",
        "Nizam",
        "Devika",
        "Sadhika",
        "Adithya",
        "Jithin",
        "Yaseen",
        "Aishwarya"
    ],

    "10": [
        "P Meenakshy Nair",
        "Gloria v s",
        "Sandra. S. R",
        "Aashni J R",
        "Noora fathima",
        "Rehsilan. H",
        "Jemima Sara Binu",
        "Anamika. S",
        "Mubeena pattan",
        "Aiswariya raj",
        "Vipanjika s",
        "Sajana rs",
        "Anaswara s",
        "Divya l",
        "Ajay JB",
        "Efrin Sam",
        "Adwaith Anish",
        "Rajeev",
        "Adhitiyan A",
        "Jelshian VA"
    ],

    "11": [
        "Anu suresh Aryananda",
        "Archana shaji Akshaya",
        "Biju Anugraha",
        "George Anamika",
        "Vanju kavitha Anjali",
        "Varghese sindhu Arsha",
        "Sunil Athma",
        "Sajitha Rajesh Aparna",
        "Sanilkumar Rakhi Angel",
        "Prema Ajayan Nandana",
        "Saiju Nimisha",
        "Ramachandran pillai ardra",
        "Ramesh dhanya Roshni",
        "Krishna Amita",
        "Aadith Nair",
        "Nadhusha Althaf",
        "Koshi Aneesh Amal",
        "Adarsh",
        "Shaji Arjun",
        "Shaji Jagath"
    ],

    "12": [
        "Musthaid",
        "anaswara",
        "varsha",
        "sruthi",
        "Jackson",
        "Rayan",
        "Arya",
        "Albin",
        "Basil",
        "Sajena",
        "afsana",
        "Nikhitha",
        "Ajmina",
        "Gowthami",
        "Ann",
        "shadi",
        "Alfiya",
        "Jeeva",
        "Sidra",
        "Reby"
    ],

    "13": [
        "Niranjan",
        "Athul Rajendran",
        "Abhiram Darshan H",
        "Abhay S R",
        "Amrita SM",
        "Shalu R",
        "Sangeetha P Saji",
        "Jolsna John",
        "Aasiya Fazi",
        "Aksa Jose",
        "Sandra B",
        "Alna Prasad",
        "Georgy",
        "Nadeem",
        "Shifana Badri",
        "Anshifa Mehar",
        "Alfa M S",
        "Muhsina",
        "Abhishek",
        "Gulfisha"
    ],

    "15": [
        "Joshua jimmy",
        "Saldan k.s",
        "Abhinandh L.S",
        "Jasmine Maria John",
        "Aisha M Anzari",
        "Alakanandha",
        "Adhithya S",
        "Snena Angel",
        "Christy Sara Pinto"
    ]

};


// =====================================================
// LOGIN
// =====================================================

loginBtn.addEventListener("click", async () => {

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;

    if (!email || !password) {

        loginMessage.textContent =
            "Please enter email and password.";

        loginMessage.style.color =
            "red";

        return;
    }


    loginBtn.disabled = true;

    loginBtn.textContent =
        "Logging in...";


    loginMessage.textContent =
        "Checking account...";

    loginMessage.style.color =
        "#1565c0";


    try {

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user =
            userCredential.user;


        console.log(
            "Authentication successful:",
            user.uid
        );


        // Check admins collection

        const adminRef =
            doc(
                db,
                "admins",
                user.uid
            );


        const adminSnapshot =
            await getDoc(adminRef);


        if (!adminSnapshot.exists()) {

            await signOut(auth);

            loginMessage.textContent =
                "Login successful, but this account has no admin permission.";

            loginMessage.style.color =
                "red";

            return;
        }


        const adminData =
            adminSnapshot.data();


        if (adminData.role !== "admin") {

            await signOut(auth);

            loginMessage.textContent =
                "This account is not an admin.";

            loginMessage.style.color =
                "red";

            return;
        }


        console.log(
            "Admin permission verified"
        );


        loginMessage.textContent =
            "Login successful.";

        loginMessage.style.color =
            "green";


    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        loginMessage.textContent =
            getErrorMessage(error);

        loginMessage.style.color =
            "red";

    }


    loginBtn.disabled = false;

    loginBtn.textContent =
        "Login";

});


// =====================================================
// AUTH STATE
// =====================================================

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            showLogin();

            return;
        }


        console.log(
            "User already logged in:",
            user.email
        );


        try {

            const adminRef =
                doc(
                    db,
                    "admins",
                    user.uid
                );


            const adminSnapshot =
                await getDoc(adminRef);


            if (!adminSnapshot.exists()) {

                await signOut(auth);

                showLogin();

                loginMessage.textContent =
                    "This account does not have admin permission.";

                loginMessage.style.color =
                    "red";

                return;
            }


            const adminData =
                adminSnapshot.data();


            if (adminData.role !== "admin") {

                await signOut(auth);

                showLogin();

                loginMessage.textContent =
                    "This account is not an admin.";

                loginMessage.style.color =
                    "red";

                return;
            }


            showDashboard(
                user,
                adminData
            );


            initializeDashboard();


        } catch (error) {

            console.error(
                "ADMIN CHECK ERROR:",
                error
            );

            showLogin();

            loginMessage.textContent =
                "Could not verify admin permission.";

            loginMessage.style.color =
                "red";
        }

    }
);


// =====================================================
// SHOW LOGIN
// =====================================================

function showLogin() {

    loginSection.style.display =
        "flex";

    adminDashboard.style.display =
        "none";

}


// =====================================================
// SHOW DASHBOARD
// =====================================================

function showDashboard(
    user,
    adminData
) {

    loginSection.style.display =
        "none";

    adminDashboard.style.display =
        "block";


    adminEmail.textContent =
        adminData.name ||
        user.email;

}


// =====================================================
// LOGOUT
// =====================================================

logoutBtn.addEventListener(
    "click",
    async () => {

        await signOut(auth);

        showLogin();

        emailInput.value = "";

        passwordInput.value = "";

    }
);


// =====================================================
// INITIALIZE DASHBOARD
// =====================================================

function initializeDashboard() {

    setupGroups();

    setupDate();

    createSessionPanel();

    loadAttendance();

}


// =====================================================
// GROUP FILTER
// =====================================================

function setupGroups() {

    groupFilter.innerHTML = `

        <option value="">
            All Groups
        </option>

        <option value="7">
            Group 7
        </option>

        <option value="9">
            Group 9
        </option>

        <option value="10">
            Group 10
        </option>

        <option value="11">
            Group 11
        </option>

        <option value="12">
            Group 12
        </option>

        <option value="13">
            Group 13
        </option>

        <option value="15">
            Group 15
        </option>

    `;


    groupFilter.addEventListener(
        "change",
        loadAttendance
    );

}


// =====================================================
// DATE
// =====================================================

function setupDate() {

    dateFilter.value =
        todayString();


    dateFilter.addEventListener(
        "change",
        loadAttendance
    );

}


// =====================================================
// CREATE SESSION PANEL
// =====================================================

function createSessionPanel() {

    if (
        document.getElementById(
            "sessionPanel"
        )
    ) {
        return;
    }


    const panel =
        document.createElement("div");


    panel.id =
        "sessionPanel";

    panel.className =
        "admin-card";


    panel.innerHTML = `

        <h2>
            Open Attendance
        </h2>

        <div class="session-controls">

            <label>

                Group

                <select id="sessionGroup">

                    <option value="">
                        Select Group
                    </option>

                    <option value="7">
                        Group 7
                    </option>

                    <option value="9">
                        Group 9
                    </option>

                    <option value="10">
                        Group 10
                    </option>

                    <option value="11">
                        Group 11
                    </option>

                    <option value="12">
                        Group 12
                    </option>

                    <option value="13">
                        Group 13
                    </option>

                    <option value="15">
                        Group 15
                    </option>

                </select>

            </label>


            <label>

                Duration

                <select id="sessionDuration">

                    <option value="10">
                        10 minutes
                    </option>

                    <option value="15">
                        15 minutes
                    </option>

                    <option value="20" selected>
                        20 minutes
                    </option>

                    <option value="30">
                        30 minutes
                    </option>

                    <option value="45">
                        45 minutes
                    </option>

                    <option value="60">
                        60 minutes
                    </option>

                </select>

            </label>


            <button
                id="openSessionBtn"
                class="open-session-btn">

                Open Attendance

            </button>


            <button
                id="closeSessionBtn"
                class="close-session-btn"
                style="display:none;">

                Close Attendance

            </button>

        </div>


        <div
            id="sessionStatus"
            class="session-status">

            No active session.

        </div>

    `;


    const container =
        document.querySelector(
            ".dashboard-container"
        );


    // Put session panel at top
    container.insertBefore(
        panel,
        container.firstChild
    );


    document
        .getElementById("openSessionBtn")
        .addEventListener(
            "click",
            openSession
        );


    document
        .getElementById("closeSessionBtn")
        .addEventListener(
            "click",
            closeSession
        );


    checkActiveSession();

}


// =====================================================
// OPEN SESSION
// =====================================================

async function openSession() {

    const group =
        document.getElementById(
            "sessionGroup"
        ).value;


    const duration =
        Number(
            document.getElementById(
                "sessionDuration"
            ).value
        );


    const status =
        document.getElementById(
            "sessionStatus"
        );


    if (!group) {

        status.textContent =
            "Please select a group.";

        status.className =
            "session-status warning";

        return;
    }


    try {

        // Check active sessions

        const activeQuery =
            query(
                collection(
                    db,
                    "sessions"
                ),
                where(
                    "active",
                    "==",
                    true
                )
            );


        const activeSnapshot =
            await getDocs(
                activeQuery
            );


        if (!activeSnapshot.empty) {

            status.textContent =
                "Another attendance session is already open.";

            status.className =
                "session-status warning";

            return;
        }


        const start =
            new Date();


        const end =
            new Date(
                start.getTime() +
                duration * 60 * 1000
            );


        const sessionData = {

            group: group,

            active: true,

            startTime:
                start.toISOString(),

            endTime:
                end.toISOString(),

            duration:
                duration,

            createdBy:
                auth.currentUser.uid,

            createdAt:
                serverTimestamp()

        };


        const sessionRef =
            await addDoc(
                collection(
                    db,
                    "sessions"
                ),
                sessionData
            );


        console.log(
            "Session created:",
            sessionRef.id
        );


        status.textContent =
            `Group ${group} attendance is OPEN until ${formatTime(end)}.`;

        status.className =
            "session-status session-active";


        document
            .getElementById(
                "openSessionBtn"
            )
            .style.display =
            "none";


        document
            .getElementById(
                "closeSessionBtn"
            )
            .style.display =
            "inline-block";


        document
            .getElementById(
                "sessionGroup"
            )
            .disabled =
            true;


        document
            .getElementById(
                "sessionDuration"
            )
            .disabled =
            true;


        // Automatically select group in records

        groupFilter.value =
            group;


        await loadAttendance();


    } catch (error) {

        console.error(
            "OPEN SESSION ERROR:",
            error
        );


        status.textContent =
            "Could not open session: " +
            error.message;

        status.className =
            "session-status error";

    }

}


// =====================================================
// CHECK ACTIVE SESSION
// =====================================================

async function checkActiveSession() {

    try {

        const activeQuery =
            query(
                collection(
                    db,
                    "sessions"
                ),
                where(
                    "active",
                    "==",
                    true
                )
            );


        const snapshot =
            await getDocs(
                activeQuery
            );


        if (snapshot.empty) {

            resetSession();

            return;
        }


        const sessionDoc =
            snapshot.docs[0];


        const session =
            sessionDoc.data();


        const now =
            new Date();


        const end =
            new Date(
                session.endTime
            );


        // Automatically close expired session

        if (now >= end) {

            await updateDoc(
                doc(
                    db,
                    "sessions",
                    sessionDoc.id
                ),
                {
                    active: false,
             
