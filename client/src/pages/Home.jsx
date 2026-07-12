import { useEffect, useState } from "react";
import api from "../api/axios";
import BlogCard from "../components/BlogCard.jsx";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    api
      .get("/api/blogs")
      .then((res) => setBlogs(res.data.blogs))
      .catch(() => setError("Could not reach the server. Is the API running?"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(query.toLowerCase()) ||
      b.author?.name?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-12">
      <div className="mb-12">
        <p className="font-mono text-xs uppercase tracking-widest text-gild mb-3">
          Vol. {new Date().getFullYear()} — field notes from everyone
        </p>
        <h1 className="font-display text-4xl md:text-5xl text-text max-w-2xl leading-tight">
          Thoughts worth writing down.
        </h1>
        <p className="text-text-muted mt-3 max-w-lg">
          A shared notebook. Read what others are working through, or start a
          page of your own.
        </p>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts or authors…"
          className="mt-6 w-full max-w-sm bg-surface border border-line rounded px-4 py-2.5 text-sm text-text placeholder:text-text-faint focus:border-jade-bright outline-none"
        />
      </div>

      {loading && (
        <p className="text-text-muted font-mono text-sm">Turning pages…</p>
      )}

      {error && <p className="text-rust font-mono text-sm">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <div className="border border-dashed border-line rounded p-10 text-center">
          <p className="font-display text-xl text-text mb-2">
            {query ? "Nothing matches that search." : "No posts yet."}
          </p>
          <p className="text-text-muted text-sm">
            {query ? "Try a different word." : "Be the first to write something."}
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mt-2">
        {filtered.map((blog, i) => (
          <BlogCard key={blog._id} blog={blog} featured={i === 0 && !query} />
        ))}
      </div>
    </div>
  );
}
