// src/components/Register.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";

const Register = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || !username) {
      setError("All fields are required");
      return;
    }
    register(email, password, username);
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-card">
        <h2 className="animated-title">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Username</label>
            <InputText
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full curved-input"
              placeholder="e.g., john_doe"
            />
          </div>
          <div className="field">
            <label>Email</label>
            <InputText
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full curved-input"
              placeholder="hello@example.com"
            />
          </div>
          <div className="field">
            <label>Password</label>
            <Password
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  feedback={false}
  inputClassName="curved-input"
  placeholder="••••••••"
  toggleMask
/>
          </div>
          {error && <small className="p-error">{error}</small>}
          <Button type="submit" label="Register" className="generate-btn mt-3" />
        </form>
        <p className="auth-switch">
          Already have an account?{" "}
          <span onClick={onSwitchToLogin} className="auth-link">
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;