import { useState } from "react";
import { departments, categories } from "../data/eventsData";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { user, events, deleteEvent } = useAuth();
  const [tab, setTab] = useState("overview"); // overview | events | departments

  const totalEvents = events.length;
  const publishedEvents = events.filter((e) => e.status === "PUBLISHED").length;

  async function handleDelete(ev) {
    if (!window.confirm(`Delete "${ev.name}"?`)) return;
    const result = await deleteEvent(ev.id);
    if (!result.success) alert(result.message);
  }

  const tabStyle = (t) => ({
    padding: "10px 22px",
    borderRadius: "30px",
    border: "2px solid",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s",
    background: tab === t ? "#29443F" : "transparent",
    color: tab === t ? "#ffffff" : "#29443F",
    borderColor: "#29443F"
  });

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <p className="welcome-label">Admin Portal</p>
        <h2>Admin Dashboard 🛠️</h2>
        <p style={{ color: "#687A76", marginTop: "4px", fontSize: "14px" }}>
          {user?.email} · EventHive Administrator
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "32px" }}>
        <button style={tabStyle("overview")} onClick={() => setTab("overview")}>
          Overview
        </button>
        <button style={tabStyle("events")} onClick={() => setTab("events")}>
          Manage Events
        </button>
        <button style={tabStyle("departments")} onClick={() => setTab("departments")}>
          Departments & Categories
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {tab === "overview" && (
        <>
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-info">
                <h3>{totalEvents}</h3>
                <p>Total Events</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>{publishedEvents}</h3>
                <p>Published Events</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏢</div>
              <div className="stat-info">
                <h3>{departments.length}</h3>
                <p>Departments</p>
              </div>
            </div>
          </div>

          {/* Recent Events */}
          <h3 className="dashboard-section-title" style={{ marginTop: "16px" }}>
            📋 Recent Events
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table className="registrations-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Event</th>
                  <th>Department</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Capacity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 5).map((ev, idx) => (
                  <tr key={ev.id}>
                    <td>{idx + 1}</td>
                    <td style={{ fontWeight: 600 }}>{ev.name}</td>
                    <td>{ev.department}</td>
                    <td>{ev.category}</td>
                    <td>{ev.date}</td>
                    <td>{ev.capacity}</td>
                    <td>
                      <span className="badge badge-green">{ev.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* MANAGE EVENTS TAB */}
      {tab === "events" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
            <h3 className="dashboard-section-title" style={{ margin: 0 }}>
              📅 All Events ({events.length})
            </h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="registrations-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Event Name</th>
                  <th>Department</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Capacity</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev, idx) => (
                  <tr key={ev.id}>
                    <td>{idx + 1}</td>
                    <td style={{ fontWeight: 600 }}>{ev.name}</td>
                    <td>{ev.department}</td>
                    <td>{ev.category}</td>
                    <td>{ev.date}</td>
                    <td>{ev.venue}</td>
                    <td>{ev.capacity}</td>
                    <td>{ev.registrationDeadline}</td>
                    <td>
                      <span className="badge badge-green">{ev.status}</span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline"
                        style={{ padding: "6px 12px", fontSize: "12px" }}
                        onClick={() => handleDelete(ev)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* DEPARTMENTS & CATEGORIES TAB */}
      {tab === "departments" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          <div>
            <h3 className="dashboard-section-title">🏢 Departments</h3>
            <div style={{ overflowX: "auto" }}>
              <table className="registrations-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((d) => (
                    <tr key={d.code}>
                      <td style={{ fontWeight: 700, color: "#F05A47" }}>{d.code}</td>
                      <td>{d.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="dashboard-section-title">🏷️ Categories</h3>
            <div style={{ overflowX: "auto" }}>
              <table className="registrations-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Category Name</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c, idx) => (
                    <tr key={c}>
                      <td>{idx + 1}</td>
                      <td>{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: "24px", display: "flex", gap: "14px", flexWrap: "wrap" }}>
        <Link to="/" className="btn btn-sm btn-outline">
          Back to Home
        </Link>
        <Link to="/events" className="btn btn-sm btn-green">
          View All Events
        </Link>
      </div>
    </div>
  );
}
