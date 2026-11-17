import { formatMoney } from "../utils/formatters";

export default function SpendingOverview({
  monthlyFilter,
  onMonthChange,
  onYearChange,
  onYearBlur,
  monthlyTotal,
}) {
  return (
    <article className="dashboard-card overview-card">
      <div className="card-heading">
        <div>
          <h2>Spending Overview</h2>
          <p>Your spending for the selected month.</p>
        </div>

        <div className="month-selector">
          <select
            value={monthlyFilter.month}
            onChange={(e) => onMonthChange(e.target.value)}
          >
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {new Date(2000, index).toLocaleString("en", {
                  month: "long",
                })}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="2000"
            value={monthlyFilter.year}
            onChange={(e) => onYearChange(e.target.value)}
            onBlur={onYearBlur}
          />
        </div>
      </div>

      <div className="overview-content">
        <div className="big-number">{formatMoney(monthlyTotal)}</div>
        <span className="overview-label">total spending</span>

        <div className="fake-chart">
          <div className="chart-line">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="chart-labels">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
          </div>
        </div>
      </div>
    </article>
  );
}
