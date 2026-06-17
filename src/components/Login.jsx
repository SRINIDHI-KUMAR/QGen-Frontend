// src/components/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // clear previous errors

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const username = email.split('@')[0];
      await login(email, password, username);
      // On success, navigate to the home page (or dashboard)
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-brand">
          <h1 className="xeus-animated">QGen</h1>
        </div>
        <div className="nav-links">
          <a href="/" className="nav-link">Home</a>
          <Link to="/register" className="nav-link register-nav-link">Register</Link>
        </div>
      </nav>

      <div className="auth-container" style={{ paddingTop: '100px' }}>
        <div className="glass-card auth-card">
          <h2 className="animated-title">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email</label>
              <InputText
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full curved-input"
                placeholder="your@email.com"
              />
            </div>
            <div className="field">
              <label>Password</label>
              <Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                feedback={false}
                inputClassName="curved-input"
                placeholder="Enter password"
                toggleMask
              />
            </div>

            {/* Error message – shown just above the login button */}
            {error && (
              <div style={{ 
                color: '#ff3b30', 
                fontSize: '0.85rem', 
                margin: '0.5rem 0 0.2rem 0',
                textAlign: 'center',
                background: 'rgba(255,59,48,0.08)',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px'
              }}>
                {error}
              </div>
            )}

            <Button type="submit" label="Login" className="generate-btn mt-3" />
          </form>
          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;