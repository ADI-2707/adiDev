
import { useState, useEffect } from 'react';

import styles from './Navbar.module.css';

const STAGE_LABELS = [
  { id: 1, label: 'L1: DOSSIER', hash: '#dossier' },
  { id: 2, label: 'L2: EVALUATION', hash: '#evaluation' },
  { id: 3, label: 'L3: SYSTEMS', hash: '#systems' },
  { id: 4, label: 'L4: CASES', hash: '#cases' },
  { id: 5, label: 'L5: DEPLOYMENTS', hash: '#facilities' },
  { id: 6, label: 'L6: PHILOSOPHY', hash: '#philosophy' },
  { id: 7, label: 'L7: OPERATIONS', hash: '#operations' },
  { id: 8, label: 'L8: VERDICT', hash: '#report' },
];

const Navbar = ({ activeStage, setStage, maxUnlockedStage, soundMuted, toggleMute }) => {
  const [systemTime, setSystemTime] = useState('');

  
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

  
  if (activeStage === 0) return null;

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
          <span className={styles.brandSubtitle}>// PERSONNEL ASSESSMENT CONSOLE</span>
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
            <span className={`${styles.statusIndicator} ${activeStage === 8 ? styles.statusApproved : styles.statusEvaluating}`} />
            <span className={styles.value}>{activeStage === 8 ? 'APPROVED' : 'EVALUATING'}</span>
          </div>
          
          <button 
            onClick={toggleMute} 
            className={styles.muteButton}
            title={soundMuted ? "Unmute UI Sounds" : "Mute UI Sounds"}
          >
            {soundMuted ? '🔇 MUTED' : '🔊 AUDIO'}
          </button>
        </div>
      </div>

      <nav className={styles.navBar}>
        <div className={styles.navContainer}>
          {STAGE_LABELS.map((stage) => {
            const isUnlocked = stage.id <= maxUnlockedStage;
            const isActive = activeStage === stage.id;
            
            return (
              <button
                key={stage.id}
                onClick={() => isUnlocked && setStage(stage.id)}
                disabled={!isUnlocked}
                className={`${styles.navItem} ${isActive ? styles.navActive : ''} ${!isUnlocked ? styles.navLocked : ''}`}
              >
                <span className={styles.navLabel}>{stage.label}</span>
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
    </motion.header>
  );
};

export default Navbar;
