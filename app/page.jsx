import SearchBar from '@/components/SearchBar';
import Link from 'next/link';

const POPULAR_TLDS = ['.com', '.io', '.dev', '.app', '.co', '.net', '.ca', '.xyz'];

const STEPS = [
  {
    n: '01',
    title: 'Search',
    body: 'Type a name and see live availability and pricing straight from the registry — never a cached guess.',
  },
  {
    n: '02',
    title: 'Register',
    body: 'Pick the TLD you want. We confirm the purchase with the registrar before it ever shows up as yours.',
  },
  {
    n: '03',
    title: 'Point it anywhere',
    body: 'Manage nameservers and DNS records from your dashboard the moment registration is confirmed.',
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-20 pt-24 text-center sm:pt-32">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-hairline bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-steel">
            Live registry pricing
          </span>
          <h1 className="text-4xl font-semibold leading-[1.05] tracking-tightish text-paper sm:text-6xl">
            Find the domain that&nbsp;sounds like you.
          </h1>
          <p className="mt-5 max-w-xl text-balance text-base text-steel sm:text-lg">
            Search hundreds of extensions in real time, register in a few clicks, and manage DNS
            without digging through someone else&rsquo;s control panel.
          </p>

          <div className="mt-10 w-full max-w-2xl">
            <SearchBar autoFocus />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {POPULAR_TLDS.map((tld) => (
              <span
                key={tld}
                className="rounded-full border border-hairline px-3 py-1 font-mono text-xs text-steel"
              >
                {tld}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-hairline bg-panel/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 max-w-lg">
            <h2 className="text-2xl font-semibold tracking-tightish text-paper sm:text-3xl">
              From search to live domain, in three steps.
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="panel p-6">
                <span className="font-mono text-sm text-steel">{step.n}</span>
                <h3 className="mt-4 text-lg font-semibold text-paper">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="panel flex flex-col items-center gap-4 px-8 py-14 text-center">
          <h2 className="text-2xl font-semibold tracking-tightish text-paper sm:text-3xl">
            Already own domains with us?
          </h2>
          <p className="max-w-md text-sm text-steel">
            Sign in to manage nameservers, DNS records, and renewals for everything in your account.
          </p>
          <Link href="/dashboard" className="btn-chrome mt-2">
            Go to my domains
          </Link>
        </div>
      </section>
    </div>
  );
}
