// src/components/QuestionGenerator.jsx
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import ReactMarkdown from "react-markdown";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { InputTextarea } from "primereact/inputtextarea";
import { useAuth } from "../context/AuthContext";

const QuestionGenerator = () => {
  const { user } = useAuth();
  const userId = user?.id || user?.username || "guest";
  const storagePrefix = `qgen_${userId}_`;

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
  
  // Custom prompt
  const [customPrompt, setCustomPrompt] = useState("Generate 10 MCQs, 5 short questions, and 5 long questions from the following PDF content.");

  // Stats
  const [stats, setStats] = useState({ pdfsUploaded: 0, questionsGenerated: 0 });
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

  const generateUniqueId = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    return `${Date.now()}-${Math.random()}-${performance.now()}`;
  };

  // Load user data from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem(`${storagePrefix}stats`);
    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      setStats(parsed);
      setCounters({ pdfs: parsed.pdfsUploaded, questions: parsed.questionsGenerated });
    } else {
      setStats({ pdfsUploaded: 0, questionsGenerated: 0 });
      setCounters({ pdfs: 0, questions: 0 });
    }
    const savedHistory = localStorage.getItem(`${storagePrefix}history`);
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, [storagePrefix]);

  // Animate counters
  useEffect(() => {
    const duration = 800, steps = 40;
    const startPdf = counters.pdfs, startQ = counters.questions;
    const endPdf = stats.pdfsUploaded, endQ = stats.questionsGenerated;
    const diffPdf = endPdf - startPdf, diffQ = endQ - startQ;
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

  const updateStats = (type, questionCount = 0) => {
    setStats(prevStats => {
      let newStats = { ...prevStats };
      if (type === "upload") newStats.pdfsUploaded += 1;
      else if (type === "generate") newStats.questionsGenerated += questionCount;
      localStorage.setItem(`${storagePrefix}stats`, JSON.stringify(newStats));
      return newStats;
    });
  };

  const saveHistory = (newHistory) => {
    localStorage.setItem(`${storagePrefix}history`, JSON.stringify(newHistory));
  };

  // Processing animation
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
        } else clearInterval(interval);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [processingVisible]);

  const handleFileSelect = (selectedFile) => {
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setUploadSuccess(true);
      updateStats("upload");
      toast.current.show({ severity: 'success', summary: 'PDF Selected', detail: selectedFile.name, life: 2000 });
      setTimeout(() => setUploadSuccess(false), 1500);
    } else {
      toast.current.show({ severity: 'error', summary: 'Invalid file', detail: 'Please select a PDF file', life: 2000 });
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
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
    if (!customPrompt.trim()) {
      toast.current.show({ severity: 'warn', summary: 'Empty prompt', detail: 'Please enter a prompt', life: 2000 });
      return;
    }
    try {
      setProcessingVisible(true);
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("custom_prompt", customPrompt);

const res = await axios.post("https://qgen-backend-8dx2.onrender.com/generate", formData);
      const generatedQuestions = res.data.questions;
      setQuestions(generatedQuestions);

      const questionCount = (generatedQuestions.match(/\d+\./g) || []).length;
      updateStats("generate", questionCount);

      const newHistoryItem = {
        id: generateUniqueId(),
        fileName: file.name,
        date: new Date().toLocaleString(),
        content: generatedQuestions,
      };
      const newHistory = [newHistoryItem, ...history].slice(0, 20);
      setHistory(newHistory);
      saveHistory(newHistory);

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
    lines.forEach(line => {
      if (y > doc.internal.pageSize.getHeight() - 15) { doc.addPage(); y = 20; }
      doc.text(line, margin, y);
      y += 6;
    });
    doc.save("questions.pdf");
    setTimeout(() => setDownloadFeedback(false), 2000);
    toast.current.show({ severity: 'info', summary: 'PDF saved', detail: 'Download complete', life: 1500 });
  };

  const footer = (
    <div className="dialog-footer-centered">
      <Button label={copyFeedback ? "Copied! ✓" : "Copy"} icon="pi pi-copy" onClick={copyQuestions} className={copyFeedback ? "p-button-success" : ""} />
      <Button label={downloadFeedback ? "Downloaded! ✓" : "Download PDF"} icon="pi pi-download" onClick={downloadPDF} className={downloadFeedback ? "p-button-success" : ""} />
    </div>
  );

  const processingFooter = <div className="dialog-footer-centered"><Button label="Processing..." disabled className="p-button-secondary" /></div>;

  const renderProcessingContent = () => (
    <div className="processing-content">
      <div className="processing-icon glow">{processingSteps[currentStep]?.icon || "🤖"}</div>
      <div className="processing-message">{stepMessage}</div>
      <div className="progress-bar-container"><div className="progress-bar" style={{ width: `${progress}%` }}></div></div>
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

          {/* Custom Prompt Input - DeepSeek style */}
          <div className="prompt-config" style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500, color: "var(--text-secondary)" }}>
              ✍️ Your Prompt
            </label>
            <InputTextarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={4}
              autoResize
              placeholder="Example: Generate 20 important questions from the following PDF content. Include MCQs, short answers, and long answers. Avoid duplicates and focus on key concepts."
              className="curved-input"
              style={{ width: "100%", resize: "vertical" }}
            />
          </div>

          {/* Drag & Drop Area */}
          <div
            className={`upload-area ${isDragging ? "dragging" : ""} ${file ? "has-file" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <input type="file" ref={fileInputRef} accept=".pdf" onChange={e => handleFileSelect(e.target.files[0])} style={{ display: "none" }} />
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

          {file && <Button className="generate-btn" label={loading ? "Generating..." : "Generate Questions"} icon="pi pi-bolt" onClick={generateQuestions} disabled={loading} />}
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card gradient-card-1"><div className="stat-icon">📄</div><div className="stat-info"><h3>PDFs Uploaded</h3><div className="stat-number">{counters.pdfs}</div></div></div>
          <div className="stat-card gradient-card-2"><div className="stat-icon">❓</div><div className="stat-info"><h3>Questions Generated</h3><div className="stat-number">{counters.questions}</div></div></div>
        </div>

        {/* History */}
        <div className="history-panel">
          <h3><i className="pi pi-history"></i> Recent Generations</h3>
          {history.length === 0 ? <p>No history yet</p> : history.map(item => (
            <div key={item.id} className="history-item" onClick={() => { setQuestions(item.content); setVisible(true); }}>
              <div>{item.fileName}</div><small>{item.date}</small>
            </div>
          ))}
        </div>
      </div>

      {/* Processing Dialog */}
      <Dialog header="AI is Thinking" visible={processingVisible} style={{ width: "550px", height: "auto" }} onHide={() => {}} closable={false} draggable={false} resizable={false} className="curved-dialog centered-header processing-dialog" footer={processingFooter} contentStyle={{ minHeight: "280px" }}>
        {renderProcessingContent()}
      </Dialog>

      {/* Results Dialog */}
      <Dialog header="Generated Questions" visible={visible} style={{ width: "70vw", maxWidth: "900px" }} onHide={() => setVisible(false)} maximizable footer={footer} className="curved-dialog centered-header">
        <div className="dialog-content"><ReactMarkdown>{questions}</ReactMarkdown></div>
      </Dialog>
    </div>
  );
};

export default QuestionGenerator;