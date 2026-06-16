import { motion } from 'framer-motion';
import RevealSection from '../ui/RevealSection';
import { SectionTag } from '../ui/Button';
import { skills } from '../../data/skills';

const SkillNode = ({ name, color, size = 'md' }) => {
  const initials = name.slice(0, 2).toUpperCase();
  const sizes = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-12 h-12 text-xs',
    lg: 'w-14 h-14 text-sm',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.15 }}
      className="flex flex-col items-center gap-1.5 group"
    >
      <div
        className={`${sizes[size]} rounded-full border flex items-center justify-center font-bold transition-all duration-300 group-hover:shadow-lg`}
        style={{
          borderColor: `${color}40`,
          backgroundColor: `${color}12`,
          color,
          boxShadow: `0 0 0 0 ${color}00`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 0 20px ${color}40`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = `0 0 0 0 ${color}00`;
        }}
      >
        {initials}
      </div>
      <span
        className="text-[10px] text-neutral-500 group-hover:text-white transition-colors duration-200 max-w-[60px] text-center leading-tight"
      >
        {name}
      </span>
    </motion.div>
  );
};

// Orbital ring of skills
const OrbitRing = ({ items, radius, duration, color, reverse = false }) => {
  const count = items.length;
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        animation: `orbit-ring ${duration}s linear infinite ${reverse ? 'reverse' : ''}`,
      }}
    >
      {items.map((skill, i) => {
        const angle = (360 / count) * i;
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;
        return (
          <div
            key={skill.name}
            className="absolute pointer-events-auto"
            style={{
              left: `calc(50% + ${x}px - 28px)`,
              top: `calc(50% + ${y}px - 28px)`,
              animation: `counter-rotate ${duration}s linear infinite ${reverse ? 'reverse' : ''}`,
            }}
          >
            <SkillNode name={skill.name} color={skill.color} size="md" />
          </div>
        );
      })}
    </div>
  );
};

const Skills = () => {
  return (
    <section id="skills" className="section-spacing c-space">
      <div className="flex flex-col items-center gap-4 mb-16">
        <RevealSection>
          <SectionTag label="Skills" />
        </RevealSection>
        <RevealSection delay={0.1}>
          <h2 className="text-heading text-center">
            What I Build{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-aqua to-mint">
              With
            </span>
          </h2>
        </RevealSection>
        <RevealSection delay={0.2}>
          <p className="subtext text-center max-w-md">
            A toolkit assembled across years of building production-grade products.
          </p>
        </RevealSection>
      </div>

      {/* Orbital rig — desktop */}
      <RevealSection delay={0.3}>
        <div className="hidden md:flex justify-center">
          <div className="relative w-[480px] h-[480px]">
            {/* Ring decorations */}
            {[80, 160, 230].map((r, i) => (
              <div
                key={r}
                className="absolute rounded-full border border-white/5"
                style={{
                  width: r * 2,
                  height: r * 2,
                  left: `calc(50% - ${r}px)`,
                  top: `calc(50% - ${r}px)`,
                  borderColor: i === 0 ? '#33c2cc20' : i === 1 ? '#7a57db20' : '#57db9620',
                }}
              />
            ))}

            {/* Center node */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-royal to-lavender flex items-center justify-center text-xs font-bold shadow-[0_0_30px_rgba(92,51,204,0.5)] z-10">
              ADI
            </div>

            {/* Orbital rings */}
            <OrbitRing items={skills.inner} radius={80} duration={20} color="#33c2cc" />
            <OrbitRing items={skills.middle} radius={160} duration={35} color="#7a57db" reverse />
            <OrbitRing items={skills.outer} radius={230} duration={50} color="#57db96" />
          </div>
        </div>
      </RevealSection>

      {/* Mobile flat grid */}
      <div className="md:hidden grid grid-cols-3 sm:grid-cols-4 gap-6 justify-items-center mt-4">
        {[...skills.inner, ...skills.middle, ...skills.outer].map((skill) => (
          <SkillNode key={skill.name} name={skill.name} color={skill.color} size="lg" />
        ))}
      </div>

      <style>{`
        @keyframes orbit-ring {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes counter-rotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
      `}</style>
    </section>
  );
};

export default Skills;
