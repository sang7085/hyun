'use client';

import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PlusIcon from '@/app/components/icon/PlusIcon';
import HoverChars from '@/app/components/effect/HoverChars';
import { usePathname } from 'next/navigation';

gsap.registerPlugin(ScrollToPlugin);

export default function Header() {
  const pathname = usePathname();
  const isWorkPage = pathname.startsWith('/work');

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    ScrollTrigger.refresh();
    gsap.to(window, {
      duration: 1,
      scrollTo: `#${id}`,
      ease: 'power2.inOut',
    });
  };

  return (
    <header className="header" role="banner">
      <div className="inner">
        <h1 className="logo">
          <button onClick={() => (window.location.href = '/')} aria-label="홈으로 이동">
            <span className="hover-chars">
              {'HYUN.'.split('').map((char, i) => (
                <span key={i} className="char-mask">
                  <span className="char-inner">
                    <span className="char-original">{char}</span>
                    <span className="char-clone">{char}</span>
                  </span>
                </span>
              ))}
            </span>
          </button>
        </h1>
        {!isWorkPage ? (
          <nav aria-label="메인 네비게이션">
            <ul>
              <li>
                <a href="#visual" onClick={(e) => handleNav(e, 'visual')} aria-label="visual 섹션으로 이동">
                  <HoverChars text="VISUAL" />
                </a>
              </li>
              <li>
                <a href="#work" onClick={(e) => handleNav(e, 'work')} aria-label="work 섹션으로 이동">
                  <HoverChars text="WORK" />
                </a>
              </li>
              <li>
                <a href="#contact" onClick={(e) => handleNav(e, 'contact')} aria-label="contact 섹션으로 이동">
                  <HoverChars text="CONTACT" />
                </a>
              </li>
            </ul>
          </nav>
        ) : (
          <nav aria-label="work detail 네비게이션">
            <ul>
              <li>
                {/* Link사용시 클라이언트 네비게이션이라 GSAP 상태가 그대로 유지되어
                button태그로 진행 */}
                <button aria-label="홈으로 이동" onClick={() => (window.location.href = '/')}>
                  <HoverChars text="HOME" />
                </button>
              </li>
            </ul>
          </nav>
        )}
        <PlusIcon />
      </div>
    </header>
  );
}
