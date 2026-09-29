// =====================================================
// MENTORIA MEDICINA - STUDENT ATTENDANCE
// Firebase Firestore
// =====================================================

import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    addDoc,
    serverTimestamp
} from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// =====================================================
// FIREBASE CONFIG
// =====================================================

const firebaseConfig = {

    apiKey: "AIzaSyBPag4SLUqmdfAws0WFLV7FWp3X8_eLPXQ",

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


const db =
    getFirestore(app);


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
// VARIABLES
// =====================================================

let activeSession = null;

let selectedGroup = null;

let attendanceRecords = [];


// =====================================================
// ELEMENTS
// =====================================================

const groupSelect =
    document.getElementById(
        "groupSelect"
    );

const studentList =
    document.getElementById(
        "studentList"
    );

const statusMessage =
    document.getElementById(
        "statusMessage"
    );


// =====================================================
// DATE
// =====================================================

function getTodayString() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            now.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// =====================================================
// STUDENT ID
// SAME AS ADMIN.JS
// =====================================================

function createStudentId(
    group,
    studentName
) {

    return `grp_${group}_${studentName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")}`;
}


// =====================================================
// INITIALIZE GROUP SELECT
// =====================================================

function initializeGroupSelect() {

    if (!groupSelect) return;


    groupSelect.innerHTML =
        `<option value="">Select your group</option>`;


    Object.keys(groups).forEach(group => {

        const option =
            document.createElement(
                "option"
            );

        option.value = group;

        option.textContent =
            `Group ${group}`;

        groupSelect.appendChild(
            option
        );
    });
}


// =====================================================
// FIND ACTIVE SESSION
// =====================================================

async function findActiveSession() {

    try {

        const q =
            query(
                collection(db, "sessions"),
                where("active", "==", true)
            );


        const snapshot =
            await getDocs(q);


        if (snapshot.empty) {

            activeSession = null;

            return null;
        }


        let foundSession = null;


        snapshot.forEach(docSnap => {

            const data =
                docSnap.data();


            const endTime =
                Number(
                    data.endTime || 0
                );


            if (
                data.active === true &&
                endTime > Date.now()
            ) {

                foundSession = {

                    id: docSnap.id,

                    ...data
                };
            }
        });


        activeSession =
            foundSession;


        return foundSession;


    } catch (error) {

        console.error(
            "FIND SESSION ERROR:",
            error
        );

        activeSession = null;

        return null;
    }
}


// =====================================================
// CHECK GROUP ALLOWED
// =====================================================

function isGroupAllowed(group) {

    if (!activeSession) {

        return false;
    }


    // ALL GROUPS

    if (
        activeSession.group === "all"
    ) {

        return true;
    }


    // SPECIFIC GROUP

    return (
        String(
            activeSession.group
        ) === String(group)
    );
}


// =====================================================
// LOAD ATTENDANCE
// =====================================================

async function loadAttendance() {

    if (!activeSession) {

        attendanceRecords = [];

        return;
    }


    try {

        const q =
            query(
                collection(db, "attendance"),
                where(
                    "sessionId",
                    "==",
                    activeSession.id
                )
            );


        const snapshot =
            await getDocs(q);


        attendanceRecords = [];


        snapshot.forEach(docSnap => {

            attendanceRecords.push({

                id: docSnap.id,

                ...docSnap.data()
            });
        });


    } catch (error) {

        console.error(
            "LOAD ATTENDANCE ERROR:",
            error
        );
    }
}


// =====================================================
// CHECK IF STUDENT ALREADY SUBMITTED
// =====================================================

function hasSubmitted(
    group,
    studentName
) {

    const studentId =
        createStudentId(
            group,
            studentName
        );


    return attendanceRecords.some(
        record => {

            return (
                record.studentId === studentId
            );
        }
    );
}


// =====================================================
// DISPLAY STUDENTS
// =====================================================

function displayStudents() {

    if (!studentList) return;


    studentList.innerHTML = "";


    if (!selectedGroup) {

        studentList.innerHTML =
            "<p>Please select your group.</p>";

        return;
    }


    const students =
        groups[selectedGroup];


    if (!students) {

        studentList.innerHTML =
            "<p>Invalid group.</p>";

        return;
    }


    const allowed =
        isGroupAllowed(
            selectedGroup
        );


    students.forEach(studentName => {

        const container =
            document.createElement(
                "div"
            );

        container.className =
            "student-row";


        const name =
            document.createElement(
                "span"
            );

        name.textContent =
            studentName;


        const button =
            document.createElement(
                "button"
            );


        button.textContent =
            "ABSENT";


        button.className =
            "absent-button";


        // ---------------------------------------------
        // ALREADY SUBMITTED
        // ---------------------------------------------

        if (
            hasSubmitted(
                selectedGroup,
                studentName
            )
        ) {

            button.textContent =
                "✓ SUBMITTED";

            button.disabled = true;

            button.classList.add(
                "submitted"
            );
        }


        // ---------------------------------------------
        // SESSION CLOSED
        // ---------------------------------------------

        else if (!activeSession) {

            button.textContent =
                "CLOSED";

            button.disabled = true;
        }


        // ---------------------------------------------
        // GROUP NOT ALLOWED
        // ---------------------------------------------

        else if (!allowed) {

            button.textContent =
                "NOT OPEN";

            button.disabled = true;
        }


        // ---------------------------------------------
        // ACTIVE
        // ---------------------------------------------

        else {

            button.addEventListener(
                "click",
                () => {

                    markAbsent(
                        selectedGroup,
                        studentName,
                        button
                    );
                }
            );
        }


        container.appendChild(name);

        container.appendChild(button);

        studentList.appendChild(
            container
        );
    });
}


// =====================================================
// MARK ABSENT
// =====================================================

async function markAbsent(
    group,
    studentName,
    button
) {

    if (!activeSession) {

        alert(
            "Attendance is closed."
        );

        return;
    }


    if (
        !isGroupAllowed(group)
    ) {

        alert(
            "Attendance is not open for your group."
        );

        return;
    }


    if (
        hasSubmitted(
            group,
            studentName
        )
    ) {

        alert(
            "You have already submitted."
        );

        return;
    }


    // ---------------------------------------------
    // LOCK BUTTON IMMEDIATELY
    // ---------------------------------------------

    button.disabled = true;

    button.textContent =
        "Submitting...";


    const studentId =
        createStudentId(
            group,
            studentName
        );


    try {

        const record = {

            sessionId:
                activeSession.id,

            studentId:
                studentId,

            studentName:
                studentName,

            group:
                group,

            date:
                getTodayString(),

            status:
                "absent",

            present:
                false,

            submittedAt:
                serverTimestamp()
        };


        await addDoc(
            collection(db, "attendance"),
            record
        );


        // Add locally so it locks immediately

        attendanceRecords.push({
            ...record
        });


        button.textContent =
            "✓ SUBMITTED";


        button.classList.add(
            "submitted"
        );


        if (statusMessage) {

            statusMessage.textContent =
                `${studentName}: absence submitted successfully.`;
        }


    } catch (error) {

        console.error(
            "MARK ABSENT ERROR:",
            error
        );


        button.disabled = false;

        button.textContent =
            "ABSENT";


        alert(
            "Could not submit absence.\n\n" +
            error.message
        );
    }
}


// =====================================================
// GROUP CHANGE
// =====================================================

if (groupSelect) {

    groupSelect.addEventListener(
        "change",
        async () => {

            selectedGroup =
                groupSelect.value;


            await findActiveSession();

            await loadAttendance();

            displayStudents();
        }
    );
}


// =====================================================
// INITIALIZE
// =====================================================

async function initializeAttendance() {

    initializeGroupSelect();


    await findActiveSession();


    await loadAttendance();


    if (activeSession) {

        // If a specific group is open,
        // automatically select it.

        if (
            activeSession.group !== "all" &&
            groups[
                activeSession.group
            ]
        ) {

            selectedGroup =
                activeSession.group;


            if (groupSelect) {

                groupSelect.value =
                    activeSession.group;
            }

        } else {

            // ALL GROUPS

            selectedGroup =
                groupSelect
                    ? groupSelect.value
                    : null;
        }
    }


    displayStudents();


    updateStatusMessage();
}


// =====================================================
// STATUS MESSAGE
// =====================================================

function updateStatusMessage() {

    if (!statusMessage) return;


    if (!activeSession) {

        statusMessage.textContent =
            "Attendance is currently closed.";

        return;
    }


    const groupText =
        activeSession.group === "all"
            ? "ALL GROUPS"
            : `Group ${activeSession.group}`;


    const remaining =
        Math.max(
            0,
            Math.ceil(
                (
                    Number(
                        activeSession.endTime
                    ) - Date.now()
                ) / 60000
            )
        );


    statusMessage.textContent =
        `Attendance OPEN — ${groupText} — ${remaining} minute(s) remaining.`;
}


// =====================================================
// AUTO REFRESH SESSION
// =====================================================

setInterval(
    async () => {

        await findActiveSession();

        await loadAttendance();

        displayStudents();

        updateStatusMessage();

    },
    10000
);


// =====================================================
// START
// =====================================================

initializeAttendance();
