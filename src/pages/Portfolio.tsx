import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight, Download, Mail, MapPin, Github, Linkedin, Instagram,
  Cpu, Bot, Zap, Shield, Wifi, Calculator, GraduationCap, Trophy,
  Sparkles, Code2, Rocket, Heart, Camera, Music, Brain, Users,
  Lightbulb, Target, BookOpen, Star, GitBranch, Flame,
} from 'lucide-react';
import { ParticleBackground } from '@/components/vortex/ParticleBackground';
import { TypingText } from '@/components/vortex/TypingText';
import { ScrollProgress } from '@/components/vortex/ScrollProgress';
import { LoadingScreen } from '@/components/vortex/LoadingScreen';
import { MagneticButton } from '@/components/vortex/MagneticButton';
import { TiltCard } from '@/components/vortex/TiltCard';
import { AnimatedCounter } from '@/components/vortex/AnimatedCounter';
import { SkillBar } from '@/components/vortex/SkillBar';
import { VortexThemeToggle } from '@/components/vortex/ThemeToggle';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const GITHUB_USERNAME = 'sakshamarya';

const STATS = [
  { value: 15, suffix: '+', label: 'Projects Built' },
  { value: 3, suffix: '+', label: 'Years Tinkering' },
  { value: 1, suffix: '', label: 'Hackathon Led' },
  { value: 20, suffix: '+', label: 'Technologies' },
];

const SKILL_LEVELS = [
  { label: 'Python', value: 85 },
  { label: 'Arduino / Embedded', value: 90 },
  { label: 'JavaScript / TypeScript', value: 75 },
  { label: 'HTML / CSS', value: 88 },
  { label: 'AI Tools & Prompting', value: 80 },
  { label: 'Robotics & Electronics', value: 92 },
];


const NAV = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Journey', href: '#journey' },
  { label: 'Contact', href: '#contact' },
];

const TYPING_WORDS = [
  'Student',
  'Robotics Enthusiast',
  'Arduino Developer',
  'Tech Explorer',
  'Innovator',
  'Problem Solver',
];

const INTERESTS = [
  'Computer Science', 'Robotics', 'Electronics', 'Arduino', 'Programming',
  'Artificial Intelligence', 'Technology', 'Innovation', 'Graphic Designing', 'Photography',
];

const HOBBIES = [
  { icon: Rocket, label: 'Building Projects' },
  { icon: Music, label: 'Listening to Music' },
  { icon: Camera, label: 'Photography' },
  { icon: Sparkles, label: 'Exploring Technology' },
  { icon: BookOpen, label: 'Learning New Skills' },
];

const STRENGTHS = [
  { icon: Lightbulb, label: 'Creativity' },
  { icon: Brain, label: 'Problem Solving' },
  { icon: Target, label: 'Leadership' },
  { icon: Users, label: 'Teamwork' },
  { icon: BookOpen, label: 'Self Learning' },
];

