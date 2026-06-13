// src/components/Header.jsx (updated fragment)
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";   // import the toggle
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const profileMenuItems = [
    {
      label: "Edit Profile",
      icon: "pi pi-user-edit",
      command: () => navigate("/edit-profile"),
    },
    {
      label: "Settings",
      icon: "pi pi-cog",
      command: () => navigate("/settings"),
    },
  ];

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="xeus-animated">QGen</h1>
      </div>

      <div className="header-center">
        {user && <span className="greeting">Heyy, {user.username}</span>}
      </div>

      <div className="header-right">
        {/* Modern theme toggle switch */}
        <ThemeToggle />

        {/* About button */}
        <Button
          icon="pi pi-info-circle"
          className="p-button-rounded p-button-text about-header-btn"
          tooltipOptions={{ position: "bottom" }}
          onClick={() => navigate("/about")}
        />

        {/* Profile avatar with menu */}
        <Avatar
          icon="pi pi-user"
          shape="circle"
          className="profile-avatar"
          onClick={(e) => menuRef.current.toggle(e)}
          style={{ cursor: "pointer", marginLeft: "0.5rem" }}
        />
        <Menu model={profileMenuItems} popup ref={menuRef} />

        {/* Logout button */}
        <Button
          label="Logout"
          icon="pi pi-sign-out"
          className="p-button-danger logout-btn"
          onClick={logout}
        />
      </div>
    </header>
  );
};

export default Header;