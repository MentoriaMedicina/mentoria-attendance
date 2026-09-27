/* ==================================================
   FIREBASE
================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyBPag4SLUqmdfAws0WFLV7FWp3X8_eLPQ",
    authDomain: "mentoria-medicina-attend-7d5ca.firebaseapp.com",
    projectId: "mentoria-medicina-attend-7d5ca",
    storageBucket: "mentoria-medicina-attend-7d5ca.firebasestorage.app",
    messagingSenderId: "238479536134",
    appId: "1:238479536134:web:3ff9a57dc1cb70dc8c9387"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Firebase connected");


/* ==================================================
   STUDENT GROUPS
================================================== */

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


/* ==================================================
   HTML ELEMENTS
================================================== */

const groupSelect =
    document.getElementById("groupSelect");

const searchInput =
    document.getElementById("searchInput");

const studentList =
    document.getElementById("studentList");

const classTitle =
    document.getElementById("classTitle");

const attendanceStatus =
    document.getElementById("attendanceStatus");

const totalStudents =
    document.getElementById("totalStudents");

const absentCount =
    document.getElementById("absentCount");


/* ==================================================
   VARIABLES
================================================== */

let activeSession = null;

let attendance = {};

let loading = false;


/* ==================================================
   CREATE STUDENT ID
================================================== */

