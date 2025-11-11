import React, { useEffect, useState } from "react";
import "../css/Navbar.css";
import { api } from "../helper/apiClient";

interface NavbarProps {
  onLogout: () => void;
  onViewProfile?: (username: string) => void;
}

interface UserProfile {
  uname: string;
  image?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onLogout, onViewProfile }) => {
  const [friendUsername, setFriendUsername] = useState("");
  const [searchUsername, setSearchUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "ok" | "err" } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) return;

        const response = await api.get("http://localhost:8080/api/v1/users/image");
        if (!response.ok) throw new Error("Failed to load profile picture");

        const data = await response.json();
        setProfile(data);
      } catch {
        setProfile(null);
      }
    };

    fetchProfile();
  }, []);

  const sendFriendRequest = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      onLogout();
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

  const handleSearchProfile = async () => {
    const username = searchUsername.trim();
    if (!username) {
      setMessage({ text: "Please enter a username to search.", type: "err" });
      return;
    }

    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        onLogout();
        return;
      }

      const response = await api.get(`http://localhost:8080/api/v1/users/${encodeURIComponent(username)}`);
      if (!response.ok) {
        setMessage({ text: `User '${username}' not found or not accessible.`, type: "err" });
        return;
      }

      setMessage({ text: `✅ Loaded profile of ${username}!`, type: "ok" });
      if (onViewProfile) onViewProfile(username);
    } catch (err) {
      setMessage({ text: "Server error while loading profile.", type: "err" });
    }
  };

  const handleMyProfileClick = () => {
    if (profile && onViewProfile) {
      onViewProfile(profile.uname);
    }
  };

  return (
    <nav className="nvb">
      <div className="nvb-left">
        <span className="nvb-logo">DrinkApp</span>
      </div>

      <div className="nvb-actions">
        {/* Add friend */}
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

        {/* Search profile */}
        <input
          className="nvb-input"
          type="text"
          placeholder="Search username"
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
        />
        <button className="nvb-btn" onClick={handleSearchProfile}>
          View Profile
        </button>

        {/* Profile avatar */}
        {profile && (
          <div className="nvb-profile" onClick={handleMyProfileClick} title="My Profile">
            {profile.image && profile.image.trim() !== "" ? (
              <img
                src={profile.image}
                alt="Profile"
                className="nvb-profile-img"
                onError={(e) => {
                  // fallback dacă poza nu se încarcă
                  (e.target as HTMLImageElement).style.display = "none";
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) parent.classList.add("nvb-placeholder-active");
                }}
              />
            ) : (
              <div className="nvb-profile-placeholder" />
            )}
            <span className="nvb-profile-name">{profile.uname}</span>
          </div>
        )}


        {/* Logout */}
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
