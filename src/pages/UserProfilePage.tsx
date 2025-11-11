import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../helper/apiClient";

interface UserProfileResponse {
  username: string;
  profilePicture: string;
  posts: {
    id: number;
    description: string;
    image: string;
    drinkName: string;
    createdAt: string;
  }[];
}

export const UserProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) return;

        const response = await api.get(`http:/localhost:8080/api/v1/users/${username}`);
        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError("Unable to load profile.");
      }
    };

    fetchProfile();
  }, [username]);

  if (error) return <div style={{ padding: "80px", textAlign: "center" }}>{error}</div>;
  if (!profile) return <div style={{ padding: "80px", textAlign: "center" }}>Loading profile...</div>;

  return (
    <div style={{ paddingTop: "80px", maxWidth: "700px", margin: "0 auto" }}>
      <div style={{ textAlign: "center" }}>
        <img
          src={profile.profilePicture || "/default-profile.png"}
          alt="Profile"
          style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover" }}
        />
        <h2>{profile.username}</h2>
      </div>

      <hr style={{ margin: "20px 0" }} />

      {profile.posts.length === 0 ? (
        <p style={{ textAlign: "center", color: "#555" }}>No posts yet.</p>
      ) : (
        <div>
          {profile.posts.map((post) => (
            <div
              key={post.id}
              style={{
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                marginBottom: "20px",
                padding: "12px",
              }}
            >
              {post.image && (
                <img
                  src={post.image}
                  alt="Drink"
                  style={{ width: "100%", borderRadius: "10px", marginBottom: "8px" }}
                />
              )}
              <p>{post.description}</p>
              <small>
                {post.drinkName} • {new Date(post.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
