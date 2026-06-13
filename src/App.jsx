// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";   // Import ThemeProvider
import Login from "./components/Login";
import Register from "./components/Register";
import Header from "./components/Header";
import QuestionGenerator from "./components/QuestionGenerator";
import AboutUs from "./components/AboutUs";
import EditProfile from "./components/EditProfile";
import Settings from "./components/Settings";
import "./App.css";

// Component that decides which routes to show based on auth status
function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading-screen">Loading...</div>;

  if (!user) {
    // Unauthenticated routes
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  // Authenticated routes – includes all pages a logged-in user can access
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Header />
            <QuestionGenerator />
          </>
        }
      />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>            {/* 👈 Wrap with ThemeProvider first */}
      <AuthProvider>           {/* 👈 Then AuthProvider */}
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;