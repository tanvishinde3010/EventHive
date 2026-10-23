# 🎓 EventHive - College Event Management System (Viva Guide)

> **Prepared for:** Tanvi Shinde  
> **Project:** College Event Management System (Easy Version)  
> **Tech Stack:** HTML5, CSS3, JavaScript (Vanilla ES6) + Node.js (Express.js) + SQLite Database (`node:sqlite`)

---

## 📌 1. Project 30-Second Elevator Pitch (Memorize This!)

> *"Respected Sir/Madam, our project is **EventHive – College Event Management System**. It is a full-stack web application designed for colleges to publish, manage, and discover campus events. Students can browse upcoming technical, sports, and cultural events across departments (COMP, IT, AI & DS, CIVIL, MECH, ENTC), search by keyword, view complete event details, and register online. The frontend is built using pure **HTML, CSS, and JavaScript**, communicating with a **Node.js + Express REST API** backend that persists all events and student registrations in a **SQLite database**."*

---

## 🧱 2. System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                       CLIENT BROWSER                        │
│   (HTML5 Structure + CSS3 Styling + Vanilla JS Logic)       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                HTTP Requests  │ (GET, POST via fetch API)
                JSON Payloads  │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    NODE.JS + EXPRESS SERVER                 │
│                      (backend/server.js)                    │
│   - Serves Static Web Pages (html-css-js/ & images/)        │
│   - Handles REST API Endpoints:                             │
│     * GET  /api/events         -> Fetch all events          │
│     * POST /api/register       -> Save new registration     │
│     * GET  /api/registrations  -> View all registrations    │
│     * POST /api/auth/login     -> User authentication       │
└──────────────────────────────┬──────────────────────────────┘
                               │
               Database Sync   │ Prepared Statements / SQL
               (PRAGMA / CRUD) │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       SQLITE DATABASE                       │
│                   (backend/eventhive.db)                    │
│   Tables:                                                   │
│   1. events (id, name, department, category, date, venue...)│
│   2. registrations (id, studentName, studentEmail, dept...) │
│   3. users (id, name, email, password, role)                │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 3. Project Structure & File Roles

```text
College_Event_Management_System/
│
├── html-css-js/                   # FRONTEND FOLDER
│   ├── index.html                 # Complete UI structure & semantic markup
│   ├── style.css                  # Custom styling, responsive layout & modal designs
│   └── script.js                  # Frontend logic, fetch API calls, DOM manipulation
│
├── backend/                       # BACKEND FOLDER
│   ├── server.js                  # Express HTTP server & REST API route handlers
│   ├── db.js                      # SQLite database initialization & prepared SQL statements
│   ├── eventsData.js              # Seed events and department list
│   ├── eventhive.db               # SQLite database file (generated automatically)
│   └── package.json               # Backend dependencies (express, express-session)
│
├── images/                        # Static event and college photos
│   ├── hero.jpeg
│   ├── college.jpeg
│   ├── hackathon.jpeg
│   ├── sports.jpeg
│   └── workshop.jpeg
│
├── package.json                   # Root package.json to easily start project (npm start)
├── .gitignore                     # Git ignore rules for node_modules
└── VIVA_GUIDE.md                  # This complete Viva preparation document
```

---

## 🔍 4. Deep Dive: Code Section Explanations

### A. Frontend (`html-css-js/index.html`)
- **Semantic HTML5 Elements:** `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`.
- **Key Sections:**
  1. **Navbar:** Logo, links to sections, "📋 Registrations" button, and "Login/Logout" buttons.
  2. **Hero Section (`#home`):** Welcome banner, heading, description, and "Explore Events" button.
  3. **Events Section (`#events`):** Contains the live search box (`#searchInput`) and category filter (`#categoryFilter`). Event cards are injected dynamically into `<div id="eventContainer">`.
  4. **Departments Section (`#departments`):** Displays all engineering departments.
  5. **Modals:**
     - `#eventDetailsModal`: Displays detailed info (venue, date, coordinator, eligibility) when student clicks "View Details".
     - `#registrationModal`: Form with inputs for Name, Email, Phone, Department.
     - `#registrationsModal`: Live table displaying all submitted registrations fetched from the SQLite database.

