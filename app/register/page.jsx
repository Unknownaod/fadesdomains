'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Could not create your account.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-20">
      <h1 className="text-2xl font-semibold tracking-tightish text-paper">Create your account</h1>
      <p className="mt-2 text-sm text-steel">Register domains and manage them from one dashboard.</p>

      <form onSubmit={handleSubmit} className="panel mt-8 flex flex-col gap-4 p-6">
        {error && (
          <div className="rounded-lg border border-rust/30 bg-rust/[0.06] px-3 py-2 text-xs text-rust">
            {error}
          </div>
        )}

        <div>
          <label className="label" htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            required
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field"
            placeholder="Your name"
          />
        </div>

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
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field"
            placeholder="At least 8 characters"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-chrome mt-2">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-steel">
        Already have an account?{' '}
        <Link href="/login" className="text-paper underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
