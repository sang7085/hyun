'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useVisualStore } from '@/store/useVisualStore';
import { CustomEase } from 'gsap/dist/CustomEase';
import { useBreakpoint } from '@/hooks/useBreakPoint';

gsap.registerPlugin(ScrollTrigger, CustomEase);

export default function AboutPage() {
  CustomEase.create('wipeEase', '.87,0,.13,1');
  const { isMobile, isTablet, isSmallPc, isBelowPc } = useBreakpoint();
  const isVisualReady = useVisualStore((s) => s.isVisualReady);

  const sectionRef = useRef<HTMLElement>(null);
  const fistWrapRef = useRef<HTMLDivElement>(null);
  const rightBoxRef = useRef<HTMLDivElement>(null);
  const leftBoxRef = useRef<HTMLDivElement>(null);
  const fistBombRef = useRef<HTMLDivElement>(null);
  const aboutIntroRef = useRef<HTMLDivElement>(null);
  const aboutTitleRef = useRef<HTMLHeadingElement>(null);
  const revealWallRef = useRef<HTMLDivElement>(null);
  const aboutDescRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    if (!isVisualReady) return;

    const ctx = gsap.context(() => {
      gsap.set(rightBoxRef.current, { right: '-15%' });
      gsap.set(leftBoxRef.current, { left: '-15%' });
      gsap.set(fistBombRef.current, { scale: 1, opacity: 0 });
      gsap.set(aboutIntroRef.current, { opacity: 0, scale: 0.8 });
      gsap.set(revealWallRef.current, { y: '0%' });
      gsap.set(aboutDescRef.current, { opacity: 0, y: 40 });

      const titleMasks = aboutTitleRef.current?.querySelectorAll('.char-mask') ?? [];
      gsap.set(titleMasks, { y: '100%' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: fistWrapRef.current,
          start: 'top top',
          end: isBelowPc ? '+=500%' : '+=300%',
          scrub: 1,
          pin: true,
          // markers: true,
        },
      });

      tl.to(rightBoxRef.current, { right: '0%', ease: 'power4.in' })
        .to(leftBoxRef.current, { left: '0%', ease: 'power4.in' }, '<')
        .set(fistBombRef.current, { opacity: 1 }, '>')
        .to(fistBombRef.current, { scale: isBelowPc ? 40 : 30, ease: 'power2.in' }, '<+=0.2')
        .to(sectionRef.current, { backgroundColor: '#fff', duration: 0.5 }, '>')
        .to(aboutIntroRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
        })
        .to(revealWallRef.current, { y: '-100%', duration: 1, ease: 'wipeEase' }, '<+=0.2')
        .to(titleMasks, { y: '0%', duration: 0.8, ease: 'power3.out', stagger: 0.03 }, '<+=0.2')
        .to(aboutDescRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '<+=0.2');
    }, sectionRef);

    const handleLoad = () => {
      ScrollTrigger.refresh();
    };

    if (document.readyState === 'complete') {
      ScrollTrigger.refresh();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.removeEventListener('load', handleLoad);
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [isVisualReady]);

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      <div className="fist-wrap" ref={fistWrapRef}>
        <div className="fist-box">
          <div className="img-box right" ref={rightBoxRef}>
            <img src="/assets/images/footer-hand.webp" alt="주먹" />
          </div>
          <div className="img-box left" ref={leftBoxRef}>
            <img src="/assets/images/footer-hand.webp" alt="주먹" />
          </div>
          <div className="fist-bomb" ref={fistBombRef} />
        </div>

        <div className="about-intro" ref={aboutIntroRef}>
          <div className="profile-img">
            <Image src="/assets/images/profile.webp" fill alt="프로필사진" style={{ objectFit: 'cover' }} onLoad={() => ScrollTrigger.refresh()} />
            <div className="reveal-wall" ref={revealWallRef} />
          </div>
          <div className="title-wrap">
            <h3 className="about-title" ref={aboutTitleRef}>
              {'PUBLISHER & DEVELOPER'.split('').map((char, i) => (
                <span key={i} className="char-mask">
                  <span className="char-inner">
                    <span className="char-original">{char === ' ' ? '\u00A0' : char}</span>
                  </span>
                </span>
              ))}
            </h3>
            <p className="about-desc" ref={aboutDescRef}>
              인터랙션 하나에도 사용자의 감정을 세심하게 설계하는 것에 자신 있습니다.
              <br /> 스크롤, 클릭, 호버처럼 작은 움직임 하나하나가 모여 전체 경험의 인상을 결정한다고 생각하며, 그 흐름을 자연스럽게 이어가는 데 깊이 고민합니다.
              <br /> 이는 단순히 화면을 구현하는 것을 넘어서, 사용자가 서비스를 탐색하는 과정 자체를 하나의 이야기로 만들어줍니다.
              <br /> 정적인 화면에 시간과 움직임이라는 요소를 더해 살아있는 경험을 만드는 것을 좋아합니다.
              <br /> 픽셀 하나, 타이밍 0.1초의 차이에도 브랜드의 태도가 드러난다고 믿기에, 디자인 의도를 코드로 정확하게 구현하는 데 많은 시간을 투자합니다.
              <br /> 기술적인 완성도와 사용자 경험 사이의 균형을 찾아, 보는 이에게 오래 기억되는 화면을 만들어 드립니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
