// ============================================================
// MENTORIA MEDICINA - ADMIN PANEL
// Firebase Authentication + Realtime Database
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getDatabase,
    ref,
    get,
    set,
    push,
    update,
    onValue
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";


// ============================================================
// FIREBASE CONFIG
// ============================================================

const firebaseConfig = {
    apiKey: "AIzaSyBPag4SLqUmdfAws0WFLV7FWp3X8_eLPQ",
    authDomain: "mentoria-medicina-attend-7d5ca.firebaseapp.com",
    databaseURL: "https://mentoria-medicina-attend-7d5ca-default-rtdb.firebaseio.com",
    projectId: "mentoria-medicina-attend-7d5ca",
    storageBucket: "mentoria-medicina-attend-7d5ca.firebasestorage.app",
    messagingSenderId: "238479536134",
    appId: "1:238479536134:web:3ff9a57dc1cb70dc8c9387",
    measurementId: "G-WEVCZ0JG2K"
};


// ============================================================
// INITIALIZE FIREBASE
// ============================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getDatabase(app);


// ============================================================
// STUDENT GROUPS
// ============================================================

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


// ============================================================
// HTML ELEMENTS
// ============================================================

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

const groupFilter =
    document.getElementById("groupFilter");

const dateFilter =
    document.getElementById("dateFilter");

const totalStudents =
    document.getElementById("totalStudents");

const absentCount =
    document.getElementById("absentCount");

const absentList =
    document.getElementById("absentList");


// ============================================================
// GLOBAL VARIABLES
// ============================================================

let currentUser = null;
let attendanceListener = null;
let sessionListener = null;


// ============================================================
// SHOW LOGIN MESSAGE
// ============================================================

function showLoginMessage(message, isError = true) {

    if (!loginMessage) return;

    loginMessage.textContent = message;

    loginMessage.style.color =
        isError ? "#d32f2f" : "#2e7d32";
}


// ============================================================
// STUDENT ID
// ============================================================

function createStudentId(group, studentName) {

    return (
        "grp_" +
        group +
        "_" +
        studentName
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_+|_+$/g, "")
    );
}


// ============================================================
// LOGIN
// ============================================================

if (loginBtn) {

    loginBtn.addEventListener("click", async () => {

        const email =
            emailInput ? emailInput.value.trim() : "";

        const password =
            passwordInput ? passwordInput.value : "";

        if (!email || !password) {

            showLoginMessage(
                "Please enter email and password."
            );

            return;
        }

        loginBtn.disabled = true;
        loginBtn.textContent = "Logging in...";

        showLoginMessage("", false);

        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            showLoginMessage(
                "Login successful.",
                false
            );

        } catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );

            // IMPORTANT:
            // Show the exact Firebase error.
            showLoginMessage(
                "Login error: " +
                (error.code || "unknown-error")
            );

        } finally {

            loginBtn.disabled = false;
            loginBtn.textContent = "Login";

        }

    });

}


// ============================================================
// ADMIN PERMISSION
// ============================================================

async function verifyAdmin(user) {

    try {

        const adminRef =
            ref(
                db,
                "admins/" + user.uid
            );

        const snapshot =
            await get(adminRef);

        if (!snapshot.exists()) {

            console.error(
                "No admin record found for UID:",
                user.uid
            );

            await signOut(auth);

            showLoginMessage(
                "Login successful, but this account is not an admin."
            );

            return false;
        }

        const adminData =
            snapshot.val();

        if (
            !adminData ||
            adminData.role !== "admin"
        ) {

            await signOut(auth);

            showLoginMessage(
                "This account does not have admin permission."
            );

            return false;
        }

        return true;

    } catch (error) {

        console.error(
            "ADMIN VERIFICATION ERROR:",
            error
        );

        showLoginMessage(
            "Admin verification error: " +
            (error.code || "unknown-error")
        );

        return false;
    }
}


