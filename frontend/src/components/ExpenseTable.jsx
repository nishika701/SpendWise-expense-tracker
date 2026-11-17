import { formatDate, formatMoney, getCategoryIcon } from "../utils/formatters";

export default function ExpenseTable({
  expenses,
  onEdit,
  onDelete,
  onAddExpense,
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Expense</th>
            <th>Category</th>
            <th>Date</th>
            <th className="amount-cell">Amount</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {expenses.length === 0 ? (
            <tr>
              <td colSpan="5">
                <div className="empty-state">
                  <div className="empty-icon">₹</div>
                  <h3>No expenses found</h3>
                  <p>Add your first expense to start tracking your spending.</p>
                  <button className="primary-button" onClick={onAddExpense}>
                    + Add Expense
                  </button>
                </div>
              </td>
            </tr>
          ) : (
            expenses.map((expense) => (
              <tr key={expense.id}>
                <td>
                  <div className="expense-name">
                    <div className="expense-icon">
                      {getCategoryIcon(expense.category)}
                    </div>
                    <div>
                      <strong>{expense.title}</strong>
                      <span>{expense.category || "Uncategorized"}</span>
                    </div>
                  </div>
                </td>

                <td>
                  <span className="category-pill">
                    {expense.category || "Uncategorized"}
                  </span>
                </td>

                <td className="date-cell">{formatDate(expense.date)}</td>

                <td className="amount-cell expense-amount">
                  {formatMoney(expense.amount)}
                </td>

                <td>
                  <div className="row-actions">
                    <button
                      className="row-action"
                      onClick={() => onEdit(expense)}
                      title="Edit"
                      aria-label="Edit expense"
                    >
                      ✎
                    </button>
                    <button
                      className="row-action danger"
                      onClick={() => onDelete(expense.id)}
                      title="Delete"
                      aria-label="Delete expense"
                    >
                      ×
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
