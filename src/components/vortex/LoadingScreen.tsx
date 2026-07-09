import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Cinematic loading screen: rotating vortex rings, kinetic "VORTEX" wordmark,
 * status readout, and progress ticker. Skips after first load per session.
 */
export function LoadingScreen() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !sessionStorage.getItem('vortex_loaded');
  });
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('BOOTING SYSTEM');

  useEffect(() => {
    if (!visible) return;
    let p = 0;
    const id = setInterval(() => {
      p = Math.min(100, p + (100 - p) * 0.14 + 1.4);
      setProgress(p);
      if (p < 25) setStatus('BOOTING SYSTEM');
      else if (p < 55) setStatus('CALIBRATING INTERFACE');
      else if (p < 82) setStatus('RENDERING EXPERIENCE');
      else setStatus('WELCOME');
      if (p >= 99.5) {
        clearInterval(id);
        setTimeout(() => {
          sessionStorage.setItem('vortex_loaded', '1');
          setVisible(false);
        }, 500);
      }
    }, 80);
    return () => clearInterval(id);
  }, [visible]);

  const letters = 'VORTEX'.split('');

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03, filter: 'blur(12px)' }}
          transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden"
        >
          {/* ambient layers */}
          <div className="absolute inset-0 bg-gradient-primary opacity-[0.08] blur-3xl" />
          <div className="absolute inset-0 grid-pattern opacity-20" />
          <motion.div
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                'radial-gradient(circle at center, hsl(var(--primary) / 0.18), transparent 55%)',
            }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* corner HUD marks */}
          <div className="pointer-events-none absolute inset-6 hidden sm:block">
            {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
              <div key={i} className={`absolute ${pos} size-4 border-foreground/30`} style={{
                borderTopWidth: pos.includes('top') ? 1 : 0,
                borderBottomWidth: pos.includes('bottom') ? 1 : 0,
                borderLeftWidth: pos.includes('left') ? 1 : 0,
                borderRightWidth: pos.includes('right') ? 1 : 0,
              }} />
            ))}
          </div>

          <div className="pointer-events-none absolute top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.6em] text-muted-foreground uppercase">
            v 1.0 · MR. VORTEX
          </div>
          <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.5em] text-muted-foreground uppercase">
            © SAKSHAM ARYA — BIHAR, IN
          </div>

          <div className="relative flex flex-col items-center gap-10 px-6">
            {/* rotating vortex emblem */}
            <div className="relative size-40 sm:size-48">
              {/* outer ring */}
              <motion.div
                aria-hidden
                className="absolute inset-0 rounded-full border border-foreground/15"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              >
                <span className="absolute -top-[3px] left-1/2 -translate-x-1/2 size-1.5 rounded-full bg-primary shadow-[0_0_14px_hsl(var(--primary))]" />
              </motion.div>
              {/* mid ring */}
              <motion.div
                aria-hidden
                className="absolute inset-4 rounded-full border border-foreground/10"
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <span className="absolute top-1/2 -right-[2px] -translate-y-1/2 size-1 rounded-full bg-accent shadow-[0_0_10px_hsl(var(--accent))]" />
              </motion.div>
              {/* inner conic disc */}
              <motion.div
                aria-hidden
                className="absolute inset-8 rounded-full"
                style={{
                  background:
                    'conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--accent)), transparent 60%, hsl(var(--primary)))',
                  mask: 'radial-gradient(circle, transparent 42%, #000 44%, #000 100%)',
                  WebkitMask: 'radial-gradient(circle, transparent 42%, #000 44%, #000 100%)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              {/* core */}
              <motion.div
                className="absolute inset-[38%] rounded-full bg-foreground shadow-[0_0_28px_hsl(var(--primary)/0.7)]"
                animate={{ scale: [1, 1.25, 1], opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            {/* VORTEX wordmark */}
            <div className="flex items-baseline gap-[0.05em] font-display font-semibold text-5xl sm:text-6xl md:text-7xl tracking-[-0.03em]">
              {letters.map((l, i) => (
                <motion.span
                  key={i}
                  initial={{ y: '110%', opacity: 0, filter: 'blur(10px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  transition={{
                    duration: 0.9,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.15 + i * 0.08,
                  }}
                  className="inline-block text-gradient"
                >
                  {l}
                </motion.span>
              ))}
              <motion.span
                className="ml-2 inline-block h-[0.9em] w-[3px] bg-primary"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            {/* status + progress */}
            <div className="flex flex-col items-center gap-3 w-72 sm:w-80">
              <div className="flex w-full items-center justify-between font-mono text-[10px] tracking-[0.35em] text-muted-foreground uppercase">
                <span className="flex items-center gap-2">
                  <motion.span
                    className="size-1.5 rounded-full bg-primary"
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  {status}
                </span>
                <span className="tabular-nums">{String(Math.round(progress)).padStart(3, '0')}%</span>
              </div>
              <div className="relative h-[2px] w-full rounded-full bg-muted/50 overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-primary"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut' }}
                />
                <motion.div
                  aria-hidden
                  className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-foreground/40 to-transparent"
                  animate={{ x: ['-20%', '420%'] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
              <div className="flex w-full justify-between font-mono text-[9px] tracking-[0.4em] text-muted-foreground/70 uppercase">
                <span>SYS.CORE</span>
                <span>SECURE·LINK</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
