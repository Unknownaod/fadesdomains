'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import RequireAuth from '@/components/RequireAuth';
import StatusBadge from '@/components/StatusBadge';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

function InlineNotice({ notice }) {
  if (!notice) return null;
  return (
    <div
      className={`rounded-lg border px-3 py-2 text-xs ${
        notice.type === 'error'
          ? 'border-rust/30 bg-rust/[0.06] text-rust'
          : 'border-mint/30 bg-mint/[0.06] text-mint'
      }`}
    >
      {notice.message}
    </div>
  );
}

function NameserversPanel({ token, domainName }) {
  const [nameservers, setNameservers] = useState(['', '']);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .getNameservers(token, domainName)
      .then((res) => {
        if (cancelled) return;
        const list = res?.result?.nameservers || res?.result;
        if (Array.isArray(list) && list.length) setNameservers(list);
      })
      .catch((err) => {
        if (!cancelled) setNotice({ type: 'error', message: err.message });
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [token, domainName]);

  function updateAt(i, value) {
    setNameservers((prev) => prev.map((ns, idx) => (idx === i ? value : ns)));
  }

  function addRow() {
    setNameservers((prev) => [...prev, '']);
  }

  function removeRow(i) {
    setNameservers((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setSaving(true);
    setNotice(null);
    try {
      await api.updateNameservers(token, domainName, nameservers.filter(Boolean));
      setNotice({ type: 'success', message: 'Nameservers updated.' });
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Could not update nameservers.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="panel p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-paper">Nameservers</h2>
      </div>

      {loading ? (
        <div className="h-16 animate-pulse rounded-lg bg-white/[0.03]" />
      ) : (
        <div className="flex flex-col gap-3">
          {nameservers.map((ns, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={ns}
                onChange={(e) => updateAt(i, e.target.value)}
                placeholder={`ns${i + 1}.example.com`}
                className="field font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => removeRow(i)}
                className="shrink-0 rounded-lg border border-hairline px-2.5 py-2 text-xs text-steel hover:text-rust"
                aria-label="Remove nameserver"
              >
                ×
              </button>
            </div>
          ))}

          <div className="mt-1 flex items-center justify-between">
            <button type="button" onClick={addRow} className="text-xs text-steel hover:text-paper">
              + Add nameserver
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="btn-chrome !px-4 !py-2 text-xs"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>

          <InlineNotice notice={notice} />
        </div>
      )}
    </div>
  );
}

const RECORD_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'TXT'];

function DnsPanel({ token, domainName }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .getDns(token, domainName)
      .then((res) => {
        if (cancelled) return;
        const list = res?.result?.records || res?.result;
        if (Array.isArray(list)) setRecords(list);
      })
      .catch((err) => {
        if (!cancelled) setNotice({ type: 'error', message: err.message });
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [token, domainName]);

  function updateRecord(i, patch) {
    setRecords((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  function addRecord() {
    setRecords((prev) => [...prev, { type: 'A', name: '@', value: '', ttl: 3600 }]);
  }

  function removeRecord(i) {
    setRecords((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setSaving(true);
    setNotice(null);
    try {
      await api.updateDns(token, domainName, records);
      setNotice({ type: 'success', message: 'DNS records updated.' });
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Could not update DNS records.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="panel p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-paper">DNS records</h2>
      </div>

      {loading ? (
        <div className="h-16 animate-pulse rounded-lg bg-white/[0.03]" />
      ) : (
        <div className="flex flex-col gap-3">
          {records.length === 0 && (
            <p className="text-xs text-steel">No records yet. Add one below.</p>
          )}

          {records.map((r, i) => (
            <div key={i} className="grid grid-cols-[80px_1fr_1fr_70px_28px] items-center gap-2">
              <select
                value={r.type}
                onChange={(e) => updateRecord(i, { type: e.target.value })}
                className="field !py-2 font-mono text-xs"
              >
                {RECORD_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <input
                value={r.name}
                onChange={(e) => updateRecord(i, { name: e.target.value })}
                placeholder="@"
                className="field !py-2 font-mono text-xs"
              />
              <input
                value={r.value}
                onChange={(e) => updateRecord(i, { value: e.target.value })}
                placeholder="value"
                className="field !py-2 font-mono text-xs"
              />
              <input
                type="number"
                value={r.ttl}
                onChange={(e) => updateRecord(i, { ttl: Number(e.target.value) })}
                className="field !py-2 font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => removeRecord(i)}
                className="rounded-lg border border-hairline py-2 text-xs text-steel hover:text-rust"
                aria-label="Remove record"
              >
                ×
              </button>
            </div>
          ))}

          <div className="mt-1 flex items-center justify-between">
            <button type="button" onClick={addRecord} className="text-xs text-steel hover:text-paper">
              + Add record
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="btn-chrome !px-4 !py-2 text-xs"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>

          <InlineNotice notice={notice} />
        </div>
      )}
    </div>
  );
}

function DomainDetailBody() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const domainName = decodeURIComponent(params.domain);

  const [domain, setDomain] = useState(null);
  const [error, setError] = useState(null);
  const [renewing, setRenewing] = useState(false);
  const [renewNotice, setRenewNotice] = useState(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    api
      .getDomain(token, domainName)
      .then((res) => {
        if (!cancelled) setDomain(res.domain);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Domain not found.');
      });
    return () => {
      cancelled = true;
    };
  }, [token, domainName]);

  async function handleRenew() {
    setRenewing(true);
    setRenewNotice(null);
    try {
      await api.renewDomain(token, domainName);
      setRenewNotice({ type: 'success', message: 'Renewal confirmed.' });
    } catch (err) {
      setRenewNotice({ type: 'error', message: err.message || 'Renewal failed.' });
    } finally {
      setRenewing(false);
    }
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="text-sm text-rust">{error}</p>
        <button onClick={() => router.push('/dashboard')} className="btn-ghost mt-6 !px-5 !py-2.5 text-xs">
          Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <button onClick={() => router.push('/dashboard')} className="mb-8 text-xs text-steel hover:text-paper">
        ← All domains
      </button>

      {!domain ? (
        <div className="panel h-24 animate-pulse" />
      ) : (
        <>
          <div className="panel mb-8 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-xl text-paper">{domain.domain}</p>
              <div className="mt-2 flex items-center gap-3">
                <StatusBadge status={domain.status === 'active' ? 'AVAILABLE' : domain.status} />
                <span className="text-xs text-steel">
                  {domain.autoRenew ? 'Auto-renew on' : 'Auto-renew off'}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <button onClick={handleRenew} disabled={renewing} className="btn-ghost !px-5 !py-2.5 text-xs">
                {renewing ? 'Renewing…' : 'Renew now'}
              </button>
              {renewNotice && <InlineNotice notice={renewNotice} />}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <NameserversPanel token={token} domainName={domain.domain} />
            <DnsPanel token={token} domainName={domain.domain} />
          </div>
        </>
      )}
    </div>
  );
}

export default function DomainDetailPage() {
  return (
    <RequireAuth>
      <DomainDetailBody />
    </RequireAuth>
  );
}
