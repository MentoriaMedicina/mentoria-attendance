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
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    onSnapshot,
    serverTimestamp
} from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// =====================================================
// FIREBASE CONFIG
// =====================================================

const firebaseConfig = {
    apiKey: "AIzaSyBPag4SLUqmdfAws0WFLV7FWp3X8_eLPXQ",
    authDomain: "mentoria-medicina-attend-7d5ca.firebaseapp.com",
    projectId: "mentoria-medicina-attend-7d5ca",
    storageBucket: "mentoria-medicina-attend-7d5ca.firebasestorage.app",
    messagingSenderId: "238479536134",
    appId: "1:238479536134:web:3ff9a57dc1cb70dc8c9387"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// =====================================================
// GROUPS
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
// GLOBAL VARIABLES
// =====================================================

let currentUser = null;
let attendanceCache = [];
let sessionsCache = [];


// =====================================================
// ELEMENTS
// =====================================================

const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");

const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const loginError = document.getElementById("loginError");

const logoutBtn = document.getElementById("logoutBtn");

const groupFilter = document.getElementById("groupFilter");
const dateFilter = document.getElementById("dateFilter");

const totalStudentsEl = document.getElementById("totalStudents");
const presentCountEl = document.getElementById("presentCount");
const absentCountEl = document.getElementById("absentCount");
const attendancePercentageEl =
    document.getElementById("attendancePercentage");

const absentList = document.getElementById("absentList");

const sessionGroup = document.getElementById("sessionGroup");
const sessionDuration = document.getElementById("sessionDuration");
const openSessionBtn = document.getElementById("openSessionBtn");

const sessionStatus = document.getElementById("sessionStatus");


// =====================================================
// DATE FUNCTION
// =====================================================

function getTodayString() {

    const now = new Date();

    const year = now.getFullYear();

    const month = String(
        now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        now.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// =====================================================
// STUDENT ID
// MUST MATCH student.js
// =====================================================

function createStudentId(group, studentName) {

    return `grp_${group}_${studentName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")}`;
}


// =====================================================
// INITIALIZE GROUP FILTER
// =====================================================

function initializeGroupFilters() {

    if (!groupFilter) return;

    groupFilter.innerHTML = "";

    const allOption = document.createElement("option");

    allOption.value = "all";
    allOption.textContent = "ALL GROUPS";

    groupFilter.appendChild(allOption);

    Object.keys(groups).forEach(group => {

        const option = document.createElement("option");

        option.value = group;
        option.textContent = `Group ${group}`;

        groupFilter.appendChild(option);
    });


    if (sessionGroup) {

        sessionGroup.innerHTML = "";

        const allSessionOption =
            document.createElement("option");

        allSessionOption.value = "all";
        allSessionOption.textContent = "ALL GROUPS";

        sessionGroup.appendChild(allSessionOption);


        Object.keys(groups).forEach(group => {

            const option = document.createElement("option");

            option.value = group;
            option.textContent = `Group ${group}`;

            sessionGroup.appendChild(option);
        });
    }
}


// =====================================================
// LOGIN
// =====================================================

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        loginError.textContent = "";

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {

            loginError.textContent =
                "Please enter email and password.";

            return;
        }

        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        } catch (error) {

            console.error("LOGIN ERROR:", error);

            loginError.textContent =
                getAuthErrorMessage(error);
        }
    });
}


// =====================================================
// AUTH ERROR MESSAGE
// =====================================================

function getAuthErrorMessage(error) {

    switch (error.code) {

        case "auth/invalid-credential":
            return "Invalid email or password.";

        case "auth/wrong-password":
            return "Wrong password.";

        case "auth/user-not-found":
            return "No Firebase account found.";

        case "auth/invalid-email":
            return "Invalid email address.";

        case "auth/too-many-requests":
            return "Too many attempts. Try again later.";

        case "auth/network-request-failed":
            return "Network error. Check internet.";

        default:
            return error.message || "Login failed.";
    }
}


// =====================================================
// AUTH STATE
// =====================================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        currentUser = null;

        showLogin();

        return;
    }


    try {

        const adminRef =
            doc(db, "admins", user.uid);

        const adminSnap =
            await getDoc(adminRef);


        if (!adminSnap.exists()) {

            await signOut(auth);

            showLogin();

            if (loginError) {

                loginError.textContent =
                    "This account has no admin permission.";
            }

            return;
        }


        const adminData = adminSnap.data();


        if (adminData.role !== "admin") {

            await signOut(auth);

            showLogin();

            if (loginError) {

                loginError.textContent =
                    "This account has no admin permission.";
            }

            return;
        }


        currentUser = user;

        showDashboard();

        initializeGroupFilters();

        if (dateFilter) {
            dateFilter.value = getTodayString();
        }

        startAttendanceListener();

        startSessionListener();

        loadStatistics();

    } catch (error) {

        console.error(
            "ADMIN CHECK ERROR:",
            error
        );

        await signOut(auth);

        showLogin();

        if (loginError) {

            loginError.textContent =
                "Unable to verify admin permission.";
        }
    }
});


