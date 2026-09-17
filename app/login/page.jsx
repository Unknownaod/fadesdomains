'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      const next = params.get('next') || '/dashboard';
      router.push(next);
    } catch (err) {
      setError(err.message || 'Could not sign in.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-20">
      <h1 className="text-2xl font-semibold tracking-tightish text-paper">Sign in</h1>
      <p className="mt-2 text-sm text-steel">Manage your domains and pick up where you left off.</p>

      <form onSubmit={handleSubmit} className="panel mt-8 flex flex-col gap-4 p-6">
        {error && (
          <div className="rounded-lg border border-rust/30 bg-rust/[0.06] px-3 py-2 text-xs text-rust">
            {error}
          </div>
        )}

        <div>
          <label className="label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field"
            placeholder="••••••••"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-chrome mt-2">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-steel">
        Don&rsquo;t have an account?{' '}
        <Link href="/register" className="text-paper underline underline-offset-4">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
