// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Register from "./components/Register";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import QuestionGenerator from "./components/QuestionGenerator";
import Stats from "./components/Stats";
import AboutUs from "./components/AboutUs";
import EditProfile from "./components/EditProfile";
import Settings from "./components/Settings";
import "./App.css";

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading-screen">Loading...</div>;

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Header />
            <HomePage />
          </>
        }
      />
      <Route
        path="/generate"
        element={
          <>
            <Header />
            <QuestionGenerator />
          </>
        }
      />
      <Route
        path="/stats"
        element={
          <>
            <Header />
            <Stats />
          </>
        }
      />
      <Route
        path="/about"
        element={
          <>
            <Header />
            <AboutUs />
          </>
        }
      />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;