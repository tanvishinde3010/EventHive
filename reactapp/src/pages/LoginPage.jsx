import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { departments } from "../data/eventsData";

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" | "register"

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [regData, setRegData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    department: "",
    studentId: ""
  });
  const [regErrors, setRegErrors] = useState({});
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState("");

  /* ---- Login submit ---- */
  function handleLogin(e) {
    e.preventDefault();
    setLoginError("");

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError("Please enter your email and password.");
      return;
    }

    setLoginLoading(true);
    setTimeout(() => {
      const result = login(loginEmail.trim(), loginPassword);
      setLoginLoading(false);
      if (!result.success) {
        setLoginError(result.message);
        return;
      }
      if (result.user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    }, 700);
  }

  /* ---- Register submit ---- */
  function validateReg() {
    const errors = {};
    if (!regData.name.trim()) errors.name = "Full name is required.";
    else if (!/^[A-Za-z ]+$/.test(regData.name))
      errors.name = "Name should contain only letters.";

    if (!regData.email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regData.email))
      errors.email = "Enter a valid email address.";

    if (!regData.password) errors.password = "Password is required.";
    else if (regData.password.length < 6)
      errors.password = "Password must be at least 6 characters.";

    if (regData.confirm !== regData.password)
      errors.confirm = "Passwords do not match.";

    if (!regData.department) errors.department = "Please select your department.";

    return errors;
  }

  function handleRegister(e) {
    e.preventDefault();
    setRegSuccess("");
    const errors = validateReg();
    setRegErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setRegLoading(true);
    setTimeout(() => {
      const result = register({
        name: regData.name.trim(),
        email: regData.email.trim(),
        password: regData.password,
        department: regData.department,
        studentId: regData.studentId.trim()
      });
      setRegLoading(false);
      if (!result.success) {
        setRegErrors({ email: result.message });
        return;
      }
      navigate("/student/dashboard");
    }, 700);
  }

  function handleRegChange(field, value) {
    setRegData((prev) => ({ ...prev, [field]: value }));
    if (regErrors[field]) setRegErrors((prev) => ({ ...prev, [field]: "" }));
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <span className="auth-label">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </span>
          <h1>{mode === "login" ? "Login to EventHive" : "Join EventHive"}</h1>
          <p>
            {mode === "login"
              ? "Access your dashboard and manage event registrations."
              : "Create your student account to register for events."}
          </p>
        </div>

        {/* Demo credentials hint */}
        {mode === "login" && (
          <div
            style={{
              background: "#FFE1D5",
              borderRadius: "12px",
              padding: "12px 16px",
              marginBottom: "20px",
              fontSize: "13px",
              color: "#29443F"
            }}
          >
            <strong>Demo accounts:</strong>
            <br />
            Student: student@kbtcoe.edu / student123
            <br />
            Admin: admin@kbtcoe.edu / admin123
          </div>
        )}

        {mode === "login" ? (
          <form onSubmit={handleLogin} noValidate>
            <div className="form-group">
              <label htmlFor="loginEmail">Email Address</label>
              <input
                id="loginEmail"
                type="email"
                placeholder="Enter your email"
                value={loginEmail}
                onChange={(e) => {
                  setLoginEmail(e.target.value);
                  setLoginError("");
                }}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="loginPassword">Password</label>
              <input
                id="loginPassword"
                type="password"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => {
                  setLoginPassword(e.target.value);
                  setLoginError("");
                }}
                autoComplete="current-password"
              />
            </div>

            {loginError && (
              <p className="form-message error" role="alert">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="btn form-submit-btn"
              disabled={loginLoading}
            >
              {loginLoading ? "Logging in…" : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} noValidate>
            <div className="form-group">
              <label htmlFor="regName">Full Name</label>
              <input
                id="regName"
                type="text"
                placeholder="Enter your full name"
                value={regData.name}
                onChange={(e) => handleRegChange("name", e.target.value)}
                autoComplete="name"
              />
              {regErrors.name && (
                <p className="field-error" role="alert">{regErrors.name}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="regEmail">Email Address</label>
              <input
                id="regEmail"
                type="email"
                placeholder="Enter your college email"
                value={regData.email}
                onChange={(e) => handleRegChange("email", e.target.value)}
                autoComplete="email"
              />
              {regErrors.email && (
                <p className="field-error" role="alert">{regErrors.email}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="regDept">Department</label>
              <select
                id="regDept"
                value={regData.department}
                onChange={(e) => handleRegChange("department", e.target.value)}
              >
                <option value="">Select your department</option>
                {departments.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.name}
                  </option>
                ))}
              </select>
              {regErrors.department && (
                <p className="field-error" role="alert">{regErrors.department}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="regStudentId">Student ID (optional)</label>
              <input
                id="regStudentId"
                type="text"
                placeholder="e.g. COMP2024001"
                value={regData.studentId}
                onChange={(e) => handleRegChange("studentId", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="regPassword">Password</label>
              <input
                id="regPassword"
                type="password"
                placeholder="At least 6 characters"
                value={regData.password}
                onChange={(e) => handleRegChange("password", e.target.value)}
                autoComplete="new-password"
              />
              {regErrors.password && (
                <p className="field-error" role="alert">{regErrors.password}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="regConfirm">Confirm Password</label>
              <input
                id="regConfirm"
                type="password"
                placeholder="Re-enter your password"
                value={regData.confirm}
                onChange={(e) => handleRegChange("confirm", e.target.value)}
                autoComplete="new-password"
              />
              {regErrors.confirm && (
                <p className="field-error" role="alert">{regErrors.confirm}</p>
              )}
            </div>

            {regSuccess && (
              <p className="form-message success">{regSuccess}</p>
            )}

            <button
              type="submit"
              className="btn form-submit-btn"
              disabled={regLoading}
            >
              {regLoading ? "Creating account…" : "Create Account"}
            </button>
          </form>
        )}

        <div className="login-switch">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button onClick={() => setMode("register")}>Register here</button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => setMode("login")}>Login here</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
