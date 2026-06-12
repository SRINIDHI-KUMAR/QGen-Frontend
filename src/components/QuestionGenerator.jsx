// src/components/QuestionGenerator.jsx
import { useState, useRef } from "react";
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

  const [copyFeedback, setCopyFeedback] = useState(false);
  const [downloadFeedback, setDownloadFeedback] = useState(false);
  const toast = useRef(null);

  const generateQuestions = async () => {
    if (!file) {
      alert("Please select a PDF");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("https://qgen-backend-8dx2.onrender.com", formData);
      setQuestions(res.data.questions);
      setHistory((prev) => [
        {
          fileName: file.name,
          date: new Date().toLocaleString(),
          content: res.data.questions,
        },
        ...prev,
      ]);
      setVisible(true);
    } catch (err) {
      console.error(err);
      alert("Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const copyQuestions = async () => {
    await navigator.clipboard.writeText(questions);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
    if (toast.current) toast.current.show({ severity: 'success', summary: 'Copied!', life: 1500 });
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
    if (toast.current) toast.current.show({ severity: 'info', summary: 'PDF saved', life: 1500 });
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

  return (
    <div className="app">
      <Toast ref={toast} position="top-right" className="custom-toast" />
      <div className="main-container">
        <div className="glass-card">
          <h1 className="animated-title">Question Generator</h1>
          <label className="upload-box">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <span>{file ? `📄 ${file.name}` : "📁 Choose PDF File"}</span>
          </label>
          <Button
            className="generate-btn"
            label={loading ? "Generating..." : "Generate Questions"}
            icon="pi pi-bolt"
            onClick={generateQuestions}
            disabled={loading}
          />
        </div>
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
      </div>

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