import { useEffect, useRef } from 'react';

/**
 * Mouse-following spotlight overlay scoped to its parent (use inside `relative`).
 * Hidden on touch; uses CSS vars to avoid React re-renders.
 */
export function Spotlight({ size = 520, color = 'hsl(var(--electric-blue) / 0.18)' }: { size?: number; color?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;

    const handle = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      el.style.setProperty('--my', `${e.clientY - rect.top}px`);
      el.style.opacity = '1';
    };
    const leave = () => { el.style.opacity = '0'; };
    parent.addEventListener('mousemove', handle);
    parent.addEventListener('mouseleave', leave);
    return () => {
      parent.removeEventListener('mousemove', handle);
      parent.removeEventListener('mouseleave', leave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
      style={{
        background: `radial-gradient(${size}px circle at var(--mx, 50%) var(--my, 50%), ${color}, transparent 60%)`,
      }}
    />
  );
}
