import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// Demo users (in a real app this would come from a backend)
const DEMO_USERS = [
  {
    id: 1,
    email: "student@kbtcoe.edu",
    password: "student123",
    name: "Tanvi Patil",
    role: "STUDENT",
    department: "COMP",
    studentId: "COMP2024001"
  },
  {
    id: 2,
    email: "admin@kbtcoe.edu",
    password: "admin123",
    name: "Admin User",
    role: "ADMIN",
    department: null,
    studentId: null
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [registrations, setRegistrations] = useState([]);

  // Restore session from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("eh_user");
      const savedRegs = localStorage.getItem("eh_registrations");
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedRegs) setRegistrations(JSON.parse(savedRegs));
    } catch (err) {
      console.error("Could not restore session:", err);
    }
  }, []);

  function login(email, password) {
    const found = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) {
      return { success: false, message: "Invalid email or password." };
    }
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    try {
      localStorage.setItem("eh_user", JSON.stringify(safeUser));
    } catch (err) {
      console.error("Could not save session:", err);
    }
    return { success: true, user: safeUser };
  }

  function logout() {
    setUser(null);
    try {
      localStorage.removeItem("eh_user");
    } catch (err) {
      console.error("Could not clear session:", err);
    }
  }

  function register(formData) {
    const { email, name, password, department } = formData;

    // Check duplicate email
    if (DEMO_USERS.find((u) => u.email === email)) {
      return {
        success: false,
        message: "An account with this email already exists."
      };
    }

    const newUser = {
      id: Date.now(),
      email,
      name,
      role: "STUDENT",
      department,
      studentId: formData.studentId || null
    };

    // Add to demo users list (persists only in memory in this demo version)
    DEMO_USERS.push({ ...newUser, password });

    const { password: _, ...safeUser } = { ...newUser, password };
    setUser(safeUser);
    try {
      localStorage.setItem("eh_user", JSON.stringify(safeUser));
    } catch (err) {
      console.error("Could not save session:", err);
    }
    return { success: true, user: safeUser };
  }

  function registerForEvent(eventId, eventName) {
    if (!user) return { success: false, message: "Please log in first." };
    if (user.role === "ADMIN")
      return { success: false, message: "Admins cannot register for events." };

    const already = registrations.find(
      (r) => r.eventId === eventId && r.userId === user.id && r.status !== "CANCELLED"
    );
    if (already) {
      return { success: false, message: "You are already registered for this event." };
    }

    const newReg = {
      id: Date.now(),
      userId: user.id,
      eventId,
      eventName,
      status: "CONFIRMED",
      registeredAt: new Date().toISOString()
    };

    const updated = [...registrations, newReg];
    setRegistrations(updated);
    try {
      localStorage.setItem("eh_registrations", JSON.stringify(updated));
    } catch (err) {
      console.error("Could not save registration:", err);
    }
    return { success: true, registration: newReg };
  }

  function cancelRegistration(regId) {
    const updated = registrations.map((r) =>
      r.id === regId ? { ...r, status: "CANCELLED", cancelledAt: new Date().toISOString() } : r
    );
    setRegistrations(updated);
    try {
      localStorage.setItem("eh_registrations", JSON.stringify(updated));
    } catch (err) {
      console.error("Could not update registration:", err);
    }
    return { success: true };
  }

  function getMyRegistrations() {
    if (!user) return [];
    return registrations.filter((r) => r.userId === user.id);
  }

  function isRegistered(eventId) {
    if (!user) return false;
    return registrations.some(
      (r) => r.eventId === eventId && r.userId === user.id && r.status !== "CANCELLED"
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        registerForEvent,
        cancelRegistration,
        getMyRegistrations,
        isRegistered
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
