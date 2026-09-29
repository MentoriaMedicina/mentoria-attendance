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
    projectId: "mentoria-medicina-attend-7d5ca",
    storageBucket: "mentoria-medicina-attend-7d5ca.firebasestorage.app",
    messagingSenderId: "238479536134",
    appId: "1:238479536134:web:3ff9a57dc1cb70dc8c9387"
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

const loginSection = document.getElementById("loginSection");
const adminDashboard = document.getElementById("adminDashboard");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const loginBtn = document.getElementById("loginBtn");
const loginMessage = document.getElementById("loginMessage");

const logoutBtn = document.getElementById("logoutBtn");
const adminEmail = document.getElementById("adminEmail");

const groupFilter = document.getElementById("groupFilter");
const dateFilter = document.getElementById("dateFilter");

const absentList = document.getElementById("absentList");

const totalStudents = document.getElementById("totalStudents");
const absentCount = document.getElementById("absentCount");


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

if (loginBtn) {

    loginBtn.addEventListener("click", loginAdmin);

}


async function loginAdmin() {

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {

        showLoginMessage(
            "Please enter email and password.",
            "red"
        );

        return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";

    showLoginMessage(
        "Checking account...",
        "#1565c0"
    );

    try {

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user = userCredential.user;

        console.log(
            "Authentication successful:",
            user.uid
        );

        await verifyAdmin(user);

    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );

        showLoginMessage(
            getErrorMessage(error),
            "red"
        );

        loginBtn.disabled = false;
        loginBtn.textContent = "Login";

    }

}


// =====================================================
// VERIFY ADMIN
// =====================================================

async function verifyAdmin(user) {

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

            showLoginMessage(
                "This account has no admin permission.",
                "red"
            );

            loginBtn.disabled = false;
            loginBtn.textContent = "Login";

            return false;
        }


        const adminData =
            adminSnapshot.data();


        if (
            adminData.role !== "admin"
        ) {

            await signOut(auth);

            showLoginMessage(
                "This account is not an admin.",
                "red"
            );

            loginBtn.disabled = false;
            loginBtn.textContent = "Login";

            return false;
        }


        console.log(
            "Admin permission verified"
        );


        showDashboard(
            user,
            adminData
        );


        initializeDashboard();


        return true;


    } catch (error) {

        console.error(
            "ADMIN CHECK ERROR:",
            error
        );

        showLoginMessage(
            "Could not verify admin permission.",
            "red"
        );

        loginBtn.disabled = false;
        loginBtn.textContent = "Login";

        return false;

    }

}


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
            "Existing login:",
            user.email
        );


        await verifyAdmin(user);

    }
);


// =====================================================
// SHOW LOGIN
// =====================================================

function showLogin() {

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
            user.email;

    }

}


// =====================================================
// LOGIN MESSAGE
// =====================================================

function showLoginMessage(
    message,
    color
) {

    if (!loginMessage) return;

    loginMessage.textContent =
        message;

    loginMessage.style.color =
        color;

}


// =====================================================
// ERROR MESSAGE
// =====================================================

