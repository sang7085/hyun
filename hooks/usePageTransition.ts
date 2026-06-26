// hooks/usePageTransition.ts
'use client';

import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useTransitionStore } from '@/store/useTransitionStore';

export function usePageTransition() {
  const router = useRouter();
  const setTransitionDone = useTransitionStore((s) => s.setTransitionDone);

  const navigate = (href: string) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: #f4f2f1;
      z-index: 9999;
      clip-path: circle(0% at 50% 50%);
      pointer-events: none;
    `;
    document.body.appendChild(overlay);

    gsap
      .timeline()
      // 커지는 애니메이션
      .to(overlay, {
        clipPath: 'circle(150% at 50% 50%)',
        duration: 1.5,
        ease: 'power2.inOut',
        onComplete: () => router.push(href),
      })
      // 페이지 이동 후 줄어드는 애니메이션
      .to(overlay, {
        clipPath: 'circle(0% at 50% 50%)',
        duration: 1,
        ease: 'power2.inOut',
        delay: 0.1,
        onComplete: () => {
          setTransitionDone(true); // zustand로 완료 알림
          document.body.removeChild(overlay);
        },
      });
  };

  return { navigate };
}
