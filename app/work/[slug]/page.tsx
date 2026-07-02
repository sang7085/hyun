'use client';

import workData from '@/data/projects';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import Image from 'next/image';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { CustomEase } from 'gsap/dist/CustomEase';
import { usePageTransition } from '@/hooks/usePageTransition';
import { useBreakpoint } from '@/hooks/useBreakPoint';
// ── Matter.js ──
import Matter from 'matter-js';

gsap.registerPlugin(ScrollTrigger, CustomEase);

export default function WorkList() {
  const mm = gsap.matchMedia();
  const { isMobile, isTablet, isSmallPc, isBelowPc } = useBreakpoint();
  const visualWrap = useRef(null);
  const visualImg = useRef(null);
  const fakeBg = useRef(null);
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const work = workData.find((w) => w.slug === slug);

  const { navigate } = usePageTransition();

  // ── Matter.js ref ──
  const matterRef = useRef<HTMLDivElement | null>(null);
  const currentIndex = workData.findIndex((w) => w.slug === slug);
  const nextIndex = (currentIndex + 1) % workData.length;
  const nextWork = workData[nextIndex];

  // ── char 이벤트 ──
  const nextWorkBtnRef = useRef<HTMLButtonElement | null>(null);

  // 진입 stagger — next-work 섹션 보일 때 글자 올라옴
  useEffect(() => {
    if (!nextWorkBtnRef.current) return;

    const masks = nextWorkBtnRef.current.querySelectorAll('.char-mask');

    gsap.set(masks, { y: '100%', opacity: 0 });

    gsap.to(masks, {
      y: '0%',
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.03,
      scrollTrigger: {
        trigger: nextWorkBtnRef.current,
        start: 'top 80%',
      },
    });
  }, []);

  // hover시 char-inner stagger 효과
  const handleNextWorkEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const inners = e.currentTarget.querySelectorAll('.char-inner');
    gsap.to(inners, {
      y: '-1em',
      duration: 0.4,
      stagger: 0.03,
      ease: 'power2.out',
    });
  };

  const handleNextWorkLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const inners = e.currentTarget.querySelectorAll('.char-inner');
    gsap.to(inners, {
      y: '0em',
      duration: 0.4,
      stagger: 0.03,
      ease: 'power2.out',
    });
  };

  // ── 페이지 이동 이벤트 ──
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      window.location.href = '/';
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // ── 스크롤 이벤트 ──
  useEffect(() => {
    if (!work) return;

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);

    gsap.to(visualImg.current, {
      y: '10%',
      scrollTrigger: {
        trigger: visualWrap.current,
        start: 'top center',
        end: 'bottom bottom',
        scrub: true,
      },
    });

    mm.add('(min-width: 1024px)', () => {
      gsap.to(fakeBg.current, {
        top: '60%',
        scrollTrigger: {
          trigger: visualWrap.current,
          start: 'top +=50%',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to(fakeBg.current, {
        width: '100%',
        scrollTrigger: {
          trigger: visualWrap.current,
          start: 'top center',
          end: 'bottom center',
          scrub: true,
        },
      });
    });

    ScrollTrigger.refresh();

    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  // ── Matter.js 스타트 ──
  useEffect(() => {
    const isMobile = window.innerWidth <= 1023;
    if (!matterRef.current) return;

    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Body } = Matter;

    const section = matterRef.current;
    const width = section.clientWidth;
    const height = section.clientHeight;

    const engine = Engine.create();
    engine.gravity.y = 0;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      onEnter: () => {
        engine.gravity.y = 1;
      },
    });

    const render = Render.create({
      element: section,
      engine,
      options: {
        width,
        height,
        wireframes: false,
        background: 'transparent',
      },
    });

    const balls = Array.from({ length: isBelowPc ? 15 : 30 }, () => {
      const radius = isBelowPc ? Math.random() * 20 + 20 : Math.random() * 40 + 40; // mobile: 20~40, pc: 40~80
      const faceNum = Math.floor(Math.random() * 5) + 1;

      return Bodies.circle(Math.random() * (width - 100) + 50, Math.random() * 200, radius, {
        restitution: 0.8,
        friction: 0.01,
        frictionAir: 0.01,
        render: {
          sprite: {
            texture: `/assets/images/faceball${faceNum}.webp`,
            xScale: (radius * 2) / 750,
            yScale: (radius * 2) / 750,
          },
        },
      });
    });

    const floor = Bodies.rectangle(width / 2, height + 20, width, 40, {
      isStatic: true,
      render: { fillStyle: '#000' },
    });

    const leftWall = Bodies.rectangle(-20, height / 2, 40, height, {
      isStatic: true,
      render: { visible: false },
    });

    const rightWall = Bodies.rectangle(width + 20, height / 2, 40, height, {
      isStatic: true,
      render: { visible: false },
    });

    const topWall = Bodies.rectangle(width / 2, -20, width, 40, {
      isStatic: true,
      render: { visible: false },
    });

    Composite.add(engine.world, [...balls, floor, leftWall, rightWall, topWall]);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.15,
        render: { visible: false },
      },
    });

    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = render.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      balls.forEach((ball) => {
        if (mouseConstraint.body === ball) return;

        const dx = ball.position.x - mouseX;
        const dy = ball.position.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          const force = (120 - distance) * 0.000005;
          Body.applyForce(ball, ball.position, {
            x: dx * force,
            y: dy * force,
          });
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    return () => {
      trigger.kill();
      window.removeEventListener('mousemove', handleMouseMove);
      Render.stop(render);
      Runner.stop(runner);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);
  // ── Matter.js 끝 ──

  if (!work) return null;

  return (
    <>
      <div className="work-container">
        <div className="inner">
          <h3 className="work-detail-tit">{work.title}</h3>
          <ul className="work-head">
            <li>
              <div className="head-tit">
                <h3>Client</h3>
              </div>
              <div className="head-txt">
                <p>{work.client}</p>
              </div>
            </li>
            <li>
              <div className="head-tit">
                <h3>Roles</h3>
              </div>
              <div className="head-txt">
                <p>{work.roles.join(', ')}</p>
              </div>
            </li>
            <li>
              <div className="head-tit">
                <h3>Year</h3>
              </div>
              <div className="head-txt">
                <p>{work.year}</p>
              </div>
            </li>
            <li>
              <div className="head-tit">
                <h3>URL</h3>
              </div>
              <div className="head-txt">
                <Link href={`${work.url}`} target="_blank" role="새창열림">
                  {work.url}
                </Link>
              </div>
            </li>
          </ul>
        </div>
        <div className="content-wrap">
          <div className="visual-wrap" ref={visualWrap}>
            <div className="fake-bg" style={{ backgroundImage: `url(${work.visual})` }} role="img" aria-label={work.visualAlt} ref={fakeBg}></div>
          </div>
          <div className="about-project">
            <div className="inner">
              <div className="tit-wrap">
                <h3 className="tit">About Project</h3>
                <div className="info">
                  <div className="info-head">
                    <p>{work.description.head}</p>
                  </div>
                  <div className="info-body">
                    <p className="txt">{work.description.body[0]}</p>
                    <p className="txt">{work.description.body[1]}</p>
                    <p className="txt">{work.description.body[2]}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="uiux-wrap">
          <div className="inner">
            <div className="uiux-tit-wrap">
              <h3 className="tit">UI UX VIEWS</h3>
              <h3 className="sub-tit">Crafting Experiences, Visual Showcase</h3>
            </div>
          </div>
          <div className="video-area">
            <div className="video-wrap">
              <div className="inner">
                {work.videoUrl && (
                  <div className="video-con">
                    <video src={work.videoUrl} autoPlay={!isMobile} muted={!isMobile} loop={!isMobile} playsInline controls={isMobile}></video>
                  </div>
                )}
                {work.imgList && (
                  <>
                    <div className="scroll">[ SCROLL ]</div>
                    <div className="img-con">
                      <div className="scroll-wrap" data-lenis-prevent>
                        <Image src={work.imgList} className="img-list" alt="상세페이지" fill style={{ objectFit: 'cover' }} loading="lazy" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── next-work + Matter.js ── */}
        <div className="next-work">
          <div className="work-matter" ref={matterRef} aria-hidden="true" role="presentation" />
          <div className="inner">
            <button className="next-work-btn" ref={nextWorkBtnRef} onClick={() => navigate(`/work/${nextWork.slug}`)} onMouseEnter={handleNextWorkEnter} onMouseLeave={handleNextWorkLeave}>
              <p>
                <span className="hover-chars">
                  {'NEXT WORK'.split('').map((char, i) => (
                    <span key={i} className="char-mask">
                      <span className="char-inner">
                        <span className="char-original">{char === ' ' ? '\u00A0' : char}</span>
                        <span className="char-clone">{char === ' ' ? '\u00A0' : char}</span>
                      </span>
                    </span>
                  ))}
                </span>
              </p>
            </button>
          </div>
        </div>
        {/* ── next-work + Matter.js 끝 ── */}
      </div>
    </>
  );
}
