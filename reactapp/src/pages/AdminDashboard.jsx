import { useState } from "react";
import { events, departments, categories } from "../data/eventsData";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("overview"); // overview | events | departments

  // Simulated admin stats (in real app these come from API)
  const totalEvents = events.length;
  const publishedEvents = events.filter((e) => e.status === "PUBLISHED").length;

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
            <div
              style={{
                background: "#FFE1D5",
                borderRadius: "12px",
                padding: "12px 18px",
                fontSize: "13px",
                color: "#29443F"
              }}
            >
              ℹ️ In the full backend version, you can create, edit, publish and cancel events here.
            </div>
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

      {/* Notice */}
      <div
        style={{
          marginTop: "40px",
          background: "#FFF9F2",
          border: "2px solid #F0E4D7",
          borderRadius: "16px",
          padding: "20px 24px",
          fontSize: "14px",
          color: "#687A76",
          lineHeight: "1.7"
        }}
      >
        <strong style={{ color: "#29443F" }}>📌 Frontend Demo Note:</strong> This admin dashboard
        currently displays read-only event data from the local data file. In the full-stack version
        (Phase 2 with Node.js + MySQL backend), admins can create, edit, publish, cancel events,
        view student registrations, export CSV, and manage student accounts via REST APIs.
        Connect a backend by implementing the API endpoints defined in the PRD.
      </div>

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
