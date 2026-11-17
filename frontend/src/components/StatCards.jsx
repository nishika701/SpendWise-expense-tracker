import { formatMoney, getCategoryIcon } from "../utils/formatters";

export default function StatCards({
  monthlyTotal,
  totalSpend,
  transactionCount,
  highestCategory,
}) {
  return (
    <section className="summary-grid">
      <article className="metric primary-metric">
        <div className="metric-top">
          <span>This Month</span>
          <div className="metric-icon">₹</div>
        </div>
        <strong>{formatMoney(monthlyTotal)}</strong>
        <small>Current month spending</small>
      </article>

      <article className="metric">
        <div className="metric-top">
          <span>Visible Spend</span>
          <div className="metric-icon soft">₹</div>
        </div>
        <strong>{formatMoney(totalSpend)}</strong>
        <small>Based on current results</small>
      </article>

      <article className="metric">
        <div className="metric-top">
          <span>Transactions</span>
          <div className="metric-icon soft">↗</div>
        </div>
        <strong>{transactionCount}</strong>
        <small>Expenses shown</small>
      </article>

      <article className="metric">
        <div className="metric-top">
          <span>Top Category</span>
          <div className="metric-icon soft">
            {getCategoryIcon(highestCategory)}
          </div>
        </div>
        <strong className="category-value">{highestCategory}</strong>
        <small>Highest spending category</small>
      </article>
    </section>
  );
}
