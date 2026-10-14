import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <main>
      {/* Header */}
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
          About Us
        </span>
        <h1 style={{ fontSize: "40px", color: "#ffffff", marginBottom: "12px" }}>
          About EventHive
        </h1>
        <p style={{ color: "#D5E3E0", fontSize: "16px", maxWidth: "520px", margin: "0 auto" }}>
          The central college event management platform for KBT College of Engineering.
        </p>
      </div>

      <section className="section about-section">
        <div className="about-image-wrap">
          <img
            src="/images/college.jpeg"
            alt="KBT College of Engineering campus"
          />
        </div>

        <div className="about-content">
          <span className="about-label">Our Mission</span>
          <h2>Learn. Participate. Grow.</h2>
          <p>
            KBT College of Engineering is an autonomous institution that provides
            students with outstanding opportunities to participate in technical,
            cultural, sports, and academic activities throughout the academic year.
          </p>
          <p>
            EventHive was created to make event discovery, registration, and
            participation simple and accessible for every student. From hackathons
            to cultural fests, all college events are organized in one central platform.
          </p>
          <p>
            Our platform bridges the gap between event organizers and students —
            making sure no exciting event goes undiscovered.
          </p>
        </div>
      </section>

      <section className="section features-section">
        <div className="section-heading">
          <span className="label">What We Offer</span>
          <h2>Platform Features</h2>
        </div>

        <div className="features-grid">
          {[
            { icon: "🔎", title: "Event Discovery", desc: "Search and filter all college events by department, category, and date." },
            { icon: "🏢", title: "Department Coverage", desc: "All 6 engineering departments publish and manage their events." },
            { icon: "📝", title: "Easy Registration", desc: "Register for events in one click with your student account." },
            { icon: "📊", title: "Student Dashboard", desc: "Track your registrations, view status, and manage your schedule." }
          ].map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div style={{ textAlign: "center", padding: "0 7% 60px" }}>
        <Link to="/events" className="btn">
          Browse Events
        </Link>
        &nbsp;&nbsp;
        <Link to="/register" className="btn btn-outline">
          Create Account
        </Link>
      </div>
    </main>
  );
}