---

### B. Frontend (`html-css-js/script.js`)
- **`fetchEvents()`:**
  ```javascript
  async function fetchEvents() {
    const response = await fetch("/api/events");
    allEvents = await response.json();
    displayEvents(allEvents);
  }
  ```
  *Viva Explanation:* Sends an asynchronous `GET` request to `/api/events`. The server returns JSON array of events, which we store in `allEvents` and pass to `displayEvents()` to render.
- **`displayEvents(eventsList)`:**
  Loops over the array using `forEach()` and creates HTML event card templates using template literals (`` `...` ``). Injects them into `#eventContainer.innerHTML`.
- **`searchEvents()` & `filterByCategory()`:**
  Performs real-time filtering on the client side using JavaScript's `.filter()` and `.includes()` methods without requiring a page reload.
- **`registrationForm` submission:**
  Listens for `submit` event, calls `e.preventDefault()` to stop browser reload, validates inputs (10-digit mobile, valid email), and sends a `POST` request to `/api/register`:
  ```javascript
  const response = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registrationData)
  });
  ```
- **`loadRegistrationsTable()`:**
  Calls `GET /api/registrations`, maps each returned row to `<tr><td>...</td></tr>`, and displays it inside the Registrations modal table.

---

### C. Backend (`backend/server.js`)
- **Express.js Setup:**
  ```javascript
  import express from "express";
  const app = express();
  app.use(express.json()); // Parses JSON bodies
  ```
- **Serving Frontend:**
  ```javascript
  app.use(express.static(path.join(__dirname, "../html-css-js")));
  app.use("/images", express.static(path.join(__dirname, "../images")));
  ```
  *Viva Explanation:* Serves our HTML/CSS/JS frontend files directly to the browser at root URL `http://localhost:5000`.
- **REST API Endpoints:**
  - `GET /api/events`: Queries SQLite using `SELECT * FROM events` and sends JSON response.
  - `POST /api/register`: Validates required fields, checks if student already registered with `SELECT id FROM registrations WHERE LOWER(studentEmail) = ? AND eventName = ?`. If duplicate, returns HTTP 409 Conflict. Otherwise, executes `INSERT INTO registrations (...)` and returns HTTP 201 Created.
  - `GET /api/registrations`: Returns all registered students using `SELECT * FROM registrations ORDER BY id DESC`.
  - `POST /api/auth/login`: Verifies user against SQLite `users` table and compares hashed password using `checkPassword()`.

---

### D. Database (`backend/db.js`)
- **Built-in `node:sqlite`:**
  Uses Node.js's built-in `DatabaseSync` class. Zero external driver installation needed!
- **Tables Created:**
  - **`users`**: `id`, `name`, `email`, `password`, `role`, `department`, `studentId`.
  - **`events`**: `id`, `name`, `department`, `category`, `date`, `time`, `venue`, `capacity`, `coordinator`, `description`, `image`, `status`.
  - **`registrations`**: `id`, `studentName`, `studentEmail`, `studentPhone`, `department`, `eventId`, `eventName`, `status`, `registeredAt`.
- **Password Security:**
  Uses `node:crypto` `scryptSync` with random 16-byte salt:
  `salt:scrypt(password, salt)`. Prevents rainbow table attacks!

---

## 🎯 5. Top 15 Viva Questions & Exact Answers

### Q1: Why did you choose HTML, CSS, and Vanilla JavaScript for frontend instead of React?
**Answer:** *"For this project, Vanilla JavaScript provides maximum transparency, zero build overhead, fast loading times, and direct DOM control. It allows us to clearly understand and demonstrate core web development fundamentals like DOM manipulation, event handling, and asynchronous API integration via `fetch()` without the abstraction of third-party frameworks."*

---

### Q2: What is the purpose of `e.preventDefault()` in form submission?
**Answer:** *"By default, submitting an HTML form causes the browser to reload the page or submit via standard GET/POST. Calling `e.preventDefault()` stops the default reload behavior so we can handle the submission smoothly using JavaScript's `fetch()` API asynchronously."*

