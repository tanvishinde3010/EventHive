import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const { user, events, registrations: myRegs, cancelRegistration } = useAuth();

  const confirmed = myRegs.filter((r) => r.status === "CONFIRMED");
  const cancelled = myRegs.filter((r) => r.status === "CANCELLED");

  function getEventInfo(eventId) {
    return events.find((e) => e.id === eventId);
  }

  async function handleCancel(regId) {
    if (window.confirm("Are you sure you want to cancel this registration?")) {
      const result = await cancelRegistration(regId);
      if (!result.success) alert(result.message);
    }
  }

  return (
    <div className="dashboard-page">
      {/* Welcome Header */}
      <div className="dashboard-header">
        <p className="welcome-label">Student Portal</p>
        <h2>Welcome, {user?.name || "Student"} 👋</h2>
        <p style={{ color: "#687A76", marginTop: "4px", fontSize: "14px" }}>
          {user?.email} &nbsp;·&nbsp; {user?.department || "—"}
          {user?.studentId && ` · ID: ${user.studentId}`}
        </p>
      </div>

      {/* Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">🎟️</div>
          <div className="stat-info">
            <h3>{myRegs.length}</h3>
            <p>Total Registrations</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{confirmed.length}</h3>
            <p>Confirmed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <h3>{cancelled.length}</h3>
            <p>Cancelled</p>
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div>
        <h3 className="dashboard-section-title">
          📋 My Event Registrations
        </h3>

        {myRegs.length === 0 ? (
          <div className="empty-state" style={{ background: "#ffffff", borderRadius: "20px", boxShadow: "0 4px 16px rgba(41,68,63,0.07)" }}>
            <div className="empty-icon">🎫</div>
            <h3>No registrations yet</h3>
            <p>Browse events and register to see them here.</p>
            <Link to="/events" className="btn btn-sm" style={{ marginTop: "16px", display: "inline-block" }}>
              Browse Events
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="registrations-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Event</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Status</th>
                  <th>Registered On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {myRegs.map((reg, idx) => {
                  const ev = getEventInfo(reg.eventId);
                  return (
                    <tr key={reg.id}>
                      <td>{idx + 1}</td>
                      <td style={{ fontWeight: 600 }}>{reg.eventName}</td>
                      <td>{ev?.department || "—"}</td>
                      <td>{ev?.date || "—"}</td>
                      <td>{ev?.venue || "—"}</td>
                      <td>
                        <span
                          className={`badge ${
                            reg.status === "CONFIRMED"
                              ? "badge-green"
                              : "badge-coral"
                          }`}
                        >
                          {reg.status}
                        </span>
                      </td>
                      <td>
                        {new Date(reg.registeredAt).toLocaleDateString("en-IN")}
                      </td>
                      <td>
                        {reg.status === "CONFIRMED" && (
                          <button
                            className="btn btn-sm btn-outline"
                            style={{ padding: "6px 12px", fontSize: "12px" }}
                            onClick={() => handleCancel(reg.id)}
                          >
                            Cancel
                          </button>
                        )}
                        {reg.status === "CANCELLED" && (
                          <span style={{ color: "#AEBDBA", fontSize: "12px" }}>Cancelled</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div style={{ marginTop: "36px", display: "flex", gap: "14px", flexWrap: "wrap" }}>
        <Link to="/events" className="btn btn-sm btn-green">
          Browse More Events
        </Link>
        <Link to="/" className="btn btn-sm btn-outline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
