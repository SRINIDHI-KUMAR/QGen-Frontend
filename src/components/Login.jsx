// src/components/Login.jsx – with logo + Theme Toggle + About Us link + header line
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";        // 👈 import the toggle
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    const username = email.split('@')[0];
    login(email, password, username);
  };

  return (
    <>
      {/* ===== HEADER with logo, theme toggle, About link, and line ===== */}
      <header className="auth-header">
        <div className="header-top">
          <div className="logo">
            <h1 className="animated-title">QGen</h1>
          </div>
          <div className="auth-header-actions">
            <ThemeToggle />               {/* 👈 Sliding toggle added here */}
            <Link to="/about" className="about-link">
              📖 About Us
            </Link>
          </div>
        </div>
        <div className="header-line"></div>
      </header>

      {/* Login form */}
      <div className="auth-container">
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
            {error && <small className="p-error">{error}</small>}
            <Button type="submit" label="Login" className="generate-btn mt-3" />
          </form>
          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">Register</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;