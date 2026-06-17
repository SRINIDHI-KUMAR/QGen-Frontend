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

  useEffect(() => {
    const savedStats = localStorage.getItem(`${storagePrefix}stats`);
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
    const savedHistory = localStorage.getItem(`${storagePrefix}history`);
    if (savedHistory) {
      setRecent(JSON.parse(savedHistory).slice(0, 5));
    }
  }, [storagePrefix]);

  return (
    <div className="home-page">
      {/* ===== DASHBOARD SECTION ===== */}
      <div className="welcome-section">
  <div className="welcome-card">

    <h1 className="welcome-title">
      Welcome, <span>{user?.username || "User"}</span>
    </h1>

    <p className="welcome-subtitle">
      Ready to create your next question paper? Generate, customize,
      and manage assessments with AI-powered efficiency.
    </p>
  </div>
</div>



      {/* ===== MARKETING / LANDING PAGE CONTENT (DIFFERENT VERSION) ===== */}


      <section className="marketing-hero">
        <div className="marketing-content">
          <h2>Unlock the Full Potential of AI Question Generation</h2>
          <p>
            Whether you're an educator, trainer, or content creator, QGen empowers you to
            produce high‑quality assessments in minutes. Leverage the latest AI to save
            time and enhance learning outcomes.
          </p>
        </div>
      </section>

      <section className="marketing-features">
        <h2 className="section-title">What Makes QGen Powerful</h2>
        <div className="features-grid">
          <div className="feature-card glass-card">
            <div className="feature-icon"></div>
            <h3>Lightning Fast</h3>
            <p>Generate question papers in seconds, not hours.</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon"></div>
            <h3>Customizable Output</h3>
            <p>Adjust difficulty, question types, and topics easily.</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon"></div>
            <h3>Iterative Refinement</h3>
            <p>Tweak prompts and regenerate until you get exactly what you need.</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon"></div>
            <h3>Export & Share</h3>
            <p>Download as PDF or copy to clipboard for seamless integration.</p>
          </div>
        </div>
      </section>

      <section className="marketing-how-it-works">
        <h2 className="section-title">How It Works – Step by Step</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Upload or Paste</h3>
            <p>Upload a PDF or paste text directly into the editor.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Write Your Prompt</h3>
            <p>Tell the AI what kind of questions you need (MCQs, short, long).</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Generate & Refine</h3>
            <p>Click generate, review the output, and regenerate if needed.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Download or Copy</h3>
            <p>Export your final question paper with one click.</p>
          </div>
        </div>
      </section>

      <section className="marketing-cta">
        <div className="cta-card glass-card">
          <h2>Ready to create your next masterpiece?</h2>
          <p>Start generating question papers right now.</p>
          <Link to="/generate">
            <Button label="Go to Generator" className="cta-btn" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;