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


/*
   Temporary storage.

   Later Firebase will replace this.
*/

let attendance =
    JSON.parse(
        localStorage.getItem("attendanceData") || "{}"
    );


/* ==================================================
   LOAD GROUPS INTO SELECT
================================================== */

Object.keys(groups).forEach(groupName => {

    const option =
        document.createElement("option");

    option.value = groupName;

    option.textContent = groupName;

    groupSelect.appendChild(option);

});


/* ==================================================
   CREATE UNIQUE STUDENT ID
================================================== */

function createStudentId(group, name) {

    return group + "_" + name;

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


    if (!selectedGroup) {

        classTitle.textContent =
            "Select a group";

        totalStudents.textContent = "0";

        absentCount.textContent = "0";

        studentList.innerHTML =
            '<div class="empty-message">' +
            'Please select a group.' +
            '</div>';

        return;
    }


    classTitle.textContent =
        selectedGroup;


    const students =
        groups[selectedGroup];


    totalStudents.textContent =
        students.length;


    let numberOfAbsent = 0;


    students.forEach((student, index) => {

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
           STUDENT CARD
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
           BUTTON
        ========================= */

        const button =
            document.createElement("button");

        button.className =
            "absent-button";


        if (record) {

            button.textContent =
                "✓ SUBMITTED";

            button.disabled = true;

            button.classList.add(
                "submitted"
            );

        } else {

            button.textContent =
                "ABSENT";


            button.onclick = function () {

                markAbsent(
                    selectedGroup,
                    student
                );

            };

        }


        /* =========================
           CARD
        ========================= */

        card.appendChild(studentInfo);

        card.appendChild(button);


        studentList.appendChild(card);

    });


    absentCount.textContent =
        numberOfAbsent;

}


/* ==================================================
   MARK ABSENT
================================================== */

function markAbsent(group, student) {

    const studentId =
        createStudentId(
            group,
            student
        );


    /*
       Prevent duplicate submission.
    */

    if (attendance[studentId]) {

        return;

    }


    /*
       Save absence.
    */

    attendance[studentId] = {

        status: "absent",

        time:
            new Date().toISOString()

    };


    /*
       Save to browser temporarily.
    */

    localStorage.setItem(
        "attendanceData",
        JSON.stringify(attendance)
    );


    /*
       Refresh screen.
    */

    displayStudents();

}


/* ==================================================
   EVENT LISTENERS
================================================== */

groupSelect.addEventListener(
    "change",
    displayStudents
);


searchInput.addEventListener(
    "input",
    displayStudents
);


/* ==================================================
   INITIAL DISPLAY
================================================== */

displayStudents();