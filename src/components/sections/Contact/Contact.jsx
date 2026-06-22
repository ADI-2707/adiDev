
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Contact.module.css';
import Typewriter from '../../ui/Typewriter';
import { playPrinter, playSuccess, playTone, playCRTClick } from '../../../utils/audio';
import ContactForm from './ContactForm';

const REPORT_ROWS = [
  'Technical Ability ............ Excellent',
  'Problem Solving ............... Excellent',
  'Architecture Thinking ......... Excellent',
  'Production Experience ......... Verified',
  ' ',
  'Overall Recommendation ... Highly Recommended'
];

const Contact = ({ activeStage, setStage, unlockOverride }) => {
  const [printState, setPrintState] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (activeStage !== 9) return;

    playPrinter();

    const slideTimer = setTimeout(() => {
      setPrintState(1);
    }, 50);

    const printTimer = setTimeout(() => {
      setPrintState(2);
    }, 2200);

    return () => {
      clearTimeout(slideTimer);
      clearTimeout(printTimer);
    };
  }, [activeStage]);

  const handleTypingComplete = useCallback(() => {
    setPrintState((prev) => {
      if (prev >= 3) return prev;
      playSuccess();

      // Trigger CRT click sound and screen scanline glitch
      setTimeout(() => {
        playCRTClick();
        const sectionEl = document.getElementById('contact');
        if (sectionEl) {
          sectionEl.classList.add(styles.screenFlicker);
          setTimeout(() => {
            sectionEl.classList.remove(styles.screenFlicker);
          }, 150);
        }
      }, 600);

      setTimeout(() => {
        setPrintState(4);
        if (unlockOverride) {
          unlockOverride();
        }
      }, 1200);

      return 3;
    });
  }, [unlockOverride]);

  if (activeStage !== 9) return null;

  const handleRestart = () => {
    playTone(400, 0.1, 0.05);
    setStage(0);
  };

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.cadBlueprintPaper}>
        <div className={styles.cadCoordinate}>VERDICT_STAGE_9</div>
        <div className={styles.cadGridMark} style={{ top: '30%' }} />
        <div className={styles.cadGridMark} style={{ left: '80%' }} />
      </div>

      <div className={`${styles.container} c-space`}>
        <div className={styles.printerSlotWrapper}>
          <div className={styles.printerSlotHeader}>
            <span className={styles.printerStatusText}>PRINTER_ONLINE // SYSTEM_VERDICT_OUTPUT</span>
          </div>

          <AnimatePresence>
            {printState >= 1 && (
              <motion.div
                initial={{ y: -350, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 2.0, ease: 'easeOut' }}
                className={styles.paperReportSheet}
              >
                <div className={styles.reportHeader}>
                  <span className={styles.reportHeaderCode}>SYSTEM_VERDICT_ID: AS-9941</span>
                  <span>CONFIDENTIAL</span>
                </div>

                <div className={styles.reportTitleRow}>
                  <h2 className={styles.reportMainTitle}>ENGINEER EVALUATION REPORT</h2>
                  <div className={styles.dividerLine} />
                </div>

                <div className={`${styles.reportContent} tech-mono`}>
                  {printState >= 2 && (
                    <div className={styles.reportTextLines}>
                      {REPORT_ROWS.map((row, index) => {
                        const delayMs = index * 800;
                        const isLast = index === REPORT_ROWS.length - 1;
                        return (
                          <div key={index} className={styles.reportLineItem}>
                            <Typewriter
                              text={row}
                              speed={25}
                              delay={delayMs}
                              showCursor={isLast && printState === 2}
                              onComplete={isLast ? handleTypingComplete : null}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <AnimatePresence>
                    {printState >= 3 && (
                      <motion.div
                        initial={{ scale: 3, opacity: 0, rotate: -30 }}
                        animate={{ scale: 1, opacity: 1, rotate: -12 }}
                        transition={{ type: 'spring', damping: 12, stiffness: 100 }}
                        className={styles.approvedStamp}
                      >
                        APPROVED
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {printState === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={styles.outroAndCtas}
            >
              <p className={styles.outroMessage}>
                Every system you've explored was designed to solve real-world engineering problems.<br />
                <strong>The next one could be yours.</strong>
              </p>

              <div className={styles.actionsGrid}>
                <a href="/api/v1/resume/download" className={styles.actionBtn}>
                  [DOWNLOAD_RESUME]
                </a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className={styles.actionBtn}>
                  [GITHUB_PROFILE]
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className={styles.actionBtn}>
                  [LINKEDIN_PROFILE]
                </a>
                <button onClick={() => setIsFormOpen(true)} className={styles.actionBtn}>
                  [TRANSMIT_EMAIL]
                </button>
                <a href="https://calendly.com" target="_blank" rel="noreferrer" className={`${styles.actionBtn} ${styles.scheduleCta}`}>
                  [SCHEDULE_MEETING]
                </a>
              </div>

              <div className={styles.restartRow}>
                <button onClick={handleRestart} className={styles.restartBtn}>
                  &lt;&lt; RESTART RECRUITMENT PROTOCOL
                </button>
              </div>

              <div className={styles.secretBypassRow}>
                <button onClick={() => setStage(10)} className={styles.bypassLink}>
                  [`&gt;`] systems_override.exe --allow-bypass
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isFormOpen && <ContactForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />}
      </AnimatePresence>
    </section>
  );
};

export default Contact;
