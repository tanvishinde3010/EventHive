import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="error-page">
      <div className="error-code">404</div>
      <h2>Page Not Found</h2>
      <p>
        The page you're looking for doesn't exist or has been moved.
        Head back to the homepage to find your way.
      </p>
      <Link to="/" className="btn">
        ← Back to Home
      </Link>
    </div>
  );
}
