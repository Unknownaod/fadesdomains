const STATUS_STYLES = {
  AVAILABLE: { dot: 'bg-mint', text: 'text-mint', label: 'Available' },
  UNAVAILABLE: { dot: 'bg-rust', text: 'text-rust', label: 'Taken' },
  TAKEN: { dot: 'bg-rust', text: 'text-rust', label: 'Taken' },
  ERROR: { dot: 'bg-rust', text: 'text-rust', label: 'Unavailable to check' },
};

export default function StatusBadge({ status }) {
  const normalized = (status || '').toUpperCase();
  const style = STATUS_STYLES[normalized] || {
    dot: 'bg-steel',
    text: 'text-steel',
    label: status || 'Unknown',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-xs ${style.text}`}>
      <span className={`status-dot ${style.dot}`} />
      {style.label}
    </span>
  );
}
