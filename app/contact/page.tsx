'use client';

import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

export default function ContactPage() {
  const sceneRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    const {
      Engine,
      Render,
      Runner,
      Bodies,
      Composite,
      Mouse,
      MouseConstraint,
      Body,
    } = Matter;

    const section = sceneRef.current;

    const width = section.clientWidth;
    const height = section.clientHeight;

    const engine = Engine.create();

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

      return Bodies.circle(
        Math.random() * (width - 100) + 50,
        Math.random() * 200,
        radius,
        {
          restitution: 0.8,
          friction: 0.01,
          frictionAir: 0.01,
          render: {
            sprite: {
              texture: '/assets/images/faceball.png',
              xScale: (radius * 2) / 1450,
              yScale: (radius * 2) / 1386,
            },
          },
        }
      );
    });

    const floor = Bodies.rectangle(
      width / 2,
      height + 20,
      width,
      40,
      {
        isStatic: true,
        render: {
          fillStyle: '#000',
        },
      }
    );

    const leftWall = Bodies.rectangle(
      -20,
      height / 2,
      40,
      height,
      {
        isStatic: true,
        render: {
          visible: false,
        },
      }
    );

    const rightWall = Bodies.rectangle(
      width + 20,
      height / 2,
      40,
      height,
      {
        isStatic: true,
        render: {
          visible: false,
        },
      }
    );

    const topWall = Bodies.rectangle(
      width / 2,
      -20,
      width,
      40,
      {
        isStatic: true,
        render: {
          visible: false,
        },
      }
    );

    Composite.add(engine.world, [
      ...balls,
      floor,
      leftWall,
      rightWall,
      topWall,
    ]);

    const mouse = Mouse.create(render.canvas);

    const mouseConstraint = MouseConstraint.create(
      engine,
      {
        mouse,
        constraint: {
          stiffness: 0.15,
          render: {
            visible: false,
          },
        },
      }
    );

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

        const distance = Math.sqrt(
          dx * dx + dy * dy
        );

        if (distance < 120) {
          const force = (120 - distance) * 0.000005;

          Body.applyForce(
            ball,
            ball.position,
            {
              x: dx * force,
              y: dy * force,
            }
          );
        }
      });
    };

    window.addEventListener(
      'mousemove',
      handleMouseMove
    );

    Render.run(render);

    const runner = Runner.create();
    Runner.run(runner, engine);

    return () => {
      window.removeEventListener(
        'mousemove',
        handleMouseMove
      );

      Render.stop(render);
      Runner.stop(runner);

      Composite.clear(
        engine.world,
        false
      );
      Engine.clear(engine);

      render.canvas.remove();
    };
  }, []);

  return (
    <>
      <section
        className='contact-section'
        style={{
          position: 'relative',
        }}
      >
        <div className="contact-wrap">
          <p
            style={{
              fontSize: "3vw",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#fff"

            }}
          >contact</p>
        </div>
        <div
          className='matter-wrap'
          ref={sceneRef}
          style={{
            position: "absolute",
            inset: "0",
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
            background: 'linear-gradient(180deg, #F4F2F1 0%, #D9D4D2 100%)',
            // pointerEvents: "none",
          }}></div>
      </section>
    </>
  );
}