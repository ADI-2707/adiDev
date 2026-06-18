/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Hero.module.css';
import Typewriter from '../../ui/Typewriter';
import { playSuccess, playDoorSlide, playTone } from '../../../utils/audio';

const Hero = ({ activeStage, setStage }) => {

  // Stage 0: Boot sequence state machine
  const [bootStep, setBootStep] = useState(0);
  const [showFlash, setShowFlash] = useState(false);

  // Auto-advance boot sequence steps
  useEffect(() => {
    if (activeStage !== 0) return;

    const timer1 = setTimeout(() => setBootStep(1), 1200); // Initializing
    const timer2 = setTimeout(() => setBootStep(2), 2600); // Connecting
    const timer3 = setTimeout(() => setBootStep(3), 4000); // Decrypting
    const timer4 = setTimeout(() => setBootStep(4), 5400); // Authenticating
    const timer5 = setTimeout(() => setBootStep(5), 7000); // Progress bar complete
    const timer6 = setTimeout(() => {
      setBootStep(6); // Access Granted
      playSuccess();
    }, 7800);
    const timer7 = setTimeout(() => {
      // Trigger white flash handoff
      setShowFlash(true);
    }, 9200);
    const timer8 = setTimeout(() => {
      setShowFlash(false);
      // Handoff to Dossier Stage 1
      setStage(1);
    }, 9400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
      clearTimeout(timer7);
      clearTimeout(timer8);
    };
  }, [activeStage, setStage]);

  // Stage 1 Action trigger
  const handleInitialize = () => {
    playDoorSlide();
    // Move to Stage 2: Candidate Evaluation
    setStage(2);
  };

  if (activeStage === 0) {
    return (
      <div className={styles.bootContainer}>
        {/* Faint blueprint grid backdrop */}
        <div className="galaxy-background" />
        
        <div className={styles.terminal}>
          <div className={styles.terminalContent}>
            {bootStep >= 0 && (
              <div className={styles.terminalLine}>
                <Typewriter text="> Initializing Recruitment Terminal..." speed={30} showCursor={bootStep === 0} />
              </div>
            )}
            {bootStep >= 1 && (
              <div className={styles.terminalLine}>
                <Typewriter text="> Connecting to Personnel Database..." speed={35} showCursor={bootStep === 1} />
              </div>
            )}
            {bootStep >= 2 && (
              <div className={styles.terminalLine}>
                <Typewriter text="> Decrypting Candidate File..." speed={30} showCursor={bootStep === 2} />
              </div>
            )}
            {bootStep >= 3 && (
              <div className={styles.terminalLine}>
                <Typewriter text="> Authenticating Viewer..." speed={30} showCursor={false} />
                {bootStep === 3 && <ProgressBar duration={1500} />}
              </div>
            )}
            {bootStep >= 4 && (
              <div className={styles.terminalLine}>
                <span className={styles.cyanText}>[████████████████████] 100% AUTH_SUCCESS</span>
              </div>
            )}
            {bootStep >= 5 && (
              <div className={`${styles.terminalLine} ${styles.accessGrantedLine}`}>
                <Typewriter text="> ACCESS GRANTED" speed={40} showCursor={bootStep === 5} />
              </div>
            )}
          </div>
        </div>

        {/* White handoff flash */}
        <AnimatePresence>
          {showFlash && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className={styles.handoffFlash}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (activeStage === 1) {
    return (
      <section id="hero" className={styles.dossierSection}>
        {/* CAD Blueprint grid overlay */}
        <div className={styles.cadBlueprintPaper}>
          <div className={styles.cadCoordinate}>A-14</div>
          <div className={styles.cadCoordinate} style={{ right: '2rem', bottom: '2rem' }}>X:42 / Y:15</div>
          <div className={styles.cadGridMark} style={{ top: '10%' }} />
          <div className={styles.cadGridMark} style={{ left: '10%' }} />
          <div className={styles.cadTickMarks} />
        </div>

        <div className={`${styles.dossierContainer} c-space`}>
          <div className={styles.leftPanel}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className={styles.dossierCard}
            >
              <div className={styles.cardHeader}>
                <span className={styles.cardHeaderTitle}>CLASSIFIED PERSONNEL FILE // RESTRICTED</span>
                <span className={styles.cardHeaderCode}>SYS_REF: AS-9941</span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.dossierField}>
                  <div className={styles.fieldLabel}>NAME:</div>
                  <h1 className={styles.fieldValueBig}>Aditya Singh</h1>
                </div>

                <div className={styles.metaRow}>
                  <div className={styles.dossierField}>
                    <div className={styles.fieldLabel}>CLEARANCE LEVEL:</div>
                    <div className={`${styles.fieldValue} ${styles.blueHighlight}`}>LEVEL_01</div>
                  </div>
                  <div className={styles.dossierField}>
                    <div className={styles.fieldLabel}>EVALUATION STATUS:</div>
                    <div className={`${styles.fieldValue} ${styles.amberHighlight}`}>AWAITING EVALUATION</div>
                  </div>
                </div>

                <div className={styles.dossierField} style={{ borderBottom: 'none', paddingBottom: 0 }}>
                  <div className={styles.fieldLabel}>SPECIALIZATION PROFILE:</div>
                  <div className={styles.specializationList}>
                    <span>INDUSTRIAL SOFTWARE</span>
                    <span className={styles.bulletDot} />
                    <span>FULL STACK SYSTEMS</span>
                    <span className={styles.bulletDot} />
                    <span>DESKTOP APPLICATIONS</span>
                    <span className={styles.bulletDot} />
                    <span>AUTOMATION</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={styles.actionContainer}
            >
              <button 
                onClick={handleInitialize} 
                className={styles.primaryCta}
              >
                INITIALIZE EVALUATION PROT
              </button>
            </motion.div>
          </div>

          {/* Spacer column on right for the rotating globe Canvas */}
          <div className={styles.rightSpace} />
        </div>
      </section>
    );
  }

  return null;
};

// Simulated progress bar component for Stage 0
const ProgressBar = ({ duration }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let startTime = Date.now();
    const interval = setInterval(() => {
      let elapsed = Date.now() - startTime;
      let pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);
      
      // Subtly play keyboard-style click during loading ticks
      if (pct % 8 === 0) {
        playTone(300 + pct * 2, 0.015, 0.005);
      }

      if (elapsed >= duration) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [duration]);

  // Visual text loading bar
  const barsCount = Math.floor(progress / 5);
  const fillText = '█'.repeat(barsCount) + ' '.repeat(20 - barsCount);

  return (
    <span className={styles.progressBarText}>
      [{fillText}] {progress}%
    </span>
  );
};

export default Hero;
