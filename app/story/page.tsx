'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function StoryPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [size, setSize] = useState({
    w: 0,
    h: 0,
  });

  const d = `
  M ${size.w * 0.55} 0

  C ${size.w * 0.05} ${size.h * 0.15},
    ${size.w * 0.1} ${size.h * 0.3},
    ${size.w * 0.52} ${size.h * 0.4}

  C ${size.w * 0.95} ${size.h * 0.48},
    ${size.w * 0.9} ${size.h * 0.6},
    ${size.w * 0.52} ${size.h * 0.68}

  C ${size.w * 0.05} ${size.h * 0.75},
    ${size.w * 0.1} ${size.h * 0.92},
    ${size.w * 0.55} ${size.h}
`;

  useLayoutEffect(() => {
    const updateSize = () => {
      setSize({
        w: window.innerWidth,
        h: window.innerHeight * 2.5,
      });
    };

    updateSize();

    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  useLayoutEffect(() => {
    if (!size.w || !size.h || !pathRef.current) return;

    const path = pathRef.current;
    const length = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    gsap.set('.line', {
      yPercent: 100,
      opacity: 0,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top +=30%',
        end: '+=200%',
        scrub: true,
      },
    });

    tl.to(
      path,
      {
        strokeDashoffset: 0,
        ease: 'none',
        duration: 1,
      },
      0
    );

    tl.to(
      '.story-text:nth-of-type(1) .line',
      {
        yPercent: 0,
        opacity: 1,
        stagger: 0.08,
        ease: 'power3.out',
      },
      0.15
    );

    tl.to(
      '.story-text:nth-of-type(2) .line',
      {
        yPercent: 0,
        opacity: 1,
        stagger: 0.08,
        ease: 'power3.out',
      },
      0.6
    );

    tl.to(
      '.story-text:nth-of-type(3) .line',
      {
        yPercent: 0,
        opacity: 1,
        stagger: 0.08,
        ease: 'power3.out',
      },
      0.9
    );

    ScrollTrigger.refresh();

    return () => {
      tl.kill();
    };
  }, [size]);

  return (
    <section className="story-section" ref={sectionRef}>
      <svg className="story-path" width="100%" height="100%" viewBox={`0 0 ${size.w} ${size.h}`} preserveAspectRatio="xMidYMid meet">
        <path ref={pathRef} d={d} fill="none" stroke="#fff" strokeWidth="8" />
      </svg>

      <p className="story-text">
        <span className="line">WACUS builds high-performance,</span>
        <span className="line">responsive platforms and</span>
        <span className="line">custom-engineered systems.</span>
      </p>

      <p className="story-text">
        <span className="line">WACUS builds high-performance,</span>
        <span className="line">responsive platforms and</span>
        <span className="line">custom-engineered systems.</span>
      </p>

      <p className="story-text">
        <span className="line">WACUS builds high-performance,</span>
        <span className="line">responsive platforms and</span>
        <span className="line">custom-engineered systems.</span>
      </p>
    </section>
  );
}
