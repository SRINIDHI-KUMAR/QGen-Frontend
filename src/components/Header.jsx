// src/components/Header.jsx
import { useAuth } from "../context/AuthContext";
import { Button } from "primereact/button";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="xeus-animated">QGen</h1>
      </div>
      <div className="header-center">
        {user && <span className="greeting">Heyy, {user.username}</span>}
      </div>
      <div className="header-right">
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