import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  to: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

/** Number that counts up smoothly the first time it scrolls into view. */
export function AnimatedCounter({ to, suffix = '', className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const value = useMotionValue(0);
  const spring = useSpring(value, { stiffness: 70, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v).toString());

  useEffect(() => {
    if (inView) value.set(to);
  }, [inView, to, value]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}
