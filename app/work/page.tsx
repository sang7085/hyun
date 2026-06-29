'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useVisualStore } from '@/store/useVisualStore';
import workData from '@/data/projects';
import { usePageTransition } from '@/hooks/usePageTransition';
gsap.registerPlugin(ScrollTrigger);

export default function WorkPage() {
  const sectionRef = useRef(null);
  const wrapRef = useRef(null);
  const isVisualReady = useVisualStore((s) => s.isVisualReady);
  const { navigate } = usePageTransition();
  const [activeIndex, setActiveIndex] = useState(0);

  // 호버 프리뷰 관련 state
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [previewY, setPreviewY] = useState(0);
  const contentWrapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!isVisualReady) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.work-item');
      const textEls = gsap.utils.toArray<HTMLElement>('.work-text-item');
      const totalFlips = 3;

      gsap.set(textEls, { yPercent: 100 });
      gsap.set(textEls[0], { yPercent: -50 });

      items.forEach((item, i) => {
        gsap.set(item, {
          rotateX: i % 2 === 0 ? 0 : 180,
          z: i * -1,
          opacity: 0,
          visibility: 'hidden',
        });
        gsap.set([items[0], items[1]], { opacity: 1, visibility: 'visible' });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${totalFlips * 100}%`,
          scrub: true,
          pin: true,
          onUpdate: (self) => {
            const index = Math.round(self.progress * totalFlips);
            setActiveIndex(index);
          },
        },
      });

      for (let i = 0; i < totalFlips; i++) {
        if (items[i + 1]) tl.set(items[i + 1], { opacity: 1, visibility: 'visible' }, i);
        if (items[i]) tl.set(items[i], { opacity: 0, visibility: 'hidden' }, i + 1);
        tl.to(wrapRef.current, { rotateX: (i + 1) * 180, ease: 'power2.out' }, i);
        if (textEls[i]) tl.to(textEls[i], { yPercent: -200, ease: 'power2.out' }, i);
        if (textEls[i + 1]) tl.to(textEls[i + 1], { yPercent: -50, filter: 'blur(0px)', ease: 'power2.out' }, i);
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [isVisualReady]);

  // all works 리스트 호버 진입 — li 중앙 Y를 content-wrap 기준으로 계산
  const handleAllWorkEnter = (e: React.MouseEvent<HTMLElement>, i: number) => {
    e.currentTarget.classList.remove('active-up', 'active-down');

    const elRect = e.currentTarget.getBoundingClientRect();
    const wrapRect = contentWrapRef.current!.getBoundingClientRect();

    // content-wrap 상단 기준 상대 Y + li 높이 절반 = li 세로 중앙
    const centerY = elRect.top - wrapRect.top + elRect.height / 2;

    setPreviewY(centerY);
    setHoveredIndex(i);
  };

  // all works 리스트 호버 이탈
  const handleAllWorkLeave = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    el.classList.add(e.clientY < centerY ? 'active-up' : 'active-down');

    setHoveredIndex(null);
  };

  return (
    <>
      <section id="work" className="work-section" aria-labelledby="work section">
        <h2 id="visual-heading" className="sr-only">
          Work
        </h2>

        <div className="flip-wrap" ref={sectionRef}>
          <ul className="text-item-wrap">
            {workData.slice(0, 4).map((project, i) => (
              <li key={i} className="work-text-item">
                <button type="button" tabIndex={-1} onClick={() => navigate(`/work/${project.slug}`)} className="marquee-btn">
                  {project.marquee}
                </button>
              </li>
            ))}
          </ul>
          <div className="work-item-wrap" ref={wrapRef}>
            {workData.slice(0, 4).map((project, i) => (
              <div key={i} className="work-item">
                <div className="desc">{project.title}</div>
                <Image src={project.thumbnail} alt={project.title} fill sizes="(max-width: 768px) 100vw, 384px" />
              </div>
            ))}
          </div>
          <div className="real-work">
            {workData.slice(0, 4).map((project, i) => (
              <button
                key={i}
                role="button"
                aria-label={`${project.title} 상세 보기`}
                className="real-work-item"
                style={{ zIndex: workData.length - i }}
                onClick={() => navigate(`/work/${project.slug}`)}
                tabIndex={0}
                aria-hidden={false}
              />
            ))}
          </div>
        </div>

        <div className="content-wrap" ref={contentWrapRef}>
          {hoveredIndex !== null && (
            <div
              className="hover-preview"
              style={{
                top: previewY,
              }}
            >
              <Image src={workData[hoveredIndex].thumbnail} alt={workData[hoveredIndex].title} fill sizes="20vw" />
            </div>
          )}

          <div className="inner">
            <p className="all-title">[ALL WORKS]</p>
          </div>

          {workData.map((project, i) => (
            <button
              type="button"
              key={i}
              className="content-list"
              onClick={() => navigate(`/work/${project.slug}`)}
              onMouseEnter={(e) => handleAllWorkEnter(e, i)} // 인덱스 전달
              onMouseLeave={handleAllWorkLeave}
            >
              <div className="info-wrap">
                <div className="inner">
                  <div className="tit-wrap">
                    <h3 className="tit">{project.title}</h3>
                  </div>
                  <div className="text-wrap">
                    {/* <p>{project.awardsText}</p> */}
                    <p>{project.year}</p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
