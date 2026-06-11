import { Search, SlidersHorizontal, X } from 'lucide-react';

export default function SearchFilterBar({ filters, setFilters }) {
  const { search, status, dateFrom, dateTo, sort } = filters;

  const update = (key, val) => setFilters(f => ({ ...f, [key]: val }));

  const reset = () =>
    setFilters({ search: '', status: '', dateFrom: '', dateTo: '', sort: 'newest' });

  const hasFilters = search || status || dateFrom || dateTo || sort !== 'newest';

  return (
    <div className="card space-y-4">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-primary-400" />
        <span className="text-sm font-semibold text-dark-text">Search & Filter</span>
        {hasFilters && (
          <button
            onClick={reset}
            className="ml-auto flex items-center gap-1 text-xs text-dark-muted hover:text-red-400 transition-colors"
            id="reset-filters-btn"
          >
            <X className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title or client..."
            value={search}
            onChange={(e) => update('search', e.target.value)}
            className="input pl-9"
            id="search-input"
          />
        </div>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => update('status', e.target.value)}
          className="input"
          id="status-filter"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => update('sort', e.target.value)}
          className="input"
          id="sort-select"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        {/* Date From */}
        <div>
          <label className="label">From Date</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => update('dateFrom', e.target.value)}
            className="input"
            id="date-from"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="label">To Date</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => update('dateTo', e.target.value)}
            className="input"
            id="date-to"
          />
        </div>
      </div>
    </div>
  );
}
