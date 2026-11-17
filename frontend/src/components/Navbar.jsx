export default function Navbar({ darkMode, onToggleTheme, onAddExpense, onLogout }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">
          <div className="brand-mark small">S</div>
          <div>
            <strong>SpendWise</strong>
            <span>Personal finance</span>
          </div>
        </div>

        <nav className="topbar-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            title="Toggle dark mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <button className="header-add" onClick={onAddExpense}>
            <span>+</span>
            Add Expense
          </button>

          <button className="profile-button" onClick={onLogout}>
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
