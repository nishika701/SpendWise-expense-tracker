import { useState } from "react";

export default function AuthView({
  darkMode,
  onToggleTheme,
  onLogin,
  onRegister,
  loading,
  message,
  error,
}) {
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    email: "",
    password: "",
    username: "",
  });

  function handleSubmit(event) {
    event.preventDefault();
    if (authMode === "login") {
      onLogin({ email: authForm.email, password: authForm.password });
    } else {
      onRegister(authForm, () => setAuthMode("login"));
    }
  }

  return (
    <main className="auth-shell">
      <button
        type="button"
        className="theme-toggle auth-theme-toggle"
        onClick={onToggleTheme}
        title="Toggle dark mode"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      <section className="auth-panel">
        <div className="auth-brand">
          <div className="brand-mark">S</div>
          <p className="eyebrow">SpendWise</p>
          <h1>
            Take control of
            <span> your spending.</span>
          </h1>
          <p className="auth-description">
            A simple and beautiful way to track your expenses, understand your
            habits, and stay on top of your money.
          </p>

          <div className="auth-features">
            <div>
              <span>✓</span>
              Track every expense
            </div>
            <div>
              <span>✓</span>
              Understand your spending
            </div>
            <div>
              <span>✓</span>
              Keep your finances organized
            </div>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-heading">
            <h2>{authMode === "login" ? "Welcome back" : "Create account"}</h2>
            <p>
              {authMode === "login"
                ? "Log in to continue to SpendWise."
                : "Start managing your expenses today."}
            </p>
          </div>

          <div className="mode-switch">
            <button
              type="button"
              className={authMode === "login" ? "active" : ""}
              onClick={() => setAuthMode("login")}
            >
              Login
            </button>

            <button
              type="button"
              className={authMode === "register" ? "active" : ""}
              onClick={() => setAuthMode("register")}
            >
              Register
            </button>
          </div>

          <label>
            Email
            <input
              type="email"
              value={authForm.email}
              onChange={(e) =>
                setAuthForm({ ...authForm, email: e.target.value })
              }
              placeholder="you@example.com"
              required
            />
          </label>

          {authMode === "register" && (
            <label>
              Username
              <input
                type="text"
                value={authForm.username}
                onChange={(e) =>
                  setAuthForm({ ...authForm, username: e.target.value })
                }
                placeholder="Your name"
                required
              />
            </label>
          )}

          <label>
            Password
            <input
              type="password"
              value={authForm.password}
              onChange={(e) =>
                setAuthForm({ ...authForm, password: e.target.value })
              }
              placeholder="Enter your password"
              required
            />
          </label>

          {message && <p className="status success">{message}</p>}
          {error && <p className="status error">{error}</p>}

          <button className="primary-button auth-submit" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : authMode === "login"
              ? "Login to SpendWise"
              : "Create Account"}
          </button>
        </form>
      </section>
    </main>
  );
}
