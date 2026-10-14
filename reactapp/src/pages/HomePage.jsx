import { useState } from "react";
import Hero from "../components/Hero";
import EventCard from "../components/EventCard";
import EventDetailsModal from "../components/EventDetailsModal";
import { events, departments } from "../data/eventsData";
import { Link } from "react-router-dom";

const FEATURED_IDS = [1, 2, 3, 9]; // AI Hackathon, Web Dev Workshop, Sports Day, Cultural Fest

const features = [
  { icon: "🔎", title: "Easy Event Discovery", desc: "Find upcoming college events quickly with search and filters." },
  { icon: "🏢", title: "Department-wise Events", desc: "Explore events organized by each department of our college." },
  { icon: "📝", title: "One-click Registration", desc: "Register for events instantly with your student account." },
  { icon: "📅", title: "Track Your Events", desc: "View all your registrations and their status in one dashboard." }
];

export default function HomePage() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const featured = events.filter((e) => FEATURED_IDS.includes(e.id));

  return (
    <>
      <main>
        {/* Hero */}
        <Hero />

        {/* Featured Events */}
        <section className="section events-section" id="events">
          <div className="section-heading">
            <span className="label">What's Happening</span>
            <h2>Featured Events</h2>
            <p>
              Register for exciting events happening across all departments.
            </p>
          </div>

          <div className="event-grid">
            {featured.map((ev) => (
              <EventCard
                key={ev.id}
                event={ev}
                onViewDetails={setSelectedEvent}
              />
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "36px" }}>
            <Link to="/events" className="btn btn-green">
              View All Events →
            </Link>
          </div>
        </section>

        {/* Departments */}
        <section className="section departments-section" id="departments">
          <div className="section-heading">
            <span className="label">Explore</span>
            <h2>Events By Department</h2>
            <p>
              Explore events organized by different departments of our college.
            </p>
          </div>

          <div className="dept-grid">
            {departments.map((dept, idx) => (
              <div
                key={dept.code}
                className="dept-card"
                style={{
                  background: "#ffffff",
                  padding: "30px 22px",
                  textAlign: "center",
                  borderRadius: "20px",
                  borderTop: `5px solid ${
                    ["#F05A47","#F2C14E","#F7B79D","#A8D5CF","#F05A47","#F2C14E"][idx % 6]
                  }`,
                  boxShadow: "0 6px 20px rgba(41,68,63,0.07)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease"
                }}
              >
                <div style={{ fontSize: "44px", marginBottom: "14px" }}>{dept.icon}</div>
                <h3 style={{ fontSize: "17px", color: "#29443F", marginBottom: "6px" }}>
                  {dept.code}
                </h3>
                <p style={{ fontSize: "13px", color: "#687A76", lineHeight: "1.5", marginBottom: "18px" }}>
                  {dept.name}
                </p>
                <Link to="/departments" className="btn btn-sm btn-outline">
                  View Events
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* About */}
        <section className="section about-section" id="about">
          <div className="about-image-wrap">
            <img
              src="/images/college.jpeg"
              alt="KBT College of Engineering campus building"
            />
          </div>

          <div className="about-content">
            <span className="about-label">About Our College</span>
            <h2>Learn. Participate. Grow.</h2>
            <p>
              KBT College of Engineering is an autonomous institution providing
              students with exceptional opportunities to participate in technical,
              cultural, sports, and academic activities throughout the year.
            </p>
            <p>
              EventHive makes it easier for students to discover events, register
              for them, and participate in activities organized by all departments —
              all from one unified platform.
            </p>
            <Link to="/about" className="btn" style={{ marginTop: "8px" }}>
              Learn More
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="section features-section">
          <div className="section-heading">
            <span className="label">Why Use Our System?</span>
            <h2>Everything About College Events in One Place</h2>
          </div>

          <div className="features-grid">
            {features.map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="section cta-section" id="contact">
          <h2>Have an Event to Organize?</h2>
          <p>
            Connect with the EventHive management team to list your
            department event on our platform.
          </p>
          <Link to="/login" className="btn">
            Get Started
          </Link>
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
