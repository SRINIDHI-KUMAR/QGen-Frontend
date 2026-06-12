import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="glass-card auth-card">
        <h2 className="animated-title">Settings</h2>
        <p style={{ color: "white", marginBottom: "1.5rem" }}>App preferences coming soon.</p>
        <Button label="Back to App" className="generate-btn" onClick={() => navigate("/")} />
      </div>
    </div>
  );
};

export default Settings;