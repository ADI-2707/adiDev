import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Navbar.module.css';
import pkg from '../../../package.json';

const STAGE_LABELS = [
  { id: 1, label: 'L1: DOSSIER', hash: '#dossier' },
  { id: 2, label: 'L2: EVALUATION', hash: '#evaluation' },
  { id: 3, label: 'L3: SYSTEMS', hash: '#systems' },
  { id: 4, label: 'L4: CASES', hash: '#cases' },
  { id: 5, label: 'L5: DEPLOYMENTS', hash: '#facilities' },
  { id: 6, label: 'L6: PHILOSOPHY', hash: '#philosophy' },
  { id: 7, label: 'L7: OPERATIONS', hash: '#operations' },
  { id: 8, label: 'L8: DEBRIEFINGS', hash: '#testimonials' },
  { id: 9, label: 'L9: VERDICT', hash: '#report' },
  { id: 10, label: 'L10: OVERRIDE', hash: '#override', isSecret: true },
];

const Navbar = ({ activeStage, setStage, maxUnlockedStage, soundMuted, toggleMute }) => {
  const [systemTime, setSystemTime] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      setSystemTime(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
  }, [activeStage]);

  if (activeStage === 0) return null;

  const handleStage = (id) => {
    const isUnlocked = id <= maxUnlockedStage;
    if (!isUnlocked) return;
    setMenuOpen(false);
    setStage(id);
  };

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={styles.header}
    >
      <div className={styles.topBar}>
        <div className={styles.brand}>
          <span className={styles.terminalPrompt}>&gt;</span>
          <span className={styles.brandName}>adiDev</span>
          <span className={styles.brandSubtitle}>// AGENT_OS_v{pkg.version}</span>
        </div>

        <div className={styles.telemetry}>
          <div className={styles.telemetryItem}>
            <span className={styles.label}>SYS_CLOCK:</span>
            <span className={styles.value}>{systemTime}</span>
          </div>
          <div className={styles.telemetryItem}>
            <span className={styles.label}>SEC_CLEARANCE:</span>
            <span className={`${styles.value} ${styles.clearanceValue}`}>LEVEL_{activeStage}</span>
          </div>
          <div className={styles.telemetryItem}>
            <span className={styles.label}>STATUS:</span>
            <span className={`${styles.statusIndicator} ${activeStage === 9 ? styles.statusApproved : styles.statusEvaluating}`} />
            <span className={styles.value}>{activeStage === 9 ? 'APPROVED' : 'EVALUATING'}</span>
          </div>

          <button
            onClick={toggleMute}
            className={styles.muteButton}
            title={soundMuted ? 'Unmute UI Sounds' : 'Mute UI Sounds'}
          >
            {soundMuted ? '🔇 MUTED' : '🔊 AUDIO'}
          </button>
        </div>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen3 : ''}`} />
        </button>
      </div>

      <nav className={styles.navBar}>
        <div className={styles.navContainer}>
          {STAGE_LABELS.map((stage) => {
            if (stage.isSecret && maxUnlockedStage < 10) return null;

            const isUnlocked = stage.id <= maxUnlockedStage;
            const isActive = activeStage === stage.id;

            return (
              <button
                key={stage.id}
                onClick={() => isUnlocked && setStage(stage.id)}
                disabled={!isUnlocked}
                className={`${styles.navItem} ${isActive ? styles.navActive : ''} ${!isUnlocked ? styles.navLocked : ''} ${stage.isSecret ? styles.navSecret : ''}`}
              >
                <span className={styles.navLabel}>
                  {stage.label}
                  {stage.isSecret && <span className={styles.pulseDot} />}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className={styles.activeLine}
                    transition={{ type: 'tween', duration: 0.25 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            key="drawer"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={styles.drawer}
          >
            {STAGE_LABELS.map((stage) => {
              if (stage.isSecret && maxUnlockedStage < 10) return null;

              const isUnlocked = stage.id <= maxUnlockedStage;
              const isActive = activeStage === stage.id;

              return (
                <button
                  key={stage.id}
                  onClick={() => handleStage(stage.id)}
                  disabled={!isUnlocked}
                  className={`${styles.drawerItem} ${isActive ? styles.drawerItemActive : ''} ${!isUnlocked ? styles.drawerItemLocked : ''} ${stage.isSecret ? styles.navSecret : ''}`}
                >
                  {stage.label}
                  {stage.isSecret && <span className={styles.pulseDotMobile} />}
                </button>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
