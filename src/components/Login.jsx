// src/components/Login.jsx – CORRECTED
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

const Login = ({ onSwitchToRegister }) => {
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
              inputClassName="curved-input"   // ✅ only this
              placeholder="Enter password"
              toggleMask                         // optional but nice
            />
          </div>
          {error && <small className="p-error">{error}</small>}
          <Button type="submit" label="Login" className="generate-btn mt-3" />
        </form>
        <p className="auth-switch">
          Don't have an account?{" "}
          <span onClick={onSwitchToRegister} className="auth-link">
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;