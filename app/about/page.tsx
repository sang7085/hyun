'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import profileImg from '@/public/assets/images/profile.webp';

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  return (
    <section id="about" className="about-section">
      <ul className="core-value-wrap">
        <li className="value-list">
          <h4 className="desc">corevalue</h4>
          <h3 className="title">why</h3>
        </li>
      </ul>
      <div className="img-box">
        <Image src={profileImg} fill alt="프로필이미지" />
      </div>
    </section>
  );
}
