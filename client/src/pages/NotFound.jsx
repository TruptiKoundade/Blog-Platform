import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-5 py-32 text-center">
      <p className="font-display text-6xl text-gild mb-4">404</p>
      <p className="text-text-muted mb-6">This page has been torn out of the notebook.</p>
      <Link to="/" className="text-jade-bright text-sm hover:underline">
        ← Back to the feed
      </Link>
    </div>
  );
}
