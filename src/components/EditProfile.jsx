import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { user, updateProfile } = useAuth(); // you'll need to add updateProfile to AuthContext
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile({ username, email });
    navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-card">
        <h2 className="animated-title">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Username</label>
            <InputText value={username} onChange={(e) => setUsername(e.target.value)} className="w-full curved-input" />
          </div>
          <div className="field">
            <label>Email</label>
            <InputText value={email} onChange={(e) => setEmail(e.target.value)} className="w-full curved-input" />
          </div>
          <Button type="submit" label="Save Changes" className="generate-btn mt-3" />
        </form>
        <p className="auth-switch">
          <span onClick={() => navigate(-1)} className="auth-link">← Back</span>
        </p>
      </div>
    </div>
  );
};

export default EditProfile;