import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';   // ← import
import './index.css';
import App from './App.jsx';
import "primereact/resources/themes/lara-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>      {/* ← wrap App */}
      <App />
    </BrowserRouter>
  </StrictMode>
);