// =====================================================
// SHOW LOGIN
// =====================================================

function showLogin() {

    if (loginSection)
        loginSection.style.display = "block";

    if (dashboardSection)
        dashboardSection.style.display = "none";
}


// =====================================================
// SHOW DASHBOARD
// =====================================================

function showDashboard() {

    if (loginSection)
        loginSection.style.display = "none";

    if (dashboardSection)
        dashboardSection.style.display = "block";
}


// =====================================================
// LOGOUT
// =====================================================

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        try {

            await signOut(auth);

        } catch (error) {

            console.error(
                "LOGOUT ERROR:",
                error
            );
        }
    });
}


// =====================================================
// OPEN ATTENDANCE SESSION
// =====================================================

if (openSessionBtn) {

    openSessionBtn.addEventListener(
        "click",
        openSession
    );
}


async function openSession() {

    if (!currentUser) {

        alert("Please login first.");

        return;
    }


    const group =
        sessionGroup.value;

    const duration =
        Number(sessionDuration.value);


    if (!group) {

        alert("Please select a group.");

        return;
    }


    if (!duration || duration <= 0) {

        alert("Please enter a valid duration.");

        return;
    }


    try {

        // ---------------------------------------------
        // CHECK ACTIVE SESSION
        // ---------------------------------------------

        const sessionsSnap =
            await getDocs(
                collection(db, "sessions")
            );


        let activeSessionExists = false;


        for (const sessionDoc of sessionsSnap.docs) {

            const data = sessionDoc.data();

            if (!data.active) continue;


            const endTime =
                Number(data.endTime || 0);


            if (endTime > Date.now()) {

                activeSessionExists = true;

                break;

            } else {

                // Automatically close expired session

                await updateDoc(
                    sessionDoc.ref,
                    {
                        active: false,
                        closedAt: serverTimestamp()
                    }
                );
            }
        }


        if (activeSessionExists) {

            alert(
                "Another attendance session is already active."
            );

            return;
        }


        // ---------------------------------------------
        // CREATE SESSION
        // ---------------------------------------------

        const now = Date.now();

        const endTime =
            now + duration * 60 * 1000;


        const sessionData = {

            group: group,

            active: true,

            startTime: now,

            endTime: endTime,

            duration: duration,

            date: getTodayString(),

            createdBy: currentUser.uid,

            createdAt: serverTimestamp()
        };


        const sessionRef =
            await addDoc(
                collection(db, "sessions"),
                sessionData
            );


        alert(
            group === "all"
                ? `Attendance opened for ALL GROUPS for ${duration} minutes.`
                : `Attendance opened for Group ${group} for ${duration} minutes.`
        );


        console.log(
            "SESSION CREATED:",
            sessionRef.id
        );

    } catch (error) {

        console.error(
            "OPEN SESSION ERROR:",
            error
        );

        alert(
            "Could not open attendance.\n\n" +
            error.message
        );
    }
}


// =====================================================
// SESSION LISTENER
// =====================================================

function startSessionListener() {

    onSnapshot(
        collection(db, "sessions"),
        async (snapshot) => {

            sessionsCache = [];

            let activeSession = null;


            for (const sessionDoc of snapshot.docs) {

                const data = sessionDoc.data();

                const session = {

                    id: sessionDoc.id,

                    ...data
                };


                sessionsCache.push(session);


                if (data.active) {

                    const endTime =
                        Number(data.endTime || 0);


                    if (
                        endTime > Date.now()
                    ) {

                        activeSession = session;

                    } else {

                        try {

                            await updateDoc(
                                sessionDoc.ref,
                                {
                                    active: false,
                                    closedAt:
                                        serverTimestamp()
                                }
                            );

                        } catch (error) {

                            console.error(
                                "AUTO CLOSE ERROR:",
                                error
                            );
                        }
                    }
                }
            }


            displaySessionStatus(
                activeSession
            );
        }
    );
}


// =====================================================
// DISPLAY SESSION STATUS
// =====================================================

function displaySessionStatus(session) {

    if (!sessionStatus) return;


    if (!session) {

        sessionStatus.innerHTML =
            "🔴 Attendance is CLOSED.";

        return;
    }


    const groupText =
        session.group === "all"
            ? "ALL GROUPS"
            : `Group ${session.group}`;


    const remaining =
        Math.max(
            0,
            Math.ceil(
                (Number(session.endTime) - Date.now())
                / 60000
            )
        );


    sessionStatus.innerHTML =
        `🟢 Attendance OPEN — ${groupText} — ${remaining} minute(s) remaining`;
}


// =====================================================
// ATTENDANCE LISTENER
// =====================================================

