import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function EventDetailsModal({ event, onClose }) {
  const { user, registerForEvent, isRegistered } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  if (!event) return null;

  const registered = isRegistered(event.id);

  async function handleRegister() {
    if (!user) {
      onClose();
      navigate("/login");
      return;
    }
    setLoading(true);
    const result = await registerForEvent(event.id);
    setLoading(false);
    if (result.success) {
      setMessage({ type: "success", text: "🎉 Registered successfully!" });
    } else {
      setMessage({ type: "error", text: result.message });
    }
  }

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
      onClick={onClose}
    >
      <div
        className="modal-box modal-box-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          aria-label="Close event details"
          onClick={onClose}
        >
          ×
        </button>

        <img
          className="event-details-img"
          src={event.image}
          alt={event.name}
        />

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
          <span className="badge badge-coral">{event.category}</span>
          <span className="badge badge-green">{event.department}</span>
        </div>

        <h2 id="detail-title" style={{ fontSize: "24px", marginBottom: "8px" }}>
          {event.name}
        </h2>

        <p style={{ color: "#687A76", fontSize: "15px", lineHeight: "1.7", marginBottom: "8px" }}>
          {event.description}
        </p>

        <ul className="event-details-meta">
          <li>📅 <strong>Date:</strong>&nbsp;{event.date}</li>
          <li>⏰ <strong>Time:</strong>&nbsp;{event.time}</li>
          <li>📍 <strong>Venue:</strong>&nbsp;{event.venue}</li>
          <li>🎟️ <strong>Capacity:</strong>&nbsp;{event.capacity} seats</li>
          <li>⏳ <strong>Registration Deadline:</strong>&nbsp;{event.registrationDeadline}</li>
          {event.coordinator && (
            <li>👤 <strong>Coordinator:</strong>&nbsp;{event.coordinator}</li>
          )}
          {event.eligibility && (
            <li>✅ <strong>Eligibility:</strong>&nbsp;{event.eligibility}</li>
          )}
        </ul>

        {message && (
          <p
            style={{
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "12px",
              color: message.type === "success" ? "#29443F" : "#F05A47"
            }}
          >
            {message.text}
          </p>
        )}

        {registered ? (
          <span className="badge badge-green" style={{ fontSize: "14px", padding: "10px 18px" }}>
            ✓ You are registered for this event
          </span>
        ) : (
          <button
            className="btn"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Registering…" : "Register Now"}
          </button>
        )}
      </div>
    </div>
  );
}
