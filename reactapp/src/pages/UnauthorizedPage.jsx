import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <div className="error-page">
      <div className="error-code" style={{ color: "#FFE1D5" }}>403</div>
      <h2>Access Denied</h2>
      <p>
        You don't have permission to access this page.
        Please log in with an appropriate account.
      </p>
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", justifyContent: "center" }}>
        <Link to="/login" className="btn">Login</Link>
        <Link to="/" className="btn btn-outline">Back to Home</Link>
      </div>
    </div>
  );
}
