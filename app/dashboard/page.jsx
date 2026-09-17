'use client';

import { useEffect, useState } from 'react';
import RequireAuth from '@/components/RequireAuth';
import DomainListItem from '@/components/DomainListItem';
import SearchBar from '@/components/SearchBar';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

function DashboardBody() {
  const { token, user } = useAuth();
  const [domains, setDomains] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    api
      .listDomains(token)
      .then((res) => {
        if (!cancelled) setDomains(res.domains || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Could not load your domains.');
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-10 flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tightish text-paper">
          {user?.name ? `${user.name}'s domains` : 'Your domains'}
        </h1>
        <p className="text-sm text-steel">Everything you own through Fades Domains, in one place.</p>
      </div>

      <div className="mb-8">
        <SearchBar size="md" />
      </div>

      {error && (
        <div className="rounded-xl border border-rust/30 bg-rust/[0.06] px-4 py-3 text-sm text-rust">
          {error}
        </div>
      )}

      {domains === null && !error && (
        <div className="panel h-16 animate-pulse" />
      )}

      {domains && domains.length === 0 && (
        <div className="panel flex flex-col items-center gap-3 px-8 py-16 text-center">
          <p className="text-sm text-steel">You don&rsquo;t own any domains yet.</p>
          <p className="text-xs text-haze">Search above to find one worth registering.</p>
        </div>
      )}

      {domains && domains.length > 0 && (
        <div className="panel">
          {domains.map((domain) => (
            <DomainListItem key={domain.id} domain={domain} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardBody />
    </RequireAuth>
  );
}
