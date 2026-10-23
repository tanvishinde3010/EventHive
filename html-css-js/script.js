// =============================================================================
// script.js - Client-Side JavaScript for College Event Management System
// =============================================================================
// Features:
// 1. Fetches events from backend API (GET /api/events) and renders event cards
// 2. Department & category filtering + live text search
// 3. Event Details modal & Registration modal
// 4. Submits event registration to backend (POST /api/register) and saves to SQLite
// 5. Live Registrations viewer modal (GET /api/registrations) for Viva presentation
// 6. User authentication (POST /api/auth/login)
// =============================================================================

// -----------------------------------------------------------------------------
// 1. Data Definitions & State
// -----------------------------------------------------------------------------

// Academic departments of the college
const departments = [
  { name: "Computer Engineering", code: "COMP", icon: "💻" },
  { name: "Information Technology", code: "IT", icon: "🌐" },
  { name: "Artificial Intelligence & Data Science", code: "AI & DS", icon: "🤖" },
  { name: "Civil Engineering", code: "CIVIL", icon: "🏗️" },
  { name: "Mechanical Engineering", code: "MECH", icon: "⚙️" },
  { name: "Electronics & Telecommunication", code: "ENTC", icon: "📡" }
];

// Fallback events (used automatically if the backend server is offline)
const fallbackEvents = [
  {
    id: 1,
    name: "AI Hackathon",
    department: "AI & DS",
    category: "Technical",
    date: "15 October 2026",
    time: "10:00 AM - 4:00 PM",
    venue: "Innovation Lab",
    coordinator: "Prof. Meera Shah",
    description: "A full-day technical hackathon where teams of 2–4 students build innovative AI solutions.",
    image: "/images/hackathon.jpeg"
  },
  {
    id: 2,
    name: "Web Development Workshop",
    department: "COMP",
    category: "Workshop",
    date: "20 October 2026",
    time: "11:00 AM - 2:00 PM",
    venue: "Computer Lab",
    coordinator: "Prof. Rajesh Kumar",
    description: "Learn modern web development concepts: HTML5, CSS3, and JavaScript.",
    image: "/images/workshop.jpeg"
  },
  {
    id: 3,
    name: "Annual Sports Day",
    department: "ALL",
    category: "Sports",
    date: "25 October 2026",
    time: "9:00 AM - 5:00 PM",
    venue: "College Sports Ground",
    coordinator: "Mr. Suresh Patil",
    description: "An exciting sports event featuring cricket, football, badminton, and athletics.",
    image: "/images/sports.jpeg"
  },
  {
    id: 4,
    name: "Coding Competition",
    department: "COMP",
    category: "Technical",
    date: "28 October 2026",
    time: "10:00 AM - 1:00 PM",
    venue: "Computer Lab 2",
    coordinator: "Prof. Anita Desai",
    description: "Test your programming and problem-solving skills across multiple rounds.",
    image: "/images/hackathon.jpeg"
  },
  {
    id: 5,
    name: "Tech Talk on Generative AI",
    department: "AI & DS",
    category: "Seminar",
    date: "2 November 2026",
    time: "11:00 AM - 1:00 PM",
    venue: "Auditorium",
    coordinator: "Prof. Neha Joshi",
    description: "An interactive expert session on Generative AI, LLMs, and prompt engineering.",
    image: "/images/workshop.jpeg"
  },
  {
    id: 6,
    name: "Robotics Workshop",
    department: "ENTC",
    category: "Workshop",
    date: "5 November 2026",
    time: "10:00 AM - 3:00 PM",
    venue: "Electronics Lab",
    coordinator: "Prof. Vikram Nair",
    description: "Hands-on workshop covering Arduino programming and building a basic robot.",
    image: "/images/workshop.jpeg"
  },
  {
    id: 7,
    name: "CAD Design Competition",
    department: "MECH",
    category: "Competition",
    date: "8 November 2026",
    time: "10:00 AM - 2:00 PM",
    venue: "Mechanical Lab",
    coordinator: "Prof. Amit Kulkarni",
    description: "Showcase your creativity and technical skills through computer-aided design.",
    image: "/images/hackathon.jpeg"
  },
  {
    id: 8,
    name: "Smart City Project Exhibition",
    department: "CIVIL",
    category: "Exhibition",
    date: "12 November 2026",
    time: "10:00 AM - 4:00 PM",
    venue: "Main Exhibition Hall",
    coordinator: "Prof. Priya Sharma",
    description: "Students present innovative ideas and working models for future smart cities.",
    image: "/images/college.jpeg"
  },
  {
    id: 9,
    name: "Cultural Fest",
    department: "ALL",
    category: "Cultural",
    date: "18 November 2026",
    time: "5:00 PM - 9:00 PM",
    venue: "College Auditorium",
    coordinator: "Cultural Committee",
    description: "A grand celebration of music, dance, drama, and art across all departments.",
    image: "/images/cultural.jpeg"
  },
  {
    id: 10,
    name: "Career Guidance Seminar",
    department: "ALL",
    category: "Seminar",
    date: "22 November 2026",
    time: "11:00 AM - 1:00 PM",
    venue: "Seminar Hall",
    coordinator: "Training & Placement Cell",
    description: "A career guidance session covering placements, GRE/GATE, and industry opportunities.",
    image: "/images/college.jpeg"
  }
];

