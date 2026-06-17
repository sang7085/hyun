'use client';

import { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useVisualStore } from '@/store/useVisualStore';
import { blur } from 'three/tsl';


gsap.registerPlugin(ScrollTrigger);

const workItems = [
  { href: '/work', src: '/assets/images/work-bg1.jpg', title: "HD HYUNDAI" },
  { href: '/work2', src: '/assets/images/work-bg2.jpg', title: "HD HYUNDAI" },
  { href: '/work3', src: '/assets/images/work-bg3.png', title: "HD HYUNDAI" },
  { href: '/work4', src: '/assets/images/work-bg4.png', title: "HD HYUNDAI" },
];

const workItemsAll = [
  { href: '/work', src: '/assets/images/work-bg1.jpg', title: "HD HYUNDAI" },
  { href: '/work2', src: '/assets/images/work-bg2.jpg', title: "HD HYUNDAI" },
  { href: '/work3', src: '/assets/images/work-bg3.png', title: "HD HYUNDAI" },
  { href: '/work4', src: '/assets/images/work-bg4.png', title: "HD HYUNDAI" },
  { href: '/work', src: '/assets/images/work-bg1.jpg', title: "HD HYUNDAI" },
  { href: '/work2', src: '/assets/images/work-bg2.jpg', title: "HD HYUNDAI" },
  { href: '/work3', src: '/assets/images/work-bg3.png', title: "HD HYUNDAI" },
  { href: '/work4', src: '/assets/images/work-bg4.png', title: "HD HYUNDAI" },
]

const textItems = [
  'HD HYUNDAI HD HYUNDAI HD HYUNDAI HD HYUNDAI HD HYUNDAI HD HYUNDAI HD HYUNDAI HD HYUNDAI HD HYUNDAI',
  'HYUNDAI ROTEM HYUNDAI ROTEM HYUNDAI ROTEM HYUNDAI ROTEM HYUNDAI ROTEM HYUNDAI ROTEM HYUNDAI ROTEM HYUNDAI ROTEM',
  'KIA MOTORS KIA MOTORS KIA MOTORS KIA MOTORS KIA MOTORS KIA MOTORS KIA MOTORS KIA MOTORS',
  'SAMSUNG SAMSUNG SAMSUNG SAMSUNG SAMSUNG SAMSUNG SAMSUNG SAMSUNG SAMSUNG SAMSUNG SAMSUNG',
];

export default function WorkPage() {
  const sectionRef = useRef(null);
  const wrapRef = useRef(null);
  const isVisualReady = useVisualStore((s) => s.isVisualReady);

  useLayoutEffect(() => {
    if (!isVisualReady) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.work-item');
      const textEls = gsap.utils.toArray<HTMLElement>('.work-text-item');
      const totalFlips = workItems.length - 1;

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
        });

        gsap.set([items[0], items[1]], {
          opacity: 1,
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${totalFlips * 200}%`,
          scrub: true,
          pin: true,
          // markers: true,
        },
      });

      for (let i = 0; i < totalFlips; i++) {

        // 다음 카드 미리 준비
        if (items[i + 1]) {
          tl.set(
            items[i + 1], {
            opacity: 1,
          }, i);
        }

        // 현재 카드 숨김
        if (items[i]) {
          tl.set(items[i], {
            opacity: 0,
          }, i + 1);
        }


        tl.to(
          wrapRef.current,
          {
            rotateX: (i + 1) * 180,
            ease: 'power2.out',
            // duration: 1,
          },
          i
        );

        // 현재 텍스트 위로
        if (textEls[i]) {
          tl.to(
            textEls[i],
            {
              yPercent: -200,
              ease: 'power2.out',
              // duration: 1,
            },
            i
          );
        }

        // 다음 텍스트 중앙
        if (textEls[i + 1]) {
          tl.to(
            textEls[i + 1],
            {
              yPercent: -50,
              filter: "blur(0px)",
              ease: 'power2.out',
              // duration: 1,
            },
            i
          );
        }
      }
    }, sectionRef);

    return () => ctx.revert();

  }, [isVisualReady]);

  // content mouse over 시 함수
  const handleEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    el.classList.remove("active-up", "active-down");
  };
  const handleLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;

    if (e.clientY < centerY) {
      el.classList.add("active-up");
    } else {
      el.classList.add("active-down");
    }
  };


  return (
    <>
      <section className="work-section">
        <div className="flip-wrap" ref={sectionRef}>
          <ul className="text-item-wrap">
            {textItems.map((text, i) => (
              <li key={i} className="work-text-item">
                <span>{text}{text}</span>
              </li>
            ))}
          </ul>
          <div className="work-item-wrap" ref={wrapRef}>
            {workItems.map((work, i) => (
              <div key={i} className="work-item">
                <Link href={work.href}>
                  <div className="desc">{work.title}</div>
                  {/* <video src={work.src} autoPlay muted loop playsInline /> */}
                  <img src={work.src} alt={`Work ${i + 1}`} />
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="content_wrap">
          {workItemsAll.map((item, i) => (
            <Link
              key={i}
              href="#"
              className="content_list"
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
            >
              <div className="content-wrap">
                <div className="tit_wrap">
                  <h3 className="tit">{item.title}</h3>
                </div>
                <div className="other">
                  <span className="update">LAST</span>
                  <span className="date">2025.01.01</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}