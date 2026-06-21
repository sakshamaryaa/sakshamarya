import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/** Top-of-page scroll progress bar with gradient fill. */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
      setProgress(scrolled || 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left bg-gradient-primary"
      style={{ scaleX: progress }}
      aria-hidden="true"
    />
  );
}
