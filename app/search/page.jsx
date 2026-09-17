import { Suspense } from 'react';
import SearchResults from '@/components/SearchResults';

export const metadata = {
  title: 'Search domains — Fades Domains',
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-6 py-16 text-sm text-steel">Loading…</div>}>
      <SearchResults />
    </Suspense>
  );
}
