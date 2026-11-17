export default function FilterBar({
  filters,
  onFilterChange,
  showFilters,
  onToggleFilters,
  onSearch,
  onApplyFilters,
  onResetFilters,
}) {
  return (
    <>
      <div className="expense-toolbar">
        <div className="search-box">
          <span>⌕</span>
          <input
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch(filters.search);
              }
            }}
            placeholder="Search expenses..."
          />
        </div>

        <button
          className={`filter-toggle ${showFilters ? "active" : ""}`}
          onClick={onToggleFilters}
        >
          ⚙ Filters
        </button>
      </div>

      {showFilters && (
        <form className="advanced-filters" onSubmit={onApplyFilters}>
          <label>
            Category
            <input
              value={filters.category}
              onChange={(e) => onFilterChange("category", e.target.value)}
              placeholder="Food"
            />
          </label>

          <label>
            Start date
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => onFilterChange("startDate", e.target.value)}
            />
          </label>

          <label>
            End date
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => onFilterChange("endDate", e.target.value)}
            />
          </label>

          <label>
            Sort
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange("sortBy", e.target.value)}
            >
              <option value="">Newest default</option>
              <option value="amount">Amount</option>
              <option value="date">Date</option>
              <option value="title">Title</option>
              <option value="category">Category</option>
            </select>
          </label>

          <div className="filter-actions">
            <button className="secondary-button" type="submit">
              Apply
            </button>
            <button
              className="text-button"
              type="button"
              onClick={onResetFilters}
            >
              Reset
            </button>
          </div>
        </form>
      )}
    </>
  );
}
