import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Could not create your account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-5 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-gild mb-3">
        First time here
      </p>
      <h1 className="font-display text-3xl text-text mb-8">Create an account</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-text-muted mb-1.5">Name</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full bg-surface border border-line rounded px-4 py-2.5 text-sm text-text focus:border-jade-bright outline-none"
          />
        </div>
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
          <label className="block text-xs font-mono text-text-muted mb-1.5">
            Password <span className="text-text-faint">(min. 6 characters)</span>
          </label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
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
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-sm text-text-muted mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-jade-bright hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
