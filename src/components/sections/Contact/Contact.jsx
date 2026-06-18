
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Contact.module.css';
import Typewriter from '../../ui/Typewriter';
import { playPrinter, playSuccess, playTone } from '../../../utils/audio';

const REPORT_ROWS = [
  'Technical Ability ............ Excellent',
  'Problem Solving ............... Excellent',
  'Architecture Thinking ......... Excellent',
  'Production Experience ......... Verified',
  ' ',
  'Overall Recommendation ... Highly Recommended'
];

const Contact = ({ activeStage, setStage }) => {
  const [printState, setPrintState] = useState(0);

  useEffect(() => {
    if (activeStage !== 8) return;

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

  if (activeStage !== 8) return null;

  const handleTypingComplete = useCallback(() => {
    setPrintState((prev) => {
      if (prev >= 3) return prev;
      playSuccess();
      setTimeout(() => setPrintState(4), 1200);
      return 3;
    });
  }, []);

  const handleRestart = () => {
    playTone(400, 0.1, 0.05);
    setStage(0);
  };

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.cadBlueprintPaper}>
        <div className={styles.cadCoordinate}>VERDICT_STAGE_8</div>
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
                <a href="/cv.pdf" download className={styles.actionBtn}>
                  [DOWNLOAD_RESUME]
                </a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className={styles.actionBtn}>
                  [GITHUB_PROFILE]
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className={styles.actionBtn}>
                  [LINKEDIN_PROFILE]
                </a>
                <a href="mailto:adi@example.com" className={styles.actionBtn}>
                  [TRANSMIT_EMAIL]
                </a>
                <a href="https://calendly.com" target="_blank" rel="noreferrer" className={`${styles.actionBtn} ${styles.scheduleCta}`}>
                  [SCHEDULE_MEETING]
                </a>
              </div>

              <div className={styles.restartRow}>
                <button onClick={handleRestart} className={styles.restartBtn}>
                  &lt;&lt; RESTART RECRUITMENT PROTOCOL
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Contact;
