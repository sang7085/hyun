"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  // 타입 지정
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    // null 방어
    if (!canvas) return;
    // context 타입 지정
    const context = canvas.getContext("2d");
    // null 방어
    if (!context) return;

    // frame 개수
    const frameCount = 30;

    // frame path
    const currentFrame = (index: number): string =>
      // `/sequence/frame_${String(index + 1).padStart(3, "0")}.webp`;
      `/sequence/frame_${String(index + 1).padStart(3, "0")}_1.png`;

    // 이미지 배열 타입 지정
    const images: HTMLImageElement[] = [];

    // sequence 타입 지정
    const sequence: { frame: number } = {
      frame: 0,
    };

    // 이미지 preload
    for (let i = 0; i < frameCount; i += 1) {
      const image = new Image();
      image.src = currentFrame(i);
      images.push(image);
    }

    // canvas size
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight / 1.5;

    // render
    const render = (): void => {
      const image = images[sequence.frame];
      if (!image) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height
      );
    };

    // 첫 프레임 로드
    images[0].onload = render;

    // gsap tween 저장
    const tween = gsap.to(sequence, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      onUpdate: render,
      scrollTrigger: {
        trigger: ".about-section",
        pin: true,
        scrub: 1,
        end: "+=200%",
        // markers: true,
      },
    });

    return () => {
      tween.kill();
      tween.scrollTrigger?.kill();
    };
  }, []);

  return (
    <section className="about-section">
      <canvas ref={canvasRef} className="sequence-canvas" />
    </section>
  );
}