// ============================================================
// AUTH STATE
// ============================================================

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            currentUser = null;

            if (loginSection) {
                loginSection.style.display = "block";
            }

            if (adminDashboard) {
                adminDashboard.style.display = "none";
            }

            return;
        }

        console.log(
            "Authenticated user:",
            user.email,
            user.uid
        );

        const isAdmin =
            await verifyAdmin(user);

        if (!isAdmin) {
            return;
        }

        currentUser = user;

        if (loginSection) {
            loginSection.style.display = "none";
        }

        if (adminDashboard) {
            adminDashboard.style.display = "block";
        }

        if (adminEmail) {
            adminEmail.textContent =
                user.email || "";
        }

        initializeDashboard();

    }
);


// ============================================================
// LOGOUT
// ============================================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                await signOut(auth);

            } catch (error) {

                console.error(
                    "LOGOUT ERROR:",
                    error
                );

            }

        }
    );

}


// ============================================================
// INITIALIZE DASHBOARD
// ============================================================

function initializeDashboard() {

    setupGroupFilter();

    setupDateFilter();

    createSessionPanel();

    startAttendanceListener();

    startSessionListener();

    loadStatistics();

}


// ============================================================
// GROUP FILTER
// ============================================================

function setupGroupFilter() {

    if (!groupFilter) return;

    groupFilter.innerHTML = `
        <option value="all">All Groups</option>
    `;

    Object.keys(groups)
        .sort(
            (a, b) =>
                Number(a) - Number(b)
        )
        .forEach(group => {

            const option =
                document.createElement("option");

            option.value = group;

            option.textContent =
                "Group " + group;

            groupFilter.appendChild(option);

        });

    groupFilter.onchange =
        loadStatistics;
}


// ============================================================
// DATE FILTER
// ============================================================

function setupDateFilter() {

    if (!dateFilter) return;

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    dateFilter.value =
        `${year}-${month}-${day}`;

    dateFilter.onchange =
        loadStatistics;
}


// ============================================================
// CREATE SESSION PANEL
// ============================================================

function createSessionPanel() {

    const dashboard =
        document.querySelector(
            ".dashboard-container"
        );

    if (!dashboard) return;

    if (
        document.getElementById(
            "sessionPanel"
        )
    ) {
        return;
    }

    const panel =
        document.createElement("section");

    panel.id =
        "sessionPanel";

    panel.className =
        "admin-card";

    panel.innerHTML = `

        <h2>Attendance Session</h2>

        <div class="session-controls">

            <label>
                Group
                <select id="sessionGroup">
                    <option value="">
                        Select Group
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
                class="open-session-btn"
                type="button"
            >
                Open Attendance
            </button>

        </div>

        <div
            id="sessionStatus"
            class="session-status"
        >
            No active session
        </div>
    `;

    dashboard.prepend(panel);

    const sessionGroup =
        document.getElementById(
            "sessionGroup"
        );

    Object.keys(groups)
        .sort(
            (a, b) =>
                Number(a) - Number(b)
        )
        .forEach(group => {

            const option =
                document.createElement("option");

            option.value =
                group;

            option.textContent =
                "Group " + group;

            sessionGroup.appendChild(
                option
            );

        });

    const openBtn =
        document.getElementById(
            "openSessionBtn"
        );

    if (openBtn) {
        openBtn.addEventListener(
            "click",
            openSession
        );
    }
}


// ============================================================
// OPEN ATTENDANCE SESSION
// ============================================================

