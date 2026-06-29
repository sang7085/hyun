import type { Metadata } from 'next';
import Script from 'next/script';

import '@/styles/main.scss';
import { pretendard, russoOne, anton } from '@/utils/fonts';
import Header from './components/layout/header';
import LenisProvider from '@/app/components/provider/LenisProvider';
import ScrollToTop from '@/app/components/layout/scrollToTop';
import Loading from './components/layout/loading';

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${russoOne.variable} ${anton.variable}`}>
      <head>
        <Script id="gtm" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),
              dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WX3BXNH5');
          `}
        </Script>
      </head>

      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WX3BXNH5" height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe>
        </noscript>

        <Loading />

        <LenisProvider>
          <ScrollToTop />
          <Header />
          <main>{children}</main>
        </LenisProvider>
      </body>
    </html>
  );
}
