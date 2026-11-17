import { formatMoney, getCategoryIcon } from "../utils/formatters";

export default function CategoryBreakdown({
  categoryEntries,
  onRefresh,
}) {
  return (
    <article className="dashboard-card category-card">
      <div className="card-heading">
        <div>
          <h2>Spending by Category</h2>
          <p>Where your money is going.</p>
        </div>

        <button
          className="icon-button"
          onClick={onRefresh}
          title="Refresh"
        >
          ↻
        </button>
      </div>

      {categoryEntries.length === 0 ? (
        <div className="category-empty">
          <span>📊</span>
          <p>No category data yet.</p>
        </div>
      ) : (
        <div className="category-list">
          {categoryEntries.slice(0, 5).map(([category, total]) => {
            const max = Number(categoryEntries[0][1]) || 1;
            const percentage = (Number(total) / max) * 100;

            return (
              <div className="category-item" key={category}>
                <div className="category-info">
                  <div className="category-name">
                    <span className="category-icon">
                      {getCategoryIcon(category)}
                    </span>
                    <span>{category}</span>
                  </div>
                  <strong>{formatMoney(total)}</strong>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-bar"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}
