import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-hairline">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-steel md:flex-row md:items-center md:justify-between">
        <Logo />
        <p>Domains, handled properly. Registered through Fades Domains.</p>
      </div>
    </footer>
  );
}
