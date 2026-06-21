import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/** Premium loading screen shown once on initial mount. */
export function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative size-20 rounded-full bg-gradient-primary animate-glow"
              style={{ backgroundSize: '200% 200%' }}
            >
              <div className="absolute inset-[3px] rounded-full bg-background flex items-center justify-center">
                <span className="text-gradient font-display font-bold text-2xl">SA</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-mono text-xs tracking-[0.4em] text-muted-foreground uppercase"
            >
              Initializing Vortex
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
