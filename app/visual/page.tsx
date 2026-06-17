'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useVisualStore } from '@/store/useVisualStore';

gsap.registerPlugin(ScrollTrigger);

export default function VisualPage() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const sequenceRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gearRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);
  const setVisualReady = useVisualStore((s) => s.setVisualReady); // visual 섹션 scrollTrigger가 활성화되면 true로 변경

  const items = [
    { title: 'TITLE 1', desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit alias, voluptatum rem dolor aliquam tempora modi voluptates, perferendis autem earum, maxime reiciendis qui quos eum aliquid placeat ducimus ipsum possimus?' },
    { title: 'TITLE 2', desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit alias, voluptatum rem dolor aliquam tempora modi voluptates, perferendis autem earum, maxime reiciendis qui quos eum aliquid placeat ducimus ipsum possimus?' },
    { title: 'TITLE 3', desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit alias, voluptatum rem dolor aliquam tempora modi voluptates, perferendis autem earum, maxime reiciendis qui quos eum aliquid placeat ducimus ipsum possimus?' },
  ];

  const frames = Array.from(
    { length: 20 },
    (_, i) => `/sequence/frame_${String(i + 1).padStart(2, '0')}.png`
  );

  useLayoutEffect(() => {

    
    // ── Three.js 세팅 ──
    const canvas = canvasRef.current!;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(-.15, 0, 0.3);

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
      const loader = new GLTFLoader();
      loader.load('/model/mycharactor2.glb', (gltf) => {
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

        gsap.set(itemRefs.current, { y: 100, opacity: 0, filter: "blur(10px)" });

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

        tl.to(textRef.current, { display: 'none' }, '<');

        tl.addLabel('items-start');

        tl.to(sequenceRef.current, { opacity: 0 }, 'items-start');
        tl.to(canvasRef.current, { opacity: 1 }, 'items-start');
        tl.to(camera.position, { z: 0.7 }, 'items-start');

        tl.to(model.rotation, {
          y: Math.PI * -0.05,
          duration: itemRefs.current.length * 0.5,
        }, 'items-start');

        itemRefs.current.forEach((item, i) => {
          if (i > 0) {
            tl.to(itemRefs.current[i - 1], {
              y: -100,
              opacity: 0,
              filter: "blur(10px)",
              ease: 'none',
              duration: 0.3,
            }, `items-start+=${i * 0.5}`);
          }

          tl.to(item, {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            ease: 'none',
            duration: 0.5,
          }, `items-start+=${i * 0.5}`);
          
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
    <section className="visual-section">
      <div className="section-pin-wrap" ref={sectionRef}>
        <div className='img-box'>
          <img
            className="sequence-image"
            ref={sequenceRef}
            src="/sequence/frame_01.png"
            alt=""
          />
        </div>
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <clipPath id="gear" clipPathUnits="objectBoundingBox">
              <path d="M 0.4473,0.0532 Q 0.5000,0.0000 0.5527,0.0532 Q 0.6054,0.1065 0.6777,0.0867 Q 0.7500,0.0670 0.7690,0.1395 Q 0.7881,0.2119 0.8605,0.2310 Q 0.9330,0.2500 0.9133,0.3223 Q 0.8935,0.3946 0.9468,0.4473 Q 1.0000,0.5000 0.9468,0.5527 Q 0.8935,0.6054 0.9133,0.6777 Q 0.9330,0.7500 0.8605,0.7690 Q 0.7881,0.7881 0.7690,0.8605 Q 0.7500,0.9330 0.6777,0.9133 Q 0.6054,0.8935 0.5527,0.9468 Q 0.5000,1.0000 0.4473,0.9468 Q 0.3946,0.8935 0.3223,0.9133 Q 0.2500,0.9330 0.2310,0.8605 Q 0.2119,0.7881 0.1395,0.7690 Q 0.0670,0.7500 0.0867,0.6777 Q 0.1065,0.6054 0.0532,0.5527 Q 0.0000,0.5000 0.0532,0.4473 Q 0.1065,0.3946 0.0867,0.3223 Q 0.0670,0.2500 0.1395,0.2310 Q 0.2119,0.2119 0.2310,0.1395 Q 0.2500,0.0670 0.3223,0.0867 Q 0.3946,0.1065 0.4473,0.0532 Z" />
            </clipPath>
          </defs>
        </svg>
        <div className="gear-wrap" ref={gearRef}></div>
        <div className="title-wrap" ref={textRef}>
          <h2 className="visual-sub-tit">CREATIVE PUBLISHER</h2>
          <h2 className="visual-tit">INTERACTIVE <br /> PUBLISHING</h2>
        </div>
        <canvas
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
              ref={(el) => { if (el) itemRefs.current[i] = el; }}
            >
              <h3 className='title'>{item.title}</h3>
              <p className='desc'>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}