import { motion } from 'framer-motion';
import RevealSection from '../../ui/RevealSection/RevealSection';
import { SectionTag } from '../../ui/Button/Button';
import { experiences } from '../../../data/experience';
import styles from './Experience.module.css';

const TimelineItem = ({ exp, index }) => {
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: 'easeOut' }}
      className={`${styles.timelineItem} ${isLeft ? styles.timelineItemLeft : styles.timelineItemRight}`}
    >

      <div className={styles.cardWrapper}>
        <div className={styles.card}>

          <div
            className={styles.accentBar}
            style={{ backgroundColor: exp.accent }}
          />

          <div className={styles.cardInner}>
            <span
              className={styles.periodBadge}
              style={{
                borderColor: `${exp.accent}40`,
                color: exp.accent,
                backgroundColor: `${exp.accent}10`,
              }}
            >
              {exp.period}
            </span>

            <h3 className={styles.role}>{exp.role}</h3>
            <p className={styles.company}>{exp.company}</p>

            <ul className={styles.list}>
              {exp.description.map((point, i) => (
                <li key={i} className={styles.listItem}>
                  <span style={{ color: exp.accent }} className={styles.listItemMarker}>▸</span>
                  {point}
                </li>
              ))}
            </ul>

            <div className={styles.tagContainer}>
              {exp.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>


      <div className={styles.spacer} />

      <div className={styles.dotContainer}>
        <div
          className={styles.dot}
          style={{
            borderColor: exp.accent,
            backgroundColor: exp.accent,
            boxShadow: `0 0 12px ${exp.accent}80`,
          }}
        />
      </div>
    </motion.div>
  );
};

const Experience = () => {
  return (
    <section id="experience" className={styles.section}>
      <div className={styles.header}>
        <RevealSection>
          <SectionTag label="Experience" />
        </RevealSection>
        <RevealSection delay={0.1}>
          <h2 className={styles.heading}>
            Mission{' '}
            <span className={styles.gradientSpan}>
              Log
            </span>
          </h2>
        </RevealSection>
        <RevealSection delay={0.2}>
          <p className={styles.subtext}>
            A record of every mission I've flown, every problem I've solved.
          </p>
        </RevealSection>
      </div>

      <div className={styles.timeline}>
        <div className={styles.centerLine} />

        {experiences.map((exp, index) => (
          <TimelineItem key={exp.id} exp={exp} index={index} />
        ))}
      </div>
    </section>
  );
};

export default Experience;
