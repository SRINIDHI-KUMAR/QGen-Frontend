// src/components/ThemeToggle.jsx
import { useTheme } from "../context/ThemeContext";
import { useRef } from "react";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const toggleRef = useRef(null);

  return (
    <div 
      className={`theme-toggle ${isDark ? "dark" : "light"}`}
      onClick={toggleTheme}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleTheme()}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <div className="toggle-track">
        <div className="toggle-icons">
          <span className="toggle-icon sun">☀️</span>
          <span className="toggle-icon moon">🌙</span>
        </div>
        <div className="toggle-thumb"></div>
      </div>
    </div>
  );
};

export default ThemeToggle;