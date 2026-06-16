import CountUp from 'react-countup';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import RevealSection from '../ui/RevealSection';
import { SectionTag } from '../ui/Button';

const stats = [
  { value: 3, suffix: '+', label: 'Years Experience' },
  { value: 20, suffix: '+', label: 'Projects Shipped' },
  { value: 5, suffix: '', label: 'Tech Stacks' },
  { value: 100, suffix: '%', label: 'Passion' },
];

const StatCard = ({ value, suffix, label }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-1 p-4 rounded-xl border border-white/5 bg-white/2"
    >
      <span className="text-3xl font-bold text-aqua">
        {isInView ? <CountUp end={value} duration={2} suffix={suffix} /> : `0${suffix}`}
      </span>
      <span className="text-xs text-neutral-500 text-center">{label}</span>
    </div>
  );
};

const About = () => {
  return (
    <section id="about" className="section-spacing c-space">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left — Text */}
        <div className="flex flex-col gap-6">
          <RevealSection>
            <SectionTag label="About" />
          </RevealSection>

          <RevealSection delay={0.1}>
            <h2 className="text-heading">
              The Human Behind{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lavender to-aqua">
                the Helmet.
              </span>
            </h2>
          </RevealSection>

          <RevealSection delay={0.2}>
            <p className="subtext leading-relaxed">
              I'm Adi — a full-stack developer with a deep passion for crafting digital experiences
              that live at the intersection of design, engineering, and creativity. I specialize in
              building scalable web applications using React, .NET Core, and modern cloud
              infrastructure.
            </p>
          </RevealSection>

          <RevealSection delay={0.3}>
            <p className="subtext leading-relaxed">
              When I'm not pushing pixels or debugging APIs, I'm exploring 3D web technology,
              playing with shaders, or building small games just to see what's possible. I believe
              every product should feel like it was made by someone who cared — because mine are.
            </p>
          </RevealSection>

          <RevealSection delay={0.4}>
            <div className="flex flex-wrap gap-3 mt-2">
              {['Problem Solver', 'Clean Code Advocate', 'UI Perfectionist', '3D Enthusiast'].map(
                (trait) => (
                  <span
                    key={trait}
                    className="px-3 py-1 rounded-full border border-lavender/30 bg-lavender/5 text-lavender text-xs"
                  >
                    {trait}
                  </span>
                )
              )}
            </div>
          </RevealSection>
        </div>

        {/* Right — Card + Stats */}
        <div className="flex flex-col gap-6">
          {/* Profile card */}
          <RevealSection direction="left" delay={0.1}>
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-storm to-indigo p-8 flex flex-col items-center gap-4">
              {/* Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 bg-royal/20 blur-3xl pointer-events-none" />

              {/* Avatar placeholder */}
              <div className="relative w-28 h-28 rounded-full border-2 border-aqua/40 bg-gradient-to-br from-royal to-lavender flex items-center justify-center text-5xl shadow-[0_0_40px_rgba(92,51,204,0.4)]">
                👨‍💻
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold">Adi</h3>
                <p className="text-neutral-400 text-sm mt-1">Full-Stack Developer · 3D Explorer</p>
              </div>

              {/* Location / status */}
              <div className="flex items-center gap-4 text-xs text-neutral-500">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
                  Open to opportunities
                </span>
                <span>· India 🇮🇳</span>
              </div>
            </div>
          </RevealSection>

          {/* Stats grid */}
          <RevealSection direction="left" delay={0.2}>
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  );
};

export default About;
