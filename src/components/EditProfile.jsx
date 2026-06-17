// src/components/EditProfile.jsx
import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog"; // 👈 added for confirmation
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const EditProfile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const navigate = useNavigate();
  const toast = useRef(null);

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false); // 👈 new

  // Actual save function
  const performSave = async () => {
    setLoading(true);
    try {
      if (username !== user?.username) {
        await updateProfile({ username, email: user?.email });
      }

      if (newPassword || currentPassword || confirmPassword) {
        if (newPassword !== confirmPassword) {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Passwords do not match',
            life: 3000,
          });
          setLoading(false);
          return;
        }
        if (newPassword.length < 6) {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Password must be at least 6 characters',
            life: 3000,
          });
          setLoading(false);
          return;
        }
        await changePassword(currentPassword, newPassword);
      }

      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Profile updated successfully',
        life: 3000,
      });

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Failed to update profile',
        life: 3000,
      });
    } finally {
      setLoading(false);
      setConfirmDialogVisible(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Show confirmation dialog
    setConfirmDialogVisible(true);
  };

  const confirmDialogFooter = (
    <div className="dialog-footer-centered">
      <Button label="Cancel" icon="pi pi-times" onClick={() => setConfirmDialogVisible(false)} className="p-button-text" />
      <Button label="Yes, Save Changes" icon="pi pi-check" onClick={performSave} className="p-button-success" />
    </div>
  );

  return (
    <>
      <Header />
      <Toast ref={toast} position="top-right" className="custom-toast" />
      <div className="edit-profile-container main-container">
        <h2 className="settings-page-title">Edit Profile</h2>

        <div className="settings-card glass-card">
          <div className="settings-card-header">
            <i className="pi pi-user-edit settings-card-icon"></i>
            <h3>Personal Information</h3>
          </div>
          <div className="settings-card-body">
            <form onSubmit={handleSubmit}>
              <div className="settings-item">
                <div className="settings-item-label">
                  <i className="pi pi-user settings-item-icon"></i>
                  <span>Username</span>
                </div>
                <InputText
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="curved-input"
                  style={{ flex: 1 }}
                  required
                />
              </div>

              <div className="settings-item">
                <div className="settings-item-label">
                  <i className="pi pi-envelope settings-item-icon"></i>
                  <span>Email</span>
                </div>
                <InputText
                  type="email"
                  value={email}
                  disabled={true}
                  className="curved-input"
                  style={{ flex: 1, opacity: 0.7, cursor: 'not-allowed' }}
                />
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
                Email cannot be changed
              </div>
            </form>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="settings-card glass-card">
          <div className="settings-card-header">
            <i className="pi pi-lock settings-card-icon"></i>
            <h3>Change Password</h3>
          </div>
          <div className="settings-card-body">
            <form onSubmit={handleSubmit}>
              <div className="settings-item">
                <div className="settings-item-label">
                  <i className="pi pi-key settings-item-icon"></i>
                  <span>Current Password</span>
                </div>
                <Password
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  feedback={false}
                  inputClassName="curved-input"
                  placeholder="Enter current password"
                  toggleMask
                  className="password-field"
                  style={{ flex: 1 }}
                />
              </div>

              <div className="settings-item">
                <div className="settings-item-label">
                  <i className="pi pi-pencil settings-item-icon"></i>
                  <span>New Password</span>
                </div>
                <Password
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  feedback={false}   // 👈 removed strength indicator
                  inputClassName="curved-input"
                  placeholder="Enter new password (min 6 chars)"
                  toggleMask
                  className="password-field"
                  style={{ flex: 1 }}
                />
              </div>

              <div className="settings-item">
                <div className="settings-item-label">
                  <i className="pi pi-check-circle settings-item-icon"></i>
                  <span>Confirm Password</span>
                </div>
                <Password
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  feedback={false}
                  inputClassName="curved-input"
                  placeholder="Confirm new password"
                  toggleMask
                  className="password-field"
                  style={{ flex: 1 }}
                />
              </div>

              <div className="edit-profile-actions">
                <Button
                  type="button"
                  label="Cancel"
                  icon="pi pi-times"
                  className="p-button-text"
                  onClick={() => navigate(-1)}
                />
                <Button
                  type="submit"
                  label={loading ? "Saving..." : "Save"}
                  icon="pi pi-check"
                  className="generate-btn"
                  disabled={loading}
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        visible={confirmDialogVisible}
        style={{ width: "450px" }}
        header="Confirm Changes"
        modal
        footer={confirmDialogFooter}
        onHide={() => setConfirmDialogVisible(false)}
        className="curved-dialog centered-header"
      >
        <p>
          Are you sure you want to save these changes?
        </p>
      </Dialog>
    </>
  );
};

export default EditProfile;