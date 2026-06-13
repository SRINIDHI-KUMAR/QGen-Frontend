// src/components/QuestionGenerator.jsx
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import ReactMarkdown from "react-markdown";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const QuestionGenerator = () => {
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [history, setHistory] = useState([]);
  const [processingVisible, setProcessingVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepMessage, setStepMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // Stats and Activity
  const [stats, setStats] = useState({
    pdfsUploaded: 0,
    questionsGenerated: 0,
  });
  const [activities, setActivities] = useState([]);
  const [counters, setCounters] = useState({ pdfs: 0, questions: 0 });

  const [copyFeedback, setCopyFeedback] = useState(false);
  const [downloadFeedback, setDownloadFeedback] = useState(false);
  const toast = useRef(null);
  const fileInputRef = useRef(null);

  const processingSteps = [
    { icon: "🤖", message: "Analyzing PDF...", progress: 25 },
    { icon: "📚", message: "Understanding Concepts...", progress: 50 },
    { icon: "✍️", message: "Creating Questions...", progress: 75 },
    { icon: "✨", message: "Finalizing Question Paper...", progress: 100 },
  ];

  // Load stats and activities from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem("qgen_stats");
    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      setStats(parsed);
      setCounters({ pdfs: parsed.pdfsUploaded, questions: parsed.questionsGenerated });
    }
    const savedActivities = localStorage.getItem("qgen_activities");
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    }
  }, []);

  // Animate counters when stats change
  useEffect(() => {
    const duration = 800;
    const steps = 40;
    const startPdf = counters.pdfs;
    const startQ = counters.questions;
    const endPdf = stats.pdfsUploaded;
    const endQ = stats.questionsGenerated;
    const diffPdf = endPdf - startPdf;
    const diffQ = endQ - startQ;
    if (diffPdf === 0 && diffQ === 0) return;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      if (step <= steps) {
        setCounters({
          pdfs: Math.min(Math.floor(startPdf + (diffPdf * step / steps)), endPdf),
          questions: Math.min(Math.floor(startQ + (diffQ * step / steps)), endQ),
        });
      } else {
        clearInterval(timer);
        setCounters({ pdfs: endPdf, questions: endQ });
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [stats]);

  // Helper to update stats and add activity
  const updateStatsAndActivity = (type, fileName, questionCount = 0) => {
    setStats(prevStats => {
      let newStats = { ...prevStats };
      let newActivity = null;

      if (type === "upload") {
        newStats.pdfsUploaded += 1;
        newActivity = {
          id: Date.now(),
          type: "upload",
          fileName,
          message: `📄 ${fileName} Uploaded`,
          icon: "📄",
          color: "purple",
          timestamp: new Date().toLocaleString(),
        };
      } else if (type === "generate") {
        const increment = questionCount > 0 ? questionCount : 10;
        newStats.questionsGenerated += increment;
        newActivity = {
          id: Date.now(),
          type: "generate",
          fileName,
          message: `✨ ${fileName} Generated (${increment} questions)`,
          icon: "✨",
          color: "blue",
          timestamp: new Date().toLocaleString(),
        };
      } else if (type === "download") {
        newActivity = {
          id: Date.now(),
          type: "download",
          fileName,
          message: `⬇️ ${fileName} Downloaded`,
          icon: "⬇️",
          color: "green",
          timestamp: new Date().toLocaleString(),
        };
      }

      if (newActivity) {
        setActivities(prev => {
          const newActivities = [newActivity, ...prev].slice(0, 20);
          localStorage.setItem("qgen_activities", JSON.stringify(newActivities));
          return newActivities;
        });
      }

      localStorage.setItem("qgen_stats", JSON.stringify(newStats));
      return newStats;
    });
  };

  useEffect(() => {
    let interval;
    if (processingVisible) {
      let stepIndex = 0;
      setCurrentStep(0);
      setStepMessage(processingSteps[0].message);
      setProgress(0);
      interval = setInterval(() => {
        stepIndex++;
        if (stepIndex < processingSteps.length) {
          setCurrentStep(stepIndex);
          setStepMessage(processingSteps[stepIndex].message);
          setProgress(processingSteps[stepIndex].progress);
        } else {
          clearInterval(interval);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [processingVisible]);

  const handleFileSelect = (selectedFile) => {
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setUploadSuccess(true);
      updateStatsAndActivity("upload", selectedFile.name);
      toast.current.show({ severity: 'success', summary: 'PDF Selected', detail: selectedFile.name, life: 2000 });
      setTimeout(() => setUploadSuccess(false), 1500);
    } else {
      toast.current.show({ severity: 'error', summary: 'Invalid file', detail: 'Please select a PDF file', life: 2000 });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const generateQuestions = async () => {
    if (!file) {
      toast.current.show({ severity: 'warn', summary: 'No file', detail: 'Please select a PDF first', life: 2000 });
      return;
    }
    try {
      setProcessingVisible(true);
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("https://qgen-backend-8dx2.onrender.com/generate", formData);
      const generatedQuestions = res.data.questions;
      setQuestions(generatedQuestions);
      
      const questionCount = (generatedQuestions.match(/\d+\./g) || []).length;
      updateStatsAndActivity("generate", file.name, questionCount);
      
      setHistory((prev) => [
        {
          fileName: file.name,
          date: new Date().toLocaleString(),
          content: generatedQuestions,
        },
        ...prev,
      ]);
      setProcessingVisible(false);
      setVisible(true);
    } catch (err) {
      console.error(err);
      toast.current.show({ severity: 'error', summary: 'Generation failed', detail: err.message, life: 3000 });
      setProcessingVisible(false);
    } finally {
      setLoading(false);
    }
  };

  const copyQuestions = async () => {
    await navigator.clipboard.writeText(questions);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
    toast.current.show({ severity: 'success', summary: 'Copied!', life: 1500 });
  };

  const downloadPDF = () => {
    setDownloadFeedback(true);
    if (file) updateStatsAndActivity("download", file.name);
    const doc = new jsPDF();
    const cleanText = questions
      .replace(/#{1,6}\s/g, "")
      .replace(/\*\*/g, "")
      .replace(/---/g, "")
      .replace(/`/g, "");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxWidth = pageWidth - margin * 2;
    const lines = doc.splitTextToSize(cleanText, maxWidth);
    let y = 20;
    doc.setFontSize(18);
    doc.text("Generated Questions", margin, y);
    y += 15;
    doc.setFontSize(11);
    lines.forEach((line) => {
      if (y > doc.internal.pageSize.getHeight() - 15) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += 6;
    });
    doc.save("questions.pdf");
    setTimeout(() => setDownloadFeedback(false), 2000);
    toast.current.show({ severity: 'info', summary: 'PDF saved', detail: 'Download complete', life: 1500 });
  };

  const footer = (
    <div className="dialog-footer-centered">
      <Button
        label={copyFeedback ? "Copied! ✓" : "Copy"}
        icon="pi pi-copy"
        onClick={copyQuestions}
        className={copyFeedback ? "p-button-success" : ""}
      />
      <Button
        label={downloadFeedback ? "Downloaded! ✓" : "Download PDF"}
        icon="pi pi-download"
        onClick={downloadPDF}
        className={downloadFeedback ? "p-button-success" : ""}
      />
    </div>
  );

  const processingFooter = (
    <div className="dialog-footer-centered">
      <Button label="Processing..." disabled className="p-button-secondary" />
    </div>
  );

  const renderProcessingContent = () => (
    <div className="processing-content">
      <div className="processing-icon glow">{processingSteps[currentStep]?.icon || "🤖"}</div>
      <div className="processing-message">{stepMessage}</div>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="processing-percent">{progress}%</div>
      <div className="processing-tip">✨ Our AI is working its magic ✨</div>
    </div>
  );

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="app">
      <Toast ref={toast} position="top-right" className="custom-toast" />
      <div className="main-container">
        <div className="glass-card">
          <h1 className="animated-title">Question Generator</h1>

          {/* Enhanced Drag & Drop Upload Area */}
          <div
            className={`upload-area ${isDragging ? "dragging" : ""} ${file ? "has-file" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              style={{ display: "none" }}
            />
            {!file ? (
              <>
                <div className="upload-illustration">📄</div>
                <div className="upload-title">Drag & Drop PDF Here</div>
                <div className="upload-subtitle">or <span className="browse-link">Browse Files</span></div>
              </>
            ) : (
              <div className="file-info">
                <div className="file-icon">📄</div>
                <div className="file-details">
                  <div className="file-name">{file.name}</div>
                  <div className="file-meta">{formatFileSize(file.size)}</div>
                </div>
                {uploadSuccess && <div className="success-tick">✓</div>}
              </div>
            )}
          </div>

          {/* Generate Button (only show if file selected) */}
          {file && (
            <Button
              className="generate-btn"
              label={loading ? "Generating..." : "Generate Questions"}
              icon="pi pi-bolt"
              onClick={generateQuestions}
              disabled={loading}
            />
          )}
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card gradient-card-1">
            <div className="stat-icon">📄</div>
            <div className="stat-info">
              <h3>PDFs Uploaded</h3>
              <div className="stat-number">{counters.pdfs}</div>
            </div>
          </div>
          <div className="stat-card gradient-card-2">
            <div className="stat-icon">❓</div>
            <div className="stat-info">
              <h3>Questions Generated</h3>
              <div className="stat-number">{counters.questions}</div>
            </div>
          </div>
        </div>

        {/* History Panel */}
        <div className="history-panel">
          <h3><i className="pi pi-history"></i> Recent Generations</h3>
          {history.length === 0 ? (
            <p>No history yet</p>
          ) : (
            history.map((item, index) => (
              <div
                key={index}
                className="history-item"
                onClick={() => {
                  setQuestions(item.content);
                  setVisible(true);
                }}
              >
                <div>{item.fileName}</div>
                <small>{item.date}</small>
              </div>
            ))
          )}
        </div>

        {/* Recent Activity Timeline */}
        <div className="activity-card glass-card">
          <h3>📅 Recent Activity</h3>
          <div className="timeline">
            {activities.length === 0 ? (
              <p className="empty-activity">No activity yet. Upload a PDF to get started!</p>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className={`timeline-item ${activity.color}`}>
                  <div className="timeline-icon">{activity.icon}</div>
                  <div className="timeline-content">
                    <p>{activity.message}</p>
                    <small>{activity.timestamp}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* AI Processing Dialog */}
      <Dialog
        header="AI is Thinking"
        visible={processingVisible}
        style={{ width: "450px" }}
        onHide={() => {}}
        closable={false}
        draggable={false}
        resizable={false}
        className="curved-dialog centered-header processing-dialog"
        footer={processingFooter}
      >
        {renderProcessingContent()}
      </Dialog>

      {/* Generated Questions Dialog */}
      <Dialog
        header="Generated Questions"
        visible={visible}
        style={{ width: "70vw", maxWidth: "900px" }}
        onHide={() => setVisible(false)}
        maximizable
        footer={footer}
        className="curved-dialog centered-header"
      >
        <div className="dialog-content">
          <ReactMarkdown>{questions}</ReactMarkdown>
        </div>
      </Dialog>
    </div>
  );
};

export default QuestionGenerator;