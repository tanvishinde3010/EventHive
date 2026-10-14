import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            Event<span>Hive</span>
          </Link>
          <p>
            The central platform for KBT College of Engineering to
            manage, discover, and register for college events across
            all departments.
          </p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/events">Browse Events</Link></li>
            <li><Link to="/departments">Departments</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li>
              <a href="mailto:events@kbtcoe.edu">events@kbtcoe.edu</a>
            </li>
            <li>
              <a href="tel:+912532580064">+91 253 258 0064</a>
            </li>
            <li>
              <a href="#">Nashik, Maharashtra</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 EventHive — KBT College of Engineering. All rights reserved.</p>
      </div>
    </footer>
  );
}
