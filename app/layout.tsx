// import type { Metadata } from "next";
import "@/styles/globals.scss";
import { pretendard, russoOne, anton } from '@/utils/fonts'
import Header from "./components/layout/header";
import LenisProvider from "@/app/components/provider/LenisProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${russoOne.variable} ${anton.variable}`}>
      <LenisProvider>
        <body>
          <Header />
          <main>
            {children}
          </main>
        </body>
      </LenisProvider>
    </html>
  );
}
