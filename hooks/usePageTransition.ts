'use client';

import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useTransitionStore } from '@/store/useTransitionStore';

export function usePageTransition() {
  const router = useRouter();
  const setTransitionDone = useTransitionStore((s) => s.setTransitionDone);

  const navigate = (href: string) => {
    const overlayWhite = document.createElement('div');
    overlayWhite.style.cssText = `
      position: fixed;
      inset: 0;
      background: #f4f2f1;
      z-index: 9999;
      transform: scale(0);
      transform-origin: center;
      pointer-events: none;
    `;

    const overlayBlack = document.createElement('div');
    overlayBlack.style.cssText = `
      position: fixed;
      inset: 0;
      background: #000;
      z-index: 10000;
      transform: scale(0);
      transform-origin: center;
      pointer-events: none;
    `;

    document.body.appendChild(overlayWhite);
    document.body.appendChild(overlayBlack);

    gsap
      .timeline()
      .to(overlayWhite, {
        scale: 2,
        duration: 1,
        ease: 'cubic-bezier(0.7, 0, 1, 1)',
        onComplete: () => router.push(href),
      })
      .to(overlayBlack, {
        delay: 0.6,
        scale: 2,
        duration: 1,
        ease: 'cubic-bezier(0.4, 0, 1, 1)',
      })
      // 둘 다 동시에 fadeout
      .to([overlayWhite, overlayBlack], {
        opacity: 0,
        duration: 1,
        ease: 'none',
        onComplete: () => {
          setTransitionDone(true);
          document.body.removeChild(overlayWhite);
          document.body.removeChild(overlayBlack);
        },
      });
  };

  return { navigate };
}
