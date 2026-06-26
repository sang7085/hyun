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

gsap.registerPlugin(ScrollTrigger, CustomEase);

export default function WorkList() {
  const mm = gsap.matchMedia();

  const visualWrap = useRef(null);
  const visualImg = useRef(null);
  const fakeBg = useRef(null);
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const work = workData.find((w) => w.slug === slug);
  const [isMobile, setIsMobile] = useState(false);

  const { navigate } = usePageTransition();

  // 다음 work로 이동
  const currentIndex = workData.findIndex((w) => w.slug === slug);
  const nextIndex = (currentIndex + 1) % workData.length;
  const nextWork = workData[nextIndex];

  // 뒤로가기 gsap 초기화
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

  useEffect(() => {
    if (!work) return;

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);

    if (window.innerWidth < 1024) {
      setIsMobile(true);
    }

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
    });

    ScrollTrigger.refresh();

    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

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
        <div className="next-work">
          <div className="inner">
            <button className="next-work-btn" onClick={() => navigate(`/work/${nextWork.slug}`)}>
              <p>GO TO THE NEXT WORK</p>
              <div className="arrow">
                <svg width="55" height="81" viewBox="0 0 55 81" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="27.5" y1="1" x2="27.5" y2="81" stroke="currentColor"></line>
                  <line x1="27.3536" y1="0.646447" x2="54.3536" y2="27.6464" stroke="currentColor"></line>
                  <line y1="-0.5" x2="38.1838" y2="-0.5" transform="matrix(-0.707107 0.707107 0.707107 0.707107 28 1)" stroke="currentColor"></line>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
