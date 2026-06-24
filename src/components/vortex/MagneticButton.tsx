import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  strength?: number;
  as?: 'a' | 'button';
  type?: 'button' | 'submit';
  download?: boolean;
}

/**
 * Magnetic button — cursor proximity pulls the element with a soft spring.
 * Falls back gracefully on touch devices (no pointer events fire).
 */
export function MagneticButton({
  children,
  className,
  href,
  onClick,
  strength = 0.35,
  as,
  type = 'button',
  download,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 15, mass: 0.4 });
  const rotateX = useTransform(sy, [-30, 30], [8, -8]);
  const rotateY = useTransform(sx, [-30, 30], [-8, 8]);

  const handleMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width / 2);
    const my = e.clientY - (r.top + r.height / 2);
    x.set(mx * strength);
    y.set(my * strength);
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Tag = (as ?? (href ? 'a' : 'button')) as 'a' | 'button';

  return (
    <motion.div
      style={{ x: sx, y: sy, rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className="inline-block"
    >
      {/* @ts-expect-error polymorphic ref */}
      <Tag
        ref={ref}
        href={href}
        onClick={onClick}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        type={Tag === 'button' ? type : undefined}
        download={download}
        className={cn('relative inline-flex items-center justify-center select-none', className)}
      >
        {children}
      </Tag>
    </motion.div>
  );
}