async function openSession() {

    const sessionGroup =
        document.getElementById(
            "sessionGroup"
        );

    const sessionDuration =
        document.getElementById(
            "sessionDuration"
        );

    if (
        !sessionGroup ||
        !sessionDuration
    ) {
        return;
    }

    const group =
        sessionGroup.value;

    const duration =
        Number(
            sessionDuration.value
        );

    if (!group) {

        alert(
            "Please select a group."
        );

        return;
    }

    if (!currentUser) {

        alert(
            "You are not logged in."
        );

        return;
    }

    try {

        const sessionsSnapshot =
            await get(
                ref(db, "sessions")
            );

        const sessions =
            sessionsSnapshot.exists()
                ? sessionsSnapshot.val()
                : {};

        const now =
            Date.now();

        let activeSessionExists =
            false;

        Object.values(sessions)
            .forEach(session => {

                if (
                    session &&
                    session.active === true &&
                    Number(session.endTime) > now
                ) {

                    activeSessionExists =
                        true;
                }

            });

        if (activeSessionExists) {

            alert(
                "An attendance session is already active."
            );

            return;
        }

        const sessionRef =
            push(
                ref(db, "sessions")
            );

        const sessionId =
            sessionRef.key;

        const startTime =
            Date.now();

        const endTime =
            startTime +
            duration * 60 * 1000;

        const sessionData = {

            group: group,

            active: true,

            startTime:
                startTime,

            endTime:
                endTime,

            duration:
                duration,

            createdBy:
                currentUser.uid,

            createdAt:
                Date.now()

        };

        await set(
            sessionRef,
            sessionData
        );

        alert(
            `Attendance opened for Group ${group} for ${duration} minutes.`
        );

    } catch (error) {

        console.error(
            "OPEN SESSION ERROR:",
            error
        );

        alert(
            "Could not open attendance session.\n\n" +
            (error.code || error.message)
        );
    }
}


// ============================================================
// SESSION REALTIME LISTENER
// ============================================================

function startSessionListener() {

    if (sessionListener) {
        sessionListener();
    }

    const sessionsRef =
        ref(db, "sessions");

    sessionListener =
        onValue(
            sessionsRef,
            async snapshot => {

                const sessions =
                    snapshot.exists()
                        ? snapshot.val()
                        : {};

                const now =
                    Date.now();

                let activeSession =
                    null;

                for (
                    const [sessionId, session]
                    of Object.entries(sessions)
                ) {

                    if (!session) {
                        continue;
                    }

                    if (
                        session.active === true &&
                        Number(session.endTime) <= now
                    ) {

                        await update(
                            ref(
                                db,
                                "sessions/" +
                                sessionId
                            ),
                            {
                                active: false,
                                closedAt:
                                    Date.now()
                            }
                        );

                        continue;
                    }

                    if (
                        session.active === true &&
                        Number(session.endTime) > now
                    ) {

                        activeSession = {

                            id:
                                sessionId,

                            ...session

                        };

                    }

                }

                displaySessionStatus(
                    activeSession
                );

            }
        );
}


// ============================================================
// DISPLAY SESSION STATUS
// ============================================================

function displaySessionStatus(session) {

    const status =
        document.getElementById(
            "sessionStatus"
        );

    const openBtn =
        document.getElementById(
            "openSessionBtn"
        );

    if (!status) return;

    if (!session) {

        status.innerHTML =
            "No active session";

        if (openBtn) {
            openBtn.disabled =
                false;
        }

        return;
    }

    const remaining =
        Math.max(
            0,
            Number(session.endTime) -
            Date.now()
        );

    const minutes =
        Math.floor(
            remaining / 60000
        );

    const seconds =
        Math.floor(
            (remaining % 60000) /
            1000
        );

    status.innerHTML = `
        <strong>
            Group ${session.group}
        </strong>
        —
        Attendance is OPEN
        <br>
        Time remaining:
        ${minutes}m ${seconds}s
    `;

    if (openBtn) {
        openBtn.disabled =
            true;
    }
}


// ============================================================
// ATTENDANCE LISTENER
// ============================================================

function startAttendanceListener() {

    if (attendanceListener) {
        attendanceListener();
    }

    attendanceListener =
        onValue(
            ref(db, "attendance"),
            () => {

                loadStatistics();

            }
        );
}


// ============================================================
// LOAD STATISTICS
// ============================================================

