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
    apiKey: "AIzaSyBPag4SLqUmdfAws0WFLV7FWp3X8_eLPQ",
    authDomain: "mentoria-medicina-attend-7d5ca.firebaseapp.com",
    databaseURL:
        "https://mentoria-medicina-attend-7d5ca-default-rtdb.firebaseio.com",
    projectId: "mentoria-medicina-attend-7d5ca",
    storageBucket:
        "mentoria-medicina-attend-7d5ca.firebasestorage.app",
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
// NORMALIZE STUDENT NAME
// =====================================================

function normalizeName(name) {

    return String(name || "")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();

}


// =====================================================
// GET TIMESTAMP VALUE
// =====================================================

function getTimestampValue(timestamp) {

    if (!timestamp) {
        return 0;
    }

    if (
        typeof timestamp.toMillis === "function"
    ) {
        return timestamp.toMillis();
    }

    if (
        typeof timestamp.seconds === "number"
    ) {
        return timestamp.seconds * 1000;
    }

    if (
        timestamp instanceof Date
    ) {
        return timestamp.getTime();
    }

    return 0;
}


// =====================================================
// LOGIN
// =====================================================

loginBtn.addEventListener(
    "click",
    async () => {

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

            if (
                adminData.role !== "admin"
            ) {

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

    }
);


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

            if (
                adminData.role !== "admin"
            ) {

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

    if (!container) {

        console.error(
            "dashboard-container not found"
        );

        return;
    }

    container.insertBefore(
        panel,
        container.firstChild
    );

    document
        .getElementById(
            "openSessionBtn"
        )
        .addEventListener(
            "click",
            openSession
        );

    document
        .getElementById(
            "closeSessionBtn"
        )
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

            group: String(group),

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

        if (
            now >= end
        ) {

            await updateDoc(
                doc(
                    db,
                    "sessions",
                    sessionDoc.id
                ),
                {
                    active: false,

                    closedAt:
                        serverTimestamp()
                }
            );

            resetSession();

            return;
        }

        const status =
            document.getElementById(
                "sessionStatus"
            );

        status.textContent =
            `Group ${session.group} attendance is OPEN until ${formatTime(end)}.`;

        status.className =
            "session-status session-active";

        document
            .getElementById(
                "sessionGroup"
            )
            .value =
            String(session.group);

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

        groupFilter.value =
            String(session.group);

    } catch (error) {

        console.error(
            "CHECK SESSION ERROR:",
            error
        );

    }

}


// =====================================================
// CLOSE SESSION
// =====================================================

async function closeSession() {

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

        for (
            const sessionDoc
            of snapshot.docs
        ) {

            await updateDoc(
                doc(
                    db,
                    "sessions",
                    sessionDoc.id
                ),
                {
                    active: false,

                    closedAt:
                        serverTimestamp(),

                    closedBy:
                        auth.currentUser.uid
                }
            );

        }

        resetSession();

        await loadAttendance();

    } catch (error) {

        console.error(
            "CLOSE SESSION ERROR:",
            error
        );

        alert(
            "Could not close session:\n" +
            error.message
        );

    }

}


// =====================================================
// RESET SESSION
// =====================================================

function resetSession() {

    const status =
        document.getElementById(
            "sessionStatus"
        );

    if (status) {

        status.textContent =
            "No active attendance session.";

        status.className =
            "session-status session-closed";
    }

    const openBtn =
        document.getElementById(
            "openSessionBtn"
        );

    const closeBtn =
        document.getElementById(
            "closeSessionBtn"
        );

    const group =
        document.getElementById(
            "sessionGroup"
        );

    const duration =
        document.getElementById(
            "sessionDuration"
        );

    if (openBtn)
        openBtn.style.display =
            "inline-block";

    if (closeBtn)
        closeBtn.style.display =
            "none";

    if (group) {

        group.disabled =
            false;

        group.value =
            "";

    }

    if (duration)
        duration.disabled =
            false;

}


// =====================================================
// LOAD ATTENDANCE
// =====================================================
// IMPORTANT FIX:
// Group filtering is done using the student roster.
// It does NOT depend only on data.group.
// =====================================================

