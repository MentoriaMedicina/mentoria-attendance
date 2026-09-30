/* =========================================================
   MENTORIA MEDICINA
   ADMIN ATTENDANCE PANEL
   Firebase Authentication + Firestore
========================================================= */


/* =========================================================
   FIREBASE IMPORTS
========================================================= */

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
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* =========================================================
   FIREBASE CONFIG
========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyBPag4SLUqmdfAws0WFLV7FWp3X8_eLPXQ",
  authDomain: "mentoria-medicina-attend-7d5ca.firebaseapp.com",
  databaseURL: "https://mentoria-medicina-attend-7d5ca-default-rtdb.firebaseio.com",
  projectId: "mentoria-medicina-attend-7d5ca",
  storageBucket: "mentoria-medicina-attend-7d5ca.firebasestorage.app",
  messagingSenderId: "238479536134",
  appId: "1:238479536134:web:3ff9a57dc1cb70dc8c9387",
  measurementId: "G-WEVCZ0JG2K"
};


/* =========================================================
   INITIALIZE FIREBASE
========================================================= */

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

console.log("Firebase Admin initialized");


/* =========================================================
   STUDENT GROUPS
========================================================= */

const groups = {

    "Group 7": [
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

    "Group 9": [
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

    "Group 10": [
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

    "Group 11": [
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

    "Group 12": [
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

    "Group 13": [
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

    "Group 15": [
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


/* =========================================================
   HTML ELEMENTS
========================================================= */

const loginSection =
    document.getElementById("loginSection");

const adminDashboard =
    document.getElementById("adminDashboard");

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const loginMessage =
    document.getElementById("loginMessage");

const logoutButton =
    document.getElementById("logoutButton");

const groupFilter =
    document.getElementById("groupFilter");

const dateFilter =
    document.getElementById("dateFilter");

const searchInput =
    document.getElementById("searchInput");

const attendanceList =
    document.getElementById("attendanceList");

const totalAbsent =
    document.getElementById("totalAbsent");

const openSessionButton =
    document.getElementById("openSessionButton");

const closeSessionButton =
    document.getElementById("closeSessionButton");

const sessionStatus =
    document.getElementById("sessionStatus");

const sessionDuration =
    document.getElementById("sessionDuration");


/* =========================================================
   CURRENT VARIABLES
========================================================= */

let currentUser = null;

let currentSession = null;

let attendanceRecords = [];


/* =========================================================
   HELPER
========================================================= */

function normalizeName(name) {

    return String(name || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");

}


/* =========================================================
   STUDENT ID
   SAME AS STUDENT SCRIPT
========================================================= */

function createStudentId(group, name) {

    return (
        group +
        "_" +
        name
            .replace(/\s+/g, "_")
            .replace(/[.#$[\]/]/g, "")
    );

}


/* =========================================================
   SHOW LOGIN
========================================================= */

function showLogin() {

    if (loginSection) {
        loginSection.style.display = "block";
    }

    if (adminDashboard) {
        adminDashboard.style.display = "none";
    }

}


/* =========================================================
   SHOW DASHBOARD
========================================================= */

function showDashboard() {

    if (loginSection) {
        loginSection.style.display = "none";
    }

    if (adminDashboard) {
        adminDashboard.style.display = "block";
    }

}


/* =========================================================
   LOGIN
========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;

            if (!email || !password) {

                showLoginMessage(
                    "Please enter email and password."
                );

                return;
            }

            try {

                showLoginMessage(
                    "Logging in..."
                );

                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );

                showLoginMessage(
                    getFirebaseErrorMessage(error)
                );

            }

        }
    );

}


/* =========================================================
   LOGIN ERROR MESSAGE
========================================================= */

function showLoginMessage(message) {

    if (loginMessage) {

        loginMessage.textContent =
            message;

    } else {

        alert(message);

    }

}


/* =========================================================
   FIREBASE ERROR
========================================================= */

function getFirebaseErrorMessage(error) {

    switch (error.code) {

        case "auth/invalid-credential":
            return "Invalid email or password.";

        case "auth/invalid-email":
            return "Invalid email address.";

        case "auth/user-not-found":
            return "Admin account not found.";

        case "auth/wrong-password":
            return "Wrong password.";

        case "auth/too-many-requests":
            return "Too many attempts. Try again later.";

        case "auth/network-request-failed":
            return "Network error. Check internet.";

        default:
            return error.message ||
                "Login failed.";

    }

}


/* =========================================================
   CHECK ADMIN PERMISSION
========================================================= */

async function checkAdminPermission(user) {

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

            console.error(
                "No admin document found for UID:",
                user.uid
            );

            return false;

        }

        const data =
            adminSnap.data();

        console.log(
            "Admin document:",
            data
        );

        return (
            data.role === "admin"
        );

    } catch (error) {

        console.error(
            "Admin permission error:",
            error
        );

        return false;

    }

}


/* =========================================================
   AUTH STATE
========================================================= */

onAuthStateChanged(
    auth,
    async function (user) {

        if (!user) {

            currentUser = null;

            showLogin();

            return;

        }

        console.log(
            "Logged in user:",
            user.email
        );

        const isAdmin =
            await checkAdminPermission(user);

        if (!isAdmin) {

            alert(
                "This account does not have admin permission."
            );

            await signOut(auth);

            showLogin();

            return;

        }

        currentUser = user;

        showDashboard();

        initializeAdmin();

    }
);


/* =========================================================
   LOGOUT
========================================================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function () {

            try {

                await signOut(auth);

                currentUser = null;

                showLogin();

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            }

        }
    );

}


/* =========================================================
   LOAD GROUPS INTO FILTER
========================================================= */

function loadGroupFilter() {

    if (!groupFilter) {
        return;
    }

    groupFilter.innerHTML =
        '<option value="">All Groups</option>';

    Object.keys(groups).forEach(
        groupName => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                groupName;

            option.textContent =
                groupName;

            groupFilter.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   FIND ACTIVE SESSION
========================================================= */

async function findActiveSession() {

    try {

        const sessionsRef =
            collection(
                db,
                "sessions"
            );

        const q =
            query(
                sessionsRef,
                where(
                    "active",
                    "==",
                    true
                )
            );

        const snapshot =
            await getDocs(q);

        currentSession = null;

        const now =
            new Date();

        snapshot.forEach(
            sessionDoc => {

                const data =
                    sessionDoc.data();

                let startTime =
                    null;

                let endTime =
                    null;


                if (data.startTime) {

                    if (
                        typeof data.startTime.toDate ===
                        "function"
                    ) {

                        startTime =
                            data.startTime.toDate();

                    } else {

                        startTime =
                            new Date(
                                data.startTime
                            );

                    }

                }


                if (data.endTime) {

                    if (
                        typeof data.endTime.toDate ===
                        "function"
                    ) {

                        endTime =
                            data.endTime.toDate();

                    } else {

                        endTime =
                            new Date(
                                data.endTime
                            );

                    }

                }


                let valid = true;


                if (startTime && now < startTime) {

                    valid = false;

                }


                if (endTime && now > endTime) {

                    valid = false;

                }


                if (valid && !currentSession) {

                    currentSession = {

                        id:
                            sessionDoc.id,

                        ...data

                    };

                }

            }
        );


        updateSessionDisplay();

        return currentSession;

    } catch (error) {

        console.error(
            "Find session error:",
            error
        );

        return null;

    }

}


/* =========================================================
   SESSION DISPLAY
========================================================= */

function updateSessionDisplay() {

    if (!sessionStatus) {
        return;
    }

    if (!currentSession) {

        sessionStatus.textContent =
            "Attendance CLOSED";

        return;

    }

    sessionStatus.textContent =
        "Attendance OPEN — " +
        (currentSession.group || "All Groups");

}


/* =========================================================
   OPEN ATTENDANCE SESSION
========================================================= */

if (openSessionButton) {

    openSessionButton.addEventListener(
        "click",
        openAttendanceSession
    );

}


async function openAttendanceSession() {

    const group =
        groupFilter
            ? groupFilter.value
            : "";

    if (!group) {

        alert(
            "Please select a group first."
        );

        return;

    }


    let duration =
        20;

    if (sessionDuration) {

        const entered =
            Number(
                sessionDuration.value
            );

        if (
            Number.isFinite(entered) &&
            entered > 0
        ) {

            duration =
                entered;

        }

    }


    try {

        const now =
            new Date();

        const end =
            new Date(
                now.getTime() +
                duration * 60 * 1000
            );


        const sessionData = {

            group:
                group,

            active:
                true,

            startTime:
                serverTimestamp(),

            endTime:
                end,

            duration:
                duration,

            createdBy:
                currentUser.uid,

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


        currentSession = {

            id:
                sessionRef.id,

            group:
                group,

            active:
                true,

            startTime:
                now,

            endTime:
                end,

            duration:
                duration,

            createdBy:
                currentUser.uid

        };


        updateSessionDisplay();

        await loadAttendance();

        alert(
            group +
            " attendance opened for " +
            duration +
            " minutes."
        );

    } catch (error) {

        console.error(
            "Open session error:",
            error
        );

        alert(
            "Could not open attendance.\n\n" +
            error.message
        );

    }

}


/* =========================================================
   CLOSE ATTENDANCE
========================================================= */

if (closeSessionButton) {

    closeSessionButton.addEventListener(
        "click",
        closeAttendanceSession
    );

}


async function closeAttendanceSession() {

    if (!currentSession) {

        alert(
            "No active attendance session."
        );

        return;

    }


    try {

        const sessionRef =
            doc(
                db,
                "sessions",
                currentSession.id
            );


        await deleteSessionOrClose(
            sessionRef
        );


        currentSession = null;

        updateSessionDisplay();

        await loadAttendance();

        alert(
            "Attendance closed."
        );

    } catch (error) {

        console.error(
            "Close session error:",
            error
        );

        alert(
            "Could not close attendance.\n\n" +
            error.message
        );

    }

}


/* =========================================================
   CLOSE SESSION WITHOUT DELETING
========================================================= */

async function deleteSessionOrClose(
    sessionRef
) {

    /*
       We update the session instead of deleting it.
       This preserves attendance history.
    */

    const { updateDoc } =
        await import(
            "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js"
        );


    await updateDoc(
        sessionRef,
        {

            active:
                false,

            closedAt:
                serverTimestamp(),

            closedBy:
                currentUser.uid

        }
    );

}


/* =========================================================
   LOAD ATTENDANCE
========================================================= */

async function loadAttendance() {

    attendanceRecords = [];


    try {

        const attendanceRef =
            collection(
                db,
                "attendance"
            );


        let q;


        /*
           If a group is selected and there is
           an active session, use both filters.
        */

        const selectedGroup =
            groupFilter
                ? groupFilter.value
                : "";


        if (
            currentSession &&
            currentSession.id
        ) {

            q =
                query(
                    attendanceRef,

                    where(
                        "sessionId",
                        "==",
                        currentSession.id
                    )
                );

        } else if (selectedGroup) {

            q =
                query(
                    attendanceRef,

                    where(
                        "group",
                        "==",
                        selectedGroup
                    )
                );

        } else {

            q =
                query(
                    attendanceRef
                );

        }


        const snapshot =
            await getDocs(q);


        snapshot.forEach(
            attendanceDoc => {

                const data =
                    attendanceDoc.data();


                /*
                   IMPORTANT:
                   Use the actual group stored by
                   student script.js.
                */

                if (
                    selectedGroup &&
                    data.group !== selectedGroup
                ) {

                    return;

                }


                attendanceRecords.push({

                    id:
                        attendanceDoc.id,

                    ...data

                });

            }
        );


        console.log(
            "Attendance records:",
            attendanceRecords
        );


        applyAttendanceFilters();

    } catch (error) {

        console.error(
            "Load attendance error:",
            error
        );

        if (attendanceList) {

            attendanceList.innerHTML =
                `
                <div class="empty-message">
                    Error loading attendance:
                    ${escapeHtml(error.message)}
                </div>
                `;

        }

    }

}


/* =========================================================
   FILTER ATTENDANCE
========================================================= */

function applyAttendanceFilters() {

    let records =
        [...attendanceRecords];


    const selectedGroup =
        groupFilter
            ? groupFilter.value
            : "";


    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const selectedDate =
        dateFilter
            ? dateFilter.value
            : "";


    /* ---------- GROUP ---------- */

    if (selectedGroup) {

        records =
            records.filter(
                record =>
                    record.group ===
                    selectedGroup
            );

    }


    /* ---------- SEARCH ---------- */

    if (search) {

        records =
            records.filter(
                record => {

                    const name =
                        String(
                            record.studentName ||
                            ""
                        ).toLowerCase();

                    return name.includes(
                        search
                    );

                }
            );

    }


    /* ---------- DATE ---------- */

    if (selectedDate) {

        records =
            records.filter(
                record =>
                    isSameDate(
                        record.submittedAt,
                        selectedDate
                    )
            );

    }


    displayAttendance(
        records
    );

}


/* =========================================================
   DATE COMPARISON
========================================================= */

function isSameDate(
    timestamp,
    dateString
) {

    if (!timestamp) {
        return false;
    }


    let date;


    try {

        if (
            typeof timestamp.toDate ===
            "function"
        ) {

            date =
                timestamp.toDate();

        } else if (
            timestamp.seconds
        ) {

            date =
                new Date(
                    timestamp.seconds * 1000
                );

        } else {

            date =
                new Date(timestamp);

        }

    } catch {

        return false;

    }


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return false;

    }


    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        `${year}-${month}-${day}` ===
        dateString
    );

}


/* =========================================================
   DISPLAY ATTENDANCE
========================================================= */

function displayAttendance(
    records
) {

    if (!attendanceList) {
        return;
    }


    attendanceList.innerHTML =
        "";


    totalAbsent.textContent =
        records.length;


    if (records.length === 0) {

        attendanceList.innerHTML =
            `
            <div class="empty-message">
                No absence records found.
            </div>
            `;

        return;

    }


    /*
       Sort newest first
    */

    records.sort(
        (a, b) =>
            getTimestampMillis(
                b.submittedAt
            ) -
            getTimestampMillis(
                a.submittedAt
            )
    );


    records.forEach(
        (record, index) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "attendance-card";


            const studentName =
                record.studentName ||
                "Unknown Student";


            const group =
                record.group ||
                "Unknown Group";


            const time =
                formatTimestamp(
                    record.submittedAt
                );


            card.innerHTML =
                `
                <div class="attendance-info">

                    <div class="attendance-number">
                        ${index + 1}
                    </div>

                    <div class="attendance-details">

                        <div class="attendance-name">
                            ${escapeHtml(studentName)}
                        </div>

                        <div class="attendance-group">
                            ${escapeHtml(group)}
                        </div>

                        <div class="attendance-time">
                            ${escapeHtml(time)}
                        </div>

                    </div>

                </div>

                <button
                    class="delete-button"
                    data-id="${record.id}">
                    DELETE
                </button>
                `;


            const deleteButton =
                card.querySelector(
                    ".delete-button"
                );


            deleteButton.addEventListener(
                "click",
                () =>
                    deleteAttendance(
                        record.id,
                        studentName
                    )
            );


            attendanceList.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   DELETE ATTENDANCE
========================================================= */

async function deleteAttendance(
    recordId,
    studentName
) {

    const confirmDelete =
        confirm(
            "Delete absence record for " +
            studentName +
            "?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        await deleteDoc(
            doc(
                db,
                "attendance",
                recordId
            )
        );


        attendanceRecords =
            attendanceRecords.filter(
                record =>
                    record.id !==
                    recordId
            );


        applyAttendanceFilters();


        alert(
            "Absence deleted successfully."
        );

    } catch (error) {

        console.error(
            "Delete attendance error:",
            error
        );

        alert(
            "Could not delete attendance.\n\n" +
            error.message
        );

    }

}


/* =========================================================
   TIMESTAMP TO MILLISECONDS
========================================================= */

function getTimestampMillis(
    timestamp
) {

    if (!timestamp) {
        return 0;
    }


    try {

        if (
            typeof timestamp.toMillis ===
            "function"
        ) {

            return timestamp.toMillis();

        }


        if (
            typeof timestamp.toDate ===
            "function"
        ) {

            return timestamp.toDate()
                .getTime();

        }


        if (timestamp.seconds) {

            return (
                timestamp.seconds *
                1000
            );

        }


        const date =
            new Date(timestamp);


        return date.getTime();

    } catch {

        return 0;

    }

}


/* =========================================================
   FORMAT TIME
========================================================= */

function formatTimestamp(
    timestamp
) {

    const milliseconds =
        getTimestampMillis(
            timestamp
        );


    if (!milliseconds) {

        return "Time unavailable";

    }


    const date =
        new Date(
            milliseconds
        );


    return date.toLocaleString();

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(
    text
) {

    return String(text || "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   FILTER EVENTS
========================================================= */

if (groupFilter) {

    groupFilter.addEventListener(
        "change",
        async function () {

            await loadAttendance();

        }
    );

}


if (dateFilter) {

    dateFilter.addEventListener(
        "change",
        function () {

            applyAttendanceFilters();

        }
    );

}


if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            applyAttendanceFilters();

        }
    );

}


/* =========================================================
   INITIALIZE ADMIN
========================================================= */

async function initializeAdmin() {

    console.log(
        "Initializing admin panel..."
    );


    loadGroupFilter();


    await findActiveSession();


    await loadAttendance();


    console.log(
        "Admin panel ready."
    );

}


/* =========================================================
   AUTO CHECK SESSION
========================================================= */

setInterval(
    async function () {

        if (!currentUser) {
            return;
        }


        await findActiveSession();

        await loadAttendance();

    },
    30000
);
