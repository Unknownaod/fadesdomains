'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { cleanDomain, isValidDomain } from '@/lib/domain';
import SearchBar from './SearchBar';
import DomainResultCard from './DomainResultCard';

export default function SearchResults() {
  const params = useSearchParams();
  const router = useRouter();
  const { token } = useAuth();
  const rawQuery = params.get('domain') || '';

  const [primary, setPrimary] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registeringDomain, setRegisteringDomain] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!rawQuery) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    setNotice(null);
    setPrimary(null);
    setAlternatives([]);

    const cleaned = cleanDomain(rawQuery);

    async function run() {
      try {
        const tasks = [];

        if (isValidDomain(cleaned)) {
          tasks.push(
            api
              .search(cleaned)
              .then((res) => ({ domain: res.domain, success: true, result: res.result }))
              .catch((err) => ({ domain: cleaned, success: false, error: { message: err.message } }))
          );
        }

        const many = api
          .searchMany(rawQuery)
          .then((res) => res.results || [])
          .catch(() => []);

        const [primaryResult, manyResults] = await Promise.all([
          tasks.length ? tasks[0] : Promise.resolve(null),
          many,
        ]);

        if (cancelled) return;

        setPrimary(primaryResult);
        setAlternatives(manyResults.filter((r) => r.domain !== primaryResult?.domain));
      } catch (err) {
        if (!cancelled) setError(err.message || 'Something went wrong searching that name.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [rawQuery]);

  async function handleRegister(domain) {
    setRegisteringDomain(domain);
    setNotice(null);
    try {
      await api.registerDomain(token, domain);
      setNotice({ type: 'success', message: `${domain} is registered. View it in your dashboard.` });
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Registration failed.' });
    } finally {
      setRegisteringDomain(null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <SearchBar initialValue={rawQuery} size="md" />

      {!rawQuery && (
        <p className="mt-10 text-center text-sm text-steel">
          Search a name above to see live availability.
        </p>
      )}

      {notice && (
        <div
          className={`mt-6 rounded-xl border px-4 py-3 text-sm ${
            notice.type === 'success'
              ? 'border-mint/30 bg-mint/[0.06] text-mint'
              : 'border-rust/30 bg-rust/[0.06] text-rust'
          }`}
        >
          {notice.message}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-xl border border-rust/30 bg-rust/[0.06] px-4 py-3 text-sm text-rust">
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-10 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="panel h-20 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && primary && (
        <div className="mt-10">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-haze">
            Exact match
          </h2>
          <DomainResultCard
            item={primary}
            onRegister={handleRegister}
            registering={registeringDomain === primary.domain}
          />
        </div>
      )}

      {!loading && alternatives.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-haze">
            Other extensions
          </h2>
          <div className="space-y-3">
            {alternatives.map((item) => (
              <DomainResultCard
                key={item.domain}
                item={item}
                onRegister={handleRegister}
                registering={registeringDomain === item.domain}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
