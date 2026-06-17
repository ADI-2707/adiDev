import { Suspense } from 'react';
import styles from './Hero.module.css';
import { motion } from 'framer-motion';
import AnimatedText from '../../ui/AnimatedText/AnimatedText';
import { Button } from '../../ui/Button/Button';

const Hero = () => {
  return (
    <section id="hero" className={styles.heroSection}>


      <div className={`${styles.contentWrapper} c-space`}>
        {/* Left — Text content */}
        <div className={styles.leftColumn}>
          {/* Availability badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={styles.badge}
          >
            <span className={styles.pulseDot} />
            Available for Work
          </motion.div>

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
          >
            <h1 className={styles.heading}>
              Hi, I'm{' '}
              <span className={styles.gradientText}>Adi.</span>
            </h1>
          </motion.div>

          {/* Typewriter subline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className={styles.subline}
          >
            <AnimatedText
              sequences={[
                'Full-Stack Developer.', 2000,
                'UI/UX Engineer.', 2000,
                '3D Web Explorer.', 2000,
                '.NET & React Specialist.', 2000,
              ]}
              className={styles.typewriter}
            />
          </motion.div>

          {/* Short bio */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className={styles.bio}
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
            className={styles.ctaContainer}
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
            className={styles.socialsContainer}
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
                className={styles.socialLink}
              >
                {social.icon}
              </a>
            ))}
            <div className={styles.dividerLine} />
            <span className={styles.handleText}>@adiDev</span>
          </motion.div>
        </div>

        {/* Right — 3D Astronaut canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className={styles.astronautWrapper}
        >
          {/* Glow base under astronaut */}
          <div className={styles.astronautGlow} />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className={styles.scrollIndicator}
      >
        <span className={styles.scrollText}>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className={styles.scrollBar}
        />
      </motion.div>
    </section>
  );
};

export default Hero;
