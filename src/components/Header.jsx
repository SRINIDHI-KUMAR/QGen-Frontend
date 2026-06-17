// src/components/Header.jsx
import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import { Avatar } from "primereact/avatar";
import { Sidebar } from "primereact/sidebar";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarVisible(false);
  };

  const handleLogout = () => {
    logout();
    setSidebarVisible(false);
    navigate("/"); // 👈 redirect to landing page after logout
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="xeus-animated">QGen</h1>
      </div>

      <nav className="header-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Home
        </NavLink>
        <NavLink to="/generate" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Generate
        </NavLink>
        <NavLink to="/stats" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Stats
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          About
        </NavLink>
      </nav>

      <div className="header-right">
        <ThemeToggle />

        <Avatar
          icon="pi pi-user"
          shape="circle"
          className="profile-avatar"
          onClick={() => setSidebarVisible(true)}
          style={{ cursor: "pointer" }}
        />

        <Sidebar
          visible={sidebarVisible}
          position="right"
          onHide={() => setSidebarVisible(false)}
          className="profile-sidebar"
          showCloseIcon={true}
          modal={true}
        >
          <div className="sidebar-content">
            <div className="sidebar-user">
              <Avatar icon="pi pi-user" shape="circle" size="large" className="sidebar-avatar" />
              <p className="sidebar-username">{user?.username || "User"}</p>
              <p className="sidebar-email">{user?.email || "user@email.com"}</p>
            </div>

            <div className="sidebar-menu">
              <div className="sidebar-menu-group">
                <div className="sidebar-menu-item" onClick={() => handleNavigation("/edit-profile")}>
                  <i className="pi pi-user-edit sidebar-menu-icon"></i>
                  <span>Edit Profile</span>
                </div>
                <div className="sidebar-menu-item" onClick={() => handleNavigation("/settings")}>
                  <i className="pi pi-cog sidebar-menu-icon"></i>
                  <span>Settings</span>
                </div>
              </div>

              <div className="sidebar-menu-divider"></div>

              <div className="sidebar-menu-item logout-item" onClick={handleLogout}>
                <i className="pi pi-sign-out sidebar-menu-icon"></i>
                <span>Logout</span>
              </div>
            </div>
          </div>
        </Sidebar>
      </div>
    </header>
  );
};

export default Header;