import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { ReactNode, useRef, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface Plane3DProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees on each axis. Default 14 (pronounced/cinematic). */
  max?: number;
  /** Hover lift on Z axis in px. Default 30. */
  lift?: number;
  /** Show cursor-tracking glare sweep. Default true. */
  glare?: boolean;
  /** Perspective distance in px. Default 1200. */
  perspective?: number;
  /** Inline style passthrough on the outer wrapper. */
  style?: CSSProperties;
}

/**
 * Cinematic 3D plane wrapper.
 * - Pointer-tracked rotateX/rotateY with spring return
 * - translateZ lift + deepening drop shadow on hover
 * - Cursor-following radial glare sweep (mix-blend-overlay)
 * - Children may declare data-depth="0..1" to translate on Z proportionally
 * - Respects prefers-reduced-motion
 */
export function Plane3D({
  children,
  className,
  max = 14,
  lift = 30,
  glare = true,
  perspective = 1200,
  style,
}: Plane3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const hovered = useMotionValue(0);

  const springCfg = { stiffness: 180, damping: 20, mass: 0.6 };
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), springCfg);
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), springCfg);
  const tz = useSpring(useTransform(hovered, [0, 1], [0, lift]), springCfg);
  const shadowOpacity = useTransform(hovered, [0, 1], [0.25, 0.55]);
  const shadowBlur = useTransform(hovered, [0, 1], [30, 60]);
  const shadow = useTransform([shadowBlur, shadowOpacity], ([b, o]: number[]) =>
    `0 ${20 + b * 0.4}px ${b}px -10px rgba(3, 8, 24, ${o}), 0 0 0 1px rgba(255,255,255,0.04)`
  );

  const glareX = useTransform(px, (v) => `${v * 100}%`);
  const glareY = useTransform(py, (v) => `${v * 100}%`);
  const glareBg = useTransform(
    [glareX, glareY],
    ([x, y]: string[]) =>
      `radial-gradient(500px circle at ${x} ${y}, rgba(255,255,255,0.22), rgba(255,255,255,0.06) 20%, transparent 55%)`
  );

  const onMove = (e: React.PointerEvent) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)));
    py.set(Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)));
  };
  const onEnter = () => !reduced && hovered.set(1);
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
    hovered.set(0);
  };

  if (reduced) {
    return (
      <div ref={ref} className={cn('relative', className)} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
        ...style,
      }}
      className={cn('relative', className)}
    >
      <motion.div
        style={{
          rotateX: rx,
          rotateY: ry,
          z: tz,
          transformStyle: 'preserve-3d',
          boxShadow: shadow,
          borderRadius: 'inherit',
        }}
        className="relative h-full w-full will-change-transform"
      >
        {/* Depth layer: children opting into data-depth get translated on Z */}
        <div
          className="relative h-full w-full [&_[data-depth]]:transition-transform [&_[data-depth]]:duration-300"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {children}
        </div>

        {glare && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 mix-blend-overlay"
            style={{ background: glareBg, opacity: hovered }}
          />
        )}
      </motion.div>

      {/* Depth-layer helper: apply transforms via CSS on hover */}
      <style>{`
        [data-depth]{ transform: translateZ(calc(var(--depth, 0) * 1px)); }
      `}</style>
    </motion.div>
  );
}
