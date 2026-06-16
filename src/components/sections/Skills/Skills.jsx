import { motion } from 'framer-motion';
import RevealSection from '../../ui/RevealSection/RevealSection';
import { SectionTag } from '../../ui/Button/Button';
import { skills } from '../../../data/skills';
import styles from './Skills.module.css';

const SkillNode = ({ name, color, size = 'md' }) => {
  const initials = name.slice(0, 2).toUpperCase();
  const sizes = {
    sm: styles.sm,
    md: styles.md,
    lg: styles.lg,
  };

  return (
    <motion.div
      whileHover={{ scale: 1.15 }}
      className={styles.skillNode}
    >
      <div
        className={`${sizes[size]} ${styles.skillCircle}`}
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
      <span className={styles.skillLabel}>{name}</span>
    </motion.div>
  );
};

// Orbital ring of skills
const OrbitRing = ({ items, radius, duration, color, reverse = false }) => {
  const count = items.length;
  return (
    <div
      className={styles.orbitRing}
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
            className={styles.orbitItem}
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
    <section id="skills" className={styles.section}>
      <div className={styles.container}>
        <RevealSection>
          <SectionTag label="Skills" />
        </RevealSection>
        <RevealSection delay={0.1}>
          <h2 className={styles.heading}>
            What I Build{' '}
            <span className={styles.gradientSpan}>With</span>
          </h2>
        </RevealSection>
        <RevealSection delay={0.2}>
          <p className={styles.subtext}>
            A toolkit assembled across years of building production-grade products.
          </p>
        </RevealSection>
      </div>

      {/* Orbital rig — desktop */}
      <RevealSection delay={0.3}>
        <div className={styles.desktopWrapper}>
          <div className={styles.orbitContainer}>
            {/* Ring decorations */}
            {[80, 160, 230].map((r, i) => (
              <div
                key={r}
                className={styles.ringDecoration}
                style={{
                  width: r * 2,
                  height: r * 2,
                  left: `calc(50% - ${r}px)`,
                  top: `calc(50% - ${r}px)`,
                  borderColor:
                    i === 0
                      ? '#33c2cc20'
                      : i === 1
                      ? '#7a57db20'
                      : '#57db9620',
                }}
              />
            ))}
            {/* Center node */}
            <div className={styles.centerNode}>ADI</div>

            {/* Orbital rings */}
            <OrbitRing items={skills.inner} radius={80} duration={20} color="#33c2cc" />
            <OrbitRing items={skills.middle} radius={160} duration={35} color="#7a57db" reverse />
            <OrbitRing items={skills.outer} radius={230} duration={50} color="#57db96" />
          </div>
        </div>
      </RevealSection>

      {/* Mobile flat grid */}
      <div className={styles.mobileGrid}>
        {[...skills.inner, ...skills.middle, ...skills.outer].map((skill) => (
          <SkillNode key={skill.name} name={skill.name} color={skill.color} size="lg" />
        ))}
      </div>

      <style>{`
        @keyframes orbit-ring { from { transform: rotate(0deg); } to   { transform: rotate(360deg); } }
        @keyframes counter-rotate { from { transform: rotate(0deg); } to   { transform: rotate(-360deg); } }
      `}</style>
    </section>
  );
};

export default Skills;
