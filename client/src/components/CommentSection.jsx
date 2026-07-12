import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";
import { formatDate, initials } from "../utils/formatDate";

export default function CommentSection({ blogId, initialComments = [] }) {
  const { user } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await api.post(`/api/comments/${blogId}`, { text });
      const newComment = { ...res.data.comment, user: { _id: user.id, name: user.name } };
      setComments((prev) => [newComment, ...prev]);
      setText("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not post your comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  const saveEdit = async (id) => {
    try {
      const res = await api.put(`/api/comments/${id}`, { text: editText });
      setComments((prev) =>
        prev.map((c) => (c._id === id ? { ...c, text: res.data.comment.text } : c))
      );
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update comment.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/comments/${id}`);
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete comment.");
    }
  };

  return (
    <div className="mt-10 pt-8 border-t border-line">
      <h3 className="font-display text-xl mb-5 text-text">
        {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add to the margin…"
            rows={3}
            maxLength={500}
            className="w-full bg-surface border border-line rounded px-4 py-3 text-sm text-text placeholder:text-text-faint focus:border-jade-bright outline-none resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="px-4 py-2 rounded-full bg-jade text-ink text-sm font-medium hover:bg-jade-bright transition-colors disabled:opacity-40"
            >
              {submitting ? "Posting…" : "Post comment"}
            </button>
          </div>
        </form>
      ) : (
        <p className="mb-8 text-sm text-text-muted font-mono">
          <Link to="/login" className="text-jade-bright hover:underline">
            Sign in
          </Link>{" "}
          to join the conversation.
        </p>
      )}

      {error && <p className="text-rust text-sm mb-4">{error}</p>}

      <ul className="space-y-6">
        {comments.map((comment) => {
          const isOwner = user && comment.user?._id === user.id;
          return (
            <li key={comment._id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-surface2 border border-line flex items-center justify-center text-[10px] font-mono text-text-muted shrink-0">
                {initials(comment.user?.name || "?")}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-text">
                    {comment.user?.name || "Unknown"}
                  </span>
                  <span className="text-xs text-text-faint font-mono">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>

                {editingId === comment._id ? (
                  <div className="mt-1">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={2}
                      className="w-full bg-surface border border-line rounded px-3 py-2 text-sm text-text outline-none focus:border-jade-bright resize-none"
                    />
                    <div className="flex gap-3 mt-1 text-xs font-mono">
                      <button
                        onClick={() => saveEdit(comment._id)}
                        className="text-jade-bright hover:underline"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-text-faint hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-text-muted mt-1 leading-relaxed">{comment.text}</p>
                )}

                {isOwner && editingId !== comment._id && (
                  <div className="flex gap-3 mt-1 text-xs font-mono">
                    <button
                      onClick={() => startEdit(comment)}
                      className="text-text-faint hover:text-gild-bright"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="text-text-faint hover:text-rust"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
