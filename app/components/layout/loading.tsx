'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useLoadingStore } from '@/store/useLoadingStore';

const lines = ['INTERACTIVE', 'PUBLISHING', 'FRONTEND', 'DEVELOP'];
const hyun = ['H', 'Y', 'U', 'N', '.'];

export default function Loading() {
  const { isLoading, setLoadingDone } = useLoadingStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hyunRefs = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!isLoading) return;

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          onComplete: setLoadingDone,
        });
      },
    });

    // 로딩 gsap 시작
    tl.to(wrapperRef.current, {
      y: '0%',
      duration: 1,
      ease: 'power2.out',
    });

    tl.to(wrapperRef.current, {
      y: '-20%',
      duration: 1,
      delay: 0.5,
      ease: 'power2.out',
    });

    tl.to(wrapperRef.current, {
      y: '-40%',
      duration: 1,
      ease: 'power2.out',
    });

    tl.to(wrapperRef.current, {
      y: '-60%',
      duration: 1,
      ease: 'power2.out',
    });

    tl.to(wrapperRef.current, {
      y: '-80%',
      duration: 1,
      ease: 'power2.out',
    });

    // 마지막 li 각 글자 stagger
    tl.from(hyunRefs.current, {
      y: '100%',
      duration: 1,
      ease: 'power2.out',
      stagger: 0.08,
    });

    tl.to({}, { duration: 0.8 });
  }, []);

  if (!isLoading) return null;

  return (
    <div ref={containerRef} className="loading-wrap">
      <div className="loading-container">
        <div ref={wrapperRef} className="loading-wrapper">
          <ul className="loading-list">
            {lines.map((text, i) => (
              <li key={i} className="loading-item">
                <span>{text}</span>
              </li>
            ))}
            <li className="loading-item loading-item--hyun">
              {hyun.map((char, i) => (
                <span
                  key={i}
                  ref={(el) => {
                    if (el) hyunRefs.current[i] = el;
                  }}
                  className="loading-char"
                >
                  {char}
                </span>
              ))}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
