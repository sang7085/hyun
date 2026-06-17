'use client';

import { useEffect, useRef } from 'react';
import VisualPage from '@/app/visual/page';
import WorkPage from '@/app/work/page';
import StoryPagePage from '@/app/story/page';
import AboutPage from '@/app/about/page';
import ContackPage from '@/app/contact/page';

export default function Home() {
  return (
    <>
      <VisualPage />
      <WorkPage />
      <ContackPage />
      {/* <StoryPagePage /> */}
      {/* <AboutPage /> */}
    </>
  );
}