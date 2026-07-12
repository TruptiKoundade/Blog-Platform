import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";
import { formatDate } from "../utils/formatDate";

export default function MyBlogs() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    api
      .get("/api/blogs")
      .then((res) => {
        const mine = res.data.blogs.filter((b) => b.author?._id === user.id);
        setBlogs(mine);
      })
      .catch(() => setError("Could not load your posts."))
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post for good?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/blogs/${id}`);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch {
      setError("Could not delete this post.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-5 py-14">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-gild mb-2">
            Your desk
          </p>
          <h1 className="font-display text-3xl text-text">My posts</h1>
        </div>
        <Link
          to="/create"
          className="px-4 py-2 rounded-full bg-jade text-ink text-sm font-medium hover:bg-jade-bright transition-colors"
        >
          + Write
        </Link>
      </div>

      {loading && <p className="text-text-muted font-mono text-sm">Loading…</p>}
      {error && <p className="text-rust font-mono text-sm">{error}</p>}

      {!loading && blogs.length === 0 && (
        <div className="border border-dashed border-line rounded p-10 text-center">
          <p className="font-display text-xl text-text mb-2">Nothing here yet</p>
          <p className="text-text-muted text-sm mb-5">
            Your published posts will show up on this shelf.
          </p>
          <Link to="/create" className="text-jade-bright text-sm hover:underline">
            Write your first post →
          </Link>
        </div>
      )}

      <ul className="divide-y divide-line border-t border-b border-line">
        {blogs.map((blog) => (
          <li key={blog._id} className="flex items-center justify-between py-4 gap-4">
            <Link to={`/blogs/${blog._id}`} className="min-w-0 flex-1 group">
              <p className="font-display text-lg text-text group-hover:text-jade-bright transition-colors truncate">
                {blog.title}
              </p>
              <p className="text-xs font-mono text-text-faint mt-1">
                {formatDate(blog.createdAt)} · {blog.likes?.length || 0} likes ·{" "}
                {blog.comments?.length || 0} comments
              </p>
            </Link>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                to={`/edit/${blog._id}`}
                className="px-3 py-1.5 rounded-full border border-line text-xs text-text-muted hover:border-gild hover:text-gild-bright transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(blog._id)}
                disabled={deletingId === blog._id}
                className="px-3 py-1.5 rounded-full border border-line text-xs text-text-muted hover:border-rust hover:text-rust transition-colors disabled:opacity-50"
              >
                {deletingId === blog._id ? "Deleting…" : "Delete"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
