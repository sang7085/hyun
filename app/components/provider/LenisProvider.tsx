"use client";

import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { PropsWithChildren } from "react";

export default function LenisProvider({
  children,
}: PropsWithChildren) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        autoResize: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}