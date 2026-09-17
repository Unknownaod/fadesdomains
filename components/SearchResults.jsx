'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { cleanDomain, isValidDomain } from '@/lib/domain';
import SearchBar from './SearchBar';
import DomainResultCard from './DomainResultCard';

function normalizeResult(item) {
if (!item) return null;

const info = item?.result?.info || {};
const result = item?.result || {};

return {
...item,


domain: item.domain || result?.info?.domainName || '',
success: item.success !== false,

status:
  info.status ||
  result.status ||
  (item.success === false ? 'UNKNOWN' : 'UNKNOWN'),

price:
  info.price ??
  result.price ??
  null,

currency:
  info.currency ||
  result.currency ||
  'USD',

period:
  info.period ??
  result.period ??
  1,

isPremium:
  info.isPremium ??
  result.isPremium ??
  false,

isDocumentRequired:
  info.isDocumentRequired ??
  result.isDocumentRequired ??
  false,

reason:
  info.reason ||
  result.reason ||
  item?.error?.message ||
  null,

error:
  item.success === false
    ? item.error || {
        code: 'DOMAIN_SEARCH_FAILED',
        message: 'This domain could not be checked right now.',
      }
    : null,


};
}

export default function SearchResults() {
const { token } = useAuth();
const rawQuery = new URLSearchParams(
typeof window !== 'undefined' ? window.location.search : ''
).get('domain') || '';

const [primary, setPrimary] = useState(null);
const [alternatives, setAlternatives] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [registeringDomain, setRegisteringDomain] = useState(null);
const [notice, setNotice] = useState(null);

useEffect(() => {
if (!rawQuery) {
setPrimary(null);
setAlternatives([]);
return;
}


let cancelled = false;

setLoading(true);
setError(null);
setNotice(null);
setPrimary(null);
setAlternatives([]);

const cleaned = cleanDomain(rawQuery);

async function run() {
  try {
    let primaryResult = null;

    /*
     * If the user entered a complete domain such as fades.com,
     * check that exact domain separately.
     */
    if (isValidDomain(cleaned)) {
      try {
        const res = await api.search(cleaned);

        primaryResult = normalizeResult({
          domain: res.domain,
          success: true,
          result: res.result,
        });
      } catch (err) {
        primaryResult = normalizeResult({
          domain: cleaned,
          success: false,
          error: {
            message:
              err?.message ||
              'Unable to check this domain right now.',
          },
        });
      }
    }

    /*
     * Search all configured extensions.
     *
     * The backend expects:
     * /api/domains/search-many?domain=fades
     */
    let manyResults = [];

    try {
      const many = await api.searchMany(rawQuery);

      manyResults = Array.isArray(many?.results)
        ? many.results.map(normalizeResult).filter(Boolean)
        : [];
    } catch (err) {
      /*
       * Don't hide a genuine API error if the multi-search itself
       * fails completely.
       */
      if (!primaryResult) {
        throw err;
      }
    }

    if (cancelled) return;

    /*
     * If the multi-TLD search contains the exact domain, use its
     * richer result as the primary result.
     */
    if (primaryResult) {
      const matching = manyResults.find(
        (item) =>
          item.domain.toLowerCase() ===
          primaryResult.domain.toLowerCase()
      );

      if (matching) {
        primaryResult = matching;
      }
    }

    setPrimary(primaryResult);

    /*
     * Don't show the same domain twice.
     */
    setAlternatives(
      manyResults.filter(
        (item) =>
          item.domain.toLowerCase() !==
          primaryResult?.domain?.toLowerCase()
      )
    );
  } catch (err) {
    if (!cancelled) {
      setError(
        err?.message ||
          'Something went wrong searching that name.'
      );
    }
  } finally {
    if (!cancelled) {
      setLoading(false);
    }
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

  setNotice({
    type: 'success',
    message: `${domain} is registered. View it in your dashboard.`,
  });
} catch (err) {
  setNotice({
    type: 'error',
    message: err?.message || 'Registration failed.',
  });
} finally {
  setRegisteringDomain(null);
}


}

return ( <div className="mx-auto max-w-3xl px-6 py-16"> <SearchBar initialValue={rawQuery} size="md" />


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

  {!loading &&
    !primary &&
    alternatives.length === 0 &&
    rawQuery &&
    !error && (
      <div className="mt-10 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-6 text-center">
        <p className="text-sm text-haze">
          No domain results were returned.
        </p>
      </div>
    )}
</div>


);
}
