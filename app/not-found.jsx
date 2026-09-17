import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-32 text-center">
      <span className="font-mono text-sm text-steel">404</span>
      <h1 className="mt-3 text-2xl font-semibold tracking-tightish text-paper">
        This page didn&rsquo;t register.
      </h1>
      <p className="mt-2 text-sm text-steel">
        The page you&rsquo;re looking for doesn&rsquo;t exist, or the domain moved.
      </p>
      <Link href="/" className="btn-chrome mt-8">
        Back to search
      </Link>
    </div>
  );
}
