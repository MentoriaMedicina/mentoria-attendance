/* =========================================
   FIREBASE
========================================= */

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
    doc,
    getDoc,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



/* =========================================
   FIREBASE CONFIG
========================================= */

const firebaseConfig = {

    apiKey:
        "AIzaSyBPag4SLUqmdfAws0WFLV7FWp3X8_eLPQ",

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



/* =========================================
   INITIALIZE FIREBASE
========================================= */

const app =
    initializeApp(firebaseConfig);


const auth =
    getAuth(app);


const db =
    getFirestore(app);



/* =========================================
   ELEMENTS
========================================= */

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


const groupSelect =
    document.getElementById("groupSelect");


const dateSelect =
    document.getElementById("dateSelect");


const viewBtn =
    document.getElementById("viewBtn");


const absentList =
    document.getElementById("absentList");


const totalStudents =
    document.getElementById("totalStudents");


const absentCount =
    document.getElementById("absentCount");


const presentCount =
    document.getElementById("presentCount");


const pdfBtn =
    document.getElementById("pdfBtn");



/* =========================================
   ADMIN LOGIN
========================================= */

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

            return;
        }


        loginMessage.textContent =
            "Logging in...";


        try {

            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                userCredential.user;


            /* Check admins collection */

            const adminRef =
                doc(
                    db,
                    "admins",
                    user.uid
                );


            const adminSnap =
                await getDoc(adminRef);


            if (
                !adminSnap.exists()
                ||
                adminSnap.data().role !== "admin"
            ) {

                await signOut(auth);


                loginMessage.textContent =
                    "This account is not an admin.";

                return;
            }


            /* Admin verified */

            showDashboard(user);


        } catch (error) {

            console.error(error);


            loginMessage.textContent =
                "Login failed. Check email and password.";

        }

    }
);



/* =========================================
   CHECK EXISTING LOGIN
========================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            showLogin();

            return;
        }


        try {

            const adminRef =
                doc(
                    db,
                    "admins",
                    user.uid
                );


            const adminSnap =
                await getDoc(adminRef);


            if (
                adminSnap.exists()
                &&
                adminSnap.data().role === "admin"
            ) {

                showDashboard(user);

            } else {

                await signOut(auth);

                showLogin();

            }

        } catch (error) {

            console.error(
                "Admin check error:",
                error
            );

            showLogin();

        }

    }
);



/* =========================================
   SHOW LOGIN
========================================= */

function showLogin() {

    loginSection.style.display =
        "block";


    adminDashboard.style.display =
        "none";

}



/* =========================================
   SHOW DASHBOARD
========================================= */

function showDashboard(user) {

    loginSection.style.display =
        "none";


    adminDashboard.style.display =
        "block";


    adminEmail.textContent =
        user.email;

}



/* =========================================
   LOGOUT
========================================= */

logoutBtn.addEventListener(
    "click",
    async () => {

        await signOut(auth);

        showLogin();

    }
);



/* =========================================
   VIEW ATTENDANCE
========================================= */

viewBtn.addEventListener(
    "click",
    async () => {

        const group =
            groupSelect.value;


        const date =
            dateSelect.value;


        if (!group || !date) {

            alert(
                "Please select group and date."
            );

            return;
        }


        absentList.innerHTML =
            `
            <div class="message">
                Loading attendance...
            </div>
            `;


        try {

            const snapshot =
                await getDocs(
                    collection(
                        db,
                        "attendance"
                    )
                );


            const records = [];


            snapshot.forEach(
                (attendanceDoc) => {

                    const data =
                        attendanceDoc.data();


                    if (
                        String(data.group)
                        ===
                        String(group)
                        &&
                        data.date === date
                    ) {

                        records.push(data);

                    }

                }
            );


            showAttendance(
                records,
                group
            );


        } catch (error) {

            console.error(error);


            absentList.innerHTML =
                `
                <div class="message error">
                    Unable to load attendance.
                    <br><br>
                    ${error.message}
                </div>
                `;

        }

    }
);



/* =========================================
   SHOW ATTENDANCE
========================================= */

function showAttendance(
    records,
    group
) {

    /*
       Number of students
       according to group.
    */

    const groupStudentCount = {

        "7": 20,
        "9": 19,
        "10": 20,
        "11": 20,
        "12": 20,
        "13": 20,
        "15": 9

    };


    const total =
        groupStudentCount[group] || 0;


    totalStudents.textContent =
        total;


    absentCount.textContent =
        records.length;


    presentCount.textContent =
        Math.max(
            total - records.length,
            0
        );


    absentList.innerHTML = "";


    if (records.length === 0) {

        absentList.innerHTML =
            `
            <div class="message">
                No absent students found.
            </div>
            `;

        return;
    }


    records.forEach(
        (student, index) => {

            const item =
                document.createElement("div");


            item.className =
                "absent-item";


            let time = "";


            if (student.submittedAt) {

                if (
                    typeof student
                        .submittedAt
                        .toDate === "function"
                ) {

                    time =
                        student
                            .submittedAt
                            .toDate()
                            .toLocaleTimeString();

                }

            }


            item.innerHTML = `

                <div>

                    <div class="student-name">

                        ${index + 1}.
                        ${student.studentName || "Unknown"}

                    </div>

                    <div class="time">

                        ${time}

                    </div>

                </div>


                <strong>
                    ABSENT
                </strong>

            `;


            absentList.appendChild(item);

        }
    );

}



/* =========================================
   PDF
========================================= */

pdfBtn.addEventListener(
    "click",
    () => {

        alert(
            "PDF generation will be added next."
        );

    }
);