function createStudentId(group, name) {

    return (
        group +
        "_" +
        name
            .replace(/\s+/g, "_")
            .replace(/[.#$[\]/]/g, "")
    );

}


/* ==================================================
   LOAD GROUPS
================================================== */

Object.keys(groups).forEach(groupName => {

    const option =
        document.createElement("option");

    option.value = groupName;

    option.textContent = groupName;

    groupSelect.appendChild(option);

});


/* ==================================================
   FIND ACTIVE SESSION
================================================== */

async function findActiveSession() {

    try {

        const sessionsRef =
            collection(db, "sessions");

        const sessionQuery =
            query(
                sessionsRef,
                where("active", "==", true)
            );

        const snapshot =
            await getDocs(sessionQuery);


        activeSession = null;


        if (snapshot.empty) {

            updateStatus("No active attendance");

            return null;

        }


        /*
           Find a session whose time
           is currently active.
        */

        const now =
            new Date();


        for (const sessionDoc of snapshot.docs) {

            const data =
                sessionDoc.data();


            let startTime = null;
            let endTime = null;


            if (data.startTime) {

                startTime =
                    data.startTime.toDate
                        ? data.startTime.toDate()
                        : new Date(data.startTime);

            }


            if (data.endTime) {

                endTime =
                    data.endTime.toDate
                        ? data.endTime.toDate()
                        : new Date(data.endTime);

            }


            /*
               If session has no time,
               consider it active.
            */

            if (
                !startTime ||
                !endTime ||
                (
                    now >= startTime &&
                    now <= endTime
                )
            ) {

                activeSession = {

                    id: sessionDoc.id,

                    ...data

                };

                break;

            }

        }


        if (!activeSession) {

            updateStatus("Attendance closed");

            return null;

        }


        updateStatus(
            "Attendance Open"
        );


        return activeSession;


    } catch (error) {

        console.error(
            "Session loading error:",
            error
        );


        updateStatus(
            "Connection error"
        );


        return null;

    }

}


/* ==================================================
   UPDATE ATTENDANCE STATUS
================================================== */

function updateStatus(message) {

    if (attendanceStatus) {

        attendanceStatus.textContent =
            message;

    }

}


/* ==================================================
   LOAD ATTENDANCE
================================================== */

async function loadAttendance() {

    attendance = {};


    if (!activeSession) {

        displayStudents();

        return;

    }


    const selectedGroup =
        groupSelect.value;


    if (!selectedGroup) {

        displayStudents();

        return;

    }


    try {

        const attendanceRef =
            collection(db, "attendance");


        const attendanceQuery =
            query(
                attendanceRef,
                where(
                    "sessionId",
                    "==",
                    activeSession.id
                ),
                where(
                    "group",
                    "==",
                    selectedGroup
                )
            );


        const snapshot =
            await getDocs(
                attendanceQuery
            );


        snapshot.forEach(
            attendanceDoc => {

                const data =
                    attendanceDoc.data();


                attendance[
                    data.studentId
                ] = {

                    id: attendanceDoc.id,

                    ...data

                };

            }
        );


    } catch (error) {

        console.error(
            "Attendance loading error:",
            error
        );

    }


    displayStudents();

}


/* ==================================================
   DISPLAY STUDENTS
================================================== */

function displayStudents() {

    const selectedGroup =
        groupSelect.value;


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    studentList.innerHTML = "";


    /*
       No group selected
    */

    if (!selectedGroup) {

        classTitle.textContent =
            "Select a group";

        totalStudents.textContent =
            "0";

        absentCount.textContent =
            "0";


        studentList.innerHTML =
            `
            <div class="empty-message">
                Please select a group.
            </div>
            `;

        return;

    }


    classTitle.textContent =
        selectedGroup;


    const students =
        groups[selectedGroup];


    totalStudents.textContent =
        students.length;


    let numberOfAbsent = 0;


    students.forEach(
        (student, index) => {

            const studentId =
                createStudentId(
                    selectedGroup,
                    student
                );


            const record =
                attendance[studentId];


            if (record) {

                numberOfAbsent++;

            }


            /*
               Search filter
            */

            if (
                searchText &&
                !student
                    .toLowerCase()
                    .includes(searchText)
            ) {

                return;

            }


            /* =========================
               CARD
            ========================= */

            const card =
                document.createElement("div");

            card.className =
                "student-card";


            /* Student information */

            const studentInfo =
                document.createElement("div");

            studentInfo.className =
                "student-info";


            const number =
                document.createElement("span");

            number.className =
                "student-number";

            number.textContent =
                (index + 1) + ".";


            const name =
                document.createElement("span");

            name.className =
                "student-name";

            name.textContent =
                student;


            studentInfo.appendChild(number);

            studentInfo.appendChild(name);


            /* =========================
               ABSENT BUTTON
            ========================= */

            const button =
                document.createElement("button");

            button.className =
                "absent-button";


            /*
               Already absent
            */

            if (record) {

                button.textContent =
                    "✓ SUBMITTED";

                button.disabled =
                    true;

                button.classList.add(
                    "submitted"
                );

            }


            /*
               No active session
            */

            else if (!activeSession) {

                button.textContent =
                    "CLOSED";

                button.disabled =
                    true;

            }


            /*
               Active session
            */

            else {

                button.textContent =
                    "ABSENT";


                button.onclick =
                    () => markAbsent(
                        selectedGroup,
                        student
                    );

            }


            card.appendChild(
                studentInfo
            );

            card.appendChild(
                button
            );

            studentList.appendChild(
                card
            );

        }
    );


    absentCount.textContent =
        numberOfAbsent;

}


/* ==================================================
   MARK ABSENT
================================================== */

async function markAbsent(
    group,
    student
) {

    /*
       No session
    */

    if (!activeSession) {

        alert(
            "Attendance is currently closed."
        );

        return;

    }


    /*
       Check if already submitted
    */

    const studentId =
        createStudentId(
            group,
            student
        );


    if (attendance[studentId]) {

        return;

    }


    /*
       Temporarily show submitted
    */

    attendance[studentId] = {

        studentId: studentId,

        studentName: student,

        group: group,

        status: "absent",

        sessionId:
            activeSession.id,

        submittedAt:
            new Date()

    };


    displayStudents();


    try {

        /*
           Save as a NEW document.

           This means:

           Day 1:
           session1_student

           Day 2:
           session2_student

           Therefore old attendance
           is never overwritten.
        */

        await addDoc(
            collection(
                db,
                "attendance"
            ),
            {

                sessionId:
                    activeSession.id,

                studentId:
                    studentId,

                studentName:
                    student,

                group:
                    group,

                status:
                    "absent",

                submittedAt:
                    serverTimestamp()

            }
        );


        alert(
            student +
            " marked as ABSENT."
        );


    } catch (error) {

        console.error(
            "Firebase save error:",
            error
        );


        /*
           Remove temporary record
        */

        delete attendance[
            studentId
        ];


        displayStudents();


        alert(
            "Attendance could not be saved.\n\n" +
            "Please check Firebase Firestore Rules."
        );

    }

}


/* ==================================================
   GROUP CHANGE
================================================== */

groupSelect.addEventListener(
    "change",
    async function () {

        attendance = {};

        displayStudents();

        await loadAttendance();

    }
);


/* ==================================================
   SEARCH
================================================== */

searchInput.addEventListener(
    "input",
    displayStudents
);


/* ==================================================
   INITIAL LOAD
================================================== */

async function initializeAttendance() {

    loading = true;


    updateStatus(
        "Checking attendance..."
    );


    await findActiveSession();


    /*
       If admin opened a session,
       automatically select its group.
    */

    if (
        activeSession &&
        activeSession.group &&
        groups[activeSession.group]
    ) {

        groupSelect.value =
            activeSession.group;

    }


    await loadAttendance();


    loading = false;

}


/* ==================================================
   START
================================================== */

initializeAttendance();
