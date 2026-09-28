// =====================================================
// MENTORIA MEDICINA - ADMIN PANEL
// Firebase Authentication + Firestore
// =====================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

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
  setDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// =====================================================
// FIREBASE CONFIG
// =====================================================

const firebaseConfig = {
  apiKey: "AIzaSyBPag4SLUqmdfAws0WFLV7FWp3X8_eLPQ",
  authDomain: "mentoria-medicina-attend-7d5ca.firebaseapp.com",
  projectId: "mentoria-medicina-attend-7d5ca",
  storageBucket: "mentoria-medicina-attend-7d5ca.firebasestorage.app",
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

console.log("Firebase initialized successfully");


// =====================================================
// HTML ELEMENTS
// =====================================================

const loginSection = document.getElementById("loginSection");
const adminDashboard = document.getElementById("adminDashboard");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const loginMessage = document.getElementById("loginMessage");

const adminEmail = document.getElementById("adminEmail");

const groupFilter = document.getElementById("groupFilter");
const dateFilter = document.getElementById("dateFilter");

const absentList = document.getElementById("absentList");

const totalStudents = document.getElementById("totalStudents");
const absentCount = document.getElementById("absentCount");


// =====================================================
// GROUP DATA
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

  loginBtn.addEventListener("click", async () => {

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {

      showLoginMessage(
        "Please enter email and password.",
        "error"
      );

      return;
    }

    try {

      loginBtn.disabled = true;
      loginBtn.textContent = "Logging in...";

      showLoginMessage(
        "Checking account...",
        "warning"
      );

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      console.log("Logged in UID:", user.uid);

      // Check admin document
      const adminRef =
        doc(db, "admins", user.uid);

      const adminSnap =
        await getDoc(adminRef);

      if (!adminSnap.exists()) {

        await signOut(auth);

        showLoginMessage(
          "This account is not registered as an admin.",
          "error"
        );

        return;
      }

      const adminData = adminSnap.data();

      if (adminData.role !== "admin") {

        await signOut(auth);

        showLoginMessage(
          "You do not have admin permission.",
          "error"
        );

        return;
      }

      console.log("Admin verified");

      showLoginMessage(
        "Login successful.",
        "success"
      );

    } catch (error) {

      console.error("LOGIN ERROR:", error);

      showLoginMessage(
        getFirebaseErrorMessage(error),
        "error"
      );

    } finally {

      loginBtn.disabled = false;
      loginBtn.textContent = "Login";

    }

  });

}


// =====================================================
// AUTH STATE
// =====================================================

onAuthStateChanged(auth, async (user) => {

  if (!user) {

    showLoginPage();

    return;
  }

  console.log("Auth user detected:", user.email);

  try {

    const adminRef =
      doc(db, "admins", user.uid);

    const adminSnap =
      await getDoc(adminRef);

    if (!adminSnap.exists()) {

      await signOut(auth);

      showLoginMessage(
        "This account is not an admin.",
        "error"
      );

      return;
    }

    const adminData = adminSnap.data();

    if (adminData.role !== "admin") {

      await signOut(auth);

      showLoginMessage(
        "Admin permission not found.",
        "error"
      );

      return;
    }

    showAdminDashboard(user, adminData);

    await initializeAdminPanel();

  } catch (error) {

    console.error("ADMIN CHECK ERROR:", error);

    showLoginMessage(
      "Unable to verify admin account.",
      "error"
    );

  }

});


// =====================================================
// SHOW LOGIN
// =====================================================

function showLoginPage() {

  if (loginSection) {
    loginSection.style.display = "block";
  }

  if (adminDashboard) {
    adminDashboard.style.display = "none";
  }

}


// =====================================================
// SHOW ADMIN DASHBOARD
// =====================================================

function showAdminDashboard(user, adminData) {

  if (loginSection) {
    loginSection.style.display = "none";
  }

  if (adminDashboard) {
    adminDashboard.style.display = "block";
  }

  if (adminEmail) {

    adminEmail.textContent =
      adminData.name ||
      user.email;

  }

}


// =====================================================
// LOGOUT
// =====================================================

if (logoutBtn) {

  logoutBtn.addEventListener("click", async () => {

    try {

      await signOut(auth);

      console.log("Admin logged out");

    } catch (error) {

      console.error("Logout error:", error);

    }

  });

}


