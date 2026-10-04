import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane3D } from './Plane3D';

const SECTIONS = [
  { id: 'home', label: 'Index', n: '00' },
  { id: 'about', label: 'About', n: '01' },
  { id: 'journey', label: 'Journey', n: '02' },
  { id: 'skills', label: 'Skills', n: '03' },
  { id: 'work', label: 'Work', n: '04' },
  { id: 'achievements', label: 'Achievements', n: '05' },
  { id: 'think', label: 'How I Think', n: '06' },
  { id: 'beyond', label: 'Beyond Code', n: '07' },
  { id: 'direction', label: 'NDA × IAF', n: '08' },
  { id: 'vision', label: 'Vision', n: '09' },
  { id: 'contact', label: 'Contact', n: '10' },
];

/**
 * Fixed vertical section rail (desktop only).
 * Highlights the active section and lets the user jump between them.
 */
export function SectionRail() {
  const [active, setActive] = useState('home');

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block pointer-events-none"
    >
      <Plane3D max={8} lift={12} glare={false} className="pointer-events-auto flex flex-col items-end gap-4 px-3 py-4 rounded-2xl glass border border-white/10 backdrop-blur-md">

      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            data-depth
            style={{ ['--depth' as any]: isActive ? 22 : 6 }}
            className="group flex items-center gap-3 pointer-events-auto"
          >
            <AnimatePresence>
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground"
                >
                  <span className="text-foreground/40 mr-2">{s.n}</span>
                  {s.label}
                </motion.span>
              )}
            </AnimatePresence>
            <span
              className={`relative block transition-all duration-500 ${
                isActive ? 'w-8 h-[2px] bg-foreground' : 'w-4 h-px bg-foreground/25 group-hover:bg-foreground/60 group-hover:w-6'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="rail-glow"
                  className="absolute inset-0 blur-[3px] bg-foreground/80"
                />
              )}
            </span>
          </a>
        );
      })}
      </Plane3D>
    </motion.aside>
  );
}
