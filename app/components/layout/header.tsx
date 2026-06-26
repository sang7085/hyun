'use client';

import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PlusIcon from '@/app/components/icon/PlusIcon';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { usePageTransition } from '@/hooks/usePageTransition';

gsap.registerPlugin(ScrollToPlugin);

export default function Header() {
  const pathname = usePathname();
  const { navigate } = usePageTransition();
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
            HYUN.
          </button>
        </h1>
        {!isWorkPage ? (
          <nav aria-label="메인 네비게이션">
            <ul>
              <li>
                <a href="#visual" onClick={(e) => handleNav(e, 'visual')} aria-label="visual 섹션으로 이동">
                  VISUAL
                </a>
              </li>
              <li>
                <a href="#work" onClick={(e) => handleNav(e, 'work')} aria-label="work 섹션으로 이동">
                  WORK
                </a>
              </li>
              <li>
                <a href="#contact" onClick={(e) => handleNav(e, 'contact')} aria-label="contact 섹션으로 이동">
                  CONTACT
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
                  HOME
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
