import { Link } from "react-router-dom";
import { assetUrl } from "../api/axios";
import { formatDate } from "../utils/formatDate";

export default function BlogCard({ blog, featured = false }) {
  const excerpt = blog.content.replace(/\s+/g, " ").slice(0, featured ? 220 : 130);

  return (
    <Link
      to={`/blogs/${blog._id}`}
      className={`group relative block border border-line rounded bg-surface hover:border-jade-bright/60 transition-colors ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      {/* corner date tab — the "index card" signature */}
      <span className="absolute -top-2 left-4 px-2 py-0.5 bg-gild text-ink text-[10px] font-mono tracking-wider rounded-sm">
        {formatDate(blog.createdAt)}
      </span>

      <div className={`flex ${featured ? "flex-col md:flex-row" : "flex-col"} gap-0`}>
        {blog.image && (
          <div
            className={`bg-surface2 overflow-hidden ${
              featured ? "md:w-2/5 h-48 md:h-auto" : "h-40"
            }`}
          >
            <img
              src={assetUrl(blog.image)}
              alt=""
              className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-300"
            />
          </div>
        )}

        <div className="p-5 flex-1 flex flex-col">
          <h3
            className={`font-display leading-snug text-text group-hover:text-jade-bright transition-colors ${
              featured ? "text-2xl md:text-3xl" : "text-xl"
            }`}
          >
            {blog.title}
          </h3>

          <p className="mt-2 text-sm text-text-muted leading-relaxed flex-1">
            {excerpt}
            {blog.content.length > excerpt.length ? "…" : ""}
          </p>

          <div className="mt-4 flex items-center gap-3 text-xs font-mono text-text-faint">
            <span>{blog.author?.name || "Unknown"}</span>
            <span className="w-1 h-1 rounded-full bg-text-faint" />
            <span>{blog.likes?.length || 0} likes</span>
            <span className="w-1 h-1 rounded-full bg-text-faint" />
            <span>{blog.comments?.length || 0} comments</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
