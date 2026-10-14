import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/");
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header className="navbar">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          Event<span>Hive</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/events">Events</NavLink>
          <NavLink to="/departments">Departments</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>

          {user ? (
            <>
              {user.role === "STUDENT" && (
                <NavLink to="/student/dashboard">Dashboard</NavLink>
              )}
              {user.role === "ADMIN" && (
                <NavLink to="/admin/dashboard">Admin</NavLink>
              )}
              <button
                className="btn btn-sm"
                onClick={handleLogout}
                style={{ marginLeft: "4px" }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-sm">
              Login
            </Link>
          )}
        </nav>

        {/* Hamburger */}
        <button
          className="hamburger"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <Link to="/" onClick={closeMenu}>Home</Link>
        <Link to="/events" onClick={closeMenu}>Events</Link>
        <Link to="/departments" onClick={closeMenu}>Departments</Link>
        <Link to="/about" onClick={closeMenu}>About</Link>
        <Link to="/contact" onClick={closeMenu}>Contact</Link>

        {user ? (
          <>
            {user.role === "STUDENT" && (
              <Link to="/student/dashboard" onClick={closeMenu}>Dashboard</Link>
            )}
            {user.role === "ADMIN" && (
              <Link to="/admin/dashboard" onClick={closeMenu}>Admin</Link>
            )}
            <Link to="/" onClick={handleLogout}>Logout</Link>
          </>
        ) : (
          <Link to="/login" onClick={closeMenu}>Login</Link>
        )}
      </div>
    </>
  );
}
