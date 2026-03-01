import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Darayi - Personal Vault',
  description: 'Track your personal finances locally',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">
        <header className="border-b border-zinc-800 px-6 py-4">
          <h1 className="text-xl font-bold tracking-tight text-zinc-100">
            Darayi
            <span className="ml-2 text-sm font-normal text-zinc-500">Vault</span>
          </h1>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
