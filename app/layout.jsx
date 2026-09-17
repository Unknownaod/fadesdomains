import { Instrument_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const display = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
});

export const metadata = {
  title: 'Fades Domains — Find and register your domain',
  description: 'Search, register, and manage domains through Fades Domains.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-ink text-paper font-display antialiased">
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <div className="pointer-events-none fixed inset-0 bg-radial-glow" aria-hidden="true" />
            <Navbar />
            <main className="relative z-10 flex-1">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