function getErrorMessage(error) {

    switch (error.code) {

        case "auth/invalid-credential":
            return "Incorrect email or password.";

        case "auth/invalid-email":
            return "Invalid email address.";

        case "auth/user-not-found":
            return "Account not found.";

        case "auth/wrong-password":
            return "Incorrect password.";

        case "auth/too-many-requests":
            return "Too many attempts. Try again later.";

        case "auth/network-request-failed":
            return "Network error. Check your internet.";

        default:
            return error.message ||
                   "Login failed.";

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

                if (emailInput)
                    emailInput.value = "";

                if (passwordInput)
                    passwordInput.value = "";

                showLogin();

                showLoginMessage(
                    "",
                    ""
                );

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
// INITIALIZE DASHBOARD
// =====================================================

let dashboardInitialized = false;


function initializeDashboard() {

    if (dashboardInitialized) {
        return;
    }

    dashboardInitialized = true;

    setupGroups();

    setupDate();

    createSessionPanel();

    loadAttendance();

}


// =====================================================
// GROUP FILTER
// =====================================================

function setupGroups() {

    if (!groupFilter) return;


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
// DATE FILTER
// =====================================================

function setupDate() {

    if (!dateFilter) return;


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

        checkActiveSession();

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
                class="open-session-btn"
                type="button">

                Open Attendance

            </button>


            <button
                id="closeSessionBtn"
                class="close-session-btn"
                type="button"
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

        status.textContent =
            "Opening attendance...";

        status.className =
            "session-status";


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


        setSessionControlsActive(
            group,
            duration
        );


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
                    active: false
                }
            );


            resetSession();

            return;
        }


        const remaining =
            Math.ceil(
                (
                    end.getTime() -
                    now.getTime()
                ) / 60000
            );


        const status =
            document.getElementById(
                "sessionStatus"
            );


        if (status) {

            status.textContent =
                `Group ${session.group} attendance is OPEN. ${remaining} minute(s) remaining.`;

            status.className =
                "session-status session-active";

        }


        setSessionControlsActive(
            session.group,
            session.duration
        );


    } catch (error) {

        console.error(
            "CHECK SESSION ERROR:",
            error
        );

    }

}


// =====================================================
// SET SESSION CONTROLS
// =====================================================

