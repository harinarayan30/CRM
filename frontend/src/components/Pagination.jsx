import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show at most 5 pages
  const visible = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2
  );

  // Insert ellipsis
  const items = [];
  let prev = 0;
  for (const p of visible) {
    if (p - prev > 1) items.push('...');
    items.push(p);
    prev = p;
  }

  return (
    <div className="flex items-center justify-center gap-1" id="pagination">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-xl text-dark-muted hover:text-dark-text hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {items.map((item, i) =>
        item === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-dark-muted text-sm">…</span>
        ) : (
          <button
            key={item}
            onClick={() => onChange(item)}
            className={`w-9 h-9 rounded-xl text-sm font-medium transition-all
              ${item === page
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/30'
                : 'text-dark-muted hover:text-dark-text hover:bg-white/5'
              }`}
          >
            {item}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-xl text-dark-muted hover:text-dark-text hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
