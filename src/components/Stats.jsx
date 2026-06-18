// src/components/Stats.jsx
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";

const Stats = () => {
  const { user } = useAuth();
  const userId = user?.username || "guest";
  const storagePrefix = `qgen_${userId}_`;

  const [stats, setStats] = useState({ pdfsUploaded: 0, questionsGenerated: 0 });
  const [history, setHistory] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [downloadFeedback, setDownloadFeedback] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    const savedStats = localStorage.getItem(`${storagePrefix}stats`);
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
    const savedHistory = localStorage.getItem(`${storagePrefix}history`);
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, [storagePrefix]);

  const handleItemClick = (content, prompt) => {
    setSelectedQuestions(content);
    setSelectedPrompt(prompt);
    setDialogVisible(true);
  };

  const copyQuestions = async () => {
    await navigator.clipboard.writeText(selectedQuestions);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
    toast.current.show({ severity: 'success', summary: 'Copied!', life: 1500 });
  };

  const downloadPDF = () => {
    setDownloadFeedback(true);
    const doc = new jsPDF();
    const cleanText = selectedQuestions
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

  return (
    <div className="main-container generator-container">
      <Toast ref={toast} position="top-right" className="custom-toast" />
      <div className="glass-card">
        <h2 className="animated-title">Activity Overview</h2>
        <div className="stats-grid stats-grid-three">
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
              <div className="stat-number">{history.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="history-panel">
        <h3>Recent Generations</h3>
        {history.length === 0 ? (
          <p className="empty-history">No history yet</p>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="history-item"
              onClick={() => handleItemClick(item.content, item.prompt)}
            >
              <div>{item.fileName}</div>
              <small>{item.date}</small>
            </div>
          ))
        )}
      </div>

      {/* Generated Questions Dialog */}
      <Dialog
        header="Generated Questions"
        visible={dialogVisible}
        style={{ width: "70vw", maxWidth: "900px" }}
        onHide={() => setDialogVisible(false)}
        maximizable
        footer={footer}
        className="curved-dialog centered-header"
      >
        <div className="dialog-content">
          {selectedPrompt && (
            <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "var(--glass-bg)", borderRadius: "12px" }}>
              <h4 style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "0.3rem" }}>Prompt used:</h4>
              <p style={{ color: "var(--text-primary)", whiteSpace: "pre-wrap", fontStyle: "italic" }}>{selectedPrompt}</p>
            </div>
          )}
          <ReactMarkdown>{selectedQuestions}</ReactMarkdown>
        </div>
      </Dialog>
    </div>
  );
};

export default Stats;