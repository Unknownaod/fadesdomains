export default function Logo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className="flex h-7 w-7 items-center justify-center rounded-md bg-chrome text-[13px] font-bold text-ink shadow-chrome"
        aria-hidden="true"
      >
        F
      </span>
      <span className="text-[15px] font-semibold tracking-tightish text-paper">
        Fades <span className="text-steel">Domains</span>
      </span>
    </span>
  );
}
