import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import { AuthPage } from "./pages/AuthPage";
import { Navbar } from "./pages/Navbar";

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

  if (loading) return null; // așteptăm verificarea JWT-ului

  return (
    <BrowserRouter>
      {isAuthenticated && <Navbar onLogout={handleLogout} />}

      <Routes>
        {/* Pagina principală (doar dacă e logat) */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <div style={{ paddingTop: "70px" }}>
                <h2 style={{ textAlign: "center" }}>Welcome to DrinkApp 🍻</h2>
              </div>
            ) : (
              <Navigate to="/auth" />
            )
          }
        />

        {/* Pagina de login/register */}
        <Route
          path="/auth"
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <AuthPage onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