function startAttendanceListener() {

    onSnapshot(
        collection(db, "attendance"),
        (snapshot) => {

            attendanceCache = [];


            snapshot.forEach(docSnap => {

                attendanceCache.push({

                    id: docSnap.id,

                    ...docSnap.data()
                });
            });


            loadStatistics();
        },

        (error) => {

            console.error(
                "ATTENDANCE LISTENER ERROR:",
                error
            );
        }
    );
}


// =====================================================
// FILTER EVENTS
// =====================================================

if (groupFilter) {

    groupFilter.addEventListener(
        "change",
        loadStatistics
    );
}


if (dateFilter) {

    dateFilter.addEventListener(
        "change",
        loadStatistics
    );
}


// =====================================================
// FIND ATTENDANCE RECORD
// =====================================================

function findAttendanceRecord(
    group,
    studentName,
    selectedDate
) {

    const studentId =
        createStudentId(
            group,
            studentName
        );


    return attendanceCache.find(record => {

        const recordDate =
            record.date ||
            record.attendanceDate ||
            record.day;


        if (
            selectedDate &&
            recordDate !== selectedDate
        ) {
            return false;
        }


        if (
            record.group !== group
        ) {
            return false;
        }


        if (
            record.studentId === studentId
        ) {
            return true;
        }


        if (
            record.studentName === studentName
        ) {
            return true;
        }


        return false;
    });
}


// =====================================================
// IS EXPLICIT ABSENCE
// =====================================================

function isAbsent(record) {

    if (!record) return false;


    return (
        record.status === "absent" ||
        record.present === false
    );
}


// =====================================================
// LOAD STATISTICS
// =====================================================

function loadStatistics() {

    if (!groupFilter || !dateFilter) return;


    const selectedGroup =
        groupFilter.value || "all";


    const selectedDate =
        dateFilter.value || getTodayString();


    let students = [];


    // ---------------------------------------------
    // ALL GROUPS
    // ---------------------------------------------

    if (selectedGroup === "all") {

        Object.keys(groups).forEach(group => {

            groups[group].forEach(name => {

                students.push({

                    group: group,

                    name: name
                });
            });
        });

    } else {

        if (!groups[selectedGroup]) {

            return;
        }


        groups[selectedGroup].forEach(name => {

            students.push({

                group: selectedGroup,

                name: name
            });
        });
    }


    const total =
        students.length;


    let absent = 0;

    const absentStudents = [];


    students.forEach(student => {

        const record =
            findAttendanceRecord(
                student.group,
                student.name,
                selectedDate
            );


        // IMPORTANT:
        // Only explicit ABSENT records count as absent.

        if (isAbsent(record)) {

            absent++;

            absentStudents.push(student);
        }
    });


    const present =
        total - absent;


    const percentage =
        total > 0
            ? ((present / total) * 100).toFixed(1)
            : "0.0";


    if (totalStudentsEl)
        totalStudentsEl.textContent =
            total;


    if (presentCountEl)
        presentCountEl.textContent =
            present;


    if (absentCountEl)
        absentCountEl.textContent =
            absent;


    if (attendancePercentageEl)
        attendancePercentageEl.textContent =
            `${percentage}%`;


    displayAbsentList(
        absentStudents
    );
}


// =====================================================
// DISPLAY ABSENT STUDENTS
// =====================================================

function displayAbsentList(
    absentStudents
) {

    if (!absentList) return;


    absentList.innerHTML = "";


    if (absentStudents.length === 0) {

        absentList.innerHTML =
            "<p>No absences submitted.</p>";

        return;
    }


    absentStudents.forEach(student => {

        const div =
            document.createElement("div");


        div.className =
            "absent-student";


        div.innerHTML = `
            <strong>${escapeHtml(student.name)}</strong>
            <span>Group ${escapeHtml(student.group)}</span>
        `;


        absentList.appendChild(div);
    });
}


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// =====================================================
// OPTIONAL: CLOSE ACTIVE SESSION
// If your HTML has a button with id="closeSessionBtn"
// =====================================================

const closeSessionBtn =
    document.getElementById(
        "closeSessionBtn"
    );


if (closeSessionBtn) {

    closeSessionBtn.addEventListener(
        "click",
        closeActiveSession
    );
}


async function closeActiveSession() {

    if (!currentUser) return;


    try {

        const snapshot =
            await getDocs(
                collection(db, "sessions")
            );


        let found = false;


        for (const sessionDoc of snapshot.docs) {

            const data =
                sessionDoc.data();


            if (data.active === true) {

                await updateDoc(
                    sessionDoc.ref,
                    {
                        active: false,
                        closedAt:
                            serverTimestamp(),
                        closedBy:
                            currentUser.uid
                    }
                );

                found = true;

                break;
            }
        }


        if (found) {

            alert(
                "Attendance session closed."
            );

        } else {

            alert(
                "No active attendance session."
            );
        }

    } catch (error) {

        console.error(
            "CLOSE SESSION ERROR:",
            error
        );

        alert(
            "Could not close session."
        );
    }
}
