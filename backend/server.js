// =============================================================================
// server.js - Express.js REST API Server for College Event Management System
// =============================================================================
// Tech Stack: Node.js + Express.js + SQLite (via db.js)
// Serves: Frontend static files (HTML, CSS, JS) and JSON REST API endpoints
// =============================================================================

import express from "express";
import session from "express-session";
import path from "node:path";
import { fileURLToPath } from "node:url";
import db, { hashPassword, checkPassword } from "./db.js";
import { departments } from "./eventsData.js";

// Setup directory paths (safe on Windows, Mac, and Linux)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// -----------------------------------------------------------------------------
// Middleware Configuration
// -----------------------------------------------------------------------------
// Parse incoming JSON request bodies (e.g., req.body)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session management for logged-in users (Student/Admin)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "eventhive-secret-key-2026",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 } // 24 hours
  })
);

// Serve static frontend assets
const frontendPath = path.join(__dirname, "../html-css-js");
const imagesPath = path.join(__dirname, "../images");

app.use(express.static(frontendPath));
app.use("/images", express.static(imagesPath));

// Helper: Remove password before returning user data to client
function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

// =============================================================================
// 1. EVENTS API ENDPOINTS
// =============================================================================

// GET /api/events - Retrieve all events (with optional category, department, or search query)
app.get("/api/events", (req, res) => {
  try {
    const { department, category, search } = req.query;
    let query = "SELECT * FROM events WHERE status = 'PUBLISHED'";
    const params = [];

    if (department && department !== "ALL") {
      query += " AND department = ?";
      params.push(department);
    }

    if (category && category !== "All") {
      query += " AND category = ?";
      params.push(category);
    }

    if (search && search.trim()) {
      query += " AND (name LIKE ? OR description LIKE ? OR venue LIKE ?)";
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    query += " ORDER BY id ASC";
    const eventsList = db.prepare(query).all(...params);
    res.json(eventsList);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error while fetching events." });
  }
});

// GET /api/events/:id - Retrieve single event details by ID
app.get("/api/events/:id", (req, res) => {
  try {
    const event = db.prepare("SELECT * FROM events WHERE id = ?").get(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found." });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

// GET /api/departments - Retrieve list of academic departments
app.get("/api/departments", (req, res) => {
  res.json(departments);
});

// POST /api/events - Add a new event (Admin)
app.post("/api/events", (req, res) => {
  try {
    const { name, department, category, date, time, venue, capacity, description, image } = req.body;
    if (!name || !department || !category || !date || !venue) {
      return res.status(400).json({ message: "Name, department, category, date, and venue are required." });
    }

    const stmt = db.prepare(`
      INSERT INTO events (name, department, category, date, time, venue, capacity, description, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      name.trim(),
      department,
      category,
      date,
      time || "10:00 AM - 1:00 PM",
      venue,
      capacity ? Number(capacity) : 100,
      description || "",
      image || "/images/workshop.jpeg"
    );

    const newEvent = db.prepare("SELECT * FROM events WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Failed to create event." });
  }
});

// DELETE /api/events/:id - Delete an event (Admin)
app.delete("/api/events/:id", (req, res) => {
  try {
    const result = db.prepare("DELETE FROM events WHERE id = ?").run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ message: "Event not found." });
    res.json({ success: true, message: "Event deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete event." });
  }
});

// =============================================================================
// 2. REGISTRATIONS API ENDPOINTS
// =============================================================================

// POST /api/register - Register a student for an event
app.post("/api/register", (req, res) => {
  try {
    const { studentName, studentEmail, studentPhone, department, eventName, eventId } = req.body;

    // Validation
    if (!studentName?.trim() || !studentEmail?.trim() || !department || !eventName) {
      return res.status(400).json({ message: "Full Name, Email, Department, and Event Name are required." });
    }

    const cleanEmail = studentEmail.trim().toLowerCase();

    // Check duplicate registration for the same event and email
    const existing = db.prepare(
      "SELECT id FROM registrations WHERE LOWER(studentEmail) = ? AND eventName = ?"
    ).get(cleanEmail, eventName);

    if (existing) {
      return res.status(409).json({ message: "You are already registered for this event!" });
    }

    // Insert into SQLite database
    const stmt = db.prepare(`
      INSERT INTO registrations (studentName, studentEmail, studentPhone, department, eventId, eventName)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      studentName.trim(),
      cleanEmail,
      studentPhone?.trim() || "",
      department,
      eventId ? Number(eventId) : null,
      eventName
    );

    res.status(201).json({
      success: true,
      registrationId: result.lastInsertRowid,
      message: `Registration confirmed for ${eventName}! We sent a confirmation to ${cleanEmail}.`
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error processing registration." });
  }
});

// GET /api/registrations - Retrieve all student registrations (for Admin / Viva Demonstration)
app.get("/api/registrations", (req, res) => {
  try {
    const list = db.prepare("SELECT * FROM registrations ORDER BY id DESC").all();
    res.json(list);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res.status(500).json({ message: "Failed to fetch registrations." });
  }
});

// DELETE /api/registrations/:id - Cancel/remove a registration
app.delete("/api/registrations/:id", (req, res) => {
  try {
    const result = db.prepare("DELETE FROM registrations WHERE id = ?").run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ message: "Registration not found." });
    res.json({ success: true, message: "Registration removed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete registration." });
  }
});

// =============================================================================
// 3. AUTHENTICATION API ENDPOINTS
// =============================================================================

// POST /api/auth/login - Login user (Student or Admin)
app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = db.prepare("SELECT * FROM users WHERE LOWER(email) = ?").get(email.trim().toLowerCase());
    if (!user || !checkPassword(password, user.password)) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    req.session.user = sanitizeUser(user);
    res.json({ success: true, user: req.session.user, message: "Login successful!" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
});

// GET /api/auth/me - Get current logged in user from session
app.get("/api/auth/me", (req, res) => {
  res.json(req.session.user || null);
});

// POST /api/auth/logout - Logout user
app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: "Logged out successfully." });
  });
});

// -----------------------------------------------------------------------------
// Start Server
// -----------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🎓 EventHive - College Event Management System`);
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
  console.log(`📂 Frontend served from: ${frontendPath}`);
  console.log(`====================================================`);
});