async function loadStatistics() {

    if (!totalStudents ||
        !absentCount ||
        !absentList) {

        return;
    }

    const selectedGroup =
        groupFilter
            ? groupFilter.value
            : "all";

    const selectedDate =
        dateFilter
            ? dateFilter.value
            : getTodayString();

    let studentTotal = 0;

    let absentStudents = [];

    const groupsToCheck =
        selectedGroup === "all"
            ? Object.keys(groups)
            : [selectedGroup];


    // --------------------------------------------------------
    // TOTAL STUDENTS
    // --------------------------------------------------------

    groupsToCheck.forEach(group => {

        if (groups[group]) {

            studentTotal +=
                groups[group].length;

        }

    });


    // --------------------------------------------------------
    // READ ATTENDANCE FOR SELECTED DATE
    // --------------------------------------------------------

    try {

        const attendanceSnapshot =
            await get(
                ref(
                    db,
                    "attendance/" +
                    selectedDate
                )
            );

        const attendanceData =
            attendanceSnapshot.exists()
                ? attendanceSnapshot.val()
                : {};


        // ----------------------------------------------------
        // CHECK EACH STUDENT
        // ----------------------------------------------------

        groupsToCheck.forEach(group => {

            groups[group].forEach(
                studentName => {

                    const studentId =
                        createStudentId(
                            group,
                            studentName
                        );

                    let record =
                        findAttendanceRecord(
                            attendanceData,
                            group,
                            studentId,
                            studentName
                        );

                    if (!isPresent(record)) {

                        absentStudents.push({
                            group:
                                group,

                            name:
                                studentName
                        });

                    }

                }
            );

        });

    } catch (error) {

        console.error(
            "STATISTICS ERROR:",
            error
        );

    }


    totalStudents.textContent =
        studentTotal;

    absentCount.textContent =
        absentStudents.length;


    // --------------------------------------------------------
    // ABSENT LIST
    // --------------------------------------------------------

    if (
        absentStudents.length === 0
    ) {

        absentList.innerHTML =
            "<p>No absent students.</p>";

        return;
    }


    absentList.innerHTML =
        absentStudents
            .map(student => `
                <div class="absent-student">
                    <strong>
                        ${escapeHtml(
                            student.name
                        )}
                    </strong>
                    <span>
                        Group ${escapeHtml(
                            student.group
                        )}
                    </span>
                </div>
            `)
            .join("");

}


// ============================================================
// FIND ATTENDANCE RECORD
// ============================================================

function findAttendanceRecord(
    attendanceData,
    group,
    studentId,
    studentName
) {

    if (!attendanceData) {
        return null;
    }


    // Format:
    // attendance/date/group/studentId

    if (
        attendanceData[group] &&
        attendanceData[group][studentId]
    ) {

        return attendanceData[group][studentId];

    }


    // Format:
    // attendance/date/studentId

    if (
        attendanceData[studentId]
    ) {

        return attendanceData[studentId];

    }


    // Search through records

    for (
        const value of
        Object.values(attendanceData)
    ) {

        if (!value) {
            continue;
        }

        if (
            typeof value === "object"
        ) {

            if (
                value.studentId ===
                studentId
            ) {

                return value;

            }

            if (
                value.studentName ===
                studentName
            ) {

                if (
                    !value.group ||
                    String(value.group) ===
                    String(group)
                ) {

                    return value;

                }

            }

        }

    }

    return null;
}


// ============================================================
// CHECK PRESENT
// ============================================================

function isPresent(record) {

    if (!record) {
        return false;
    }


    if (
        record.present === true
    ) {
        return true;
    }


    if (
        record.status === "present"
    ) {
        return true;
    }


    if (
        record.status === "Present"
    ) {
        return true;
    }


    if (
        record.attended === true
    ) {
        return true;
    }


    return false;
}


// ============================================================
// TODAY
// ============================================================

function getTodayString() {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    return (
        `${year}-${month}-${day}`
    );
}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
