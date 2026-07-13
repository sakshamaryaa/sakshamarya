import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight, ArrowRight, Mail, MapPin, Github, Instagram,
  Cpu, Bot, Zap, Shield, Wifi, Calculator, Sparkles, Rocket,
  Brain, Lightbulb, MessageCircle, Play, Globe,
} from 'lucide-react';
import { LoadingScreen } from '@/components/vortex/LoadingScreen';
import { ScrollProgress } from '@/components/vortex/ScrollProgress';
import { MagneticButton } from '@/components/vortex/MagneticButton';
import { VortexThemeToggle } from '@/components/vortex/ThemeToggle';
import { Aurora } from '@/components/vortex/Aurora';
import { CustomCursor } from '@/components/vortex/CustomCursor';
import { Spotlight } from '@/components/vortex/Spotlight';
import { SectionRail } from '@/components/vortex/SectionRail';
import { SplitText } from '@/components/vortex/SplitText';
import { toast } from 'sonner';
import sakshamPortrait from '@/assets/saksham-train.jpg.asset.json';

/* ───────────────────────── DATA ───────────────────────── */

const NAV = [
  { label: 'Index', href: '#home', n: '00' },
  { label: 'About', href: '#about', n: '01' },
  { label: 'Journey', href: '#journey', n: '02' },
  { label: 'Skills', href: '#skills', n: '03' },
  { label: 'Work', href: '#work', n: '04' },
  { label: 'Vision', href: '#vision', n: '05' },
  { label: 'Contact', href: '#contact', n: '06' },
];

const ROTATING = ['student.', 'builder.', 'roboticist.', 'tech explorer.', 'innovator.'];

const JOURNEY = [
  { year: '2023', tag: 'Origin', title: 'A spark with Arduino', text: 'Picked up my first microcontroller. Solder, sensors, late nights — and the realisation that I could make ideas move in the real world.' },
  { year: '2024', tag: 'Craft',  title: 'Building, relentlessly', text: 'Shipped a wave of electronics and automation projects. Learnt the discipline of iteration — sketch, prototype, fail, refine.' },
  { year: '2025', tag: 'Leadership', title: 'AI VIDYASETU 1.0', text: 'Led my team at the AI VIDYASETU 1.0 Hackathon in Guwahati. Designed, defended and demoed an AI-driven idea on stage.' },
  { year: '2026', tag: 'Horizon', title: 'Class XI · Science · JEE', text: 'Entering Class XI with Computer Science. Preparing for JEE while continuing to build at the edge of AI, robotics and design.' },
];

const SKILL_CLUSTERS = [
  { title: 'Languages', items: ['Python', 'JavaScript', 'TypeScript', 'C / C++', 'HTML', 'CSS'] },
  { title: 'Hardware',  items: ['Arduino', 'ESP / GSM', 'Sensors', 'Motor Control', 'PCB Basics', 'Soldering'] },
  { title: 'AI & Web',  items: ['Prompt Engineering', 'Google AI Studio', 'React', 'Tailwind', 'Vercel', 'Lovable'] },
  { title: 'Craft',     items: ['Figma', 'Canva', 'Photography', 'Editorial Design', 'Storytelling', 'Branding'] },
];

const ECOSYSTEM = [
  'Python', 'Arduino', 'TypeScript', 'React', 'Tailwind', 'AI Studio',
  'GSM', 'Sensors', 'Robotics', 'Figma', 'Vercel', 'GitHub',
  'Prompting', 'Embedded', 'Automation', 'Design',
];

type Project = {
  n: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  description: string;
  stack: string[];
  icon: React.ComponentType<{ className?: string }>;
  accent: string; // hsl color
  github?: string;
  demo?: string;
};