// =====================================================
// INITIALIZE ADMIN PANEL
// =====================================================

async function initializeAdminPanel() {

  setupGroupFilter();

  setupDateFilter();

  createSessionControl();

  await checkActiveSession();

  await loadAttendance();

}


// =====================================================
// GROUP FILTER
// =====================================================

function setupGroupFilter() {

  if (!groupFilter) return;

  groupFilter.innerHTML = `
    <option value="">All Groups</option>
    <option value="7">Group 7</option>
    <option value="9">Group 9</option>
    <option value="10">Group 10</option>
    <option value="11">Group 11</option>
    <option value="12">Group 12</option>
    <option value="13">Group 13</option>
    <option value="15">Group 15</option>
  `;

  groupFilter.addEventListener(
    "change",
    loadAttendance
  );

}


// =====================================================
// DATE FILTER
// =====================================================

function setupDateFilter() {

  if (!dateFilter) return;

  const today = getTodayString();

  dateFilter.value = today;

  dateFilter.addEventListener(
    "change",
    loadAttendance
  );

}


// =====================================================
// CREATE SESSION CONTROL PANEL
// =====================================================

function createSessionControl() {

  // Avoid creating twice
  if (document.getElementById("sessionAdminPanel")) {
    return;
  }

  const panel =
    document.createElement("section");

  panel.id = "sessionAdminPanel";

  panel.className = "admin-card";

  panel.innerHTML = `

    <h2>Attendance Session</h2>

    <div class="session-controls">

      <label>
        Group
        <select id="sessionGroup">
          <option value="">Select Group</option>
          <option value="7">Group 7</option>
          <option value="9">Group 9</option>
          <option value="10">Group 10</option>
          <option value="11">Group 11</option>
          <option value="12">Group 12</option>
          <option value="13">Group 13</option>
          <option value="15">Group 15</option>
        </select>
      </label>

      <label>
        Duration
        <select id="sessionDuration">
          <option value="10">10 minutes</option>
          <option value="15">15 minutes</option>
          <option value="20" selected>20 minutes</option>
          <option value="30">30 minutes</option>
          <option value="45">45 minutes</option>
          <option value="60">60 minutes</option>
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
      No active attendance session.
    </div>

  `;

  const dashboard =
    document.getElementById("adminDashboard");

  if (dashboard) {

    dashboard.insertBefore(
      panel,
      dashboard.firstChild
    );

  }

  document
    .getElementById("openSessionBtn")
    .addEventListener(
      "click",
      openAttendanceSession
    );

  document
    .getElementById("closeSessionBtn")
    .addEventListener(
      "click",
      closeAttendanceSession
    );

}


// =====================================================
// OPEN ATTENDANCE SESSION
// =====================================================

