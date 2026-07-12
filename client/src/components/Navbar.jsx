import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { initials } from "../utils/formatDate.js";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="border-b border-line sticky top-0 z-30 bg-ink/90 backdrop-blur">
      <div className="max-w-5xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="block w-[3px] h-7 bg-jade-bright rounded-full group-hover:bg-gild transition-colors" />
          <span className="font-display text-2xl tracking-tight text-text">
            Marginalia
          </span>
        </Link>

        <nav className="flex items-center gap-6 font-mono text-xs uppercase tracking-wider">
          <Link to="/" className="text-text-muted hover:text-text transition-colors">
            Feed
          </Link>

          {user ? (
            <>
              <Link
                to="/my-blogs"
                className="text-text-muted hover:text-text transition-colors"
              >
                My Posts
              </Link>
              <Link
                to="/create"
                className="px-4 py-2 rounded-full bg-jade text-ink font-medium normal-case tracking-normal hover:bg-jade-bright transition-colors"
              >
                Write
              </Link>
              <button
                onClick={handleLogout}
                className="w-8 h-8 rounded-full bg-surface2 border border-line flex items-center justify-center text-[11px] text-text-muted hover:text-rust hover:border-rust transition-colors"
                title={`Log out ${user.name}`}
              >
                {initials(user.name)}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-text-muted hover:text-text transition-colors">
                Sign in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-full bg-jade text-ink font-medium normal-case tracking-normal hover:bg-jade-bright transition-colors"
              >
                Join
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