function setSessionControlsActive(
    group,
    duration
) {

    const groupSelect =
        document.getElementById(
            "sessionGroup"
        );

    const durationSelect =
        document.getElementById(
            "sessionDuration"
        );

    const openBtn =
        document.getElementById(
            "openSessionBtn"
        );

    const closeBtn =
        document.getElementById(
            "closeSessionBtn"
        );


    if (groupSelect) {

        groupSelect.value =
            group;

        groupSelect.disabled =
            true;

    }


    if (durationSelect) {

        durationSelect.value =
            String(duration);

        durationSelect.disabled =
            true;

    }


    if (openBtn) {

        openBtn.style.display =
            "none";

    }


    if (closeBtn) {

        closeBtn.style.display =
            "inline-block";

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


    const groupSelect =
        document.getElementById(
            "sessionGroup"
        );

    const durationSelect =
        document.getElementById(
            "sessionDuration"
        );

    const openBtn =
        document.getElementById(
            "openSessionBtn"
        );

    const closeBtn =
        document.getElementById(
            "closeSessionBtn"
        );


    if (status) {

        status.textContent =
            "No active session.";

        status.className =
            "session-status";

    }


    if (groupSelect) {

        groupSelect.disabled =
            false;

        groupSelect.value =
            "";

    }


    if (durationSelect) {

        durationSelect.disabled =
            false;

    }


    if (openBtn) {

        openBtn.style.display =
            "inline-block";

    }


    if (closeBtn) {

        closeBtn.style.display =
            "none";

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


        if (snapshot.empty) {

            resetSession();

            return;
        }


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


        const status =
            document.getElementById(
                "sessionStatus"
            );


        if (status) {

            status.textContent =
                "Could not close attendance.";

            status.className =
                "session-status error";

        }

    }

}


// =====================================================
// LOAD ATTENDANCE
// =====================================================

async function loadAttendance() {

    if (!absentList) return;


    absentList.innerHTML =
        "<p>Loading...</p>";


    try {

        const selectedGroup =
            groupFilter
                ? groupFilter.value
                : "";


        const selectedDate =
            dateFilter
                ? dateFilter.value
                : todayString();


        const attendanceSnapshot =
            await getDocs(
                collection(
                    db,
                    "attendance"
                )
            );


        const records = [];


        attendanceSnapshot.forEach(
            attendanceDoc => {

                const data =
                    attendanceDoc.data();


                if (
                    selectedGroup &&
                    String(data.group) !==
                    String(selectedGroup)
                ) {

                    return;
                }


                if (
                    selectedDate &&
                    !isSameDate(
                        data.submittedAt,
                        selectedDate
                    )
                ) {

                    return;
                }


                records.push({

                    id:
                        attendanceDoc.id,

                    ...data

                });

            }
        );


        records.sort(
            (a, b) => {

                const dateA =
                    getDateValue(
                        a.submittedAt
                    );

                const dateB =
                    getDateValue(
                        b.submittedAt
                    );

                return dateB - dateA;

            }
        );


        const total =
            selectedGroup
                ? groups[selectedGroup].length
                : Object.values(groups)
                    .reduce(
                        (sum, group) =>
                            sum + group.length,
                        0
                    );


        totalStudents.textContent =
            total;


        absentCount.textContent =
            records.length;


        displayAttendance(
            records
        );


    } catch (error) {

        console.error(
            "LOAD ATTENDANCE ERROR:",
            error
        );


        absentList.innerHTML = `
            <p class="error">
                Could not load attendance.
            </p>
        `;

    }

}


// =====================================================
// DISPLAY ATTENDANCE
// =====================================================

function displayAttendance(
    records
) {

    if (!records.length) {

        absentList.innerHTML = `
            <div class="empty-message">
                No absent students found.
            </div>
        `;

        return;
    }


    absentList.innerHTML = "";


    records.forEach(
        record => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "attendance-item";


            const time =
                formatDateTime(
                    record.submittedAt
                );


            item.innerHTML = `

                <div>

                    <strong>
                        ${escapeHtml(
                            record.studentName ||
                            "Unknown Student"
                        )}
                    </strong>

                    <div>
                        Group ${escapeHtml(
                            String(
                                record.group || ""
                            )
                        )}
                    </div>

                    <small>
                        ${time}
                    </small>

                </div>


                <button
                    class="delete-attendance-btn"
                    type="button">

                    Delete

                </button>

            `;


            const deleteBtn =
                item.querySelector(
                    ".delete-attendance-btn"
                );


            deleteBtn.addEventListener(
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
// DELETE ATTENDANCE
// =====================================================

async function deleteAttendance(
    attendanceId
) {

    if (!attendanceId) return;


    const confirmed =
        confirm(
            "Delete this absence record?"
        );


    if (!confirmed) {
        return;
    }


    try {

        await deleteDoc(
            doc(
                db,
                "attendance",
                attendanceId
            )
        );


        await loadAttendance();


    } catch (error) {

        console.error(
            "DELETE ATTENDANCE ERROR:",
            error
        );


        alert(
            "Could not delete the record."
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


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


// =====================================================
// CHECK SAME DATE
// =====================================================

function isSameDate(
    timestamp,
    selectedDate
) {

    if (!timestamp) {
        return false;
    }


    const date =
        getDateObject(
            timestamp
        );


    if (!date) {
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


    const dateString =
        `${year}-${month}-${day}`;


    return (
        dateString ===
        selectedDate
    );

}


// =====================================================
// DATE OBJECT
// =====================================================

function getDateObject(
    value
) {

    if (!value) {
        return null;
    }


    if (
        typeof value.toDate ===
        "function"
    ) {

        return value.toDate();

    }


    if (
        value instanceof Date
    ) {

        return value;

    }


    const date =
        new Date(value);


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return null;

    }


    return date;

}


// =====================================================
// DATE VALUE
// =====================================================

function getDateValue(
    value
) {

    const date =
        getDateObject(
            value
        );


    return date
        ? date.getTime()
        : 0;

}


// =====================================================
// FORMAT TIME
// =====================================================

function formatTime(
    date
) {

    return date.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// =====================================================
// FORMAT DATE + TIME
// =====================================================

function formatDateTime(
    value
) {

    const date =
        getDateObject(
            value
        );


    if (!date) {

        return "Time unavailable";

    }


    return date.toLocaleString(
        [],
        {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(
    value
) {

    return String(value)
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


// =====================================================
// AUTOMATIC SESSION CHECK
// =====================================================

setInterval(
    async () => {

        if (
            auth.currentUser
        ) {

            await checkActiveSession();

            await loadAttendance();

        }

    },
    30000
);


// =====================================================
// INITIAL STATE
// =====================================================

showLogin();
    
