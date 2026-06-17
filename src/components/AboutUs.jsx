// src/components/AboutUs.jsx
const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="glass-card about-card">
        <h1 className="animated-title">About QGen</h1>

        <div className="about-content">
          {/* Mission */}
          <div className="about-section">
            <h3>Our Mission</h3>
            <p>
              To democratize content creation by providing an intuitive, AI-powered platform
              that saves time, reduces effort, and sparks creativity for educators, 
              content creators, and professionals across every industry.
            </p>
          </div>

          {/* What is QGen */}
          <div className="about-section">
            <h3>What is QGen?</h3>
            <p>
              <strong>QGen</strong> is a state-of-the-art AI-driven question and content generator
              that transforms any text – from PDFs, lecture notes, or raw input – into 
              high-quality questions, assessments, and study materials. Built for 
              teachers, trainers, students, and marketing teams, QGen turns hours of 
              manual content creation into seconds of intelligent automation.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              Unlike generic tools, QGen understands context, adapts to your subject matter,
              and produces questions that are relevant, challenging, and well-structured.
            </p>
          </div>

          {/* Why QGen */}
          <div className="about-section">
            <h3>Why QGen?</h3>
            <ul className="steps-list" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
              <li><strong>Speed:</strong> Generate complete question papers in under 30 seconds.</li>
              <li><strong>Quality:</strong> AI that mimics expert-level question design.</li>
              <li><strong>Flexibility:</strong> Supports multiple question types – MCQs, short, long, and more.</li>
              <li><strong>Control:</strong> Full customisation via prompts – you decide the difficulty, topics, and format.</li>
              <li><strong>Privacy:</strong> Your data is never stored or shared – all processing is temporary.</li>
            </ul>
          </div>

          {/* Key Features */}
          <div className="about-section">
  <h3>Key Features</h3>
  <div className="features-grid">
    <div className="feature-item">
      <i className="pi pi-bolt feature-icon"></i>
      <span>Instant Generation</span>
    </div>
      <div className="feature-item">
      <i className="pi pi-pencil feature-icon"></i>
      <span>Customizable Prompts</span>
    </div>
    
    <div className="feature-item">
      <i className="pi pi-file-pdf feature-icon"></i>
      <span>PDF & Text Upload</span>
    </div>
    <div className="feature-item">
      <i className="pi pi-chart-bar feature-icon"></i>
      <span>History & Stats</span>
    </div>
    <div className="feature-item">
      <i className="pi pi-download feature-icon"></i>
      <span>Export as PDF / Copy</span>
    </div>
    <div className="feature-item">
      <i className="pi pi-moon feature-icon"></i>
      <span>Light / Dark Theme</span>
    </div>

  </div>
</div>

          {/* Use Cases */}
          <div className="about-section">
            <h3>Who Can Use QGen?</h3>
            <ul className="steps-list" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
              <li><strong>Educators & Teachers</strong> – Create quizzes, exams, and homework in minutes.</li>
              <li><strong>Students</strong> – Generate practice questions to test your understanding.</li>
              <li><strong>Content Marketers</strong> – Produce social media polls, trivia, and engagement prompts.</li>
              <li><strong>Corporate Trainers</strong> – Design assessments for employee training programs.</li>
              <li><strong>EdTech Companies</strong> – Integrate QGen into your platforms for scalable content creation.</li>
            </ul>
          </div>

          {/* How It Works */}
          <div className="about-section">
            <h3>How It Works</h3>
            <ol className="steps-list">
              <li><strong>Upload or Paste</strong> – Provide your source material (PDF or plain text).</li>
              <li><strong>Write Your Prompt</strong> – Tell the AI what you need (e.g., “Generate 10 MCQs on Data Mining”).</li>
              <li><strong>Generate & Review</strong> – Click “Generate” and see AI‑crafted questions instantly.</li>
              <li><strong>Refine or Export</strong> – Tweak the prompt and regenerate, or download as PDF / copy to clipboard.</li>
            </ol>
          </div>

          {/* Technology Behind QGen */}
          <div className="about-section">
            <h3>Technology Behind QGen</h3>
            <div className="tech-stack">
              <span className="tech-badge">React</span>
              <span className="tech-badge">PrimeReact</span>
              <span className="tech-badge">Node.js</span>
              <span className="tech-badge">FastAPI</span>
              <span className="tech-badge">OpenRouter API</span>
              <span className="tech-badge">PyPDF2</span>
              <span className="tech-badge">jsPDF</span>
            </div>
            <p style={{ marginTop: '0.75rem', color: 'var(--text-secondary)' }}>
              QGen leverages state-of-the-art language models via OpenRouter, with a robust 
              backend that extracts text from PDFs, processes prompts, and returns structured 
              questions. The frontend is built with React for a smooth, responsive user experience.
            </p>
          </div>

          {/* Team / About Us */}
          <div className="about-section">
            <h3>About the Team</h3>
            <p>
              QGen was created by a passionate team of AI enthusiasts, full-stack developers, 
              and educators who believe that technology should empower people, not replace them. 
              We are dedicated to building tools that make knowledge creation faster, 
              more accessible, and more enjoyable.
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              We continuously improve QGen based on user feedback – your voice shapes our roadmap.
            </p>
          </div>

          {/* Contact */}
          <div className="about-section">
            <h3>Get in Touch</h3>
            <p>
              Have questions, suggestions, or need support? Reach out to us – we’d love to hear from you.
            </p>
            <p className="contact-email">
              <strong>Email:</strong> demo@qgen.com
            </p>

          </div>

          <hr className="about-divider" />

          <p className="version-text">
            <em>Version 2.0 – QGen</em>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;