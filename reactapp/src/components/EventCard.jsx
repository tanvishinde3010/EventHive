import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function EventCard({ event, onViewDetails, compact = false }) {
  const { user, registerForEvent, isRegistered } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const registered = isRegistered(event.id);

  async function handleRegister(e) {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    if (registered) return;

    setLoading(true);
    const result = await registerForEvent(event.id);
    setLoading(false);
    if (result.success) {
      setMessage({ type: "success", text: "Registered successfully!" });
    } else {
      setMessage({ type: "error", text: result.message });
    }
    setTimeout(() => setMessage(null), 3000);
  }

  return (
    <article className="event-card">
      <img
        className="event-card-img"
        src={event.image}
        alt={event.name}
        loading="lazy"
      />

      <div className="event-card-body">
        <div className="event-card-badges">
          <span className="badge badge-coral">{event.category}</span>
          <span className="badge badge-green">{event.department}</span>
        </div>

        <h3>{event.name}</h3>

        <ul className="event-meta">
          <li>
            <span className="icon">📅</span>
            {event.date}
          </li>
          <li>
            <span className="icon">⏰</span>
            {event.time}
          </li>
          <li>
            <span className="icon">📍</span>
            {event.venue}
          </li>
          <li>
            <span className="icon">🎟️</span>
            Capacity: {event.capacity}
          </li>
        </ul>

        {!compact && (
          <p className="event-card-desc">
            {event.description.length > 100
              ? event.description.slice(0, 100) + "…"
              : event.description}
          </p>
        )}

        {message && (
          <p
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: message.type === "success" ? "#29443F" : "#F05A47",
              marginBottom: "10px"
            }}
          >
            {message.text}
          </p>
        )}

        <div className="event-card-actions">
          <button
            className="btn btn-sm btn-outline"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails && onViewDetails(event);
            }}
          >
            View Details
          </button>

          {registered ? (
            <span className="badge badge-green" style={{ alignSelf: "center", padding: "8px 14px" }}>
              ✓ Registered
            </span>
          ) : (
            <button
              className="btn btn-sm"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "Registering…" : "Register"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
