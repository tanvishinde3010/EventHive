// =============================================================================
// db.js - SQLite Database Setup and Initialization for EventHive
// =============================================================================
// Uses Node.js built-in 'node:sqlite' DatabaseSync (zero external DB drivers needed)
// Uses Node.js built-in 'node:crypto' for secure password hashing
// =============================================================================

import { DatabaseSync } from "node:sqlite";
import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { events } from "./eventsData.js";

// Compute directory and database file path safely for Windows, Mac, and Linux
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "eventhive.db");

// Connect to SQLite database (creates 'eventhive.db' file if it doesn't exist)
const db = new DatabaseSync(dbPath);

// Enable foreign keys
db.exec("PRAGMA foreign_keys = ON;");

// -----------------------------------------------------------------------------
// 1. Create Tables
// -----------------------------------------------------------------------------
db.exec(`
  -- Users table: stores student and admin accounts
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'STUDENT',
    department TEXT,
    studentId TEXT
  );

  -- Events table: stores college events details
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT,
    venue TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 100,
    registrationDeadline TEXT,
    coordinator TEXT,
    description TEXT,
    eligibility TEXT,
    image TEXT,
    status TEXT NOT NULL DEFAULT 'PUBLISHED'
  );

  -- Registrations table: stores student event registrations
  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentName TEXT NOT NULL,
    studentEmail TEXT NOT NULL,
    studentPhone TEXT,
    department TEXT NOT NULL,
    eventId INTEGER,
    eventName TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'CONFIRMED',
    registeredAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

// -----------------------------------------------------------------------------
// 2. Password Hashing Utilities (Crypto)
// -----------------------------------------------------------------------------
// Viva explanation: We hash passwords with a random 16-byte salt using scrypt
// so passwords are never saved in plain text in the database.
export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function checkPassword(password, stored) {
  if (!stored || !stored.includes(":")) return false;
  const [salt, hash] = stored.split(":");
  const testHash = scryptSync(password, salt, 64);
  return timingSafeEqual(Buffer.from(hash, "hex"), testHash);
}

// -----------------------------------------------------------------------------
// 3. Seed Demo Data (runs only on first setup when users table is empty)
// -----------------------------------------------------------------------------
const userCount = db.prepare("SELECT COUNT(*) AS count FROM users").get().count;

if (userCount === 0) {
  console.log("Seeding initial users and events into SQLite database...");

  // Insert default student and admin users
  const addUser = db.prepare(
    "INSERT INTO users (name, email, password, role, department, studentId) VALUES (?, ?, ?, ?, ?, ?)"
  );
  addUser.run("Tanvi Shinde", "student@kbtcoe.edu", hashPassword("student123"), "STUDENT", "COMP", "COMP2024001");
  addUser.run("Admin User", "admin@kbtcoe.edu", hashPassword("admin123"), "ADMIN", null, null);

  // Insert seed events from eventsData.js
  const addEvent = db.prepare(`
    INSERT INTO events (
      name, department, category, date, time, venue, capacity,
      registrationDeadline, coordinator, description, eligibility, image, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const e of events) {
    addEvent.run(
      e.name,
      e.department,
      e.category,
      e.date,
      e.time || "10:00 AM - 1:00 PM",
      e.venue,
      e.capacity || 100,
      e.registrationDeadline || "Open",
      e.coordinator || "Event Coordinator",
      e.description,
      e.eligibility || "Open to all students",
      e.image,
      e.status || "PUBLISHED"
    );
  }

  // Insert one sample registration for demo
  const addReg = db.prepare(`
    INSERT INTO registrations (studentName, studentEmail, studentPhone, department, eventId, eventName)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  addReg.run("Tanvi Shinde", "student@kbtcoe.edu", "9876543210", "COMP", 1, "AI Hackathon");

  console.log("Database initialized successfully with sample data.");
}

export default db;