const PROJECTS: Project[] = [
  {
    n: '01',
    title: 'RC Rover with 6-DOF Robotic Arm',
    category: 'Robotics · Mechatronics',
    year: '2025',
    summary: 'A remote rover with a six-degrees-of-freedom arm capable of precise pick-and-place choreography.',
    description: 'Designed end-to-end: chassis, servo orchestration, inverse-kinematics intuition and a wireless control layer. Built to demonstrate that complex robotics is approachable when broken into honest, small pieces.',
    stack: ['Arduino', 'Servo Array', 'RF Module', 'Custom Frame', 'PWM Control'],
    icon: Bot,
    accent: 'hsl(220 96% 64%)',
  },
  {
    n: '02',
    title: 'Smart Car Parking System',
    category: 'Embedded · Automation',
    year: '2024',
    summary: 'Sensor-driven slot detection with live indicators — a study in clarity over complexity.',
    description: 'IR + ultrasonic sensors map free and occupied bays in real-time. LED indicators and a clean signal logic make the system instantly understandable, even at a glance.',
    stack: ['Arduino', 'IR Sensors', 'Ultrasonic', 'LED Matrix'],
    icon: Cpu,
    accent: 'hsl(268 84% 72%)',
  },
  {
    n: '03',
    title: 'GSM Agriculture Motor Starter',
    category: 'IoT · Agriculture',
    year: '2024',
    summary: 'SMS-controlled water pump for farmers — distance collapsed into a single text message.',
    description: 'A GSM module receives encoded SMS commands and toggles a high-current relay safely. Built for rural reliability: low power draw, fail-safes, and unambiguous status responses.',
    stack: ['Arduino', 'GSM SIM800', 'Relay', 'Power Electronics'],
    icon: Wifi,
    accent: 'hsl(188 88% 64%)',
  },
  {
    n: '04',
    title: 'Intrusion & Motion Security',
    category: 'Security · Embedded',
    year: '2024',
    summary: 'A quiet sentinel — PIR, magnetic and ultrasonic sensors stitched into one alert layer.',
    description: 'Multi-sensor fusion reduces false positives. Buzzer + indicator stack offers immediate physical feedback, while a logged event stream lays groundwork for cloud reporting.',
    stack: ['Arduino', 'PIR', 'Magnetic Switch', 'Buzzer'],
    icon: Shield,
    accent: 'hsl(320 70% 70%)',
  },
  {
    n: '05',
    title: 'Bluetooth Controlled Water Pump',
    category: 'IoT · Home',
    year: '2024',
    summary: 'Pocket-sized control for everyday hardware. A pump, a phone, a tap.',
    description: 'A Bluetooth bridge between a custom Android app and a relay-driven pump. Designed to feel invisible — pair once, then forget the wiring exists.',
    stack: ['Arduino', 'HC-05', 'Android', 'Relay'],
    icon: Zap,
    accent: 'hsl(40 90% 60%)',
  },
  {
    n: '06',
    title: 'Quadratic Equation Solver',
    category: 'Hardware Math',
    year: '2023',
    summary: 'Algebra on bare metal — a physical calculator that thinks in roots.',
    description: 'Embedded solver computing real and complex roots, displayed on an LCD. A small but formative exercise in turning mathematics into circuitry.',
    stack: ['Arduino', 'C++', 'LCD 16×2', 'Keypad'],
    icon: Calculator,
    accent: 'hsl(220 96% 64%)',
  },
];

const LEADERSHIP = [
  { title: 'AI VIDYASETU 1.0', role: 'Team Leader · Guwahati 2025', text: 'Led a team through a high-pressure hackathon — ideation, technical architecture, pitch and live demo.' },
  { title: 'Independent Builder', role: 'Self-initiated · ongoing', text: 'A consistent practice of shipping personal hardware and software projects, often outside any curriculum.' },
  { title: 'Curator of Ideas', role: 'Across disciplines', text: 'Bridging design, AI and robotics — believing the most interesting work lives at the intersections.' },
];

const VISION = [
  { k: 'Engineering', v: 'Pursue computer science and engineering with a focus on AI, robotics and intelligent systems.' },
  { k: 'Innovation', v: 'Build technology that solves real Indian problems — agriculture, education, accessibility.' },
  { k: 'Craft', v: 'Hold design and engineering to the same standard — both deserve to be made carefully.' },
];

const SOCIAL = {
  whatsapp: 'https://wa.me/917061096010',
  instagram: 'https://instagram.com/sakshamaryaaa',
  github: 'https://github.com/sakshamaryaaa',
  email: 'mailto:mr.sakshamaryaa@gmail.com',
};

/* ───────────────────────── PRIMITIVES ───────────────────────── */

function Eyebrow({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
      <span className="text-foreground/40">{n}</span>
      <span className="h-px w-8 bg-foreground/20" />
      <span>{children}</span>
    </div>
  );
}

function Reveal({ children, delay = 0, y = 24, className }: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}