async function openAttendanceSession() {

  const group =
    document.getElementById("sessionGroup").value;

  const duration =
    Number(
      document.getElementById("sessionDuration").value
    );

  const status =
    document.getElementById("sessionStatus");

  if (!group) {

    status.textContent =
      "Please select a group.";

    status.className =
      "session-status warning";

    return;
  }


  try {

    // Check if another active session exists
    const activeQuery = query(
      collection(db, "sessions"),
      where("active", "==", true)
    );

    const activeSnapshot =
      await getDocs(activeQuery);

    if (!activeSnapshot.empty) {

      status.textContent =
        "Another attendance session is already active.";

      status.className =
        "session-status warning";

      return;
    }


    const now =
      new Date();

    const end =
      new Date(
        now.getTime() +
        duration * 60 * 1000
      );


    const sessionData = {

      group: group,

      active: true,

      startTime:
        now.toISOString(),

      endTime:
        end.toISOString(),

      duration: duration,

      createdBy:
        auth.currentUser.uid,

      createdByEmail:
        auth.currentUser.email,

      createdAt:
        serverTimestamp()

    };


    const sessionRef =
      await addDoc(
        collection(db, "sessions"),
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
      .getElementById("openSessionBtn")
      .style.display = "none";

    document
      .getElementById("closeSessionBtn")
      .style.display = "inline-block";


    document
      .getElementById("sessionGroup")
      .disabled = true;

    document
      .getElementById("sessionDuration")
      .disabled = true;


    // Automatically refresh student attendance
    if (groupFilter) {
      groupFilter.value = group;
    }

    await loadAttendance();


  } catch (error) {

    console.error(
      "OPEN SESSION ERROR:",
      error
    );

    status.textContent =
      "Unable to open attendance: " +
      error.message;

    status.className =
      "session-status error";

  }

}


// =====================================================
// CLOSE ATTENDANCE SESSION
// =====================================================

async function closeAttendanceSession() {

  try {

    const activeQuery = query(
      collection(db, "sessions"),
      where("active", "==", true)
    );

    const snapshot =
      await getDocs(activeQuery);

    if (snapshot.empty) {

      return;

    }


    for (const sessionDoc of snapshot.docs) {

      await updateDoc(
        doc(
          db,
          "sessions",
          sessionDoc.id
        ),
        {
          active: false,
          closedAt: serverTimestamp(),
          closedBy: auth.currentUser.uid
        }
      );

    }


    const status =
      document.getElementById(
        "sessionStatus"
      );

    status.textContent =
      "Attendance session closed.";

    status.className =
      "session-status session-closed";


    resetSessionControls();

    await loadAttendance();


  } catch (error) {

    console.error(
      "CLOSE SESSION ERROR:",
      error
    );

  }

}


// =====================================================
// CHECK ACTIVE SESSION
// =====================================================

async function checkActiveSession() {

  try {

    const activeQuery = query(
      collection(db, "sessions"),
      where("active", "==", true)
    );

    const snapshot =
      await getDocs(activeQuery);


    if (snapshot.empty) {

      resetSessionControls();

      return;

    }


    // Get first active session
    const sessionDoc =
      snapshot.docs[0];

    const session =
      sessionDoc.data();


    const now =
      new Date();

    const end =
      new Date(session.endTime);


    // Session expired
    if (now >= end) {

      await updateDoc(
        doc(
          db,
          "sessions",
          sessionDoc.id
        ),
        {
          active: false,
          closedAt: serverTimestamp()
        }
      );

      resetSessionControls();

      return;

    }


    const group =
      session.group;


    const status =
      document.getElementById(
        "sessionStatus"
      );


    if (status) {

      status.textContent =
        `Group ${group} attendance is OPEN until ${formatTime(end)}.`;

      status.className =
        "session-status session-active";

    }


    document
      .getElementById("sessionGroup")
      .value = group;

    document
      .getElementById("sessionGroup")
      .disabled = true;

    document
      .getElementById("sessionDuration")
      .disabled = true;


    document
      .getElementById("openSessionBtn")
      .style.display = "none";

    document
      .getElementById("closeSessionBtn")
      .style.display = "inline-block";


    if (groupFilter) {
      groupFilter.value = group;
    }


  } catch (error) {

    console.error(
      "CHECK SESSION ERROR:",
      error
    );

  }

}


// =====================================================
// RESET SESSION CONTROLS
// =====================================================

function resetSessionControls() {

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

  const status =
    document.getElementById(
      "sessionStatus"
    );


  if (openBtn)
    openBtn.style.display =
      "inline-block";

  if (closeBtn)
    closeBtn.style.display =
      "none";

  if (group)
    group.disabled = false;

  if (duration)
    duration.disabled = false;

  if (status) {

    status.textContent =
      "No active attendance session.";

    status.className =
      "session-status session-closed";

  }

}


// =====================================================
// LOAD ATTENDANCE
// =====================================================

async function loadAttendance() {

  if (!absentList) {
    return;
  }


  absentList.innerHTML =
    "<p>Loading attendance...</p>";


  try {

    const selectedGroup =
      groupFilter
        ? groupFilter.value
        : "";


    const selectedDate =
      dateFilter
        ? dateFilter.value
        : getTodayString();


    const attendanceQuery =
      query(
        collection(db, "attendance")
      );


    const snapshot =
      await getDocs(attendanceQuery);


    let records = [];


    snapshot.forEach((document) => {

      const data =
        document.data();


      if (
        selectedGroup &&
        data.group !== selectedGroup
      ) {

        return;

      }


      if (
        data.submittedAt
      ) {

        let recordDate = "";


        if (
          data.submittedAt.toDate
        ) {

          recordDate =
            getDateString(
              data.submittedAt.toDate()
            );

        }


        if (
          recordDate &&
          recordDate !== selectedDate
        ) {

          return;

        }

      }


      records.push({
        id: document.id,
        ...data
      });

    });


    records.sort(
      (a, b) =>
