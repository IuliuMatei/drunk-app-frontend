import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { AuthPage } from "./pages/AuthPage";
import { Navbar } from "./pages/Navbar";
import { FeedPage } from "./pages/FeedPage";
import { UserProfilePage } from "./pages/UserProfilePage";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem("jwt", token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setIsAuthenticated(false);
  };

  if (loading) return null;

  return (
    <BrowserRouter>
      {isAuthenticated && (
        <Navbar
          onLogout={handleLogout}
          onViewProfile={(username) => (window.location.href = `/profile/${username}`)}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <FeedPage /> : <Navigate to="/auth" />
          }
        />

        <Route
          path="/auth"
          element={
            isAuthenticated ? <Navigate to="/" /> : <AuthPage onLoginSuccess={handleLoginSuccess} />
          }
        />

        <Route
          path="/profile/:username"
          element={isAuthenticated ? <UserProfilePage /> : <Navigate to="/auth" />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
