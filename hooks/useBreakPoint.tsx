// hooks/useBreakpoint.ts
import { useState, useEffect } from 'react';

type Breakpoint = 'mobile' | 'tablet' | 'smallPc' | 'pc';

function getBreakpoint(width: number): Breakpoint {
  if (width < 375) return 'mobile';
  if (width < 768) return 'tablet';
  if (width < 1024) return 'smallPc';
  return 'pc';
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => (typeof window !== 'undefined' ? getBreakpoint(window.innerWidth) : 'pc'));

  useEffect(() => {
    const handleResize = () => setBreakpoint(getBreakpoint(window.innerWidth));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isSmallPc: breakpoint === 'smallPc',
    isPc: breakpoint === 'pc',
    // 1024 미만 전체
    isBelowPc: breakpoint !== 'pc',
  };
}
