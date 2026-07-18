'use client';

import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useTransitionStore } from '@/store/useTransitionStore';

export function usePageTransition() {
  const router = useRouter();
  const setTransitionDone = useTransitionStore((s) => s.setTransitionDone);
  const setPageReady = useTransitionStore((s) => s.setPageReady);

  const navigate = (href: string) => {
    // 새 네비게이션 시작 시 이전 상태 초기화
    setPageReady(false);

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

    const tl = gsap.timeline();

    // 1~2번째 트윈: 오버레이로 화면 덮기
    tl.to(overlayGray, {
      y: '0%',
      duration: 0.8,
      ease: 'cubic-bezier(.87, 0, .13, 1)',
    }).to(
      overlayBlack,
      {
        y: '0%',
        duration: 0.8,
        ease: 'cubic-bezier(.87, 0, .13, 1)',
        onComplete: () => {
          router.push(href);
          waitForPageReady();
        },
      },
      '<0.15'
    );

    const playExit = () => {
      tl.to(overlayBlack, {
        y: '-100%',
        duration: 0.8,
        delay: 0.2,
        ease: 'cubic-bezier(.87, 0, .13, 1)',
      }).to(
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

    // 새 페이지의 isPageReady가 true 될 때까지 대기
    const waitForPageReady = () => {
      // 이미 준비돼 있으면 바로 실행 (캐시된 페이지 등)
      if (useTransitionStore.getState().isPageReady) {
        playExit();
        return;
      }

      const unsub = useTransitionStore.subscribe((state) => {
        if (state.isPageReady) {
          unsub();
          playExit();
        }
      });
    };
  };

  return { navigate };
}
