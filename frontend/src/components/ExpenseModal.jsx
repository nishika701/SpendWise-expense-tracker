export default function ExpenseModal({
  isOpen,
  editingId,
  form,
  onFormChange,
  onSave,
  onClose,
  loading,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="expense-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-heading">
          <div>
            <p className="eyebrow">
              {editingId ? "Update transaction" : "New transaction"}
            </p>
            <h2>{editingId ? "Edit Expense" : "Add Expense"}</h2>
          </div>
          <button className="close-button" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>

        <form onSubmit={onSave}>
          <label>
            What did you spend on?
            <input
              value={form.title}
              onChange={(e) => onFormChange("title", e.target.value)}
              placeholder="Groceries, Uber, Netflix..."
              required
              autoFocus
            />
          </label>

          <div className="form-row">
            <label>
              Amount
              <div className="amount-input">
                <span>₹</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => onFormChange("amount", e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
            </label>

            <label>
              Date
              <input
                type="date"
                value={form.date}
                onChange={(e) => onFormChange("date", e.target.value)}
                required
              />
            </label>
          </div>

          <label>
            Category <span className="optional-tag">(optional)</span>
            <input
              value={form.category}
              onChange={(e) => onFormChange("category", e.target.value)}
              placeholder="Food (leave blank for Uncategorized)"
            />
          </label>

          <div className="modal-actions">
            <button
              className="ghost-button"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="primary-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Save Changes"
                : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
