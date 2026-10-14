import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { departments, events } from "../data/eventsData";
import EventCard from "../components/EventCard";
import EventDetailsModal from "../components/EventDetailsModal";

export default function DepartmentsPage() {
  const [activeDept, setActiveDept] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  const deptEvents = activeDept
    ? events.filter(
        (ev) =>
          ev.department === activeDept ||
          ev.department === "ALL"
      )
    : [];

  function handleDeptClick(code) {
    setActiveDept((prev) => (prev === code ? null : code));
  }

  return (
    <>
      <main>
        {/* Page Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #29443F 0%, #1d3430 100%)",
            padding: "60px 7% 50px",
            color: "#ffffff",
            textAlign: "center"
          }}
        >
          <span
            style={{
              display: "inline-block",
              background: "rgba(240,90,71,0.25)",
              color: "#FFB4A9",
              padding: "6px 16px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "14px"
            }}
          >
            Explore
          </span>
          <h1 style={{ fontSize: "40px", color: "#ffffff", marginBottom: "12px" }}>
            Events By Department
          </h1>
          <p style={{ color: "#D5E3E0", fontSize: "16px", maxWidth: "500px", margin: "0 auto" }}>
            Explore events organized by different departments of our college.
          </p>
        </div>

        <section className="section departments-section">
          <div className="dept-grid">
            {departments.map((dept, idx) => (
              <div
                key={dept.code}
                className={`dept-card${idx + 1}`}
                style={{
                  background: "#ffffff",
                  padding: "30px 22px",
                  textAlign: "center",
                  borderRadius: "20px",
                  borderTop: `5px solid ${
                    [
                      "#F05A47","#F2C14E","#F7B79D","#A8D5CF","#F05A47","#F2C14E"
                    ][idx % 6]
                  }`,
                  boxShadow:
                    activeDept === dept.code
                      ? "0 16px 36px rgba(240,90,71,0.2)"
                      : "0 6px 20px rgba(41,68,63,0.07)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                  transform: activeDept === dept.code ? "translateY(-6px)" : "none"
                }}
                onClick={() => handleDeptClick(dept.code)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleDeptClick(dept.code)}
              >
                <div style={{ fontSize: "44px", marginBottom: "14px" }}>
                  {dept.icon}
                </div>
                <h3 style={{ fontSize: "17px", color: "#29443F", marginBottom: "6px" }}>
                  {dept.code}
                </h3>
                <p style={{ fontSize: "13px", color: "#687A76", lineHeight: "1.5", marginBottom: "16px" }}>
                  {dept.name}
                </p>
                <button
                  className="btn btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeptClick(dept.code);
                  }}
                >
                  {activeDept === dept.code ? "Hide Events" : "View Events"}
                </button>
              </div>
            ))}
          </div>

          {/* Department Events Panel */}
          {activeDept && (
            <div style={{ marginTop: "50px" }}>
              <div className="section-heading" style={{ marginBottom: "30px" }}>
                <h2 style={{ fontSize: "26px" }}>
                  Events for{" "}
                  <span style={{ color: "#F05A47" }}>
                    {departments.find((d) => d.code === activeDept)?.name}
                  </span>
                </h2>
                <p style={{ color: "#687A76", marginTop: "8px" }}>
                  {deptEvents.length} event{deptEvents.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {deptEvents.length > 0 ? (
                <div className="event-grid">
                  {deptEvents.map((ev) => (
                    <EventCard
                      key={ev.id}
                      event={ev}
                      onViewDetails={setSelectedEvent}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h3>No events yet</h3>
                  <p>This department has no upcoming events. Check back soon!</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
}
