import axios from "axios";
import { useContext, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext.jsx";
import { useEntranceReveal } from "../lib/animations.js";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);
  const cardRef = useRef(null);

  useEntranceReveal(cardRef, { y: 20 });

  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { data } = await axios.post("/login", { email, password });
      setUser(data);
      setRedirect(true);
    } catch {
      setError("We couldn't find an account with those details. Check your email and password and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-10">
      <div
        ref={cardRef}
        className="w-full max-w-md bg-white rounded-3xl shadow-lifted border border-black/5 p-8 sm:p-10"
      >
        <h1 className="font-display text-3xl text-center mb-1">Welcome back</h1>
        <p className="text-center text-ink/50 text-sm mb-6">
          Log in to continue planning your next stay.
        </p>

        {error && (
          <div className="mb-2 rounded-2xl bg-primary-light text-primary-dark text-sm px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleLoginSubmit}>
          <label htmlFor="login-email" className="block text-xs font-semibold uppercase tracking-wide text-ink/40 mt-3 mb-1">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            required
          />

          <label htmlFor="login-password" className="block text-xs font-semibold uppercase tracking-wide text-ink/40 mt-1 mb-1">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            placeholder="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            required
          />

          <button type="submit" className="btn-primary mt-4" disabled={submitting}>
            {submitting ? "Logging in…" : "Login"}
          </button>

          <div className="text-center py-4 text-sm text-ink/60">
            Don&apos;t have an account yet?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