async function loadAttendance() {

    absentList.innerHTML =
        "<p>Loading attendance...</p>";

    try {

        const selectedGroup =
            String(
                groupFilter.value || ""
            ).trim();

        const selectedDate =
            dateFilter.value;

        console.log(
            "================================="
        );

        console.log(
            "Selected Group:",
            selectedGroup
        );

        console.log(
            "Selected Date:",
            selectedDate
        );

        console.log(
            "================================="
        );

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "attendance"
                )
            );

        const records = [];

        snapshot.forEach(
            (docSnapshot) => {

                const data =
                    docSnapshot.data();

                const studentName =
                    String(
                        data.studentName || ""
                    ).trim();

                const storedGroup =
                    String(
                        data.group ?? ""
                    ).trim();

                console.log(
                    "Attendance:",
                    studentName,
                    "| Firestore group:",
                    storedGroup
                );


                // =====================================
                // GROUP FILTER
                // =====================================

                if (selectedGroup) {

                    const selectedStudents =
                        groups[selectedGroup] || [];

                    const normalizedStudentName =
                        normalizeName(
                            studentName
                        );

                    const belongsToGroup =
                        selectedStudents.some(
                            (name) => {

                                return (
                                    normalizeName(name) ===
                                    normalizedStudentName
                                );

                            }
                        );

                    if (!belongsToGroup) {

                        console.log(
                            "Removed by group filter:",
                            studentName
                        );

                        return;
                    }

                }


                // =====================================
                // DATE FILTER
                // =====================================

                if (
                    data.submittedAt
                ) {

                    let attendanceDate =
                        null;


                    if (
                        typeof data.submittedAt.toDate ===
                        "function"
                    ) {

                        attendanceDate =
                            dateString(
                                data.submittedAt.toDate()
                            );

                    }

                    else if (
                        typeof data.submittedAt.toMillis ===
                        "function"
                    ) {

                        attendanceDate =
                            dateString(
                                new Date(
                                    data.submittedAt.toMillis()
                                )
                            );

                    }

                    else if (
                        typeof data.submittedAt.seconds ===
                        "number"
                    ) {

                        attendanceDate =
                            dateString(
                                new Date(
                                    data.submittedAt.seconds *
                                    1000
                                )
                            );

                    }

                    else if (
                        data.submittedAt instanceof Date
                    ) {

                        attendanceDate =
                            dateString(
                                data.submittedAt
                            );

                    }


                    if (
                        attendanceDate &&
                        attendanceDate !== selectedDate
                    ) {

                        return;
                    }

                }


                records.push({

                    id:
                        docSnapshot.id,

                    ...data

                });

            }
        );


        // =====================================
        // SORT NEWEST FIRST
        // =====================================

        records.sort(
            (a, b) => {

                const aTime =
                    getTimestampValue(
                        a.submittedAt
                    );

                const bTime =
                    getTimestampValue(
                        b.submittedAt
                    );

                return (
                    bTime - aTime
                );

            }
        );


        console.log(
            "================================="
        );

        console.log(
            "FINAL FILTERED RECORDS:",
            records
        );

        console.log(
            "Total records:",
            records.length
        );

        console.log(
            "================================="
        );


        displayAttendance(
            records,
            selectedGroup
        );

    } catch (error) {

        console.error(
            "ATTENDANCE ERROR:",
            error
        );

        absentList.innerHTML = `

            <p style="color:red;">

                Error loading attendance:<br><br>

                ${escapeHtml(
                    error.message
                )}

            </p>

        `;

    }

}


// =====================================================
// DISPLAY ATTENDANCE
// =====================================================

