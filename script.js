/* ==================================================
   FIREBASE
================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
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
   VARIABLES
================================================== */

const groupSelect =
    document.getElementById("groupSelect");

const searchInput =
    document.getElementById("searchInput");

const studentList =
    document.getElementById("studentList");

const classTitle =
    document.getElementById("classTitle");

const totalStudents =
    document.getElementById("totalStudents");

const absentCount =
    document.getElementById("absentCount");


/* ==================================================
   ATTENDANCE MEMORY
================================================== */

let attendance = {};


/* ==================================================
   LOAD GROUPS INTO DROPDOWN
================================================== */

Object.keys(groups).forEach(groupName => {

    const option =
        document.createElement("option");

    option.value = groupName;
    option.textContent = groupName;

    groupSelect.appendChild(option);

});


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


    /* No group selected */

    if (!selectedGroup) {

        classTitle.textContent =
            "Select a group";

        totalStudents.textContent =
            "0";

        absentCount.textContent =
            "0";

        studentList.innerHTML =
            '<div class="empty-message">' +
            'Please select a group.' +
            '</div>';

        return;
    }


    /* Group selected */

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


            /* Search */

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


            if (record) {

                button.textContent =
                    "✓ SUBMITTED";

                button.disabled =
                    true;

                button.classList.add(
                    "submitted"
                );

            } else {

                button.textContent =
                    "ABSENT";

                button.onclick =
                    () => markAbsent(
                        selectedGroup,
                        student
                    );

            }


            card.appendChild(studentInfo);
            card.appendChild(button);

            studentList.appendChild(card);

        }
    );


    absentCount.textContent =
        numberOfAbsent;

}


/* ==================================================
   LOAD ATTENDANCE FROM FIREBASE
================================================== */

async function loadAttendance() {

    const selectedGroup =
        groupSelect.value;


    if (!selectedGroup) {

        return;

    }


    /*
       First show students immediately.
    */

    displayStudents();


    const students =
        groups[selectedGroup];


    /*
       Clear old group attendance.
    */

    attendance = {};


    /*
       Load each student's record.
    */

    for (const student of students) {

        const studentId =
            createStudentId(
                selectedGroup,
                student
            );


        try {

            const attendanceRef =
                doc(
                    db,
                    "attendance",
                    studentId
                );


            const attendanceSnap =
                await getDoc(
                    attendanceRef
                );


            if (
                attendanceSnap.exists()
            ) {

                attendance[studentId] =
                    attendanceSnap.data();

            }

        } catch (error) {

            /*
               Firebase error will NOT
               stop the student list.
            */

            console.error(
                "Firebase loading error:",
                error
            );

        }

    }


    /*
       Update buttons after Firebase load.
    */

    displayStudents();

}


/* ==================================================
   MARK STUDENT ABSENT
================================================== */

async function markAbsent(
    group,
    student
) {

    const studentId =
        createStudentId(
            group,
            student
        );


    /*
       Already submitted?
    */

    if (attendance[studentId]) {

        return;

    }


    /*
       Temporarily disable by adding
       local record immediately.
    */

    attendance[studentId] = {

        studentId: studentId,

        studentName: student,

        group: group,

        status: "absent",

        submittedAt:
            new Date()

    };


    displayStudents();


    try {

        /*
           Save to Firestore.
        */

        await setDoc(
            doc(
                db,
                "attendance",
                studentId
            ),
            {

                studentId: studentId,

                studentName: student,

                group: group,

                status: "absent",

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
           If Firebase failed,
           remove temporary record.
        */

        delete attendance[studentId];

        displayStudents();


        alert(
            "Attendance could not be saved.\n\n" +
            "Please check Firestore Security Rules."
        );

    }

}


/* ==================================================
   GROUP CHANGE
================================================== */

groupSelect.addEventListener(
    "change",
    async function () {

        /*
           Show students immediately.
        */

        displayStudents();


        /*
           Then load Firebase data.
        */

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
   INITIAL DISPLAY
================================================== */

displayStudents();
