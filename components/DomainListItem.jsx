import Link from 'next/link';

function formatDate(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

export default function DomainListItem({ domain }) {
  return (
    <Link
      href={`/dashboard/${encodeURIComponent(domain.domain)}`}
      className="group flex items-center justify-between gap-4 border-b border-hairline px-5 py-4 transition-colors last:border-b-0 hover:bg-white/[0.03]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="status-dot bg-mint" aria-hidden="true" />
        <div className="min-w-0">
          <p className="truncate font-mono text-sm text-paper">{domain.domain}</p>
          <p className="text-xs text-steel">Registered {formatDate(domain.registeredAt)}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-4 text-xs text-steel">
        <span className="hidden font-mono sm:inline">
          {domain.autoRenew ? 'Auto-renew on' : 'Auto-renew off'}
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-steel transition-transform group-hover:translate-x-0.5">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  );
}
