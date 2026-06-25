import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Cinematic ambient background — three slow aurora blobs + subtle grid mask.
 * Pure CSS/SVG, no canvas. Respects reduced-motion via CSS.
 */
export function Aurora() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 2000], [0, 300]);
  const y2 = useTransform(scrollY, [0, 2000], [0, -260]);
  const y3 = useTransform(scrollY, [0, 2000], [0, 180]);

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-background">
        <motion.div
          style={{ y: y1 }}
          className="absolute -top-40 -left-32 size-[680px] rounded-full blur-[120px] opacity-60"
        >
          <div className="size-full rounded-full bg-[hsl(var(--aurora-purple)/0.45)] animate-aurora" />
        </motion.div>
        <motion.div
          style={{ y: y2 }}
          className="absolute top-1/3 -right-40 size-[720px] rounded-full blur-[140px] opacity-55"
        >
          <div className="size-full rounded-full bg-[hsl(var(--electric-blue)/0.40)] animate-aurora" style={{ animationDelay: '-6s' }} />
        </motion.div>
        <motion.div
          style={{ y: y3 }}
          className="absolute bottom-0 left-1/3 size-[560px] rounded-full blur-[120px] opacity-45"
        >
          <div className="size-full rounded-full bg-[hsl(var(--aurora-cyan)/0.30)] animate-aurora" style={{ animationDelay: '-12s' }} />
        </motion.div>
        <div className="absolute inset-0 grid-pattern opacity-30" />
        {/* vignette */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(120% 80% at 50% 0%, transparent 40%, hsl(var(--background) / 0.85) 100%)'
        }} />
      </div>
      <div className="grain-fixed" aria-hidden />
    </>
  );
}
