import { useState } from "react";
import { Link } from "react-router-dom";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.subject.trim()) e.subject = "Subject is required.";
    if (!form.message.trim()) e.message = "Message is required.";
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  }

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
          Get In Touch
        </span>
        <h1 style={{ fontSize: "40px", color: "#ffffff", marginBottom: "12px" }}>
          Contact Us
        </h1>
        <p style={{ color: "#D5E3E0", fontSize: "16px", maxWidth: "500px", margin: "0 auto" }}>
          Have a question about EventHive or want to organize an event? We'd love to hear from you.
        </p>
      </div>

      <section className="section" style={{ background: "#FFF9F2" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: "48px",
            maxWidth: "900px",
            margin: "0 auto",
            alignItems: "start"
          }}
        >
          {/* Contact Info */}
          <div>
            <h2 style={{ fontSize: "26px", marginBottom: "20px" }}>
              Contact Information
            </h2>

            {[
              { icon: "📍", title: "Address", desc: "KBT College of Engineering, Nashik, Maharashtra 422013" },
              { icon: "📞", title: "Phone", desc: "+91 253 258 0064" },
              { icon: "📧", title: "Email", desc: "events@kbtcoe.edu" },
              { icon: "⏰", title: "Office Hours", desc: "Mon–Sat, 9:00 AM – 5:00 PM" }
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  display: "flex",
                  gap: "14px",
                  marginBottom: "20px",
                  background: "#ffffff",
                  padding: "16px 18px",
                  borderRadius: "14px",
                  boxShadow: "0 4px 14px rgba(41,68,63,0.07)"
                }}
              >
                <span style={{ fontSize: "24px" }}>{item.icon}</span>
                <div>
                  <strong style={{ fontSize: "14px", color: "#29443F", display: "block" }}>
                    {item.title}
                  </strong>
                  <p style={{ fontSize: "13px", color: "#687A76", marginTop: "2px" }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "36px",
              boxShadow: "0 8px 28px rgba(41,68,63,0.1)"
            }}
          >
            {submitted ? (
              <div className="empty-state">
                <div className="empty-icon">✉️</div>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <button
                  className="btn btn-sm"
                  style={{ marginTop: "16px" }}
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h3 style={{ fontSize: "20px", marginBottom: "22px", color: "#29443F" }}>
                  Send a Message
                </h3>

                <div className="form-group">
                  <label htmlFor="contactName">Your Name</label>
                  <input
                    id="contactName"
                    type="text"
                    placeholder="Full name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                  {errors.name && <p className="field-error">{errors.name}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="contactEmail">Email Address</label>
                  <input
                    id="contactEmail"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                  {errors.email && <p className="field-error">{errors.email}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="contactSubject">Subject</label>
                  <input
                    id="contactSubject"
                    type="text"
                    placeholder="What is this about?"
                    value={form.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                  />
                  {errors.subject && <p className="field-error">{errors.subject}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="contactMessage">Message</label>
                  <textarea
                    id="contactMessage"
                    rows={4}
                    placeholder="Write your message here…"
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                  />
                  {errors.message && <p className="field-error">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="btn form-submit-btn"
                  disabled={loading}
                >
                  {loading ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
