import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { assetUrl } from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";
import LikeButton from "../components/LikeButton.jsx";
import CommentSection from "../components/CommentSection.jsx";
import { formatDate, initials } from "../utils/formatDate";

export default function BlogDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/api/blogs/${id}`)
      .then((res) => {
        setBlog(res.data.blog);
        setComments(res.data.comments || []);
      })
      .catch(() => setError("This post could not be found."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this post for good? This can't be undone.")) return;
    setDeleting(true);
    try {
      await api.delete(`/api/blogs/${id}`);
      navigate("/my-blogs", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete this post.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-24 text-center text-text-muted font-mono text-sm">
        Turning pages…
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-24 text-center">
        <p className="font-display text-2xl text-text mb-2">Page missing</p>
        <p className="text-text-muted text-sm mb-6">{error}</p>
        <Link to="/" className="text-jade-bright text-sm hover:underline">
          ← Back to the feed
        </Link>
      </div>
    );
  }

  const isOwner = user && blog.author?._id === user.id;

  return (
    <article className="max-w-2xl mx-auto px-5 md:px-0 py-16">
      <Link to="/" className="text-xs font-mono text-text-muted hover:text-jade-bright">
        ← Feed
      </Link>

      <p className="font-mono text-xs uppercase tracking-widest text-gild mt-6 mb-3">
        {formatDate(blog.createdAt)}
      </p>
      <h1 className="font-display text-3xl md:text-4xl text-text leading-tight mb-6">
        {blog.title}
      </h1>

      <div className="flex items-center justify-between border-y border-line py-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-surface2 border border-line flex items-center justify-center text-xs font-mono text-text-muted">
            {initials(blog.author?.name || "?")}
          </div>
          <div>
            <p className="text-sm text-text">{blog.author?.name || "Unknown author"}</p>
            <p className="text-xs text-text-faint font-mono">{blog.author?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LikeButton blogId={blog._id} initialLikes={blog.likes} size="lg" />

          {isOwner && (
            <>
              <Link
                to={`/edit/${blog._id}`}
                className="px-3 py-1.5 rounded-full border border-line text-sm text-text-muted hover:border-gild hover:text-gild-bright transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-1.5 rounded-full border border-line text-sm text-text-muted hover:border-rust hover:text-rust transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </>
          )}
        </div>
      </div>

      {blog.image && (
        <img
          src={assetUrl(blog.image)}
          alt=""
          className="w-full rounded mb-8 border border-line"
        />
      )}

      <div className="drop-cap text-[1.05rem] leading-8 text-text/90 whitespace-pre-wrap font-body">
        {blog.content}
      </div>

      <CommentSection blogId={blog._id} initialComments={comments} />
    </article>
  );
}
