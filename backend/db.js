import { DatabaseSync } from "node:sqlite";
import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";
import { events } from "../reactapp/src/data/eventsData.js";

const db = new DatabaseSync(new URL("./eventhive.db", import.meta.url).pathname);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'STUDENT',
    department TEXT,
    studentId TEXT
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT,
    venue TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    registrationDeadline TEXT,
    coordinator TEXT,
    description TEXT,
    eligibility TEXT,
    image TEXT,
    status TEXT NOT NULL DEFAULT 'PUBLISHED'
  );

  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    eventId INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'CONFIRMED',
    registeredAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (userId, eventId)
  );
`);
db.exec("PRAGMA foreign_keys = ON");

export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  return salt + ":" + scryptSync(password, salt, 64).toString("hex");
}

export function checkPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  return timingSafeEqual(Buffer.from(hash, "hex"), scryptSync(password, salt, 64));
}

// Seed demo data on first run
if (db.prepare("SELECT COUNT(*) AS n FROM users").get().n === 0) {
  const addUser = db.prepare(
    "INSERT INTO users (name, email, password, role, department, studentId) VALUES (?, ?, ?, ?, ?, ?)"
  );
  addUser.run("Tanvi Shinde", "student@kbtcoe.edu", hashPassword("student123"), "STUDENT", "COMP", "COMP2024001");
  addUser.run("Admin User", "admin@kbtcoe.edu", hashPassword("admin123"), "ADMIN", null, null);

  const addEvent = db.prepare(`
    INSERT INTO events (name, department, category, date, time, venue, capacity,
      registrationDeadline, coordinator, description, eligibility, image, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const e of events) {
    addEvent.run(e.name, e.department, e.category, e.date, e.time, e.venue, e.capacity,
      e.registrationDeadline, e.coordinator, e.description, e.eligibility, e.image, e.status);
  }
}

export default db;
