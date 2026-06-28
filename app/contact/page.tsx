'use client';

import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useVisualStore } from '@/store/useVisualStore';
gsap.registerPlugin(ScrollTrigger);

export default function ContactPage() {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const isVisualReady = useVisualStore((s) => s.isVisualReady);

  useEffect(() => {
    if (!sceneRef.current || !isVisualReady) return;

    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Body } = Matter;

    const section = sceneRef.current;

    const width = section.clientWidth;
    const height = section.clientHeight;

    const engine = Engine.create();
    engine.gravity.y = 0;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      // markers: true,

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

    const balls = Array.from({ length: 30 }, () => {
      const radius = Math.random() * 40 + 40; // 40~80
      const faceNum = Math.floor(Math.random() * 5) + 1; // 1~5 랜덤

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
      render: {
        fillStyle: '#000',
      },
    });

    const leftWall = Bodies.rectangle(-20, height / 2, 40, height, {
      isStatic: true,
      render: {
        visible: false,
      },
    });

    const rightWall = Bodies.rectangle(width + 20, height / 2, 40, height, {
      isStatic: true,
      render: {
        visible: false,
      },
    });

    const topWall = Bodies.rectangle(width / 2, -20, width, 40, {
      isStatic: true,
      render: {
        visible: false,
      },
    });

    Composite.add(engine.world, [...balls, floor, leftWall, rightWall, topWall]);

    const mouse = Mouse.create(render.canvas);

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.15,
        render: {
          visible: false,
        },
      },
    });

    Composite.add(engine.world, mouseConstraint);

    render.mouse = mouse;

    // 마우스 근처 지나가면 공 밀어내기
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
  }, [isVisualReady]);

  return (
    <>
      <section id="contact" className="contact-section">
        <div className="contact-wrap">
          <a href="mailto:sang7085@gmail.com" className="contact" aria-label="이메일로 연락하기 (sang7085@gmail.com)">
            CONTACT
          </a>
        </div>
        <div className="matter-wrap" ref={sceneRef} aria-hidden="true" role="presentation" />
      </section>
    </>
  );
}
