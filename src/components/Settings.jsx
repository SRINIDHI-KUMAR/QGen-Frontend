// src/components/Settings.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Header from "./Header";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";

const Settings = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const toast = useRef(null);
  const fileInputRef = useRef(null);

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem("qgen_fontSize") || "medium";
  });
  const [clearDialogVisible, setClearDialogVisible] = useState(false);
  const [importDialogVisible, setImportDialogVisible] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const userId = user?.username || "guest";
  const storagePrefix = `qgen_${userId}_`;

  useEffect(() => {
    document.documentElement.style.fontSize =
      fontSize === "small" ? "14px" :
      fontSize === "large" ? "18px" :
      "16px";
    localStorage.setItem("qgen_fontSize", fontSize);
  }, [fontSize]);

  const themeOptions = [
    { label: "Dark", value: "dark" },
    { label: "Light", value: "light" },
  ];

  const fontSizeOptions = [
    { label: "Small", value: "small" },
    { label: "Medium", value: "medium" },
    { label: "Large", value: "large" },
  ];

  const handleThemeChange = (e) => {
    const newTheme = e.value;
    if (newTheme === "dark" && theme !== "dark") toggleTheme();
    else if (newTheme === "light" && theme !== "light") toggleTheme();
  };

  const handleFontSizeChange = (e) => {
    setFontSize(e.value);
  };

  const clearHistory = () => {
    localStorage.removeItem(`${storagePrefix}history`);
    localStorage.removeItem(`${storagePrefix}stats`);
    toast.current.show({
      severity: "success",
      summary: "History Cleared",
      detail: "All your data has been cleared.",
      life: 3000,
    });
    setClearDialogVisible(false);
  };

  const exportData = () => {
    const stats = localStorage.getItem(`${storagePrefix}stats`);
    const history = localStorage.getItem(`${storagePrefix}history`);
    const data = { stats: stats ? JSON.parse(stats) : null, history: history ? JSON.parse(history) : [] };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `qgen_data_${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.current.show({
      severity: "info",
      summary: "Data Exported",
      detail: "Your data has been downloaded as JSON.",
      life: 3000,
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImportFile(file);
      setImportDialogVisible(true);
    }
    e.target.value = null;
  };

  const importData = () => {
    if (!importFile) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.stats !== undefined) {
          localStorage.setItem(`${storagePrefix}stats`, JSON.stringify(data.stats));
        }
        if (Array.isArray(data.history)) {
          localStorage.setItem(`${storagePrefix}history`, JSON.stringify(data.history));
        }
        toast.current.show({
          severity: "success",
          summary: "Import Successful",
          detail: "Your data has been imported.",
          life: 3000,
        });
        setImportDialogVisible(false);
        setImportFile(null);
        window.location.reload();
      } catch (err) {
        toast.current.show({
          severity: "error",
          summary: "Import Failed",
          detail: "Invalid JSON file. Please export from QGen.",
          life: 3000,
        });
        setImportDialogVisible(false);
        setImportFile(null);
      }
    };
    reader.readAsText(importFile);
  };

  // ------------------- FIXED DELETE ACCOUNT -------------------
  const deleteAccount = () => {
    if (!user) return; // safety check

    // 1. Remove user from the registered users list
    const users = JSON.parse(localStorage.getItem("qgen_users") || "[]");
    const filteredUsers = users.filter((u) => u.id !== user.id);
    localStorage.setItem("qgen_users", JSON.stringify(filteredUsers));

    // 2. Clear user's specific data (history, stats)
    localStorage.removeItem(`${storagePrefix}history`);
    localStorage.removeItem(`${storagePrefix}stats`);

    // 3. Clear global preferences (optional)
    localStorage.removeItem("theme");
    localStorage.removeItem("qgen_fontSize");

    // 4. Logout and navigate to landing page
    logout();
    navigate("/");

    toast.current.show({
      severity: "info",
      summary: "Account Deleted",
      detail: "Your account has been permanently removed.",
      life: 3000,
    });

    setDeleteDialogVisible(false);
  };
  // ------------------------------------------------------------

  const clearDialogFooter = (
    <div className="dialog-footer-centered">
      <Button label="Cancel" icon="pi pi-times" onClick={() => setClearDialogVisible(false)} className="p-button-text" />
      <Button label="Clear" icon="pi pi-trash" onClick={clearHistory} className="p-button-danger" />
    </div>
  );

  const importDialogFooter = (
    <div className="dialog-footer-centered">
      <Button label="Cancel" icon="pi pi-times" onClick={() => { setImportDialogVisible(false); setImportFile(null); }} className="p-button-text" />
      <Button label="Import" icon="pi pi-upload" onClick={importData} className="p-button-success" />
    </div>
  );

  const deleteDialogFooter = (
    <div className="dialog-footer-centered">
      <Button label="Cancel" icon="pi pi-times" onClick={() => setDeleteDialogVisible(false)} className="p-button-text" />
      <Button label="Yes, Delete Account" icon="pi pi-trash" onClick={deleteAccount} className="p-button-danger" />
    </div>
  );

  return (
    <>
      <Header />
      <Toast ref={toast} position="top-right" className="custom-toast" />
      <div className="settings-container main-container">
        <h2 className="settings-page-title">Settings</h2>

        {/* Appearance Card */}
        <div className="settings-card glass-card">
          <div className="settings-card-header">
            <i className="pi pi-palette settings-card-icon"></i>
            <h3>Appearance</h3>
          </div>
          <div className="settings-card-body">
            <div className="settings-item">
              <div className="settings-item-label">
                <i className="pi pi-moon settings-item-icon"></i>
                <span>Theme</span>
              </div>
              <Dropdown
                value={theme}
                options={themeOptions}
                onChange={handleThemeChange}
                placeholder="Select Theme"
                className="settings-dropdown"
              />
            </div>
            <div className="settings-item">
              <div className="settings-item-label">
                <i className="pi pi-pencil settings-item-icon"></i>
                <span>Font Size</span>
              </div>
              <Dropdown
                value={fontSize}
                options={fontSizeOptions}
                onChange={handleFontSizeChange}
                placeholder="Select Size"
                className="settings-dropdown"
              />
            </div>
          </div>
        </div>

        {/* Data Management Card */}
        <div className="settings-card glass-card">
          <div className="settings-card-header">
            <i className="pi pi-database settings-card-icon"></i>
            <h3>Data Management</h3>
          </div>
          <div className="settings-card-body">
            <div className="settings-item">
              <div className="settings-item-label">
                <i className="pi pi-trash settings-item-icon"></i>
                <span>Clear History</span>
              </div>
              <Button
                label="⠀Clear"
                icon="pi pi-trash"
                className="p-button-danger settings-action-btn"
                onClick={() => setClearDialogVisible(true)}
              />
            </div>
            <div className="settings-item">
              <div className="settings-item-label">
                <i className="pi pi-download settings-item-icon"></i>
                <span>Export Data</span>
              </div>
              <Button
                label="⠀Export"
                icon="pi pi-download"
                className="p-button-secondary settings-action-btn"
                onClick={exportData}
              />
            </div>
            <div className="settings-item">
              <div className="settings-item-label">
                <i className="pi pi-upload settings-item-icon"></i>
                <span>Import Data</span>
              </div>
              <div>
                <input
                  type="file"
                  accept=".json"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileSelect}
                />
                <Button
                  label="⠀Import"
                  icon="pi pi-upload"
                  className="p-button-secondary settings-action-btn"
                  onClick={() => fileInputRef.current.click()}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Account Card */}
        <div className="settings-card glass-card">
          <div className="settings-card-header">
            <i className="pi pi-user settings-card-icon"></i>
            <h3>Account</h3>
          </div>
          <div className="settings-card-body">
            <div className="settings-item">
              <div className="settings-item-label">
                <i className="pi pi-user-edit settings-item-icon"></i>
                <span>Edit Profile</span>
              </div>
              <Button
                label="⠀Go"
                icon="pi pi-arrow-right"
                className="p-button-secondary settings-action-btn"
                onClick={() => navigate("/edit-profile")}
              />
            </div>
            {/* Delete Account */}
            <div className="settings-item">
              <div className="settings-item-label">
                <i className="pi pi-trash settings-item-icon" style={{ color: 'var(--danger)' }}></i>
                <span style={{ color: 'var(--danger)' }}>Delete Account</span>
              </div>
              <Button
                label="⠀Delete"
                icon="pi pi-trash"
                className="p-button-danger settings-action-btn"
                onClick={() => setDeleteDialogVisible(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Clear History Dialog */}
      <Dialog
        visible={clearDialogVisible}
        style={{ width: "450px" }}
        header="Confirm Clear History"
        modal
        footer={clearDialogFooter}
        onHide={() => setClearDialogVisible(false)}
        className="curved-dialog centered-header"
      >
        <p>
          This will permanently delete all your uploaded PDF stats and generation history.
          This action cannot be undone. Are you sure?
        </p>
      </Dialog>

      {/* Import Data Dialog */}
      <Dialog
        visible={importDialogVisible}
        style={{ width: "450px" }}
        header="Confirm Import"
        modal
        footer={importDialogFooter}
        onHide={() => { setImportDialogVisible(false); setImportFile(null); }}
        className="curved-dialog centered-header"
      >
        <p>
          You are about to import data from <strong>{importFile?.name}</strong>.
          This will overwrite your current stats and history. Are you sure?
        </p>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog
        visible={deleteDialogVisible}
        style={{ width: "450px" }}
        header="Delete Account"
        modal
        footer={deleteDialogFooter}
        onHide={() => setDeleteDialogVisible(false)}
        className="curved-dialog centered-header"
      >
        <p>
          This will permanently delete your account and all associated data.
          This action cannot be undone. Are you sure you want to delete your account?
        </p>
      </Dialog>
    </>
  );
};

export default Settings;