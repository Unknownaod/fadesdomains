'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Logo from './Logo';

const links = [
  { href: '/', label: 'Search' },
  { href: '/dashboard', label: 'My domains' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    setOpen(false);
    router.push('/');
  }

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-ink/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  active ? 'bg-white/[0.08] text-paper' : 'text-steel hover:text-paper'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-steel">
                {user?.name || user?.email}
              </span>
              <button onClick={handleLogout} className="btn-ghost !px-4 !py-2 text-xs">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost !px-4 !py-2 text-xs">
                Sign in
              </Link>
              <Link href="/register" className="btn-chrome !px-4 !py-2 text-xs">
                Create account
              </Link>
            </>
          )}
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="relative block h-3 w-4">
            <span
              className={`absolute left-0 top-0 h-px w-4 bg-paper transition-transform ${open ? 'translate-y-1.5 rotate-45' : ''}`}
            />
            <span className={`absolute left-0 top-1.5 h-px w-4 bg-paper transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span
              className={`absolute left-0 top-3 h-px w-4 bg-paper transition-transform ${open ? '-translate-y-1.5 -rotate-45' : ''}`}
            />
          </span>
        </button>
      </div>

      {open && (
        <div className="border-t border-hairline px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-steel hover:bg-white/[0.05] hover:text-paper"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-hairline pt-3">
              {isAuthenticated ? (
                <button onClick={handleLogout} className="btn-ghost w-full text-xs">
                  Sign out
                </button>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="btn-ghost w-full text-xs">
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="btn-chrome w-full text-xs"
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
