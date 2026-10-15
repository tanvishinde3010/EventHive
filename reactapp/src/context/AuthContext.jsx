import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// Small helper for calling the backend API (proxied to the Express server by Vite)
async function api(path, method = "GET", body) {
  try {
    const res = await fetch("/api" + path, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json();
    return res.ok ? { success: true, data } : { success: false, message: data.message };
  } catch (err) {
    console.error("API error:", err);
    return { success: false, message: "Could not reach the server." };
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [ready, setReady] = useState(false);

  async function loadEvents() {
    const result = await api("/events");
    if (result.success) setEvents(result.data);
  }

  async function loadRegistrations() {
    const result = await api("/registrations/me");
    setRegistrations(result.success ? result.data : []);
  }

  // Restore session from the server and load events
  useEffect(() => {
    api("/events").then((result) => {
      if (result.success) setEvents(result.data);
    });
    api("/auth/me").then((me) => {
      if (me.success && me.data) {
        setUser(me.data);
        loadRegistrations();
      }
      setReady(true);
    });
  }, []);

  async function login(email, password) {
    const result = await api("/auth/login", "POST", { email, password });
    if (!result.success) return result;
    setUser(result.data);
    await loadRegistrations();
    return { success: true, user: result.data };
  }

  async function logout() {
    await api("/auth/logout", "POST");
    setUser(null);
    setRegistrations([]);
  }

  async function register(formData) {
    const result = await api("/auth/register", "POST", formData);
    if (!result.success) return result;
    setUser(result.data);
    setRegistrations([]);
    return { success: true, user: result.data };
  }

  async function registerForEvent(eventId) {
    if (!user) return { success: false, message: "Please log in first." };
    const result = await api("/registrations", "POST", { eventId });
    if (result.success) await loadRegistrations();
    return result;
  }

  async function cancelRegistration(regId) {
    const result = await api(`/registrations/${regId}`, "DELETE");
    if (result.success) await loadRegistrations();
    return result;
  }

  async function deleteEvent(eventId) {
    const result = await api(`/events/${eventId}`, "DELETE");
    if (result.success) await loadEvents();
    return result;
  }

  function isRegistered(eventId) {
    return registrations.some((r) => r.eventId === eventId && r.status === "CONFIRMED");
  }

  // Wait until we know whether the user is logged in before rendering routes
  if (!ready) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        events,
        registrations,
        login,
        logout,
        register,
        registerForEvent,
        cancelRegistration,
        deleteEvent,
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
