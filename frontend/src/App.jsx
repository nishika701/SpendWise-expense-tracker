import { useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import AuthView from "./components/AuthView";
import StatusBanner from "./components/StatusBanner";
import StatCards from "./components/StatCards";
import SpendingOverview from "./components/SpendingOverview";
import CategoryBreakdown from "./components/CategoryBreakdown";
import FilterBar from "./components/FilterBar";
import ExpenseTable from "./components/ExpenseTable";
import ExpenseModal from "./components/ExpenseModal";
import { authApi, expenseApi, setUnauthorizedHandler } from "./services/api";
import { getGreeting, getNameFromToken } from "./utils/formatters";

const defaultExpenseForm = {
  title: "",
  amount: "",
  category: "",
  date: new Date().toISOString().slice(0, 10),
};

export default function App() {
  const [token, setToken] = useState(
    () => localStorage.getItem("spendwise_token") || ""
  );

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("spendwise_theme") === "dark"
  );

  const [expenses, setExpenses] = useState([]);
  const [categoryTotals, setCategoryTotals] = useState({});
  const [monthlyTotal, setMonthlyTotal] = useState(0);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    startDate: "",
    endDate: "",
    sortBy: "",
  });

  const [monthlyFilter, setMonthlyFilter] = useState({
    month: String(new Date().getMonth() + 1),
    year: String(new Date().getFullYear()),
  });

  const [expenseForm, setExpenseForm] = useState(defaultExpenseForm);
  const [editingId, setEditingId] = useState(null);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Setup auto-logout on 401 token expiration
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setToken("");
      setExpenses([]);
      setCategoryTotals({});
      setMonthlyTotal(0);
      setError("Your session has expired. Please log in again.");
    });
  }, []);

  // Sync dark mode class and storage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("spendwise_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Load dashboard data when token is valid
  useEffect(() => {
    if (!token) return;
    loadDashboardData();
  }, [token]);

  async function loadDashboardData() {
    await Promise.all([
      loadExpenses(),
      loadCategoryTotals(),
      loadMonthlyTotal(),
    ]);
  }

  function showMessage(text) {
    setMessage(text);
    setError("");
  }

  function showError(err) {
    setError(err.message || "Something went wrong");
    setMessage("");
  }

  function clearAlerts() {
    setMessage("");
    setError("");
  }

  // --- Auth Handlers ---
  async function handleLogin(credentials) {
    setLoading(true);
    clearAlerts();
    try {
      const jwtToken = await authApi.login(credentials);
      localStorage.setItem("spendwise_token", jwtToken);
      setToken(jwtToken);
      showMessage("Welcome back!");
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(userData, onSuccess) {
    setLoading(true);
    clearAlerts();
    try {
      await authApi.register(userData);
      showMessage("Account created successfully. You can now log in.");
      if (onSuccess) onSuccess();
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("spendwise_token");
    setToken("");
    setExpenses([]);
    setCategoryTotals({});
    setMonthlyTotal(0);
    clearAlerts();
  }

  // --- Data Fetching ---
  async function loadExpenses(customFilters = filters) {
    setLoading(true);
    try {
      const list = await expenseApi.getAll(customFilters, token);
      setExpenses(Array.isArray(list) ? list : []);
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadCategoryTotals() {
    try {
      const totals = await expenseApi.getCategoryTotals(token);
      setCategoryTotals(totals || {});
    } catch (err) {
      showError(err);
    }
  }

  async function loadMonthlyTotal(filter = monthlyFilter) {
    try {
      const total = await expenseApi.getMonthlyTotal(filter.month, filter.year, token);
      setMonthlyTotal(Number(total || 0));
    } catch (err) {
      showError(err);
    }
  }

  // --- Expense CRUD Handlers ---
  async function handleSaveExpense(event) {
    event.preventDefault();
    const payload = {
      ...expenseForm,
      amount: Number(expenseForm.amount),
      category: expenseForm.category.trim() || "Uncategorized",
    };

    setLoading(true);
    try {
      if (editingId) {
        await expenseApi.update(editingId, payload, token);
        showMessage("Expense updated successfully.");
      } else {
        await expenseApi.create(payload, token);
        showMessage("Expense added successfully.");
      }

      closeModal();
      await loadDashboardData();
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  }

  function handleEditExpense(expense) {
    setEditingId(expense.id);
    setExpenseForm({
      title: expense.title || "",
      amount: String(expense.amount || ""),
      category: expense.category || "",
      date: expense.date || defaultExpenseForm.date,
    });
    setShowExpenseModal(true);
  }

  async function handleDeleteExpense(id) {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    setLoading(true);
    try {
      await expenseApi.delete(id, token);
      showMessage("Expense deleted successfully.");
      await loadDashboardData();
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  }

  // --- Filter Handlers ---
  function handleFilterChange(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSearch(searchTerm) {
    if (!searchTerm.trim()) {
      loadExpenses();
      return;
    }
    setLoading(true);
    try {
      const list = await expenseApi.search(searchTerm, token);
      setExpenses(Array.isArray(list) ? list : []);
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApplyFilters(event) {
    event.preventDefault();
    if (filters.search.trim()) {
      handleSearch(filters.search);
      return;
    }

    if (filters.category.trim()) {
      setLoading(true);
      try {
        const list = await expenseApi.getByCategory(filters.category, token);
        setExpenses(Array.isArray(list) ? list : []);
      } catch (err) {
        showError(err);
      } finally {
        setLoading(false);
      }
      return;
    }

    loadExpenses(filters);
  }

  function handleResetFilters() {
    const reset = {
      search: "",
      category: "",
      startDate: "",
      endDate: "",
      sortBy: "",
    };
    setFilters(reset);
    loadExpenses(reset);
  }

  function openAddExpense() {
    setEditingId(null);
    setExpenseForm(defaultExpenseForm);
    setShowExpenseModal(true);
  }

  function closeModal() {
    setShowExpenseModal(false);
    setEditingId(null);
    setExpenseForm(defaultExpenseForm);
  }

  // --- Computed Metrics ---
  const totalSpend = useMemo(
    () => expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [expenses]
  );

  const categoryEntries = useMemo(
    () =>
      Object.entries(categoryTotals).sort(
        (a, b) => Number(b[1]) - Number(a[1])
      ),
    [categoryTotals]
  );

  const highestCategory = useMemo(() => {
    if (!categoryEntries.length) return "No data";
    return categoryEntries[0][0];
  }, [categoryEntries]);

  const userName = useMemo(() => (token ? getNameFromToken(token) : ""), [token]);

  // If unauthenticated, render Auth View
  if (!token) {
    return (
      <AuthView
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((prev) => !prev)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        loading={loading}
        message={message}
        error={error}
      />
    );
  }

  // Authenticated Dashboard
  return (
    <main className="app-shell">
      <Navbar
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((prev) => !prev)}
        onAddExpense={openAddExpense}
        onLogout={handleLogout}
      />

      <div className="dashboard">
        <StatusBanner
          message={message}
          error={error}
          onClose={clearAlerts}
        />

        <section className="welcome-section">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1>
              {getGreeting()}, {userName} 👋
            </h1>
            <p>Here's a quick look at your spending.</p>
          </div>

          <button className="primary-button desktop-add" onClick={openAddExpense}>
            + Add Expense
          </button>
        </section>

        <StatCards
          monthlyTotal={monthlyTotal}
          totalSpend={totalSpend}
          transactionCount={expenses.length}
          highestCategory={highestCategory}
        />

        <section className="analytics-grid">
          <SpendingOverview
            monthlyFilter={monthlyFilter}
            onMonthChange={(month) => {
              const next = { ...monthlyFilter, month };
              setMonthlyFilter(next);
              loadMonthlyTotal(next);
            }}
            onYearChange={(year) => {
              setMonthlyFilter((prev) => ({ ...prev, year }));
            }}
            onYearBlur={() => loadMonthlyTotal(monthlyFilter)}
            monthlyTotal={monthlyTotal}
          />

          <CategoryBreakdown
            categoryEntries={categoryEntries}
            onRefresh={loadCategoryTotals}
          />
        </section>

        <section className="dashboard-card expenses-card">
          <div className="expenses-header">
            <div>
              <h2>Recent Expenses</h2>
              <p>Keep track of your latest transactions.</p>
            </div>
            <button className="text-button" onClick={() => loadExpenses()}>
              Refresh ↻
            </button>
          </div>

          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters((prev) => !prev)}
            onSearch={handleSearch}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />

          <ExpenseTable
            expenses={expenses}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
            onAddExpense={openAddExpense}
          />
        </section>
      </div>

      <ExpenseModal
        isOpen={showExpenseModal}
        editingId={editingId}
        form={expenseForm}
        onFormChange={(field, val) =>
          setExpenseForm((prev) => ({ ...prev, [field]: val }))
        }
        onSave={handleSaveExpense}
        onClose={closeModal}
        loading={loading}
      />
    </main>
  );
}
