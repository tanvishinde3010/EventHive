import { useState } from "react";
import { events, departments, categories } from "../data/eventsData";
import EventCard from "../components/EventCard";
import EventDetailsModal from "../components/EventDetailsModal";

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [department, setDepartment] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filtered = events.filter((ev) => {
    const q = search.toLowerCase();
    const matchSearch =
      ev.name.toLowerCase().includes(q) ||
      ev.department.toLowerCase().includes(q) ||
      ev.category.toLowerCase().includes(q) ||
      ev.venue.toLowerCase().includes(q);

    const matchCat = category === "All" || ev.category === category;
    const matchDept =
      department === "All" ||
      ev.department === department ||
      ev.department === "ALL";

    return matchSearch && matchCat && matchDept;
  });

  function clearFilters() {
    setSearch("");
    setCategory("All");
    setDepartment("All");
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
            What's Happening
          </span>
          <h1 style={{ fontSize: "40px", color: "#ffffff", marginBottom: "12px" }}>
            Upcoming Events
          </h1>
          <p style={{ color: "#D5E3E0", fontSize: "16px", maxWidth: "500px", margin: "0 auto" }}>
            Browse and register for events happening across all departments at KBTCOE.
          </p>
        </div>

        {/* Filters */}
        <div className="section" style={{ paddingTop: "40px", paddingBottom: "20px", background: "#ffffff" }}>
          <div className="event-filters">
            <div className="search-box">
              <input
                type="search"
                placeholder="🔍 Search events, departments, venues…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search events"
              />
            </div>

            <div className="filter-select">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Filter by category"
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="filter-select">
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                aria-label="Filter by department"
              >
                <option value="All">All Departments</option>
                {departments.map((d) => (
                  <option key={d.code} value={d.code}>{d.code}</option>
                ))}
              </select>
            </div>

            {(search || category !== "All" || department !== "All") && (
              <button className="btn btn-outline btn-sm" onClick={clearFilters}>
                Clear Filters
              </button>
            )}
          </div>

          {/* Results count */}
          <p style={{ textAlign: "center", color: "#687A76", fontSize: "14px", marginBottom: "28px" }}>
            Showing <strong style={{ color: "#29443F" }}>{filtered.length}</strong> of {events.length} events
          </p>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="event-grid">
              {filtered.map((ev) => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  onViewDetails={setSelectedEvent}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No events found</h3>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
              <button className="btn btn-sm" onClick={clearFilters} style={{ marginTop: "16px" }}>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
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
