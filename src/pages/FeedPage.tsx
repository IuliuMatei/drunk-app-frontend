import React, { useEffect, useState } from "react";
import { api } from "../helper/apiClient";

interface PostDto {
  id: number;
  uname: string;
  imageProfile: string;
  description: string;
  createdAt: string;
  image: string;
  drinkName: string;
}

export const FeedPage: React.FC = () => {
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          setError("Not authenticated.");
          return;
        }

        const response = await api.get("http://localhost:8080/api/v1/post/feed");
        if (!response.ok) throw new Error("Failed to load feed");

        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError("Could not load posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) return <div style={{ textAlign: "center", marginTop: "80px" }}>Loading feed...</div>;
  if (error) return <div style={{ textAlign: "center", marginTop: "80px" }}>{error}</div>;

  return (
    <div style={{ paddingTop: "80px", maxWidth: "600px", margin: "0 auto" }}>
      {posts.length === 0 ? (
        <p style={{ textAlign: "center", color: "#555" }}>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            style={{
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
              marginBottom: "20px",
              padding: "14px",
            }}
          >
            {/* Header user */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <img
                src={post.imageProfile || "/default-profile.png"}
                alt="Profile"
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginRight: "10px",
                }}
              />
              <div>
                <strong>{post.uname}</strong>
                <div style={{ fontSize: "0.85rem", color: "#666" }}>
                  {new Date(post.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Text */}
            {post.description && (
              <p style={{ fontSize: "1rem", color: "#222", marginBottom: "10px" }}>{post.description}</p>
            )}

            {/* Image */}
            {post.image && (
              <img
                src={post.image}
                alt="Drink"
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  marginBottom: "8px",
                  objectFit: "cover",
                  maxHeight: "600px",
                }}
              />
            )}

            {/* Drink name */}
            {post.drinkName && (
              <div
                style={{
                  marginTop: "5px",
                  fontWeight: "600",
                  color: "#2563eb",
                  fontSize: "0.95rem",
                }}
              >
                🥂 {post.drinkName}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};
