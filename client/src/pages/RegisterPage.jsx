import { Link, Navigate } from "react-router-dom";
import { useRef, useState } from "react";
import axios from "axios";
import { useEntranceReveal } from "../lib/animations.js";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const cardRef = useRef(null);

  useEntranceReveal(cardRef, { y: 20 });

  async function registerUser(ev) {
    ev.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await axios.post("/register", { name, email, password });
      setRedirect(true);
    } catch {
      setError("We couldn't create that account — the email may already be registered.");
    } finally {
      setSubmitting(false);
    }
  }

  if (redirect) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10">
      <div
        ref={cardRef}
        className="w-full max-w-md bg-white rounded-3xl shadow-lifted border border-black/5 p-8 sm:p-10"
      >
        <h1 className="font-display text-3xl text-center mb-1">Create an account</h1>
        <p className="text-center text-ink/50 text-sm mb-6">
          Join Airbnc to book and host beautiful places.
        </p>

        {error && (
          <div className="mb-2 rounded-2xl bg-primary-light text-primary-dark text-sm px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={registerUser}>
          <label htmlFor="register-name" className="block text-xs font-semibold uppercase tracking-wide text-ink/40 mt-3 mb-1">
            Full name
          </label>
          <input
            id="register-name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            required
          />

          <label htmlFor="register-email" className="block text-xs font-semibold uppercase tracking-wide text-ink/40 mt-1 mb-1">
            Email
          </label>
          <input
            id="register-email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            required
          />

          <label htmlFor="register-password" className="block text-xs font-semibold uppercase tracking-wide text-ink/40 mt-1 mb-1">
            Password
          </label>
          <input
            id="register-password"
            type="password"
            placeholder="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            required
          />

          <button type="submit" className="btn-primary mt-4" disabled={submitting}>
            {submitting ? "Creating account…" : "Register"}
          </button>

          <div className="text-center py-4 text-sm text-ink/60">
            Already a member?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Login now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
