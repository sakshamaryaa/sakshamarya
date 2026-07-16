import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/**
 * Synthesized UI SFX via Web Audio API (no assets needed).
 * Mute state persisted in localStorage. Global delegated listeners fire
 * hover / click sounds on interactive elements.
 */

type SFX = 'hover' | 'click' | 'enter' | 'toggle';

interface SoundCtx {
  muted: boolean;
  toggle: () => void;
  play: (sfx: SFX) => void;
}

const Ctx = createContext<SoundCtx | null>(null);

export function useSound() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useSound outside SoundProvider');
  return c;
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem('vortex.muted');
    return stored === null ? true : stored === '1';
  });
  const ctxRef = useRef<AudioContext | null>(null);
  const lastHoverRef = useRef(0);

  const ensureCtx = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return null;
      ctxRef.current = new AC();
    }
    if (ctxRef.current.state === 'suspended') void ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const play = useCallback(
    (sfx: SFX) => {
      if (muted) return;
      const ctx = ensureCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      const tone = (freq: number, dur: number, type: OscillatorType, gain = 0.05, slide?: number) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slide), now + dur);
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(gain, now + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
        osc.connect(g).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + dur + 0.02);
      };

      switch (sfx) {
        case 'hover':
          tone(880, 0.06, 'sine', 0.025);
          break;
        case 'click':
          tone(520, 0.09, 'triangle', 0.06, 260);
          break;
        case 'enter':
          tone(320, 0.35, 'sine', 0.05, 640);
          tone(480, 0.35, 'sine', 0.03, 720);
          break;
        case 'toggle':
          tone(660, 0.12, 'square', 0.04, 990);
          break;
      }
    },
    [muted, ensureCtx],
  );

  const toggle = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      localStorage.setItem('vortex.muted', next ? '1' : '0');
      if (!next) {
        // priming click on unmute
        ensureCtx();
        setTimeout(() => {
          const ctx = ctxRef.current;
          if (!ctx) return;
          const now = ctx.currentTime;
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(660, now);
          osc.frequency.exponentialRampToValueAtTime(990, now + 0.12);
          g.gain.setValueAtTime(0, now);
          g.gain.linearRampToValueAtTime(0.04, now + 0.005);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
          osc.connect(g).connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.14);
        }, 0);
      }
      return next;
    });
  }, [ensureCtx]);

  // Global delegated listeners on interactive elements.
  useEffect(() => {
    const isInteractive = (el: EventTarget | null): HTMLElement | null => {
      if (!(el instanceof HTMLElement)) return null;
      return el.closest('a, button, [role="button"], [data-sfx]') as HTMLElement | null;
    };
    const onOver = (e: MouseEvent) => {
      if (!isInteractive(e.target)) return;
      const now = performance.now();
      if (now - lastHoverRef.current < 90) return;
      lastHoverRef.current = now;
      play('hover');
    };
    const onDown = (e: MouseEvent) => {
      if (!isInteractive(e.target)) return;
      play('click');
    };
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mousedown', onDown);
    };
  }, [play]);

  const value = useMemo(() => ({ muted, toggle, play }), [muted, toggle, play]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function SoundToggle({ className = '' }: { className?: string }) {
  const { muted, toggle } = useSound();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={muted ? 'Enable sound' : 'Mute sound'}
      className={`group inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md w-9 h-9 hover:bg-white/10 transition ${className}`}
    >
      {muted ? (
        <VolumeX className="w-4 h-4 text-white/70" />
      ) : (
        <Volume2 className="w-4 h-4 text-white/90" />
      )}
    </button>
  );
}
