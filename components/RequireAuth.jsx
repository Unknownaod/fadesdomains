'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function RequireAuth({ children }) {
  const { ready, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [ready, isAuthenticated, router, pathname]);

  if (!ready) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="panel h-40 animate-pulse" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return children;
}
