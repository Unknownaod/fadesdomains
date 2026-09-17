'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { cleanDomain, isValidDomain } from '@/lib/domain';
import SearchBar from './SearchBar';
import DomainResultCard from './DomainResultCard';

function normalizeResult(item) {
  const result = item?.result || {};
  const info = result?.info || {};

  return {
    domain:
      item?.domain ||
      info?.domainName ||
      '',

    success:
      item?.success !== false,

    status:
      info?.status ||
      result?.status ||
      'UNKNOWN',

    price:
      typeof info?.price === 'number'
        ? info.price
        : typeof result?.price === 'number'
          ? result.price
          : null,

    currency:
      info?.currency ||
      result?.currency ||
      'USD',

    period:
      info?.period ||
      result?.period ||
      1,

    isPremium:
      info?.isPremium ??
      result?.isPremium ??
      false,

    isDocumentRequired:
      info?.isDocumentRequired ??
      result?.isDocumentRequired ??
      false,

    reason:
      info?.reason ||
      result?.reason ||
      null,

    error:
      item?.error ||
      null,

    // Keep the original upstream response available.
    result,
  };
}

export default function SearchResults() {
  const params = useSearchParams();
  const { token } = useAuth();

  const rawQuery =
    params.get('domain') || '';

  const [primary, setPrimary] =
    useState(null);

  const [alternatives, setAlternatives] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [registeringDomain, setRegisteringDomain] =
    useState(null);

  const [notice, setNotice] =
    useState(null);

  /*
   * Search domains whenever the URL query changes.
   */
  useEffect(() => {
    if (!rawQuery) {
      setPrimary(null);
      setAlternatives([]);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    setLoading(true);
    setError(null);
    setNotice(null);
    setPrimary(null);
    setAlternatives([]);

    const cleaned =
      cleanDomain(rawQuery);

    async function runSearch() {
      try {
        let exactResult = null;

        /*
         * If the user entered a complete domain,
         * perform an exact availability lookup.
         */
        if (isValidDomain(cleaned)) {
          try {
            console.log(
              '[Fades Domains] Exact search:',
              cleaned
            );

            const res =
              await api.search(cleaned);

            exactResult =
              normalizeResult({
                domain:
                  res?.domain ||
                  cleaned,

                success: true,

                result:
                  res?.result ||
                  res,
              });
          } catch (err) {
            console.error(
              '[Fades Domains] Exact search failed:',
              err
            );

            exactResult =
              normalizeResult({
                domain: cleaned,

                success: false,

                error: {
                  message:
                    err?.message ||
                    'Domain search failed.',
                },
              });
          }
        }

        /*
         * Search multiple TLDs as well.
         */
        let manyResults = [];

        try {
          console.log(
            '[Fades Domains] Multi-TLD search:',
            rawQuery
          );

          const many =
            await api.searchMany(
              rawQuery
            );

          manyResults = (
            many?.results || []
          ).map(normalizeResult);
        } catch (err) {
          console.error(
            '[Fades Domains] Search-many failed:',
            err
          );
        }

        if (cancelled) {
          return;
        }

        /*
         * For a full domain, use the exact result.
         *
         * For a bare name such as "fades",
         * use the first multi-TLD result.
         */
        let finalPrimary =
          exactResult;

        if (
          !finalPrimary &&
          manyResults.length > 0
        ) {
          finalPrimary =
            manyResults[0];
        }

        /*
         * If multi-search contains the exact
         * domain, prefer that normalized result.
         */
        if (finalPrimary?.domain) {
          const matchingMany =
            manyResults.find(
              (item) =>
                item.domain?.toLowerCase() ===
                finalPrimary.domain?.toLowerCase()
            );

          if (matchingMany) {
            finalPrimary =
              matchingMany;
          }
        }

        const finalAlternatives =
          manyResults.filter(
            (item) =>
              item.domain?.toLowerCase() !==
              finalPrimary?.domain?.toLowerCase()
          );

        setPrimary(finalPrimary);
        setAlternatives(
          finalAlternatives
        );
      } catch (err) {
        console.error(
          '[Fades Domains] Search error:',
          err
        );

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

    runSearch();

    return () => {
      cancelled = true;
    };
  }, [rawQuery]);

  /*
   * Register a domain.
   *
   * This deliberately does NOT log the JWT.
   */
  async function handleRegister(domain) {
    console.log(
      '[Fades Domains] REGISTER BUTTON CLICKED'
    );

    console.log(
      '[Fades Domains] Register domain:',
      domain
    );

    console.log(
      '[Fades Domains] Authentication token available:',
      Boolean(token)
    );

    /*
     * Validate the domain before making the API call.
     */
    if (!domain) {
      console.error(
        '[Fades Domains] Registration stopped: no domain provided.'
      );

      setNotice({
        type: 'error',
        message:
          'No domain was provided.',
      });

      return;
    }

    /*
     * Authentication is required.
     */
    if (!token) {
      console.error(
        '[Fades Domains] Registration stopped: no authentication token.'
      );

      setNotice({
        type: 'error',
        message:
          'Please sign in before registering a domain.',
      });

      return;
    }

    setRegisteringDomain(domain);
    setNotice(null);

    try {
      console.log(
        '[Fades Domains] Calling api.registerDomain()...'
      );

      console.log(
        '[Fades Domains] API endpoint should be:',
        'POST /api/domains/register'
      );

      const result =
        await api.registerDomain(
          token,
          domain
        );

      console.log(
        '[Fades Domains] REGISTER SUCCESS:',
        result
      );

      setNotice({
        type: 'success',
        message:
          `${domain} is registered. View it in your dashboard.`,
      });
    } catch (err) {
      console.error(
        '[Fades Domains] REGISTER ERROR:',
        err
      );

      console.error(
        '[Fades Domains] REGISTER ERROR MESSAGE:',
        err?.message
      );

      console.error(
        '[Fades Domains] REGISTER ERROR STATUS:',
        err?.status
      );

      console.error(
        '[Fades Domains] REGISTER ERROR CODE:',
        err?.code
      );

      console.error(
        '[Fades Domains] REGISTER ERROR DATA:',
        err?.data
      );

      setNotice({
        type: 'error',
        message:
          err?.message ||
          'Registration failed.',
      });
    } finally {
      setRegisteringDomain(null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <SearchBar
        initialValue={rawQuery}
        size="md"
      />

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
            <div
              key={i}
              className="panel h-20 animate-pulse"
            />
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
            registering={
              registeringDomain ===
              primary.domain
            }
          />
        </div>
      )}

      {!loading &&
        alternatives.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-haze">
              Other extensions
            </h2>

            <div className="space-y-3">
              {alternatives.map(
                (item) => (
                  <DomainResultCard
                    key={item.domain}
                    item={item}
                    onRegister={
                      handleRegister
                    }
                    registering={
                      registeringDomain ===
                      item.domain
                    }
                  />
                )
              )}
            </div>
          </div>
        )}

      {!loading &&
        !primary &&
        alternatives.length === 0 &&
        rawQuery && (
          <div className="mt-10 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-6 text-center">
            <p className="text-sm text-steel">
              No domain results were returned.
            </p>
          </div>
        )}
    </div>
  );
}