/* ───────────────────────── ROTATING WORD ───────────────────────── */

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % ROTATING.length), 2400);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-block align-baseline" style={{ minWidth: '7ch' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={ROTATING[i]}
          initial={{ y: '0.6em', opacity: 0, filter: 'blur(8px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-0.6em', opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block italic text-aurora"
        >
          {ROTATING[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ───────────────────────── HERO ───────────────────────── */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Mouse parallax
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setParallax({
        x: ((e.clientX - cx) / cx) * 14,
        y: ((e.clientY - cy) / cy) * 14,
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section id="home" ref={ref} className="relative min-h-[100svh] overflow-hidden">
      <Spotlight size={620} color="hsl(var(--electric-blue) / 0.22)" />

      {/* status bar */}
      <div className="absolute top-24 inset-x-0 px-6 lg:px-10 flex justify-between font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground z-20">
        <span>N · 25.59° E · 85.13°</span>
        <span className="hidden md:inline">Bihar, India</span>
        <span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online</span>
      </div>

      {/* Portrait — right 55-60% with soft mask & ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-full lg:w-[60%] overflow-hidden"
      >
        {/* ambient glow */}
        <div
          className="absolute -inset-20 opacity-70"
          style={{
            background:
              'radial-gradient(60% 55% at 60% 45%, hsl(217 91% 60% / 0.35), transparent 70%), radial-gradient(50% 50% at 75% 70%, hsl(280 85% 65% / 0.28), transparent 75%)',
            filter: 'blur(40px)',
          }}
        />
        {/* image with ken burns + parallax */}
        <motion.div
          className="absolute inset-0"
          style={{
            transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
            transition: 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <motion.img
            src={sakshamPortrait.url}
            alt="Saksham Arya looking out a train window"
            initial={{ scale: 1.05 }}
            animate={{ scale: [1.05, 1.15, 1.05] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 h-full w-full object-cover object-[60%_center] opacity-[0.92] lg:opacity-100"
            style={{
              WebkitMaskImage:
                'radial-gradient(120% 90% at 75% 50%, black 35%, transparent 78%), linear-gradient(to left, black 55%, transparent 100%)',
              maskImage:
                'radial-gradient(120% 90% at 75% 50%, black 35%, transparent 78%), linear-gradient(to left, black 55%, transparent 100%)',
              WebkitMaskComposite: 'source-in',
              maskComposite: 'intersect',
            }}
          />
        </motion.div>

        {/* gradient blends into background */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent lg:via-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
        {/* subtle blue/purple wash */}
        <div
          className="absolute inset-0 mix-blend-overlay opacity-50"
          style={{
            background:
              'linear-gradient(135deg, hsl(217 91% 60% / 0.25), transparent 50%, hsl(280 85% 65% / 0.2))',
          }}
        />

        {/* Glass status card — lower-right over image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="pointer-events-auto absolute bottom-10 right-6 lg:right-10 max-w-[280px] glass rounded-2xl p-5 backdrop-blur-xl border border-white/10"
        >
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Current Journey
          </div>
          <p className="font-display italic text-base leading-snug text-foreground/90">
            "Building ideas into reality."
          </p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Learning · Building · Innovating
          </p>
        </motion.div>
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 min-h-[100svh] flex flex-col justify-center px-6 lg:px-10 pt-40 pb-32"
      >
        <Reveal>
          <Eyebrow n="00">Portfolio · MMXXV</Eyebrow>
        </Reveal>

        <Reveal delay={0.15}>
          <h1 className="display-xl mt-8 text-[clamp(3rem,10vw,10rem)] lg:max-w-[60%]">
            <SplitText as="span" text="Saksham Arya" className="block text-gradient" delay={0.1} stagger={0.03} />
            <span className="block italic text-foreground/55 -mt-2 sm:-mt-4">aka Mr. Vortex</span>
          </h1>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="mt-10 flex flex-col gap-8 lg:max-w-xl">
            <p className="text-xl sm:text-2xl lg:text-3xl font-display italic text-foreground/80 leading-snug">
              A young <RotatingWord />
              <span className="block mt-1 not-italic font-sans text-base sm:text-lg text-muted-foreground tracking-normal">
                Designing thinking machines and small futures from Bihar, India.
              </span>
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <MagneticButton
                href="#work"
                className="group inline-flex items-center gap-3 rounded-full bg-foreground text-background pl-6 pr-2 py-2 text-sm font-medium"
              >
                Explore the work
                <span className="grid place-items-center size-9 rounded-full bg-background text-foreground transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="size-4" />
                </span>
              </MagneticButton>
              <MagneticButton
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full glass px-5 py-3 text-sm"
              >
                Get in touch
              </MagneticButton>
            </div>
          </div>
        </Reveal>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 inset-x-0 flex justify-center font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground z-20"
      >
        <div className="flex flex-col items-center gap-2">
          <span>Scroll</span>
          <motion.span
            animate={{ y: [0, 8, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-6 w-px bg-foreground/60"
          />
        </div>
      </motion.div>
    </section>
  );
}

/* ───────────────────────── MARQUEE ───────────────────────── */

function Marquee() {
  const words = ['Robotics', 'Artificial Intelligence', 'Embedded Systems', 'Design', 'Innovation', 'Engineering', 'Curiosity', 'Craft'];
  const all = [...words, ...words];
  return (
    <div className="relative py-10 border-y border-hairline overflow-hidden">
      <div className="flex gap-16 whitespace-nowrap animate-marquee will-change-transform" style={{ width: 'max-content' }}>
        {all.map((w, i) => (
          <span key={i} className="font-display italic text-4xl sm:text-6xl text-foreground/15 flex items-center gap-16">
            {w}
            <span className="size-2 rounded-full bg-foreground/20" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── ABOUT ───────────────────────── */

function About() {
  return (
    <section id="about" className="relative px-6 lg:px-10 py-32 sm:py-40">
      <div className="max-w-7xl mx-auto">
        <Reveal><Eyebrow n="01">A short introduction</Eyebrow></Reveal>

        <div className="mt-12 grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-8">
            <Reveal delay={0.1}>
              <p className="display-xl text-[clamp(1.8rem,4.5vw,4rem)] leading-[1.05] text-foreground/90">
                I'm a sixteen-year-old <em className="italic text-foreground/60">student from Bihar</em> who builds things that move, think and respond — usually all at once. I started with an Arduino and never quite stopped.
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <p className="mt-10 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
                My work lives at the intersection of <span className="text-foreground">hardware, software and design</span>. I prototype quickly, sketch loud, and care quietly about craft. I'm preparing for JEE while shipping things on the side — because the best engineers I've read about never waited for permission to begin.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-4 lg:pt-2">
            <Reveal delay={0.35}>
              <dl className="font-mono text-xs uppercase tracking-wider divide-y divide-hairline">
                {[
                  ['Based in', 'Bihar, India'],
                  ['School', 'PM SHRI KENDRIYA VIDYALAYA OFN RAJGIR', true], // highlighted/long
                  ['Speaks', 'Hindi · English'],
                  ['Currently', 'Class XI · Science'],
                  ['Focus', 'AI · Robotics · Design'],
                  ['Status', 'Open to ideas'],
                ].map(([k, v, highlight]) => (
                  <div key={k as string} className="flex flex-col sm:flex-row lg:flex-col xl:flex-row justify-between items-start py-4 gap-2">
                    <dt className="text-muted-foreground shrink-0 font-medium tracking-[0.2em]">{k as string}</dt>
                    <dd className={`tracking-normal normal-case font-sans text-left sm:text-right lg:text-left xl:text-right ${
                      highlight 
                        ? 'text-foreground font-semibold text-[13px] bg-foreground/5 px-2.5 py-1 rounded border border-foreground/10 tracking-wide font-mono uppercase' 
                        : 'text-foreground/80 text-sm'
                    }`}>
                      {v as string}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── JOURNEY ───────────────────────── */

function Journey() {
  return (
    <section id="journey" className="relative px-6 lg:px-10 py-32 sm:py-40">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-20">
          <div>
            <Reveal><Eyebrow n="02">Timeline</Eyebrow></Reveal>
            <Reveal delay={0.1}>
              <h2 className="display-xl mt-6 text-[clamp(2.5rem,7vw,6rem)]">
                A short <em>chronicle</em>.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <p className="max-w-sm text-muted-foreground">Four moments that shaped how I think, build and lead — from a curious beginning to the next horizon.</p>
          </Reveal>
        </div>

        <div className="relative">
          <div className="absolute left-[7px] sm:left-1/2 top-0 bottom-0 w-px bg-foreground/10" aria-hidden />
          <ol className="space-y-16 sm:space-y-24">
            {JOURNEY.map((j, i) => (
              <JourneyItem key={j.year} item={j} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function JourneyItem({ item, index }: { item: typeof JOURNEY[number]; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const left = index % 2 === 0;
  return (
    <li ref={ref} className="relative grid sm:grid-cols-2 gap-8 sm:gap-16">
      {/* dot */}
      <motion.span
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute left-0 sm:left-1/2 top-2 -translate-x-1/2 size-3.5 rounded-full bg-foreground ring-4 ring-background"
        aria-hidden
      />
      <div className={`pl-8 sm:pl-0 ${left ? 'sm:pr-16 sm:text-right' : 'sm:order-2 sm:pl-16'}`}>
        <motion.div
          initial={{ opacity: 0, x: left ? -30 : 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">{item.tag}</div>
          <div className="mt-2 font-display italic text-6xl sm:text-7xl text-foreground/30">{item.year}</div>
        </motion.div>
      </div>
      <div className={`pl-8 sm:pl-0 ${left ? '' : 'sm:order-1 sm:pr-16 sm:text-right'}`}>
        <motion.div
          initial={{ opacity: 0, x: left ? 30 : -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="font-display text-2xl sm:text-3xl text-foreground">{item.title}</h3>
          <p className="mt-3 text-muted-foreground leading-relaxed max-w-md sm:inline-block">{item.text}</p>
        </motion.div>
      </div>
    </li>
  );
}

/* ───────────────────────── SKILLS ───────────────────────── */

function Skills() {
  return (
    <section id="skills" className="relative px-6 lg:px-10 py-32 sm:py-40">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div>
            <Reveal><Eyebrow n="03">Toolkit</Eyebrow></Reveal>
            <Reveal delay={0.1}>
              <h2 className="display-xl mt-6 text-[clamp(2.5rem,7vw,6rem)]">An <em>ecosystem</em>,<br/>not a list.</h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <p className="max-w-sm text-muted-foreground">I don't believe in progress bars. Skills are how you think, not how you score.</p>
          </Reveal>
        </div>

        {/* Floating ecosystem chips */}
        <Reveal delay={0.2}>
          <div className="relative glass-card rounded-3xl p-8 sm:p-12 noise overflow-hidden">
            <Spotlight size={460} color="hsl(var(--aurora-purple) / 0.18)" />
            <div className="relative flex flex-wrap gap-3 justify-center">
              {ECOSYSTEM.map((s, i) => (
                <motion.span
                  key={s}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.03 }}
                  whileHover={{ y: -4, scale: 1.04 }}
                  className="px-4 py-2 rounded-full border border-hairline glass text-sm font-mono tracking-wide cursor-default"
                  style={{ fontSize: `${0.8 + (i % 4) * 0.08}rem` }}
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SKILL_CLUSTERS.map((c, i) => (
            <Reveal key={c.title} delay={0.1 + i * 0.08}>
              <div className="group h-full p-7 rounded-2xl glass-card noise relative overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                     style={{ background: 'radial-gradient(400px circle at 50% 0%, hsl(var(--electric-blue)/0.12), transparent 60%)' }} />
                <div className="relative">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{`0${i + 1}`}</div>
                  <h3 className="mt-3 font-display text-2xl">{c.title}</h3>
                  <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                    {c.items.map((it) => (
                      <li key={it} className="flex items-center gap-2">
                        <span className="size-1 rounded-full bg-foreground/40" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── PROJECTS ───────────────────────── */

function Work() {
  return (
    <section id="work" className="relative px-6 lg:px-10 py-32 sm:py-40">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-20">
          <div>
            <Reveal><Eyebrow n="04">Selected Work</Eyebrow></Reveal>
            <Reveal delay={0.1}>
              <h2 className="display-xl mt-6 text-[clamp(2.5rem,7vw,6rem)]">
                Six things <em>I'm proud</em><br/>to have built.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <p className="max-w-sm text-muted-foreground">Each project is a study in restraint — solving one real problem, well. Hover to look closer.</p>
          </Reveal>
        </div>

        <div className="space-y-6">
          {PROJECTS.map((p, i) => (
            <ProjectShowcase key={p.n} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectShowcase({ project, index }: { project: Project; index: number }) {
  const Icon = project.icon;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });
  const reverse = index % 2 === 1;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-3xl overflow-hidden glass-card noise"
    >
      <Spotlight size={500} color={`${project.accent.replace(')', ' / 0.20)')}`} />

      <div className={`relative grid lg:grid-cols-12 gap-0 ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
        {/* Visual */}
        <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto relative overflow-hidden border-b lg:border-b-0 lg:border-r border-hairline">
          <div
            className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]"
            style={{
              background: `radial-gradient(120% 80% at ${reverse ? '80%' : '20%'} 30%, ${project.accent.replace(')', ' / 0.45)')}, transparent 60%), linear-gradient(180deg, hsl(222 24% 8%), hsl(222 28% 5%))`,
            }}
          />
          <div className="absolute inset-0 grid-pattern opacity-30" />
          {/* big monogram */}
          <div className="absolute inset-0 grid place-items-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              <div className="size-32 sm:size-44 rounded-3xl glass grid place-items-center shadow-[var(--shadow-soft)]">
                <Icon className="size-14 sm:size-20 text-foreground/90" />
              </div>
              <div
                className="absolute -inset-10 rounded-full blur-3xl -z-10 opacity-60"
                style={{ background: project.accent }}
              />
            </motion.div>
          </div>
          <div className="absolute top-6 left-6 font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/60">
            {project.n} / {String(PROJECTS.length).padStart(2, '0')}
          </div>
          <div className="absolute bottom-6 right-6 font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/60">
            {project.year}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">{project.category}</div>
          <h3 className="mt-4 font-display text-3xl sm:text-4xl leading-[1.05] text-foreground">{project.title}</h3>
          <p className="mt-4 text-foreground/80 italic font-display text-lg leading-snug">{project.summary}</p>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{project.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((t) => (
              <span key={t} className="px-3 py-1 rounded-full border border-hairline text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                {t}
              </span>
            ))}
          </div>

          <div className="mt-auto pt-8 flex items-center gap-3">
            <a
              href={project.github || SOCIAL.github}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm group/btn"
            >
              <Github className="size-4" />
              <span className="border-b border-foreground/30 group-hover/btn:border-foreground transition-colors">Source</span>
            </a>
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm group/btn">
                <Play className="size-4" />
                <span className="border-b border-foreground/30 group-hover/btn:border-foreground transition-colors">Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ───────────────────────── LEADERSHIP ───────────────────────── */

function Leadership() {
  return (
    <section id="leadership" className="relative px-6 lg:px-10 py-32 sm:py-40">
      <div className="max-w-7xl mx-auto">
        <Reveal><Eyebrow n="05a">Leadership · Innovation</Eyebrow></Reveal>
        <Reveal delay={0.1}>
          <h2 className="display-xl mt-6 text-[clamp(2.5rem,7vw,6rem)] max-w-4xl">
            Building <em>with people</em>, not just for them.
          </h2>
        </Reveal>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {LEADERSHIP.map((l, i) => (
            <Reveal key={l.title} delay={0.1 + i * 0.1}>
              <div className="h-full p-8 rounded-2xl glass-card noise relative overflow-hidden">
                <Spotlight size={400} color="hsl(var(--aurora-purple) / 0.18)" />
                <div className="relative">
                  <div className="size-10 rounded-xl glass grid place-items-center mb-6">
                    {i === 0 ? <Rocket className="size-5" /> : i === 1 ? <Sparkles className="size-5" /> : <Brain className="size-5" />}
                  </div>
                  <h3 className="font-display text-2xl">{l.title}</h3>
                  <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">{l.role}</div>
                  <p className="mt-5 text-sm text-muted-foreground leading-relaxed">{l.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── VISION ───────────────────────── */

function Vision() {
  return (
    <section id="vision" className="relative px-6 lg:px-10 py-32 sm:py-40">
      <div className="max-w-7xl mx-auto">
        <Reveal><Eyebrow n="05">Where I'm headed</Eyebrow></Reveal>
        <Reveal delay={0.1}>
          <h2 className="display-xl mt-6 text-[clamp(2.5rem,8vw,7rem)] max-w-5xl leading-[0.95]">
            <span className="text-foreground/40">The next ten years</span><br/>
            <em>belong to people</em><br/>
            who build carefully.
          </h2>
        </Reveal>

        <div className="mt-20 grid md:grid-cols-3 gap-x-12 gap-y-10 max-w-5xl">
          {VISION.map((v, i) => (
            <Reveal key={v.k} delay={0.1 + i * 0.1}>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">{`0${i + 1} · ${v.k}`}</div>
                <p className="mt-4 font-display text-xl text-foreground/90 leading-snug">{v.v}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── CONTACT ───────────────────────── */

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success("Message sent. I'll respond soon.");
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="relative px-6 lg:px-10 py-32 sm:py-40">
      <div className="max-w-7xl mx-auto">
        <Reveal><Eyebrow n="06">Conversation</Eyebrow></Reveal>
        <Reveal delay={0.1}>
          <h2 className="display-xl mt-6 text-[clamp(3rem,11vw,11rem)] leading-[0.9]">
            Let's <em>talk</em>.
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Have an idea, a project, or just want to say hello? My inbox is open. The fastest way to reach me is WhatsApp or email.
          </p>
        </Reveal>

        <div className="mt-16 grid lg:grid-cols-12 gap-10">
          {/* Form */}
          <Reveal delay={0.2} className="lg:col-span-7">
            <form onSubmit={submit} className="glass-card rounded-3xl p-6 sm:p-10 relative overflow-hidden">
              <Spotlight size={500} color="hsl(var(--aurora-purple) / 0.18)" />
              <div className="relative space-y-7">
                <FloatingField label="Your name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
                <FloatingField label="Email" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
                <FloatingField label="Message" textarea value={form.message} onChange={(v) => setForm((f) => ({ ...f, message: v }))} />

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Encrypted in transit</span>
                  <MagneticButton
                    onClick={submit as any}
                    className="group inline-flex items-center gap-3 rounded-full bg-foreground text-background pl-6 pr-2 py-2 text-sm font-medium"
                  >
                    Send message
                    <span className="grid place-items-center size-9 rounded-full bg-background text-foreground transition-transform group-hover:rotate-45">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </MagneticButton>
                </div>
              </div>
            </form>
          </Reveal>

          {/* Direct channels */}
          <Reveal delay={0.3} className="lg:col-span-5">
            <div className="space-y-3">
              <ContactCard href={SOCIAL.email} icon={Mail} title="Email" sub="mr.sakshamaryaa@gmail.com" />
              <ContactCard href={SOCIAL.whatsapp} icon={MessageCircle} title="WhatsApp" sub="+91 7061096010" />
              <ContactCard href={SOCIAL.instagram} icon={Instagram} title="Instagram" sub="@sakshamaryaaa" />
              <ContactCard href={SOCIAL.github} icon={Github} title="GitHub" sub="sakshamaryaaa" />
              <div className="mt-6 p-6 rounded-2xl glass-card noise flex items-center gap-3">
                <MapPin className="size-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Based in</div>
                  <div className="font-display text-lg">Bihar, India</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
}

function FloatingField({ label, value, onChange, type = 'text', textarea = false }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; textarea?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const float = focused || value.length > 0;
  return (
    <label className="block relative">
      <span
        className={`absolute left-0 pointer-events-none font-mono uppercase tracking-[0.2em] transition-all duration-300
          ${float ? 'top-0 text-[10px] text-muted-foreground' : 'top-7 text-xs text-foreground/50'}`}
      >
        {label}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="w-full bg-transparent border-b border-foreground/15 focus:border-foreground/60 outline-none pt-7 pb-2 resize-none text-base text-foreground transition-colors"
        />
      ) : (
        <input
          type={type}
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent border-b border-foreground/15 focus:border-foreground/60 outline-none pt-7 pb-2 text-base text-foreground transition-colors"
        />
      )}
    </label>
  );
}

function ContactCard({ href, icon: Icon, title, sub }: { href: string; icon: React.ComponentType<{ className?: string }>; title: string; sub: string }) {
  return (
    <a
      href={href}
      target="_blank" rel="noopener noreferrer"
      className="group flex items-center gap-5 p-5 rounded-2xl glass-card noise hover:translate-x-1 transition-transform"
    >
      <div className="size-12 rounded-xl glass grid place-items-center">
        <Icon className="size-5" />
      </div>
      <div className="flex-1">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{title}</div>
        <div className="font-display text-lg">{sub}</div>
      </div>
      <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition" />
    </a>
  );
}

/* ───────────────────────── FOOTER ───────────────────────── */

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative px-6 lg:px-10 pt-20 pb-10 border-t border-hairline">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div>
            <div className="font-display italic text-5xl sm:text-7xl text-foreground/70">Mr. Vortex</div>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              A digital monogram by Saksham Arya. Built with care in Bihar, India.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            <a href={SOCIAL.email} className="hover:text-foreground transition-colors">Email</a>
            <a href={SOCIAL.whatsapp} className="hover:text-foreground transition-colors">WhatsApp</a>
            <a href={SOCIAL.instagram} className="hover:text-foreground transition-colors">Instagram</a>
            <a href={SOCIAL.github} className="hover:text-foreground transition-colors">GitHub</a>
          </div>
        </div>
        <div className="mt-12 hairline" />
        <div className="mt-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <span>© {year} Saksham Arya</span>
          <span className="flex items-center gap-2"><Globe className="size-3" /> EN · HI</span>
        </div>
      </div>
    </footer>
  );
}

/* ───────────────────────── HEADER ───────────────────────── */

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>('about');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = ['about', 'journey', 'skills', 'work', 'vision', 'contact'];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const links = NAV.slice(1, -1); // About → Vision

  const Shell = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`relative rounded-full p-[1px] overflow-hidden group ${className}`}>
      <div
        aria-hidden
        className="absolute inset-[-150%] opacity-70 group-hover:opacity-100 transition-opacity duration-700 animate-spin [animation-duration:8s] group-hover:[animation-duration:4s]"
        style={{
          background:
            'conic-gradient(from 0deg, transparent 35%, hsl(var(--foreground) / 0.9) 50%, transparent 65%)',
        }}
      />
      <div className="relative rounded-full bg-background/80 backdrop-blur-2xl border border-foreground/10 shadow-[inset_0_1px_1px_hsl(var(--foreground)/0.08),inset_0_-1px_1px_hsl(var(--background)/0.5),0_20px_50px_-15px_hsl(var(--background)/0.9)]">
        {children}
      </div>
    </div>
  );

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}>
      <div className="px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Shell>
            <div className="flex items-center gap-2 md:gap-6 px-3 md:px-5 py-2 md:py-2.5">
              {/* Brand */}
              <a href="#home" className="flex items-center gap-3 pr-3 md:pr-5 md:border-r md:border-foreground/10">
                <span className="size-8 rounded-full bg-foreground text-background grid place-items-center font-bold text-[10px] tracking-tighter shadow-[0_0_18px_hsl(var(--foreground)/0.25),inset_0_-1px_2px_hsl(var(--background)/0.2)]">
                  SA
                </span>
                <span className="hidden sm:inline font-semibold text-[13px] uppercase tracking-[0.18em] select-none">
                  Mr. Vortex
                </span>
              </a>

              {/* Links */}
              <nav className="hidden md:flex items-center gap-6 flex-1">
                {links.map((n) => {
                  const id = n.href.replace('#', '');
                  const active = activeId === id;
                  return (
                    <a
                      key={n.href}
                      href={n.href}
                      className={`relative flex items-center gap-1.5 transition-all duration-300 hover:scale-105 active:scale-95 ${
                        active ? 'opacity-100' : 'opacity-50 hover:opacity-100'
                      }`}
                    >
                      <span className="font-mono text-[9px] text-foreground/30">{n.n}</span>
                      <span
                        className={`text-[13px] font-medium ${
                          active ? 'drop-shadow-[0_0_8px_hsl(var(--foreground)/0.25)]' : ''
                        }`}
                      >
                        {n.label}
                      </span>
                      {active && (
                        <motion.span
                          layoutId="nav-dot"
                          className="absolute -bottom-2 left-1/2 -translate-x-1/2 size-1 rounded-full bg-foreground shadow-[0_0_10px_hsl(var(--foreground)/0.9)] animate-pulse"
                        />
                      )}
                    </a>
                  );
                })}
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-3 md:gap-4 md:pl-5 md:border-l md:border-foreground/10 ml-auto">
                <VortexThemeToggle />
                <a
                  href="#contact"
                  className="hidden sm:inline-flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_hsl(var(--foreground)/0.35)] transition-all"
                >
                  Contact <ArrowRight className="size-3" />
                </a>
                <button
                  onClick={() => setOpen((v) => !v)}
                  className="md:hidden size-9 grid place-items-center rounded-full border border-foreground/10"
                  aria-label="Toggle menu"
                >
                  <div className="flex flex-col gap-1.5">
                    <span className={`block h-px w-4 bg-foreground transition ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
                    <span className={`block h-px w-4 bg-foreground transition ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
                  </div>
                </button>
              </div>
            </div>
          </Shell>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="md:hidden glass rounded-3xl mt-3 p-6 flex flex-col gap-4 max-w-5xl mx-auto"
            >
              {NAV.map((n) => (
                <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="font-mono text-xs uppercase tracking-[0.3em] flex items-center gap-3">
                  <span className="text-foreground/40">{n.n}</span>{n.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}


/* ───────────────────────── PAGE ───────────────────────── */

export default function Portfolio() {
  return (
    <>
      <LoadingScreen />
      <ScrollProgress />
      <Aurora />
      <CustomCursor />
      <Header />
      <SectionRail />

      <main className="relative">
        <Hero />
        <Marquee />
        <About />
        <Journey />
        <Skills />
        <Work />
        <Leadership />
        <Vision />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
