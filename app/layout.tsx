import type { Metadata } from 'next';

import '@/styles/main.scss';
import { pretendard, russoOne, anton } from '@/utils/fonts';
import Header from './components/layout/header';
import LenisProvider from '@/app/components/provider/LenisProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://hyun-three.vercel.app/'),

  title: {
    default: '박상현 | Publisher and Frontend Developer',
    template: '%s | 박상현',
  },

  description: 'Publisher and Frontend Developer Portfolio built with Next.js, React, TypeScript, and GSAP.',

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${russoOne.variable} ${anton.variable}`}>
      <body>
        <LenisProvider>
          <Header />
          <main>{children}</main>
        </LenisProvider>
      </body>
    </html>
  );
}
