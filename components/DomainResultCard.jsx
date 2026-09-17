'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import StatusBadge from './StatusBadge';
import { formatPrice } from '@/lib/domain';

function extractInfo(result) {
  // Upstream shape: { success, result: { info: {...} } }
  return result?.result?.info || null;
}

export default function DomainResultCard({ item, onRegister, registering }) {
  const { isAuthenticated } = useAuth();
  const failed = item.success === false;
  const info = !failed ? extractInfo(item.result) : null;
  const status = failed ? 'ERROR' : info?.status;
  const available = status === 'AVAILABLE';

  return (
    <div className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-col gap-1.5">
        <span className="truncate font-mono text-base text-paper">{item.domain}</span>
        <div className="flex items-center gap-3">
          <StatusBadge status={status} />
          {info?.isPremium ? (
            <span className="rounded-full border border-hairline px-2 py-0.5 font-mono text-[10px] text-steel">
              premium
            </span>
          ) : null}
        </div>
        {failed ? (
          <p className="text-xs text-steel">{item.error?.message || 'Could not check this TLD.'}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-4">
        {available && typeof info?.price === 'number' ? (
          <span className="font-mono text-lg text-paper">
            {formatPrice(info.price, info.currency)}
            <span className="ml-1 text-xs text-steel">/yr</span>
          </span>
        ) : null}

        {available ? (
          isAuthenticated ? (
            <button
              onClick={() => onRegister?.(item.domain)}
              disabled={registering}
              className="btn-chrome !px-5 !py-2.5 text-xs"
            >
              {registering ? 'Registering…' : 'Register'}
            </button>
          ) : (
            <Link href={`/login?next=/search?domain=${encodeURIComponent(item.domain)}`} className="btn-ghost !px-5 !py-2.5 text-xs">
              Sign in to register
            </Link>
          )
        ) : null}
      </div>
    </div>
  );
}
