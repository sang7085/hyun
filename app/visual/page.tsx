'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { useVisualStore } from '@/store/useVisualStore';

gsap.registerPlugin(ScrollTrigger);

export default function VisualPage() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const sequenceRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gearRef = useRef<HTMLDivElement>(null);
  const textRef1 = useRef<HTMLDivElement>(null);
  const textRef2 = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);
  const setVisualReady = useVisualStore((s) => s.setVisualReady); // visual 섹션 scrollTrigger가 활성화되면 true로 변경

  const items = [
    {
      title: 'INTERACTION',
      desc: `단순히 화면을 만드는 것을 넘어 사용자와 콘텐츠가 자연스럽게 연결될 수 있는 경험을 고민합니다. 스크롤과 모션을 활용해 흐름을 설계하고, 사용자가 머무를 수 있는 인터랙션을 구현합니다.`,
    },
    {
      title: 'USER EXPERIENCE',
      desc: `사용자는 복잡한 기능보다 자연스러운 경험을 기억합니다. 직관적인 인터페이스와 부드러운 인터랙션을 통해 사용자가 콘텐츠에 집중할 수 있는 환경을 구현합니다. 작은 디테일 하나까지 사용자 관점에서 고민합니다.`,
    },
    {
      title: 'GROWTH',
      desc: `기술은 끊임없이 변화하고 사용자의 기대 역시 높아지고 있습니다. 새로운 기술과 트렌드를 꾸준히 학습하며 실제 프로젝트에 적용하고, 더 나은 결과를 만들기 위해 지속적으로 개선합니다. 성장은 개발자의 가장 중요한 역량이라고 생각합니다.`,
    },
  ];

  const frames = Array.from({ length: 20 }, (_, i) => `/sequence/frame_${String(i + 1).padStart(2, '0')}.webp`);

  useLayoutEffect(() => {
    // ── Three.js 세팅 ──
    const canvas = canvasRef.current!;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(-0.15, 0, 0.3);

    const ambient = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambient);

    const dir = new THREE.DirectionalLight(0xffffff, 2);
    dir.position.set(5, 5, 5);
    scene.add(dir);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(-100, 3, 4);
    scene.add(keyLight);

    let model: THREE.Group | null = null;

    // ── GSAP Context ──
    const ctx = gsap.context(() => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');

      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);

      loader.load('/model/mycharactor2-draco.glb', (gltf) => {
        model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        model.rotation.y = Math.PI * -4;

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const mat = child.material as THREE.MeshStandardMaterial;
            mat.roughness = 1;
            mat.metalness = 0;
            mat.needsUpdate = true;
          }
        });

        scene.add(model);

        gsap.set(itemRefs.current, { y: 100, opacity: 0, filter: 'blur(10px)' });

        const sequence = { frame: 0 };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=900%',
            scrub: 1,
            pin: true,
            onUpdate: (self) => {
              if (self.progress > 0.3) {
                sectionRef.current?.classList.add('canvas-bg');
              } else {
                sectionRef.current?.classList.remove('canvas-bg');
              }
            },
          },
        });

        tl.to(sequence, {
          frame: 19,
          ease: 'none',
          duration: 0.3,
          onUpdate: () => {
            if (!sequenceRef.current) return;
            sequenceRef.current.src = frames[Math.round(sequence.frame)];
          },
        });

        tl.to(gearRef.current, {
          rotate: 180,
          scale: 100,
          ease: 'none',
        });

        tl.to(textRef1.current, { display: 'none' }, '<');
        tl.to(textRef2.current, { display: 'none' }, '<');

        tl.addLabel('items-start');

        tl.to(sequenceRef.current, { opacity: 0 }, 'items-start');
        tl.to(canvasRef.current, { opacity: 1 }, 'items-start');
        tl.to(camera.position, { z: 0.7 }, 'items-start');

        tl.to(
          model.rotation,
          {
            y: Math.PI * -0.05,
            duration: itemRefs.current.length * 0.5,
          },
          'items-start'
        );

        itemRefs.current.forEach((item, i) => {
          if (i > 0) {
            tl.to(
              itemRefs.current[i - 1],
              {
                y: -100,
                opacity: 0,
                // filter: "blur(10px)",
                ease: 'none',
                duration: 0.3,
              },
              `items-start+=${i * 0.5}`
            );
          }

          tl.to(
            item,
            {
              y: 0,
              opacity: 1,
              filter: 'blur(0px)',
              ease: 'none',
              duration: 0.5,
            },
            `items-start+=${i * 0.5}`
          );
        });

        ScrollTrigger.refresh();
        setVisualReady(); // visual섹션 준비되면 true로 변경 // work섹션 스크롤 트리거 위치 오류방지
      });
    }, sectionRef);

    // 애니메이션 루프
    let rafId: number;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      renderer.dispose();
      ctx.revert(); // ScrollTrigger 포함 전부 정리
    };
  }, []);

  return (
    <section id="visual" className="visual-section" aria-label="비주얼 섹션">
      <div className="section-pin-wrap" ref={sectionRef}>
        <div className="img-box">
          <img className="sequence-image" ref={sequenceRef} src="/sequence/frame_01.webp" alt="시퀀스 애니메이션 이미지" />
        </div>
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <defs>
            <clipPath id="gear" clipPathUnits="objectBoundingBox">
              <path d="M 0.4473,0.0532 Q 0.5000,0.0000 0.5527,0.0532 Q 0.6054,0.1065 0.6777,0.0867 Q 0.7500,0.0670 0.7690,0.1395 Q 0.7881,0.2119 0.8605,0.2310 Q 0.9330,0.2500 0.9133,0.3223 Q 0.8935,0.3946 0.9468,0.4473 Q 1.0000,0.5000 0.9468,0.5527 Q 0.8935,0.6054 0.9133,0.6777 Q 0.9330,0.7500 0.8605,0.7690 Q 0.7881,0.7881 0.7690,0.8605 Q 0.7500,0.9330 0.6777,0.9133 Q 0.6054,0.8935 0.5527,0.9468 Q 0.5000,1.0000 0.4473,0.9468 Q 0.3946,0.8935 0.3223,0.9133 Q 0.2500,0.9330 0.2310,0.8605 Q 0.2119,0.7881 0.1395,0.7690 Q 0.0670,0.7500 0.0867,0.6777 Q 0.1065,0.6054 0.0532,0.5527 Q 0.0000,0.5000 0.0532,0.4473 Q 0.1065,0.3946 0.0867,0.3223 Q 0.0670,0.2500 0.1395,0.2310 Q 0.2119,0.2119 0.2310,0.1395 Q 0.2500,0.0670 0.3223,0.0867 Q 0.3946,0.1065 0.4473,0.0532 Z" />
            </clipPath>
          </defs>
        </svg>
        <div className="gear-wrap" ref={gearRef} aria-hidden="true"></div>
        <div className="title-wrap" ref={textRef1}>
          {/* <h2 className="visual-sub-tit">CREATIVE PUBLISHER</h2> */}
          <h2 className="visual-tit">
            USER <br />
            EXPERIENCE
          </h2>
        </div>
        <div className="title-wrap right" ref={textRef2}>
          {/* <h2 className="visual-sub-tit">CREATIVE PUBLISHER</h2> */}
          <h2 className="visual-tit">
            INTERACTIVE <br /> PUBLISHING
          </h2>
        </div>
        <canvas
          aria-hidden="true"
          ref={canvasRef}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100vh',
            display: 'block',
            opacity: 0,
          }}
        />
        <div className="item-wrap">
          {items.map((item, i) => (
            <div
              key={i}
              className="text-item"
              ref={(el) => {
                if (el) itemRefs.current[i] = el;
              }}
            >
              <h3 className="title">{item.title}</h3>
              <p className="desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
