import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";

export default function LikeButton({ blogId, initialLikes = [], size = "md" }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [likes, setLikes] = useState(initialLikes.length);
  const [liked, setLiked] = useState(
    user ? initialLikes.some((id) => id === user.id || id?._id === user.id) : false
  );
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (busy) return;
    setBusy(true);

    // optimistic update
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikes((n) => (wasLiked ? n - 1 : n + 1));

    try {
      const res = await api.put(`/api/blogs/${blogId}/like`);
      setLikes(res.data.totalLikes);
    } catch (err) {
      // revert on failure
      setLiked(wasLiked);
      setLikes((n) => (wasLiked ? n + 1 : n - 1));
    } finally {
      setBusy(false);
    }
  };

  const textSize = size === "lg" ? "text-base" : "text-sm";

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors font-mono ${textSize} ${
        liked
          ? "border-gild bg-gild/10 text-gild-bright"
          : "border-line text-text-muted hover:border-gild hover:text-gild-bright"
      }`}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
      {likes}
    </button>
  );
}
