import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Footer from '@/components/footer';
import Header from '@/components/header';
import '@/styles/index.css';

export const metadata: Metadata = {
  title: 'Pedro Martin Valera',
  description: 'I help to build, teach and lead product tech teams.',
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <div className="site">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
