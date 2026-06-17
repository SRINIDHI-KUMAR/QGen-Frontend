// src/components/Landing.jsx
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { Button } from "primereact/button";

const Landing = () => {
  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="landing-nav">
  <div className="nav-brand">

    <h1 className="xeus-animated">QGen</h1>
  </div>

  <div className="nav-links">
    <a href="#home" className="nav-link">Home</a>
    <a href="#features" className="nav-link">Features</a>
    <Link to="/login" className="nav-link">Login</Link>
    <Link to="/register" className="nav-link register-nav-link">Register</Link>
  </div>
</nav>
      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content glass-card">
          <h1 className="hero-title">
            Generate AI-Powered<br />
            <span className="gradient-text">Question Papers</span><br />
            from PDFs
          </h1>
          <p className="hero-subtitle">
            Upload your syllabus, books, or notes and let AI generate professional question papers instantly.
          </p>
          <div className="hero-buttons">
            <Link to="/register">
              <Button label="Get Started" className="hero-btn primary-btn" />
            </Link>
            <a href="#features" className="hero-btn secondary-btn">Learn More</a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2 className="section-title">Features</h2>
        <div className="features-grid">
          <div className="feature-card glass-card">
            <div className="feature-icon"></div>
            <h3>Upload PDFs</h3>
            <p>Upload books, notes, and syllabuses with ease</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon"></div>
            <h3>AI Generation</h3>
            <p>Generate MCQs and descriptive questions instantly</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon"></div>
            <h3>Export Papers</h3>
            <p>Download generated question papers as PDFs</p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon"></div>
            <h3>History Access</h3>
            <p>View and manage previous generations anytime</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Upload PDF</h3>
            <p>Select your PDF file containing study material</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>AI Reads Content</h3>
            <p>Our AI extracts and analyzes the text</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Generate Questions</h3>
            <p>Choose question types and difficulty</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Download Paper</h3>
            <p>Get your ready-to-use question paper</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-card glass-card">
          <h2>Ready to Transform Question Creation?</h2>
          <p>Join educators and students using EduGen AI today</p>
          <Link to="/register">
            <Button label="Get Started Now" className="cta-btn" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2026 QGen.</p>
      </footer>
    </div>
  );
};

export default Landing;