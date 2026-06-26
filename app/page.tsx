'use client';

import { useEffect, useRef } from 'react';
import VisualPage from '@/app/visual/page';
import WorkPage from '@/app/work/page';
import StoryPagePage from '@/app/story/page';
import AboutPage from '@/app/about/page';
import ContactPage from '@/app/contact/page';
import { usePathname } from 'next/navigation';

export default function Home() {
  const pathname = usePathname();

  return (
    <>
      <VisualPage key={`visual-${pathname}`} />
      <WorkPage key={`work-${pathname}`} />
      {/* <AboutPage /> */}
      <ContactPage />
      {/* <StoryPagePage /> */}
    </>
  );
}