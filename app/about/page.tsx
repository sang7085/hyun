'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useVisualStore } from '@/store/useVisualStore';

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const isVisualReady = useVisualStore((s) => s.isVisualReady);

  const sectionRef = useRef<HTMLElement>(null);
  const rightBoxRef = useRef<HTMLDivElement>(null);
  const leftBoxRef = useRef<HTMLDivElement>(null);
  const fistBombRef = useRef<HTMLDivElement>(null);
  const aboutContentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!isVisualReady) return;

    const ctx = gsap.context(() => {
      gsap.set(rightBoxRef.current, { right: '-15%' });
      gsap.set(leftBoxRef.current, { left: '-15%' });
      gsap.set(fistBombRef.current, { scale: 1, opacity: 0 });
      gsap.set(aboutContentRef.current, { opacity: 0, y: 40 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=200%',
            scrub: 1,
            pin: true,
            markers: true,
          },
        })
        .to(rightBoxRef.current, { right: '0%', ease: 'power4.in' }, 0)
        .to(leftBoxRef.current, { left: '0%', ease: 'power4.in' }, 0)
        .to(fistBombRef.current, { opacity: 1 }, 0)
        .to(fistBombRef.current, { scale: 30, ease: 'power2.in' }, 0.7)
        .fromTo(aboutContentRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: 'power2.out' }, 1);
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [isVisualReady]);

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      <div className="inner">
        <div className="img-box right" ref={rightBoxRef}>
          <img src="/assets/images/footer-hand.webp" alt="주먹" />
        </div>
        <div className="img-box left" ref={leftBoxRef}>
          <img src="/assets/images/footer-hand.webp" alt="주먹" />
        </div>
        <div className="fist-bomb" ref={fistBombRef} />
        <div className="about-content" ref={aboutContentRef}>
          <div className="img-box">
            <Image src="/assets/images/profile.jpg" fill alt="프로필사진" />
          </div>
          <h3 className="about-title">FRONTEND DEVELOPER</h3>
          <p className="about-desc">사용자 경험을 고민하는 개발자, 박상현입니다.</p>
        </div>
      </div>
    </section>
  );
}
