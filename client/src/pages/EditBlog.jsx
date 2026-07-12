import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { assetUrl } from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [existingImage, setExistingImage] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get(`/api/blogs/${id}`)
      .then((res) => {
        const blog = res.data.blog;
        if (user && blog.author?._id !== user.id) {
          setError("You can only edit your own posts.");
          return;
        }
        setTitle(blog.title);
        setContent(blog.content);
        setExistingImage(blog.image);
      })
      .catch(() => setError("This post could not be found."))
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content are both required.");
      return;
    }
    setSubmitting(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      const res = await api.put(`/api/blogs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/blogs/${res.data.blog._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save your changes.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-24 text-center text-text-muted font-mono text-sm">
        Loading…
      </div>
    );
  }

  if (error && !title) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-24 text-center">
        <p className="font-display text-2xl text-text mb-2">Can't edit this post</p>
        <p className="text-text-muted text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-14">
      <p className="font-mono text-xs uppercase tracking-widest text-gild mb-3">Editing</p>
      <h1 className="font-display text-3xl text-text mb-8">Revise your post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-mono text-text-muted mb-1.5">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={150}
            className="w-full bg-surface border border-line rounded px-4 py-3 font-display text-xl text-text focus:border-jade-bright outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-text-muted mb-1.5">Cover image</label>
          {existingImage && !preview && (
            <img
              src={assetUrl(existingImage)}
              alt="Current cover"
              className="mb-3 max-h-48 rounded border border-line"
            />
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleImage}
            className="text-sm text-text-muted file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-surface2 file:text-text-muted file:text-xs file:font-mono hover:file:bg-line"
          />
          {preview && (
            <img src={preview} alt="New preview" className="mt-3 max-h-48 rounded border border-line" />
          )}
        </div>

        <div>
          <label className="block text-xs font-mono text-text-muted mb-1.5">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full bg-surface border border-line rounded px-4 py-3 text-sm leading-relaxed text-text focus:border-jade-bright outline-none resize-y"
          />
        </div>

        {error && <p className="text-rust text-sm">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-full border border-line text-text-muted text-sm hover:text-text transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 rounded-full bg-jade text-ink font-medium text-sm hover:bg-jade-bright transition-colors disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