function displayAttendance(
    records,
    selectedGroup
) {

    let total = 0;


    if (selectedGroup) {

        total =
            groups[selectedGroup]?.length ||
            0;

    }

    else {

        total =
            Object.values(groups)
                .reduce(
                    (sum, list) =>
                        sum + list.length,
                    0
                );

    }


    totalStudents.textContent =
        total;

    absentCount.textContent =
        records.length;


    if (
        records.length === 0
    ) {

        absentList.innerHTML = `

            <p>
                No absent students found.
            </p>

        `;

        return;
    }


    absentList.innerHTML =
        "";


    records.forEach(
        (record, index) => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "attendance-item";


            let time =
                "";


            if (
                record.submittedAt &&
                typeof record.submittedAt.toDate ===
                "function"
            ) {

                time =
                    formatTime(
                        record.submittedAt.toDate()
                    );

            }

            else if (
                record.submittedAt &&
                typeof record.submittedAt.toMillis ===
                "function"
            ) {

                time =
                    formatTime(
                        new Date(
                            record.submittedAt.toMillis()
                        )
                    );

            }

            else if (
                record.submittedAt &&
                typeof record.submittedAt.seconds ===
                "number"
            ) {

                time =
                    formatTime(
                        new Date(
                            record.submittedAt.seconds *
                            1000
                        )
                    );

            }


            item.innerHTML = `

                <strong>

                    ${index + 1}.
                    ${escapeHtml(
                        record.studentName ||
                        "Unknown"
                    )}

                </strong>

                <br><br>

                Group:
                ${escapeHtml(
                    String(
                        record.group ??
                        findStudentGroup(
                            record.studentName
                        ) ||
                        "-"
                    )
                )}

                <br>

                Time:
                ${time || "Unknown"}

                <br><br>

                <button
                    class="delete-attendance"
                    style="
                        padding:7px 12px;
                        border:none;
                        border-radius:6px;
                        background:#c62828;
                        color:white;
                        cursor:pointer;
                    "
                >
                    Delete
                </button>

            `;


            item
                .querySelector(
                    ".delete-attendance"
                )
                .addEventListener(
                    "click",
                    () => {

                        deleteAttendance(
                            record.id
                        );

                    }
                );


            absentList.appendChild(
                item
            );

        }
    );

}


// =====================================================
// FIND STUDENT GROUP
// =====================================================

function findStudentGroup(
    studentName
) {

    const normalized =
        normalizeName(
            studentName
        );

    for (
        const [groupNumber, students]
        of Object.entries(groups)
    ) {

        const found =
            students.some(
                (name) =>
                    normalizeName(name) ===
                    normalized
            );

        if (found) {

            return groupNumber;

        }

    }

    return null;

}


// =====================================================
// DELETE ATTENDANCE
// =====================================================

async function deleteAttendance(
    id
) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this absence record?"
        );

    if (!confirmDelete) {
        return;
    }

    try {

        await deleteDoc(
            doc(
                db,
                "attendance",
                id
            )
        );

        await loadAttendance();

    } catch (error) {

        console.error(
            "DELETE ERROR:",
            error
        );

        alert(
            "Could not delete record:\n" +
            error.message
        );

    }

}


// =====================================================
// DATE HELPERS
// =====================================================

function todayString() {

    const now =
        new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );

    return `${year}-${month}-${day}`;

}


function dateString(
    date
) {

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

    return `${year}-${month}-${day}`;

}


// =====================================================
// TIME
// =====================================================

function formatTime(
    date
) {

    return date.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        }
    );

}


// =====================================================
// SECURITY
// =====================================================

function escapeHtml(
    text
) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        String(text ?? "");

    return div.innerHTML;

}


// =====================================================
// FIREBASE ERROR
// =====================================================

function getErrorMessage(
    error
) {

    console.error(
        "Firebase error:",
        error
    );

    switch (
        error.code
    ) {

        case "auth/invalid-credential":

            return "Incorrect email or password.";

        case "auth/invalid-email":

            return "Invalid email address.";

        case "auth/user-not-found":

            return "No Firebase account exists with this email.";

        case "auth/wrong-password":

            return "Incorrect password.";

        case "auth/too-many-requests":

            return "Too many attempts. Try again later.";

        case "auth/network-request-failed":

            return "Network error. Check your internet connection.";

        case "auth/unauthorized-domain":

            return "This website is not authorized in Firebase.";

        case "auth/api-key-not-valid":

            return "Firebase API key is invalid.";

        case "permission-denied":

            return "Firestore permission denied. Check Firestore Rules.";

        case "failed-precondition":

            return "Firestore operation failed. Check Firebase configuration.";

        case "unavailable":

            return "Firebase is temporarily unavailable. Check your internet.";

        default:

            return (
                error.message ||
                "Login failed."
            );

    }

}
