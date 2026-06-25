import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Premium custom cursor: outer ring + inner dot, magnetic to interactive elements.
 * Disabled on touch devices.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const dx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const dy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const rx = useSpring(x, { stiffness: 120, damping: 18, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 120, damping: 18, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      setHovering(!!t.closest('a, button, [role="button"], [data-cursor="hover"]'));
    };
    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseover', over);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[200] rounded-full mix-blend-difference"
        style={{
          x: dx,
          y: dy,
          translateX: '-50%',
          translateY: '-50%',
          width: 6,
          height: 6,
          background: 'white',
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[199] rounded-full border"
        style={{
          x: rx,
          y: ry,
          translateX: '-50%',
          translateY: '-50%',
          borderColor: 'hsl(var(--foreground) / 0.4)',
          width: hovering ? 56 : 34,
          height: hovering ? 56 : 34,
          backgroundColor: hovering ? 'hsl(var(--foreground) / 0.06)' : 'transparent',
          transition: 'width 220ms ease, height 220ms ease, background-color 220ms ease',
        }}
      />
    </>
  );
}
