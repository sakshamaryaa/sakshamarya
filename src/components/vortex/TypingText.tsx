import { useEffect, useState } from 'react';

interface TypingTextProps {
  words: string[];
  className?: string;
}

/** Typewriter cycling through an array of words. */
export function TypingText({ words, className }: TypingTextProps) {
  const [index, setIndex] = useState(0);
  const [sub, setSub] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[index % words.length];
    const speed = deleting ? 45 : 90;
    const timeout = setTimeout(() => {
      const next = deleting
        ? current.substring(0, sub.length - 1)
        : current.substring(0, sub.length + 1);
      setSub(next);

      if (!deleting && next === current) {
        setTimeout(() => setDeleting(true), 1400);
      } else if (deleting && next === '') {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      }
    }, speed);
    return () => clearTimeout(timeout);
  }, [sub, deleting, index, words]);

  return (
    <span className={className}>
      {sub}
      <span className="inline-block w-[2px] h-[1em] align-middle ml-1 bg-current animate-blink" />
    </span>
  );
}
