'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar({ initialValue = '', size = 'lg', autoFocus = false }) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);

  function handleSubmit(e) {
    e.preventDefault();
    const query = value.trim();
    if (!query) return;
    router.push(`/search?domain=${encodeURIComponent(query)}`);
  }

  const isLarge = size === 'lg';

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`group flex items-center gap-2 rounded-full border border-hairline bg-panel-2 shadow-chrome transition-colors focus-within:border-chrome/60 ${
          isLarge ? 'p-2 pl-6' : 'p-1.5 pl-4'
        }`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className="shrink-0 text-steel"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="findyourdomain.com"
          autoFocus={autoFocus}
          className={`w-full bg-transparent text-paper placeholder:text-haze focus:outline-none ${
            isLarge ? 'py-3 text-lg' : 'py-2 text-sm'
          }`}
        />
        <button type="submit" className={`btn-chrome shrink-0 ${isLarge ? '' : '!px-4 !py-2 text-xs'}`}>
          Search
        </button>
      </div>
    </form>
  );
}