---

### Q3: What is the difference between GET and POST HTTP methods?
**Answer:**
- *"**GET** is used to retrieve data from the server (e.g. fetching `/api/events` or `/api/registrations`). It sends parameters in the query string and should not alter database state."*
- *"**POST** is used to send data to the server to create a new resource (e.g. submitting `/api/register` or `/api/auth/login`). Data is sent securely in the request body."*

---

### Q4: How do you prevent SQL Injection in your database queries?
**Answer:** *"We use **Prepared Statements** with parameterized queries (e.g., `db.prepare("INSERT INTO registrations VALUES (?, ?, ?)")`). The `?` placeholders ensure user inputs are treated strictly as data values, not executable SQL commands, completely preventing SQL Injection attacks."*

---

### Q5: How does your system prevent duplicate registrations?
**Answer:** *"In `server.js`, before inserting a new registration, the server executes `SELECT id FROM registrations WHERE LOWER(studentEmail) = ? AND eventName = ?`. If a record already exists, it returns HTTP 409 Conflict with a message: 'You are already registered for this event!'."*

---

### Q6: What is SQLite and why did you use it instead of MySQL or MongoDB?
**Answer:** *"SQLite is a lightweight, serverless, self-contained, ACID-compliant relational SQL database engine that stores the entire database in a single file (`eventhive.db`). Unlike MySQL, it doesn't require setting up a separate background database server process, making it extremely fast, portable, and reliable for college project demonstrations."*

---

### Q7: How does client-side search work?
**Answer:** *"When the user types in `#searchInput`, the `oninput` event triggers `searchEvents()`. We take the search query, convert it to lowercase, and use JavaScript's `Array.prototype.filter()` to match the query against event name, department, category, or description. The matched list is immediately passed to `displayEvents()` to update the UI without needing a server call."*

---

### Q8: What HTTP status codes does your API return?
**Answer:**
- `200 OK`: Request succeeded (GET events, registrations).
- `201 Created`: New resource created successfully (POST registration).
- `400 Bad Request`: Missing required form fields.
- `401 Unauthorized`: Invalid email or password during login.
- `404 Not Found`: Event or resource not found.
- `409 Conflict`: Duplicate registration.
- `500 Internal Server Error`: Uncaught database or server exception.

---

### Q9: What is Express.js middleware and what middleware did you use?
**Answer:** *"Middleware functions in Express are functions that have access to the request (`req`), response (`res`), and `next` function in the application cycle. We used:
1. `express.json()`: Parses incoming requests with JSON payloads.
2. `express.urlencoded()`: Parses URL-encoded data from HTML forms.
3. `express.static()`: Serves static frontend assets (HTML, CSS, JS, images).
4. `express-session`: Manages user login sessions across requests."*

---

### Q10: How do you show that the registration was stored in the database?
**Answer:** *"In our navigation bar, we have a **'📋 Registrations'** button. When clicked, it calls `GET /api/registrations`, which reads directly from the SQLite `registrations` table and displays all records in a live table modal. We can also inspect the `eventhive.db` file directly."*

---

## 🚀 6. How to Run the Project (For Live Demo)

1. Open Terminal or PowerShell in the project directory:
   ```bash
   npm start
   ```
   *(or `cd backend` then `node server.js`)*
2. Open your browser and navigate to:
   ```text
   http://localhost:5000
   ```
3. **Demo Steps for Viva:**
   - Show homepage and explain the hero section.
   - Type in the search box (e.g., `"hackathon"`) to show instant filtering.
   - Select a department (e.g. `"AI & DS"` or `"COMP"`) to show department filtering.
   - Click **"View Details"** on an event to show the popup modal with venue, date, and coordinator.
   - Click **"Register"**, fill in name, email, phone, and department, and submit.
   - Point out the confirmation message.
   - Click **"📋 Registrations"** in the top navigation bar to show the live database table with the newly inserted row!
   - (Optional) Click **"Login"** and use `student@kbtcoe.edu` / `student123` or `admin@kbtcoe.edu` / `admin123`.
