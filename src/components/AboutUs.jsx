// src/components/AboutUs.jsx
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      <div className="glass-card about-card">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h1 className="animated-title">About QGen</h1>

        <div className="about-content">
          {/* Mission & Vision */}
          <div className="about-section">
            <h3>🎯 Our Mission</h3>
            <p>
              To democratize content creation by providing an intuitive, AI‑powered platform
              that saves time and sparks creativity for educators, marketers, and creators
              worldwide.
            </p>
          </div>

          <div className="about-section">
            <h3>🌟 What is QGen?</h3>
            <p>
              <strong>QGen</strong> is an AI‑driven question and content generator that
              transforms any text or topic into high‑quality questions, blog posts,
              social media captions, and more. Whether you're a teacher creating
              assessments, a marketer drafting copy, or a student studying, QGen
              accelerates your workflow with intelligent automation.
            </p>
          </div>

          {/* Features Grid */}
          <div className="about-section">
            <h3>✨ Key Features</h3>
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span>Instant generation</span>
              </div>
             
              <div className="feature-item">
                <span className="feature-icon">🕜</span>
                <span>history</span>
              </div>
     
              <div className="feature-item">
                <span className="feature-icon">📄</span>
                <span>PDF & text upload</span>
              </div>
        
            </div>
          </div>

          {/* How It Works */}
          <div className="about-section">
            <h3>🛠️ How It Works</h3>
            <ol className="steps-list">
              <li>Upload a PDF or paste your text</li>
              <li>Select question type and difficulty</li>
              <li>Click “Generate” – AI creates smart questions</li>
              <li>Review, edit, and download your results</li>
            </ol>
          </div>

          {/* Tech Stack */}
          <div className="about-section">
            <h3>⚙️ Tech Stack</h3>
            <div className="tech-stack">
              <span className="tech-badge">React</span>
              <span className="tech-badge">PrimeReact</span>
              <span className="tech-badge">Node.js</span>
              <span className="tech-badge">FastAPI</span>
              <span className="tech-badge">OpenRouter API</span>
            </div>
          </div>

          {/* Team & Contact */}
          <div className="about-section">
            <h3>👥 Meet the Team</h3>
            <p>
              Built with passion by a team of AI enthusiasts and full‑stack developers.
              We believe in making content creation effortless and accessible to everyone.
            </p>
            <p className="contact-email">
              📧 <strong>Contact us:</strong> demo@qgen.com
            </p>
          </div>

          <hr className="about-divider" />

          <p className="version-text">
            <em>Version ∞ – the QGen</em>
          </p>
        </div>

        <Button label="Go to Home" className="generate-btn" onClick={() => navigate("/")} />
      </div>
    </div>
  );
};

export default AboutUs;