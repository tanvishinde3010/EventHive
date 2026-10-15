import express from "express";
import session from "express-session";
import db, { hashPassword, checkPassword } from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "eventhive-dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax" }
  })
);

// Static resources: the plain HTML/CSS/JS site and shared images
app.use(express.static(new URL("../html-css-js", import.meta.url).pathname));
app.use("/images", express.static(new URL("../images", import.meta.url).pathname));

// ---------- Middleware ----------
function requireLogin(req, res, next) {
  if (!req.session.user) return res.status(401).json({ message: "Please log in first." });
  next();
}

function requireAdmin(req, res, next) {
  if (req.session.user?.role !== "ADMIN") return res.status(403).json({ message: "Admins only." });
  next();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EVENT_FIELDS = [
  "name", "department", "category", "date", "time", "venue", "capacity",
  "registrationDeadline", "coordinator", "description", "eligibility", "image", "status"
];

function safeUser({ password, ...user }) {
  return user;
}

// ---------- Auth ----------
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, department, studentId } = req.body;
  if (!name?.trim() || !email?.trim() || !password || !department) {
    return res.status(400).json({ message: "Name, email, password and department are required." });
  }
  if (!EMAIL_RE.test(email)) return res.status(400).json({ message: "Enter a valid email address." });
  if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters." });

  const cleanEmail = email.trim().toLowerCase();
  if (db.prepare("SELECT id FROM users WHERE email = ?").get(cleanEmail)) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const { lastInsertRowid } = db
    .prepare("INSERT INTO users (name, email, password, department, studentId) VALUES (?, ?, ?, ?, ?)")
    .run(name.trim(), cleanEmail, hashPassword(password), department, studentId?.trim() || null);

  req.session.user = safeUser(db.prepare("SELECT * FROM users WHERE id = ?").get(lastInsertRowid));
  res.status(201).json(req.session.user);
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Please enter your email and password." });

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email.trim().toLowerCase());
  if (!user || !checkPassword(password, user.password)) {
    return res.status(401).json({ message: "Invalid email or password." });
  }
  req.session.user = safeUser(user);
  res.json(req.session.user);
});

app.get("/api/auth/me", (req, res) => {
  res.json(req.session.user || null);
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

// ---------- Events (CRUD) ----------
app.get("/api/events", (req, res) => {
  res.json(db.prepare("SELECT * FROM events ORDER BY id").all());
});

app.get("/api/events/:id", (req, res) => {
  const event = db.prepare("SELECT * FROM events WHERE id = ?").get(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found." });
  res.json(event);
});

app.post("/api/events", requireAdmin, (req, res) => {
  const { name, department, category, date, venue, capacity } = req.body;
  if (!name || !department || !category || !date || !venue || !(capacity > 0)) {
    return res.status(400).json({ message: "Name, department, category, date, venue and a positive capacity are required." });
  }
  const values = EVENT_FIELDS.map((f) => req.body[f] ?? null);
  values[EVENT_FIELDS.indexOf("status")] ??= "PUBLISHED";

  const { lastInsertRowid } = db
    .prepare(`INSERT INTO events (${EVENT_FIELDS.join(", ")}) VALUES (${EVENT_FIELDS.map(() => "?").join(", ")})`)
    .run(...values);
  res.status(201).json(db.prepare("SELECT * FROM events WHERE id = ?").get(lastInsertRowid));
});

app.put("/api/events/:id", requireAdmin, (req, res) => {
  const fields = EVENT_FIELDS.filter((f) => f in req.body);
  if (fields.length === 0) return res.status(400).json({ message: "Nothing to update." });

  const { changes } = db
    .prepare(`UPDATE events SET ${fields.map((f) => `${f} = ?`).join(", ")} WHERE id = ?`)
    .run(...fields.map((f) => req.body[f]), req.params.id);
  if (!changes) return res.status(404).json({ message: "Event not found." });
  res.json(db.prepare("SELECT * FROM events WHERE id = ?").get(req.params.id));
});

app.delete("/api/events/:id", requireAdmin, (req, res) => {
  const { changes } = db.prepare("DELETE FROM events WHERE id = ?").run(req.params.id);
  if (!changes) return res.status(404).json({ message: "Event not found." });
  res.json({ success: true });
});

// ---------- Registrations ----------
app.get("/api/registrations/me", requireLogin, (req, res) => {
  const rows = db
    .prepare(`
      SELECT r.*, e.name AS eventName
      FROM registrations r JOIN events e ON e.id = r.eventId
      WHERE r.userId = ?
      ORDER BY r.registeredAt DESC
    `)
    .all(req.session.user.id);
  res.json(rows);
});

app.post("/api/registrations", requireLogin, (req, res) => {
  const { user } = req.session;
  if (user.role === "ADMIN") return res.status(403).json({ message: "Admins cannot register for events." });

  const event = db.prepare("SELECT * FROM events WHERE id = ?").get(req.body.eventId);
  if (!event) return res.status(404).json({ message: "Event not found." });

  const existing = db.prepare("SELECT * FROM registrations WHERE userId = ? AND eventId = ?").get(user.id, event.id);
  if (existing?.status === "CONFIRMED") {
    return res.status(409).json({ message: "You are already registered for this event." });
  }

  const { n } = db
    .prepare("SELECT COUNT(*) AS n FROM registrations WHERE eventId = ? AND status = 'CONFIRMED'")
    .get(event.id);
  if (n >= event.capacity) return res.status(409).json({ message: "Sorry, this event is full." });

  if (existing) {
    db.prepare("UPDATE registrations SET status = 'CONFIRMED', registeredAt = CURRENT_TIMESTAMP WHERE id = ?").run(existing.id);
  } else {
    db.prepare("INSERT INTO registrations (userId, eventId) VALUES (?, ?)").run(user.id, event.id);
  }
  res.status(201).json({ success: true });
});

app.delete("/api/registrations/:id", requireLogin, (req, res) => {
  const { changes } = db
    .prepare("UPDATE registrations SET status = 'CANCELLED' WHERE id = ? AND userId = ?")
    .run(req.params.id, req.session.user.id);
  if (!changes) return res.status(404).json({ message: "Registration not found." });
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`EventHive API running on http://localhost:${PORT}`);
});
