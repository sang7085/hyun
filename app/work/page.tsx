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

  useLayoutEffect(() => {
    if (!isVisualReady) return;
    console.log('isVisualReady:', isVisualReady);
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.work-item');
      const textEls = gsap.utils.toArray<HTMLElement>('.work-text-item');
      const totalFlips = workData.length - 1;

      gsap.set(textEls, {
        yPercent: 100,
      });

      gsap.set(textEls[0], {
        yPercent: -50,
      });

      items.forEach((item, i) => {
        gsap.set(item, {
          rotateX: i % 2 === 0 ? 0 : 180,
          z: i * -1,
          opacity: 0,
          visibility: 'hidden',
          // pointerEvents: 'none',
        });

        gsap.set([items[0], items[1]], {
          opacity: 1,
          visibility: 'visible',
        });
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
        if (items[i + 1]) {
          tl.set(
            items[i + 1],
            {
              opacity: 1,
              // pointerEvents: 'auto'
              visibility: 'visible',
            },
            i
          );
        }

        if (items[i]) {
          tl.set(
            items[i],
            {
              opacity: 0,
              visibility: 'hidden',
              // pointerEvents: 'none'
            },
            i + 1
          );
        }

        tl.to(
          wrapRef.current,
          {
            rotateX: (i + 1) * 180,
            ease: 'power2.out',
          },
          i
        );

        if (textEls[i]) {
          tl.to(
            textEls[i],
            {
              yPercent: -200,
              ease: 'power2.out',
            },
            i
          );
        }

        if (textEls[i + 1]) {
          tl.to(
            textEls[i + 1],
            {
              yPercent: -50,
              filter: 'blur(0px)',
              ease: 'power2.out',
            },
            i
          );
        }
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [isVisualReady]);

  const handleEnter = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.classList.remove('active-up', 'active-down');
  };

  const handleLeave = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;

    if (e.clientY < centerY) {
      el.classList.add('active-up');
    } else {
      el.classList.add('active-down');
    }
  };

  return (
    <>
      <section id="work" className="work-section">
        <div className="flip-wrap" ref={sectionRef}>
          <ul className="text-item-wrap">
            {workData.map((project, i) => (
              <li key={i} className="work-text-item">
                <span onClick={() => navigate(`/work/${project.slug}`)}>{project.marquee.repeat(2)}</span>
              </li>
            ))}
          </ul>
          <div className="work-item-wrap" ref={wrapRef}>
            {workData.map((project, i) => (
              <div key={i} className="work-item">
                <div className="desc">{project.title}</div>
                <Image src={project.thumbnail} alt={project.title} fill sizes="(max-width: 768px) 100vw, 384px" />
              </div>
            ))}
          </div>
          <div className="real-work">
            {workData.map((project, i) => (
              <div
                key={i}
                className="real-work-item"
                style={{
                  zIndex: workData.length - i,
                  pointerEvents: activeIndex === i ? 'auto' : 'none',
                }}
                onClick={() => navigate(`/work/${project.slug}`)}
              ></div>
            ))}
          </div>
        </div>
        <div className="content-wrap">
          <div className="inner">
            <p className="all-title">[ALL WORKS]</p>
          </div>
          {workData.map((project, i) => (
            <div key={i} className="content-list" onClick={() => navigate(`/work/${project.slug}`)} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
              <div className="info-wrap">
                <div className="inner">
                  <div className="tit-wrap">
                    <h3 className="tit">{project.title}</h3>
                  </div>
                  <div className="text-wrap">
                    <p>{project.year}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
