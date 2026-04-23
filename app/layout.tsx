import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Mandiri - Blokir Kartu Debit',
  description: 'Layanan pemblokiran kartu debit Mandiri sementara untuk perlindungan akun.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id" className={inter.variable}>
      <body suppressHydrationWarning className="font-sans">{children}</body>
    </html>
  );
}
