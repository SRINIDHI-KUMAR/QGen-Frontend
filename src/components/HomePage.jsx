// src/components/HomePage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { user } = useAuth();
  const userId = user?.username || "guest";
  const storagePrefix = `qgen_${userId}_`;

  const [stats, setStats] = useState({ pdfsUploaded: 0, questionsGenerated: 0 });
  const [recent, setRecent] = useState([]);
  const [totalGenerations, setTotalGenerations] = useState(0);

  useEffect(() => {
    const savedStats = localStorage.getItem(`${storagePrefix}stats`);
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
    const savedHistory = localStorage.getItem(`${storagePrefix}history`);
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      setRecent(history.slice(0, 5));
      setTotalGenerations(history.length);
    }
  }, [storagePrefix]);

  return (
    <div className="home-page">
      {/* ===== WELCOME SECTION ===== */}
      <div className="welcome-section">
        <div className="welcome-card glass-card">
          <h1 className="welcome-title">
            <i className="pi pi-user welcome-icon"></i>
            Welcome back, <span className="username-highlight">{user?.username || "User"}</span>
          </h1>
          <p className="welcome-subtitle">
            You've generated <strong>{totalGenerations}</strong> question paper
            {totalGenerations !== 1 ? "s" : ""} so far. Ready for another?
          </p>
        </div>
      </div>

      {/* ===== QUICK STATS ===== */}
      <div className="stats-grid home-stats">
        <div className="stat-card gradient-card-1">
          <div className="stat-icon">
            <i className="pi pi-file-pdf"></i>
          </div>
          <div className="stat-info">
            <h3>PDFs Uploaded</h3>
            <div className="stat-number">{stats.pdfsUploaded}</div>
          </div>
        </div>
        <div className="stat-card gradient-card-2">
          <div className="stat-icon">
            <i className="pi pi-question-circle"></i>
          </div>
          <div className="stat-info">
            <h3>Questions Generated</h3>
            <div className="stat-number">{stats.questionsGenerated}</div>
          </div>
        </div>
        <div className="stat-card gradient-card-3">
          <div className="stat-icon">
            <i className="pi pi-history"></i>
          </div>
          <div className="stat-info">
            <h3>Total Generations</h3>
            <div className="stat-number">{totalGenerations}</div>
          </div>
        </div>
      </div>

      {/* ===== QUICK ACTIONS ===== */}
      <div className="quick-actions glass-card">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <Link to="/generate" className="action-item">
            <span className="action-icon">
              <i className="pi pi-plus-circle"></i>
            </span>
            <span>New Generation</span>
          </Link>
          <Link to="/stats" className="action-item">
            <span className="action-icon">
              <i className="pi pi-chart-bar"></i>
            </span>
            <span>View History</span>
          </Link>
          <Link to="/about" className="action-item">
            <span className="action-icon">
              <i className="pi pi-info-circle"></i>
            </span>
            <span>About QGen</span>
          </Link>
          <Link to="/settings" className="action-item">
            <span className="action-icon">
              <i className="pi pi-cog"></i>
            </span>
            <span>Settings</span>
          </Link>
        </div>
      </div>

      {/* ===== RECENT ACTIVITY ===== */}
      <div className="history-panel home-history">
        <h3>
          <i className="pi pi-clock"></i> Recent Generations
        </h3>
        {recent.length === 0 ? (
          <p className="empty-history">
            You haven't generated any questions yet.
            <Link to="/generate" style={{ color: 'var(--accent-blue)', marginLeft: '0.3rem' }}>
              Start now →
            </Link>
          </p>
        ) : (
          recent.map((item) => (
            <div key={item.id} className="history-item">
              <div>
                <span className="history-file">{item.fileName}</span>
                <span className="history-date">{item.date}</span>
              </div>
            </div>
          ))
        )}
        {recent.length > 0 && (
          <div className="view-all">
            <Link to="/stats">View all {totalGenerations} generations →</Link>
          </div>
        )}
      </div>

      {/* ===== TIPS SECTION ===== */}
      <div className="tip-card glass-card">
        <h3>
          <i className="pi pi-lightbulb"></i> Pro Tip
        </h3>
        <p>
          For best results, use clear, well‑structured PDFs and be specific in your prompt.
          The AI performs better with focused instructions. You can also adjust difficulty
          and question types by mentioning them in your prompt.
        </p>
      </div>
    </div>
  );
};

export default HomePage;