import { motion } from 'framer-motion';

/**
 * Letter-by-letter reveal with blur and rise.
 * Splits each word so it doesn't break across lines.
 */
export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.04,
  as: Tag = 'span',
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'p';
}) {
  const words = text.split(' ');
  const TagAny = Tag as any;
  return (
    <TagAny className={className} aria-label={text}>

      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split('').map((ch, ci) => (
            <motion.span
              key={`${wi}-${ci}`}
              className="inline-block will-change-transform"
              initial={{ y: '80%', opacity: 0, filter: 'blur(10px)' }}
              whileInView={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
                delay: delay + (wi * 3 + ci) * stagger,
              }}
            >
              {ch}
            </motion.span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </TagAny>
  );
}
