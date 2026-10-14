import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <span className="hero-label">Welcome to KBTCOE</span>

        <h1>
          College Event{" "}
          <span>Management System</span>
        </h1>

        <p className="hero-desc">
          Discover, register, and participate in exciting events
          happening across our college. All departments, all events —
          one platform.
        </p>

        <div className="hero-buttons">
          <Link to="/events" className="btn">
            Explore Events
          </Link>
          <Link to="/register" className="btn btn-outline">
            Join Now
          </Link>
        </div>
      </div>

      <div className="hero-image-wrap">
        <img
          src="/images/hero.jpeg"
          alt="College students participating in an event at KBTCOE"
        />
      </div>
    </section>
  );
}
