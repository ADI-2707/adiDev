import { Suspense } from 'react';
import { motion } from 'framer-motion';
import AnimatedText from '../ui/AnimatedText';
import { Button } from '../ui/Button';
import FloatingAstronaut from '../three/FloatingAstronaut';

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Radial gradient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-royal/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-aqua/8 blur-[100px]" />
      </div>

      <div className="c-space w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-20">

        {/* Left — Text content */}
        <div className="flex flex-col gap-6 z-10">

          {/* Availability badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-mint/30 bg-mint/5 text-mint text-sm w-fit"
          >
            <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
            Available for Work
          </motion.div>

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              Hi, I'm{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-aqua to-lavender">
                Adi.
              </span>
            </h1>
          </motion.div>

          {/* Typewriter subline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg md:text-xl text-neutral-400 font-light min-h-[2rem]"
          >
            <AnimatedText
              sequences={[
                'Full-Stack Developer.', 2000,
                'UI/UX Engineer.', 2000,
                '3D Web Explorer.', 2000,
                '.NET & React Specialist.', 2000,
              ]}
              className="text-aqua font-medium"
            />
          </motion.div>

          {/* Short bio */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="text-neutral-400 max-w-md leading-relaxed"
          >
            I craft immersive digital experiences — combining clean UI design,
            robust backend architecture, and cutting-edge 3D web technology to
            build products that feel alive.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Button href="#projects" variant="primary">
              View My Work ↓
            </Button>
            <Button href="/cv.pdf" variant="ghost">
              Download CV
            </Button>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex items-center gap-5 pt-2"
          >
            {[
              { label: 'GitHub', href: 'https://github.com', icon: '⌥' },
              { label: 'LinkedIn', href: 'https://linkedin.com', icon: '𝗶𝗻' },
              { label: 'Email', href: 'mailto:adi@example.com', icon: '✉' },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-aqua/50 hover:bg-aqua/5 transition-all duration-300 text-sm"
              >
                {social.icon}
              </a>
            ))}
            <div className="h-px w-16 bg-gradient-to-r from-white/10 to-transparent" />
            <span className="text-neutral-600 text-xs">@adiDev</span>
          </motion.div>
        </div>

        {/* Right — 3D Astronaut canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative h-[420px] lg:h-[600px] w-full"
        >
          <Suspense fallback={null}>
            <FloatingAstronaut />
          </Suspense>
          {/* Glow base under astronaut */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-40 h-6 bg-royal/30 blur-2xl rounded-full pointer-events-none" />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-600"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-10 bg-gradient-to-b from-aqua/40 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default Hero;