const SKILLS = {
  Programming: ['Python', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Arduino'],
  Tools: ['VS Code', 'GitHub', 'Google AI Studio', 'Canva', 'Figma', 'Lovable', 'Replit', 'Cursor', 'Vercel'],
  'Soft Skills': ['Leadership', 'Creativity', 'Problem Solving', 'Communication', 'Teamwork'],
};

const PROJECTS = [
  { icon: Bot, title: 'RC Rover with 6-DOF Robotic Arm', category: 'Robotics', desc: 'Remote-controlled rover paired with a 6 degrees-of-freedom robotic arm for pick-and-place tasks.' },
  { icon: Cpu, title: 'Smart Car Parking System', category: 'Automation', desc: 'Sensor-driven automated parking slot detection and indicator system.' },
  { icon: Shield, title: 'Security System', category: 'Security', desc: 'Microcontroller-based intrusion and motion detection with real-time alerts.' },
  { icon: Wifi, title: 'GSM Agriculture Motor Starter', category: 'IoT', desc: 'GSM-based remote starter for agricultural water pumps using SMS commands.' },
  { icon: Zap, title: 'Bluetooth Controlled Water Pump', category: 'IoT', desc: 'Bluetooth-enabled control of water pump from a mobile device.' },
  { icon: Calculator, title: 'Quadratic Equation Solver', category: 'Electronics', desc: 'Embedded solver computing roots of quadratic equations on hardware.' },
];

const TIMELINE = [
  { year: '2023', title: 'The Beginning', text: 'Started learning Arduino and electronics; developed a deep curiosity for technology.' },
  { year: '2024', title: 'Building Phase', text: 'Built multiple electronics and automation projects, sharpening technical fundamentals.' },
  { year: '2025', title: 'Hackathon & Leadership', text: 'Worked on robotics ideas and led my team as Team Leader at AI VIDYASETU 1.0 Hackathon, Guwahati.' },
  { year: '2026', title: 'Class XI & JEE', text: 'Started Class XI Science — exploring CS, robotics and AI while preparing for JEE.' },
];

const ACHIEVEMENTS = [
  { icon: '🏆', text: 'Team Leader at AI VIDYASETU 1.0 Hackathon, Guwahati (2025)' },
  { icon: '⚡', text: 'Built multiple Arduino-based projects' },
  { icon: '🤖', text: 'Hands-on experience with electronics and robotics' },
  { icon: '💡', text: 'Passionate about innovation and technology' },
  { icon: '🚀', text: 'Continuous learner, creator and problem solver' },
];

const FADE_UP = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: 'easeOut' as const },
};

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const { scrollY } = useScroll();
  const blobY1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const blobY2 = useTransform(scrollY, [0, 1000], [0, -180]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.2]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.96]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success("Message sent! I'll get back to you soon.");
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <>
      <LoadingScreen />
      <ScrollProgress />
      <ParticleBackground />

      {/* Ambient gradient blobs with parallax */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
        <motion.div style={{ y: blobY1 }} className="absolute -top-40 -left-40 size-[500px] rounded-full bg-gradient-primary opacity-20 blur-3xl animate-float" />
        <motion.div style={{ y: blobY2 }} className="absolute top-1/2 -right-40 size-[600px] rounded-full bg-gradient-primary opacity-15 blur-3xl animate-float" />
        <div className="absolute inset-0 grid-pattern opacity-40" />
      </div>


      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4">
          <div className="glass rounded-full px-4 sm:px-6 py-3 flex items-center justify-between">
            <a href="#home" className="flex items-center gap-2 font-display font-bold">
              <span className="size-8 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground text-sm">SA</span>
              <span className="hidden sm:block text-sm tracking-wide">Mr. Vortex</span>
            </a>
            <nav className="hidden md:flex items-center gap-6">
              {NAV.map((n) => (
                <a key={n.href} href={n.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="hidden md:flex items-center gap-3">
              <VortexThemeToggle />
              <MagneticButton href="#contact" className="rounded-full bg-gradient-primary text-primary-foreground px-5 py-2 text-sm font-medium shadow-[var(--shadow-glow)] hover:opacity-95">
                Let's Talk <ArrowRight className="ml-1.5 size-4" />
              </MagneticButton>
            </div>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden size-9 grid place-items-center rounded-full hover:bg-muted"
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-1">
                <span className={`block h-px w-5 bg-foreground transition ${menuOpen ? 'translate-y-[5px] rotate-45' : ''}`} />
                <span className={`block h-px w-5 bg-foreground transition ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-px w-5 bg-foreground transition ${menuOpen ? '-translate-y-[5px] -rotate-45' : ''}`} />
              </div>
            </button>
          </div>
          {menuOpen && (
            <div className="md:hidden glass rounded-2xl mt-2 p-4 flex flex-col gap-3">
              {NAV.map((n) => (
                <a key={n.href} href={n.href} onClick={() => setMenuOpen(false)} className="text-sm py-1">
                  {n.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </header>

      <main>
        {/* HERO */}
        <section id="home" className="relative min-h-screen flex items-center pt-28 pb-20 px-4 sm:px-6 lg:px-8">
          <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="mx-auto max-w-5xl text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8">
              <span className="size-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-mono tracking-wider text-muted-foreground uppercase">Available for collaboration</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display font-bold text-5xl sm:text-7xl lg:text-8xl leading-[1.05] tracking-tight"
            >
              Hi, I'm <span className="text-gradient">Saksham Arya</span>{' '}
              <motion.span
                className="inline-block"
                animate={{ rotate: [0, 18, -10, 18, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
              >
                👋
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-4 text-lg sm:text-xl text-muted-foreground"
            >
              Also known as <span className="text-foreground font-medium">Mr. Vortex</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 h-10 flex items-center justify-center"
            >
              <span className="font-mono text-base sm:text-xl">
                <span className="text-muted-foreground">&gt; </span>
                <TypingText words={TYPING_WORDS} className="text-gradient font-semibold" />
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-8 mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed"
            >
              A passionate student from Bihar, India with a deep interest in Computer Science since childhood. I turn ideas into real projects through programming, robotics, electronics and AI — learning by building solutions that make an impact.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              <MagneticButton href="#projects" className="rounded-full bg-gradient-primary text-primary-foreground px-7 py-3 text-sm font-semibold shadow-[var(--shadow-glow)]">
                Explore My Work <ArrowRight className="ml-2 size-4" />
              </MagneticButton>
              <MagneticButton href="#contact" className="rounded-full glass border border-border px-7 py-3 text-sm font-semibold">
                <Mail className="mr-2 size-4" /> Contact Me
              </MagneticButton>
              <MagneticButton href="/resume.pdf" download className="rounded-full px-7 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                <Download className="mr-2 size-4" /> Resume
              </MagneticButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-12 flex items-center justify-center gap-2 text-xs font-mono text-muted-foreground"
            >
              <MapPin className="size-3" /> Bihar, India · <span className="text-foreground">Hindi · English</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="mt-16 hidden sm:flex flex-col items-center gap-2 text-muted-foreground"
            >
              <span className="text-[10px] font-mono tracking-[0.4em] uppercase">Scroll</span>
              <motion.span
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                className="block h-6 w-px bg-gradient-to-b from-foreground/60 to-transparent"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* STATS */}
        <section className="px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="mx-auto max-w-6xl glass-card rounded-3xl p-6 sm:p-10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-primary opacity-[0.06]" />
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative text-center"
              >
                <div className="font-display font-bold text-4xl sm:text-5xl text-gradient tabular-nums">
                  <AnimatedCounter to={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-2 text-xs sm:text-sm font-mono uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>


        {/* ABOUT */}
        <Section id="about" eyebrow="About" title="Maker. Student. Tech Enthusiast.">
          <div className="grid lg:grid-cols-5 gap-8">
            <motion.div {...FADE_UP} className="lg:col-span-3 glass-card rounded-3xl p-8">
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                My name is <span className="text-foreground font-medium">Saksham Arya</span>, also known as <span className="text-gradient font-semibold">Mr. Vortex</span>. I'm a student, maker and technology enthusiast with a strong interest in Computer Science since childhood. My curiosity about computers inspired me to explore programming, robotics, electronics and artificial intelligence.
              </p>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted-foreground">
                I enjoy building projects, solving problems and continuously learning new things — turning ideas into reality through technology.
              </p>

              <div className="mt-8">
                <h4 className="font-display font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full text-xs glass border border-border/50 hover:border-primary/50 transition-colors">
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            <div className="lg:col-span-2 grid gap-6">
              <motion.div {...FADE_UP} className="glass-card rounded-3xl p-6">
                <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
                  <Heart className="size-4 text-accent" /> Hobbies
                </h4>
                <ul className="space-y-3">
                  {HOBBIES.map((h) => (
                    <li key={h.label} className="flex items-center gap-3 text-sm">
                      <span className="size-8 rounded-lg glass grid place-items-center"><h.icon className="size-4 text-accent" /></span>
                      {h.label}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div {...FADE_UP} className="glass-card rounded-3xl p-6">
                <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" /> Strengths
                </h4>
                <ul className="space-y-3">
                  {STRENGTHS.map((s) => (
                    <li key={s.label} className="flex items-center gap-3 text-sm">
                      <span className="size-8 rounded-lg glass grid place-items-center"><s.icon className="size-4 text-primary" /></span>
                      {s.label}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </Section>

        {/* EDUCATION */}
        <Section id="education" eyebrow="Education" title="Building the Foundation">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div {...FADE_UP} className="glass-card rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 size-40 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
              <GraduationCap className="size-10 text-gradient mb-4" />
              <div className="font-mono text-xs text-muted-foreground tracking-wider uppercase">Current Status</div>
              <h3 className="font-display font-bold text-2xl mt-1">Senior Secondary Student</h3>
              <dl className="mt-6 space-y-3 text-sm">
                <Row label="Class" value="XI — Science" />
                <Row label="School" value="PM SHRI Kendriya Vidyalaya OFN Rajgir" />
                <Row label="Region" value="Patna Region" />
                <Row label="Board" value="CBSE" />
              </dl>
            </motion.div>

            <motion.div {...FADE_UP} className="glass-card rounded-3xl p-8">
              <Target className="size-10 text-accent mb-4" />
              <div className="font-mono text-xs text-muted-foreground tracking-wider uppercase">Current Goal</div>
              <h3 className="font-display font-bold text-2xl mt-1">JEE + Tech Exploration</h3>
              <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                Preparing for JEE while strengthening PCM concepts and exploring robotics, programming and AI.
              </p>
              <div className="mt-6">
                <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Academic Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {['Physics', 'Chemistry', 'Mathematics', 'Computer Science', 'Robotics', 'Artificial Intelligence'].map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full text-xs glass border border-border/50">{s}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </Section>

        {/* SKILLS */}
        <Section id="skills" eyebrow="Skills" title="Tools of the Trade">
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(SKILLS).map(([group, items], idx) => (
              <motion.div
                key={group}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="glass-card rounded-3xl p-6 group hover:-translate-y-1 transition-transform"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="size-10 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground">
                    <Code2 className="size-5" />
                  </span>
                  <h3 className="font-display font-semibold">{group}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.map((s) => (
                    <span key={s} className="px-3 py-1.5 rounded-lg text-xs glass border border-border/50 group-hover:border-primary/40 transition-colors">
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Proficiency bars */}
          <div className="mt-10 grid md:grid-cols-2 gap-x-12 gap-y-6 glass-card rounded-3xl p-8">
            {SKILL_LEVELS.map((s, i) => (
              <SkillBar key={s.label} label={s.label} value={s.value} delay={i * 0.08} />
            ))}
          </div>
        </Section>

        {/* PROJECTS */}
        <Section id="projects" eyebrow="Featured Projects" title="From Idea to Reality">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <TiltCard className="group glass-card rounded-3xl p-6 relative overflow-hidden h-full">
                  <div className="absolute -top-16 -right-16 size-40 rounded-full bg-gradient-primary opacity-0 group-hover:opacity-25 blur-3xl transition-opacity duration-500" />
                  <div className="relative" style={{ transform: 'translateZ(40px)' }}>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full glass border border-border/50">
                      {p.category}
                    </span>
                    <div className="mt-5 size-12 rounded-2xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-[var(--shadow-glow)] group-hover:scale-110 transition-transform">
                      <p.icon className="size-6" />
                    </div>
                    <h3 className="mt-4 font-display font-semibold text-lg leading-snug">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-mono text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore <ArrowRight className="size-3" />
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* GITHUB STATS */}
        <Section id="github" eyebrow="GitHub" title="Code in the Open">
          <motion.div {...FADE_UP} className="grid lg:grid-cols-3 gap-6">
            <TiltCard className="glass-card rounded-3xl p-6 lg:col-span-1 group" max={6}>
              <div className="flex items-center gap-3 mb-4">
                <span className="size-12 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-[var(--shadow-glow)]">
                  <Github className="size-6" />
                </span>
                <div>
                  <div className="font-display font-semibold">@{GITHUB_USERNAME}</div>
                  <div className="text-xs text-muted-foreground font-mono">github.com</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Building robotics, IoT and AI-flavoured experiments in public. Follow along, fork the ideas, send PRs.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                <MiniStat icon={Star} label="Stars" value={42} />
                <MiniStat icon={GitBranch} label="Repos" value={18} />
                <MiniStat icon={Flame} label="Streak" value={67} />
              </div>
              <MagneticButton
                href={`https://github.com/${GITHUB_USERNAME}`}
                className="mt-6 w-full rounded-xl bg-gradient-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold"
              >
                Visit GitHub <ArrowRight className="ml-2 size-4" />
              </MagneticButton>
            </TiltCard>

            <div className="lg:col-span-2 grid gap-6">
              <div className="glass-card rounded-3xl p-3 overflow-hidden">
                <img
                  loading="lazy"
                  alt="GitHub stats"
                  src={`https://github-readme-stats.vercel.app/api?username=${GITHUB_USERNAME}&show_icons=true&hide_border=true&bg_color=00000000&title_color=A78BFA&icon_color=22D3EE&text_color=A1A1AA&include_all_commits=true`}
                  className="w-full h-auto rounded-2xl"
                />
              </div>
              <div className="glass-card rounded-3xl p-3 overflow-hidden">
                <img
                  loading="lazy"
                  alt="GitHub contribution streak"
                  src={`https://streak-stats.demolab.com?user=${GITHUB_USERNAME}&hide_border=true&background=00000000&ring=A78BFA&fire=22D3EE&currStreakLabel=A78BFA&sideLabels=A1A1AA&dates=71717A&stroke=A78BFA&currStreakNum=FAFAFA&sideNums=FAFAFA`}
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            </div>
          </motion.div>
        </Section>


        {/* HACKATHON */}
        <Section id="hackathon" eyebrow="Hackathon" title="Leading at AI VIDYASETU 1.0">
          <motion.div {...FADE_UP} className="glass-card rounded-3xl p-8 sm:p-10 relative overflow-hidden">
            <div className="absolute -top-32 -left-32 size-80 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
            <div className="relative flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/3">
                <Trophy className="size-12 text-gradient" />
                <div className="mt-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">Guwahati · 2025</div>
                <h3 className="mt-1 font-display font-bold text-2xl">AI VIDYASETU 1.0</h3>
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-primary text-primary-foreground text-xs font-semibold">
                  <Users className="size-3" /> Team Leader
                </div>
              </div>
              <div className="lg:w-2/3">
                <p className="text-muted-foreground leading-relaxed">
                  Represented my team as the Team Leader at AI VIDYASETU 1.0 Hackathon in Guwahati, Assam. Led the team throughout the event, coordinated tasks and contributed to innovative problem-solving — strengthening leadership, communication and teamwork while exploring AI and emerging technologies.
                </p>
                <ul className="mt-6 grid sm:grid-cols-2 gap-3">
                  {[
                    'Team Leader at AI VIDYASETU 1.0 (2025)',
                    'Collaborated with innovators and mentors',
                    'Explored AI tools and emerging technologies',
                    'Strengthened leadership and teamwork',
                    'Improved communication and presentation',
                  ].map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm">
                      <Sparkles className="size-4 text-accent shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </Section>

        {/* TIMELINE */}
        <Section id="journey" eyebrow="Journey" title="Experience & Milestones">
          <div className="relative">
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
            <div className="space-y-10">
              {TIMELINE.map((t, i) => (
                <motion.div
                  key={t.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6 }}
                  className={`relative flex flex-col sm:flex-row gap-4 sm:gap-8 ${i % 2 ? 'sm:flex-row-reverse' : ''}`}
                >
                  <div className="sm:w-1/2 pl-12 sm:pl-0 sm:px-8">
                    <div className="glass-card rounded-2xl p-6">
                      <div className="font-mono text-xs text-accent tracking-wider">{t.year}</div>
                      <h4 className="font-display font-semibold text-lg mt-1">{t.title}</h4>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t.text}</p>
                    </div>
                  </div>
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 top-4 size-4 rounded-full bg-gradient-primary ring-4 ring-background shadow-[var(--shadow-glow)]" />
                  <div className="hidden sm:block sm:w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ACHIEVEMENTS */}
        <Section id="achievements" eyebrow="Achievements" title="Highlights">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ACHIEVEMENTS.map((a, i) => (
              <motion.div
                key={a.text}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass-card rounded-2xl p-5 flex items-start gap-4"
              >
                <span className="text-3xl">{a.icon}</span>
                <span className="text-sm leading-relaxed">{a.text}</span>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* VISION */}
        <Section id="vision" eyebrow="Future Vision" title="What's Next">
          <motion.div {...FADE_UP} className="glass-card rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-primary opacity-10" />
            <Rocket className="relative mx-auto size-12 text-gradient mb-6" />
            <p className="relative text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto text-muted-foreground">
              I aspire to explore robotics, artificial intelligence and emerging technologies. My goal is to keep learning, building and creating impactful solutions that contribute positively to society.
            </p>
            <p className="relative mt-8 font-display font-bold text-2xl sm:text-3xl text-gradient">
              "Turning Ideas Into Reality Through Technology."
            </p>
          </motion.div>
        </Section>

        {/* CONTACT */}
        <Section id="contact" eyebrow="Contact" title="Let's Build Something">
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div {...FADE_UP} className="glass-card rounded-3xl p-8">
              <h3 className="font-display font-semibold text-xl">Get in touch</h3>
              <p className="mt-2 text-sm text-muted-foreground">Open to collaboration, learning opportunities and interesting tech conversations.</p>
              <div className="mt-6 space-y-3">
                <ContactRow icon={MapPin} label="Bihar, India" />
                <ContactRow icon={Mail} label="Connect via the form" />
              </div>
              <div className="mt-8 flex gap-3">
                <SocialIcon href="#" label="GitHub"><Github className="size-4" /></SocialIcon>
                <SocialIcon href="#" label="LinkedIn"><Linkedin className="size-4" /></SocialIcon>
                <SocialIcon href="#" label="Instagram"><Instagram className="size-4" /></SocialIcon>
              </div>
            </motion.div>

            <motion.form {...FADE_UP} onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 space-y-4">
              <Field label="Name">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="Your name"
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Message">
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Tell me about your idea..."
                />
              </Field>
              <Button type="submit" className="w-full rounded-xl bg-gradient-primary text-primary-foreground border-0 hover:opacity-90">
                Send Message <ArrowRight className="ml-2 size-4" />
              </Button>
            </motion.form>
          </div>
        </Section>

        {/* FOOTER */}
        <footer className="relative mt-20 border-t border-border/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-center">
            <p className="font-display text-lg text-gradient font-semibold">
              "Turning Ideas Into Reality Through Technology."
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Designed & Developed with <span className="text-red-500">❤</span> by Saksham Arya aka Mr. Vortex · © 2026
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}

/* ---------- helpers ---------- */

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-accent">{eyebrow}</div>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-5xl tracking-tight">{title}</h2>
          <div className="mx-auto mt-4 h-px w-16 bg-gradient-primary" />
        </motion.div>
        {children}
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4 border-b border-border/50 pb-2">
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="text-right text-foreground">{value}</dd>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function ContactRow({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="size-9 rounded-lg glass grid place-items-center"><Icon className="size-4 text-accent" /></span>
      {label}
    </div>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} aria-label={label} className="size-10 rounded-xl glass grid place-items-center hover:border-primary/50 transition-colors">
      {children}
    </a>
  );
}
