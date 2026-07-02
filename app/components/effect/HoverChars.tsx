// components/HoverChars.tsx
'use client';

import gsap from 'gsap';
import { useRef } from 'react';

export default function HoverChars({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    const chars = ref.current?.querySelectorAll('.char-inner');
    gsap.to(chars ?? [], { y: '-1em', duration: 0.4, stagger: 0.03, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    const chars = ref.current?.querySelectorAll('.char-inner');
    gsap.to(chars ?? [], { y: '0em', duration: 0.4, stagger: 0.03, ease: 'power2.out' });
  };

  return (
    <span className="hover-chars" ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {text.split('').map((char, i) => (
        <span key={i} className="char-mask">
          <span className="char-inner">
            <span className="char-original">{char}</span>
            <span className="char-clone">{char}</span>
          </span>
        </span>
      ))}
    </span>
  );
}
