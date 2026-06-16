import CountUp from 'react-countup';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import RevealSection from '../../ui/RevealSection/RevealSection';
import { SectionTag } from '../../ui/Button/Button';
import styles from './About.module.css';

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
    <div ref={ref} className={styles.statCard}>
      <span className={styles.statValue}>
        {isInView ? <CountUp end={value} duration={2} suffix={suffix} /> : `0${suffix}`}
      </span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
};

const About = () => {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.grid}>

        {/* Left — Text */}
        <div className={styles.leftCol}>
          <RevealSection>
            <SectionTag label="About" />
          </RevealSection>

          <RevealSection delay={0.1}>
            <h2 className={styles.heading}>
              The Human Behind{' '}
              <span className={styles.gradientSpan}>the Helmet.</span>
            </h2>
          </RevealSection>

          <RevealSection delay={0.2}>
            <p className={styles.bodyText}>
              I'm Adi — a full-stack developer with a deep passion for crafting digital experiences
              that live at the intersection of design, engineering, and creativity. I specialize in
              building scalable web applications using React, .NET Core, and modern cloud
              infrastructure.
            </p>
          </RevealSection>

          <RevealSection delay={0.3}>
            <p className={styles.bodyText}>
              When I'm not pushing pixels or debugging APIs, I'm exploring 3D web technology,
              playing with shaders, or building small games just to see what's possible. I believe
              every product should feel like it was made by someone who cared — because mine are.
            </p>
          </RevealSection>

          <RevealSection delay={0.4}>
            <div className={styles.traitsList}>
              {['Problem Solver', 'Clean Code Advocate', 'UI Perfectionist', '3D Enthusiast'].map(
                (trait) => (
                  <span key={trait} className={styles.trait}>{trait}</span>
                )
              )}
            </div>
          </RevealSection>
        </div>

        {/* Right — Card + Stats */}
        <div className={styles.rightCol}>
          {/* Profile card */}
          <RevealSection direction="left" delay={0.1}>
            <div className={styles.profileCard}>
              <div className={styles.cardGlow} />
              <div className={styles.avatar}>👨‍💻</div>
              <div>
                <h3 className={styles.cardName}>Adi</h3>
                <p className={styles.cardRole}>Full-Stack Developer · 3D Explorer</p>
              </div>
              <div className={styles.statusRow}>
                <span>
                  <span className={styles.pulseDot} /> Open to opportunities
                </span>
                <span>· India 🇮🇳</span>
              </div>
            </div>
          </RevealSection>

          {/* Stats grid */}
          <RevealSection direction="left" delay={0.2}>
            <div className={styles.statsGrid}>
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
