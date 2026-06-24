import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface SkillBarProps {
  label: string;
  value: number; // 0-100
  delay?: number;
}

/** Animated skill progress bar with gradient fill, reveals on scroll. */
export function SkillBar({ label, value, delay = 0 }: SkillBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs font-mono text-muted-foreground">{value}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full bg-gradient-primary"
          style={{ backgroundSize: '200% 200%' }}
        />
      </div>
    </div>
  );
}