// Current list of events loaded in memory
let allEvents = [];
let currentEventId = null;

// Helper to ensure correct image path whether run from HTTP server or file://
function getImageUrl(img) {
  if (!img) return "../images/workshop.jpeg";
  if (window.location.protocol === "file:") {
    return img.startsWith("/") ? ".." + img : img;
  }
  return img;
}

// -----------------------------------------------------------------------------
// 2. Fetch Events from Backend REST API
// -----------------------------------------------------------------------------
// Viva Question: "How does the frontend get data from the database?"
// Viva Answer: "We call fetch('/api/events'). The Express server queries SQLite
// using 'SELECT * FROM events' and returns JSON. We then parse the JSON and
// dynamically generate the HTML cards using innerHTML."
async function fetchEvents() {
  try {
    const response = await fetch("/api/events");
    if (!response.ok) throw new Error("Server responded with error status");
    allEvents = await response.json();
    console.log("Events loaded from SQLite database:", allEvents.length);
  } catch (error) {
    console.warn("Backend API not reachable, falling back to local events array.", error);
    allEvents = fallbackEvents;
  }
  displayEvents(allEvents);
}

// -----------------------------------------------------------------------------
// 3. Render Event Cards Dynamically
// -----------------------------------------------------------------------------
function displayEvents(eventsToRender) {
  const container = document.getElementById("eventContainer");
  if (!container) return;

  if (eventsToRender.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #687A76;">
        <h3>No matching events found</h3>
        <p>Try searching for a different keyword or category.</p>
      </div>
    `;
    return;
  }

  let html = "";
  eventsToRender.forEach((event) => {
    const imgSrc = getImageUrl(event.image);
    html += `
      <div class="event-card">
        <img src="${imgSrc}" alt="${event.name}" onerror="this.onerror=null; this.src='../images/workshop.jpeg'">
        <div class="event-content">
          <span style="font-size: 12px; font-weight: bold; color: #F05A47; text-transform: uppercase;">
            ${event.category}
          </span>
          <h3>${event.name}</h3>
          <p>🏢 <strong>Dept:</strong> ${event.department}</p>
          <p>📅 <strong>Date:</strong> ${event.date}</p>
          <p>⏰ <strong>Time:</strong> ${event.time || "10:00 AM - 1:00 PM"}</p>
          <p>📍 <strong>Venue:</strong> ${event.venue}</p>
          <p class="event-desc">${event.description}</p>
          <div style="display: flex; gap: 10px; margin-top: 15px;">
            <button class="main-btn" style="flex: 1;" onclick="showEventDetails(${event.id})">
              View Details
            </button>
            <button class="main-btn" style="flex: 1; background-color: #29443F;" onclick="registerEvent('${event.name.replace(/'/g, "\\'")}', ${event.id})">
              Register
            </button>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// -----------------------------------------------------------------------------
// 4. Render Department Cards
// -----------------------------------------------------------------------------
function displayDepartments() {
  const container = document.getElementById("departmentContainer");
  if (!container) return;

  let html = "";
  departments.forEach((dept) => {
    html += `
      <div class="department-card">
        <div class="department-icon">${dept.icon}</div>
        <h3>${dept.code}</h3>
        <p>${dept.name}</p>
        <button class="main-btn" onclick="showDepartmentEvents('${dept.code}')">
          View Events
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Filter events by department code
function showDepartmentEvents(departmentCode) {
  const filtered = allEvents.filter(
    (e) => e.department === departmentCode || e.department === "ALL"
  );
  displayEvents(filtered);
  scrollToEvents();
}

// -----------------------------------------------------------------------------
// 5. Search & Category Filters
// -----------------------------------------------------------------------------
// Live Search (runs on each keystroke in search box)
function searchEvents() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const selectedCategory = document.getElementById("categoryFilter").value;

  const filtered = allEvents.filter((event) => {
    const matchesQuery =
      event.name.toLowerCase().includes(query) ||
      event.department.toLowerCase().includes(query) ||
      event.category.toLowerCase().includes(query) ||
      event.venue.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query);

    const matchesCategory =
      selectedCategory === "All" || event.category === selectedCategory;

    return matchesQuery && matchesCategory;
  });

  displayEvents(filtered);
}

// Category dropdown change listener
function filterByCategory() {
  searchEvents();
}

// Smooth scroll helper
function scrollToEvents() {
  document.getElementById("events").scrollIntoView({ behavior: "smooth" });
}

// -----------------------------------------------------------------------------
// 6. Event Details Modal
// -----------------------------------------------------------------------------
function showEventDetails(eventId) {
  const event = allEvents.find((e) => e.id === eventId);
  if (!event) return;

  currentEventId = event.id;

  const modal = document.getElementById("eventDetailsModal");
  document.getElementById("detailsImage").src = getImageUrl(event.image);
  document.getElementById("detailsCategory").textContent = event.category;
  document.getElementById("detailsName").textContent = event.name;
  document.getElementById("detailsDepartment").textContent = "🏢 Department: " + event.department;
  document.getElementById("detailsDate").textContent = "📅 Date: " + event.date;
  document.getElementById("detailsTime").textContent = "⏰ Time: " + (event.time || "10:00 AM - 1:00 PM");
  document.getElementById("detailsVenue").textContent = "📍 Venue: " + event.venue;
  document.getElementById("detailsCoordinator").textContent = "👤 Coordinator: " + (event.coordinator || "Event Incharge");
  document.getElementById("detailsDescription").textContent = event.description;

  document.getElementById("detailsRegisterBtn").onclick = function () {
    closeEventDetails();
    registerEvent(event.name, event.id);
  };

  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
}

function closeEventDetails() {
  const modal = document.getElementById("eventDetailsModal");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
}

// -----------------------------------------------------------------------------
// 7. Event Registration Modal & Submission (POST /api/register)
// -----------------------------------------------------------------------------
function registerEvent(eventName, eventId) {
  currentEventId = eventId || null;
  document.getElementById("registrationEventName").textContent = eventName;
  document.getElementById("registrationMessage").textContent = "";
  document.getElementById("registrationForm").reset();

  const modal = document.getElementById("registrationModal");
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
}

function closeRegistration() {
  const modal = document.getElementById("registrationModal");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
}

// Handle Registration Form Submission
document.getElementById("registrationForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("studentName").value.trim();
  const email = document.getElementById("studentEmail").value.trim();
  const phone = document.getElementById("studentPhone").value.trim();
  const department = document.getElementById("studentDepartment").value;
  const eventName = document.getElementById("registrationEventName").textContent;
  const message = document.getElementById("registrationMessage");

  // Client-side validations
  if (!name || !email || !phone || !department) {
    message.textContent = "Please fill in all required fields.";
    message.style.color = "#F05A47";
    return;
  }

  // Validate phone number: exactly 10 digits
  if (!/^[0-9]{10}$/.test(phone)) {
    message.textContent = "Phone number must be exactly 10 digits.";
    message.style.color = "#F05A47";
    return;
  }

  message.textContent = "Submitting registration to server...";
  message.style.color = "#29443F";

  const registrationData = {
    studentName: name,
    studentEmail: email,
    studentPhone: phone,
    department: department,
    eventName: eventName,
    eventId: currentEventId
  };

  try {
    // Send POST request to backend Express API
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registrationData)
    });

    const result = await response.json();

    if (response.ok) {
      message.textContent = result.message || "Registration successful!";
      message.style.color = "#176B46";
      document.getElementById("registrationForm").reset();

      // Also back up in localStorage for offline availability
      saveToLocalStorage(registrationData);

      // Auto close after 2.5 seconds
      setTimeout(() => {
        closeRegistration();
      }, 2500);
    } else {
      message.textContent = result.message || "Registration could not be completed.";
      message.style.color = "#F05A47";
    }
  } catch (error) {
    console.warn("Backend not available, saving registration locally:", error);
    saveToLocalStorage(registrationData);
    message.textContent = "Registration saved locally (Server offline).";
    message.style.color = "#176B46";
  }
});

function saveToLocalStorage(data) {
  try {
    const list = JSON.parse(localStorage.getItem("registrations") || "[]");
    list.push({ ...data, registeredAt: new Date().toLocaleString() });
    localStorage.setItem("registrations", JSON.stringify(list));
  } catch (err) {
    console.error("Local storage error", err);
  }
}

// -----------------------------------------------------------------------------
// 8. View Registrations Modal (For Viva Examination Demo)
// -----------------------------------------------------------------------------
// Viva Question: "How do you verify the registration went into the database?"
// Viva Answer: "We can click the 'Registrations' button in the navbar. It executes
// fetch('/api/registrations'), which runs 'SELECT * FROM registrations' in SQLite
// and displays every registered student with their department, phone, and event!"
function openRegistrationsModal() {
  const modal = document.getElementById("registrationsModal");
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
  loadRegistrationsTable();
}

function closeRegistrationsModal() {
  const modal = document.getElementById("registrationsModal");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
}

async function loadRegistrationsTable() {
  const tbody = document.getElementById("registrationsTableBody");
  tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px;">Fetching records from SQLite database...</td></tr>`;

  try {
    const response = await fetch("/api/registrations");
    if (!response.ok) throw new Error("Could not fetch registrations");
    const records = await response.json();

    if (records.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px; color: #687A76;">No registrations found yet. Register for an event to see it here!</td></tr>`;
      return;
    }

    let rowsHtml = "";
    records.forEach((row, index) => {
      rowsHtml += `
        <tr>
          <td>${index + 1}</td>
          <td><strong>${escapeHtml(row.studentName)}</strong></td>
          <td>${escapeHtml(row.studentEmail)}</td>
          <td>${escapeHtml(row.studentPhone || "—")}</td>
          <td><span class="badge-status">${escapeHtml(row.department)}</span></td>
          <td>${escapeHtml(row.eventName)}</td>
          <td>${escapeHtml(row.registeredAt ? row.registeredAt.substring(0, 19) : "Just now")}</td>
        </tr>
      `;
    });

    tbody.innerHTML = rowsHtml;
  } catch (err) {
    // If backend is offline, read from localStorage
    const localList = JSON.parse(localStorage.getItem("registrations") || "[]");
    if (localList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px; color: #687A76;">No registrations available.</td></tr>`;
      return;
    }
    let rowsHtml = "";
    localList.forEach((row, index) => {
      rowsHtml += `
        <tr>
          <td>${index + 1}</td>
          <td><strong>${escapeHtml(row.studentName)}</strong></td>
          <td>${escapeHtml(row.studentEmail)}</td>
          <td>${escapeHtml(row.studentPhone || "—")}</td>
          <td><span class="badge-status">${escapeHtml(row.department)}</span></td>
          <td>${escapeHtml(row.eventName)}</td>
          <td>${escapeHtml(row.registeredAt || "Local")}</td>
        </tr>
      `;
    });
    tbody.innerHTML = rowsHtml;
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// -----------------------------------------------------------------------------
// 9. Login & Authentication (POST /api/auth/login)
// -----------------------------------------------------------------------------
function openLogin() {
  const modal = document.getElementById("loginModal");
  document.getElementById("loginMessage").textContent = "";
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
}

function closeLogin() {
  const modal = document.getElementById("loginModal");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
}

document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const message = document.getElementById("loginMessage");

  if (!email || !password) {
    message.textContent = "Please enter both email and password.";
    message.style.color = "#F05A47";
    return;
  }

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      message.textContent = `Welcome, ${data.user.name}!`;
      message.style.color = "#176B46";
      localStorage.setItem("user", JSON.stringify(data.user));
      updateLoginButton();

      setTimeout(() => {
        closeLogin();
      }, 1000);
    } else {
      message.textContent = data.message || "Invalid credentials.";
      message.style.color = "#F05A47";
    }
  } catch (err) {
    // Demo fallback for offline test
    if (
      (email === "student@kbtcoe.edu" && password === "student123") ||
      (email === "admin@kbtcoe.edu" && password === "admin123")
    ) {
      message.textContent = "Login successful!";
      message.style.color = "#176B46";
      localStorage.setItem("user", JSON.stringify({ email, name: email.split("@")[0] }));
      updateLoginButton();
      setTimeout(closeLogin, 1000);
    } else {
      message.textContent = "Invalid email or password.";
      message.style.color = "#F05A47";
    }
  }
});

function updateLoginButton() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const loginNav = document.getElementById("loginNav");
  const logoutNav = document.getElementById("logoutNav");

  if (user) {
    loginNav.style.display = "none";
    logoutNav.style.display = "inline-block";
    logoutNav.textContent = `Logout (${user.name || user.email})`;
  } else {
    loginNav.style.display = "inline-block";
    logoutNav.style.display = "none";
  }
}

function logoutUser() {
  fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
  localStorage.removeItem("user");
  updateLoginButton();
}

// -----------------------------------------------------------------------------
// 10. Initialization on Page Load
// -----------------------------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
  fetchEvents();
  displayDepartments();
  updateLoginButton();
});