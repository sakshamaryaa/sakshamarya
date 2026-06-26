import { useEffect, useRef, useState } from 'react';

/**
 * Liquid metal cursor: a gooey chrome blob that stretches with velocity,
 * squishes on click, and engulfs interactive elements on hover.
 * Disabled on touch / coarse-pointer devices.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const blobRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  // pointer + smoothed positions
  const target = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });
  const drop = useRef({ x: -100, y: -100 });
  const vel = useRef({ x: 0, y: 0 });

  const hover = useRef<{ active: boolean; rect: DOMRect | null }>({ active: false, rect: null });
  const pressed = useRef(false);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add('cursor-liquid');

    const move = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      const el = t?.closest('a, button, [role="button"], [data-cursor="hover"]') as HTMLElement | null;
      if (el) {
        hover.current.active = true;
        hover.current.rect = el.getBoundingClientRect();
      } else {
        hover.current.active = false;
        hover.current.rect = null;
      }
    };
    const down = () => (pressed.current = true);
    const up = () => (pressed.current = false);
    const leave = () => {
      target.current.x = -200;
      target.current.y = -200;
    };

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseover', over);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    document.addEventListener('mouseleave', leave);

    let raf = 0;
    const tick = () => {
      // ease main blob toward target
      const ease = 0.22;
      const nx = pos.current.x + (target.current.x - pos.current.x) * ease;
      const ny = pos.current.y + (target.current.y - pos.current.y) * ease;
      vel.current.x = nx - pos.current.x;
      vel.current.y = ny - pos.current.y;
      pos.current.x = nx;
      pos.current.y = ny;

      // trailing droplet — slower follow for gooey merge effect
      drop.current.x += (pos.current.x - drop.current.x) * 0.32;
      drop.current.y += (pos.current.y - drop.current.y) * 0.32;

      const blob = blobRef.current;
      const dropEl = dropRef.current;
      if (!blob || !dropEl) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const speed = Math.min(Math.hypot(vel.current.x, vel.current.y), 60);
      const angle = (Math.atan2(vel.current.y, vel.current.x) * 180) / Math.PI;
      const stretch = 1 + speed / 110; // up to ~1.55
      const squash = 1 - speed / 240;

      if (hover.current.active && hover.current.rect) {
        // engulf the target element
        const r = hover.current.rect;
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const w = r.width + 18;
        const h = r.height + 18;
        const radius = Math.min(w, h) / 2 + 8;
        blob.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
        blob.style.width = `${w}px`;
        blob.style.height = `${h}px`;
        blob.style.borderRadius = `${radius}px`;
        dropEl.style.opacity = '0';
      } else {
        const base = pressed.current ? 22 : 34;
        const size = base;
        blob.style.width = `${size}px`;
        blob.style.height = `${size}px`;
        blob.style.borderRadius = '999px';
        const sx = pressed.current ? 0.7 : stretch;
        const sy = pressed.current ? 0.7 : squash;
        blob.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${sx}, ${sy})`;
        dropEl.style.opacity = speed > 4 ? '1' : '0';
        dropEl.style.transform = `translate3d(${drop.current.x}px, ${drop.current.y}px, 0) translate(-50%, -50%) scale(${0.55 + speed / 200})`;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      document.removeEventListener('mouseleave', leave);
      document.documentElement.classList.remove('cursor-liquid');
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* SVG goo filter merges blob + droplet into one liquid surface */}
      <svg
        aria-hidden
        width="0"
        height="0"
        style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none' }}
      >
        <defs>
          <filter id="liquid-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
          <linearGradient id="liquid-chrome" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a5f3fc" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>
      </svg>

      <div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[200]"
        style={{ filter: 'url(#liquid-goo)', width: '100vw', height: '100vh' }}
      >
        <div
          ref={blobRef}
          className="pointer-events-none fixed top-0 left-0"
          style={{
            width: 34,
            height: 34,
            background:
              'radial-gradient(circle at 30% 25%, #ffffff 0%, #a5f3fc 22%, #818cf8 55%, #6d28d9 100%)',
            boxShadow:
              '0 0 20px rgba(129,140,248,0.55), inset -6px -8px 14px rgba(0,0,0,0.35), inset 6px 6px 10px rgba(255,255,255,0.35)',
            mixBlendMode: 'plus-lighter',
            transition:
              'width 260ms cubic-bezier(0.22,1,0.36,1), height 260ms cubic-bezier(0.22,1,0.36,1), border-radius 260ms cubic-bezier(0.22,1,0.36,1)',
            willChange: 'transform, width, height, border-radius',
          }}
        />
        <div
          ref={dropRef}
          className="pointer-events-none fixed top-0 left-0 rounded-full"
          style={{
            width: 14,
            height: 14,
            background:
              'radial-gradient(circle at 30% 25%, #ffffff 0%, #a5f3fc 30%, #818cf8 70%, #6d28d9 100%)',
            mixBlendMode: 'plus-lighter',
            opacity: 0,
            transition: 'opacity 180ms ease',
            willChange: 'transform, opacity',
          }}
        />
      </div>
    </>
  );
}
