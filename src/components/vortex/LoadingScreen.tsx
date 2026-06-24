import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Premium loading screen: animated SA monogram, progress bar to 100%,
 * then unmounts. Sessions skip after the first load via sessionStorage.
 */
export function LoadingScreen() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !sessionStorage.getItem('vortex_loaded');
  });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let p = 0;
    const id = setInterval(() => {
      p = Math.min(100, p + (100 - p) * 0.18 + 2);
      setProgress(p);
      if (p >= 99.5) {
        clearInterval(id);
        setTimeout(() => {
          sessionStorage.setItem('vortex_loaded', '1');
          setVisible(false);
        }, 350);
      }
    }, 90);
    return () => clearInterval(id);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
          transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden"
        >
          {/* ambient gradient */}
          <div className="absolute inset-0 bg-gradient-primary opacity-10 blur-3xl" />
          <div className="absolute inset-0 grid-pattern opacity-30" />

          <div className="relative flex flex-col items-center gap-8 px-6">
            <motion.div
              initial={{ scale: 0.4, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative size-24 rounded-2xl bg-gradient-primary animate-glow"
              style={{ backgroundSize: '200% 200%' }}
            >
              <motion.div
                className="absolute inset-[3px] rounded-[14px] bg-background flex items-center justify-center"
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="text-gradient font-display font-bold text-3xl tracking-tight">SA</span>
              </motion.div>
              {/* orbiting dot */}
              <motion.div
                aria-hidden
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
              >
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 size-2 rounded-full bg-accent shadow-[0_0_12px_hsl(var(--accent))]" />
              </motion.div>
            </motion.div>

            <div className="flex flex-col items-center gap-3 w-64">
              <div className="font-mono text-[10px] tracking-[0.5em] text-muted-foreground uppercase">
                Initializing Vortex
              </div>
              <div className="h-[2px] w-full rounded-full bg-muted/60 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-primary"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut' }}
                />
              </div>
              <div className="font-mono text-xs text-muted-foreground tabular-nums">
                {Math.round(progress)}%
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
