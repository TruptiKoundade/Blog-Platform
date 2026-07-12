import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      const dest = location.state?.from?.pathname || "/";
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-5 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-gild mb-3">
        Welcome back
      </p>
      <h1 className="font-display text-3xl text-text mb-8">Sign in</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-text-muted mb-1.5">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full bg-surface border border-line rounded px-4 py-2.5 text-sm text-text focus:border-jade-bright outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-text-muted mb-1.5">Password</label>
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full bg-surface border border-line rounded px-4 py-2.5 text-sm text-text focus:border-jade-bright outline-none"
          />
        </div>

        {error && <p className="text-rust text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-full bg-jade text-ink font-medium hover:bg-jade-bright transition-colors disabled:opacity-50"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-sm text-text-muted mt-6">
        New here?{" "}
        <Link to="/register" className="text-jade-bright hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
