import React, { useState } from "react";
import "../css/Navbar.css";
import { api } from "../helper/apiClient";

interface NavbarProps {
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const [friendUsername, setFriendUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "ok" | "err" } | null>(null);

  const sendFriendRequest = async () => {
    const token = localStorage.getItem("jwt");

    // dacă nu există JWT → redirect imediat
    if (!token) {
      onLogout(); // 🔥 declanșează logout-ul global
      return;
    }

    if (!friendUsername.trim()) {
      setMessage({ text: "Please enter a username.", type: "err" });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const response = await api.post(
        `http://localhost:8080/api/v1/friendship/request?username=${encodeURIComponent(friendUsername.trim())}`
      );

      const text = await response.text();

      if (!response.ok) {
        setMessage({ text: text || "Failed to send friend request.", type: "err" });
      } else {
        setMessage({ text: text || "✅ Friend request sent successfully!", type: "ok" });
        setFriendUsername("");
      }
    } catch (err: any) {
      if (err.message === "JWT expired") {
        onLogout();
        return;
      }
      setMessage({ text: "Server error.", type: "err" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = () => {
    onLogout();
  };

  return (
    <nav className="nvb">
      <div className="nvb-left">
        <span className="nvb-logo">DrinkApp</span>
      </div>

      <div className="nvb-actions">
        <input
          className="nvb-input"
          type="text"
          placeholder="Add friend"
          value={friendUsername}
          onChange={(e) => setFriendUsername(e.target.value)}
          disabled={loading}
        />
        <button className="nvb-btn" onClick={sendFriendRequest} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>

        <button className="nvb-logout" onClick={handleLogoutClick}>
          Logout
        </button>
      </div>

      {message && (
        <div className={`nvb-msg ${message.type === "ok" ? "ok" : "err"}`}>
          {message.text}
        </div>
      )}
    </nav>
  );
};
