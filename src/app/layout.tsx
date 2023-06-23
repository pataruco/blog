import Footer from '@/components/footer';
import Header from '@/components/header';
import '@/styles/index.css';
import { BASE_URL } from '@/utils/metadata';
import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'Pedro Martin Valera',
  description: 'I help to build, teach and lead product tech teams.',
  openGraph: {
    title: 'Pedro Martin Valera',
    description: 'I help to build, teach and lead product tech teams.',
    url: BASE_URL,
    siteName: 'Pedro Martin Valera',
    images: [
      {
        url: `${BASE_URL}/og.png`,
        width: 800,
        height: 600,
        alt: 'Pedro Martin Valera',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
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
    <html lang='en' className={inter.className}>
      <body>
        <div className='site'>
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
