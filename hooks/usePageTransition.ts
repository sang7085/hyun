'use client';

import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useTransitionStore } from '@/store/useTransitionStore';

export function usePageTransition() {
  const router = useRouter();
  const setTransitionDone = useTransitionStore((s) => s.setTransitionDone);

  const navigate = (href: string) => {
    const overlayGray = document.createElement('div');
    overlayGray.style.cssText = `
      position: fixed;
      inset: 0;
      background: #111;
      z-index: 9999;
      transform: translateY(100%);
      pointer-events: none;
    `;

    const overlayBlack = document.createElement('div');
    overlayBlack.style.cssText = `
      position: fixed;
      inset: 0;
      background: #000;
      z-index: 10000;
      transform: translateY(100%);
      pointer-events: none;
    `;

    document.body.appendChild(overlayGray);
    document.body.appendChild(overlayBlack);

    gsap
      .timeline()
      .to(overlayGray, {
        y: '0%',
        duration: 0.8,
        ease: 'cubic-bezier(.87, 0, .13, 1)',
      })
      .to(
        overlayBlack,
        {
          y: '0%',
          duration: 0.8,
          ease: 'cubic-bezier(.87, 0, .13, 1)',
          onComplete: () => router.push(href),
        },
        '<0.15'
      )
      .to(overlayBlack, {
        y: '-100%',
        duration: 0.8,
        delay: 0.2,
        ease: 'cubic-bezier(.87, 0, .13, 1)',
      })
      .to(
        overlayGray,
        {
          y: '-100%',
          duration: 0.8,
          ease: 'cubic-bezier(.87, 0, .13, 1)',
          onComplete: () => {
            setTransitionDone(true);
            document.body.removeChild(overlayGray);
            document.body.removeChild(overlayBlack);
          },
        },
        '<0.15'
      );
  };

  return { navigate };
}
