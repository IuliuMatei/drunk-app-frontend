import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AuthPage.css";

interface AuthResponse {
  token?: string;
}

interface AuthPageProps {
  onLoginSuccess: (token: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(true);
  const [uname, setUname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = isRegister
      ? "http://localhost:8080/api/v1/auth/register"
      : "http://localhost:8080/api/v1/auth/authenticate";

    const body = isRegister ? { uname, email, password } : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const text = await response.text();

      if (!response.ok) {
        setMessage(text || "Authentication failed.");
        return;
      }

      const data: AuthResponse = JSON.parse(text);

      if (data.token) {
        onLoginSuccess(data.token);
        setMessage("✅ Success! Logged in.");
        navigate("/"); // 👈 redirecționează automat spre homepage
      } else {
        setMessage("Unexpected response.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isRegister ? "Register" : "Login"}</h2>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input
              type="text"
              placeholder="Username"
              value={uname}
              onChange={(e) => setUname(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="show-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button type="submit" className="submit-btn">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p className="toggle-text">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span onClick={() => setIsRegister(!isRegister)} className="link">
            {isRegister ? "Login here" : "Register here"}
          </span>
        </p>

        {message && (
          <p
            className={`message ${
              message.includes("Success") ? "success" : "error"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};
