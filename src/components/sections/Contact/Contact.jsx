
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Contact.module.css';
import Typewriter from '../../ui/Typewriter';
import { playPrinter, playSuccess, playTone, playCRTClick, playOverrideWarning, playGlitchStatic } from '../../../utils/audio';
import ContactForm from './ContactForm';
import SmallGlobe from '../../companion/SmallGlobe';

const REPORT_ROWS = [
  'Technical Ability ............ Excellent',
  'Problem Solving ............... Excellent',
  'Architecture Thinking ......... Excellent',
  'Production Experience ......... Verified',
  ' ',
  'Overall Recommendation ... Highly Recommended'
];

const Contact = ({ activeStage, setStage, triggerFullscreenOverride }) => {
  const [printState, setPrintState] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [overrideState, setOverrideState] = useState('idle'); // 'idle' | 'warning' | 'hdmi'
  const [isGlobeHovered, setIsGlobeHovered] = useState(false);

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

      // Trigger CRT click sound - Glitch effect removed completely per requirements
      setTimeout(() => {
        playCRTClick();
      }, 250);

      setTimeout(() => {
        setPrintState(4);
      }, 1200);

      return 3;
    });
  }, []);

  const handleRestart = () => {
    playTone(400, 0.1, 0.05);
    setStage(0);
  };

  const triggerOverride = () => {
    if (overrideState !== 'idle') return;

    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {
          console.log('HTML5 requestFullscreen blocked. Using standard overlay backup.');
        });
      }
    } catch (err) {
      console.log('Fullscreen request failed.', err);
    }

    setOverrideState('warning');
    playOverrideWarning(1.5);

    // Warning alarm phase for 1.5 seconds
    setTimeout(() => {
      setOverrideState('hdmi');
      playGlitchStatic(2.0);

      // HDMI error calibration screen for 2.0 seconds
      setTimeout(() => {
        if (triggerFullscreenOverride) {
          triggerFullscreenOverride();
        } else {
          setStage(10);
        }
      }, 2000);
    }, 1500);
  };

  if (activeStage !== 9) return null;

  // Circular layout parameters
  const radius = 170; // px
  const angleStep = (2 * Math.PI) / 5;

  const buttons = [
    { label: '[DOWNLOAD_RESUME]', href: '/api/v1/resume/download', isLink: true },
    { label: '[GITHUB_PROFILE]', href: 'https://github.com', target: '_blank', isLink: true },
    { label: '[LINKEDIN_PROFILE]', href: 'https://linkedin.com', target: '_blank', isLink: true },
    { label: '[TRANSMIT_EMAIL]', onClick: () => setIsFormOpen(true), isLink: false },
    { label: '[SCHEDULE_MEETING]', href: 'https://calendly.com', target: '_blank', isLink: true, isSchedule: true }
  ];

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

              {/* Spider Web Revolving Button Layout */}
              <div className={styles.webContainer}>
                <div className={styles.revolvingOuter}>
                  {/* Dashed Connecting Lines SVG */}
                  <svg className={styles.webSvg}>
                    {buttons.map((_, index) => {
                      const angle = index * angleStep - Math.PI / 2;
                      const x = Math.cos(angle) * radius;
                      const y = Math.sin(angle) * radius;
                      return (
                        <line
                          key={index}
                          x1="50%"
                          y1="50%"
                          x2={`calc(50% + ${x}px)`}
                          y2={`calc(50% + ${y}px)`}
                          className={styles.webDashedLine}
                        />
                      );
                    })}
                  </svg>

                  {/* Circular revolving button nodes */}
                  {buttons.map((btn, index) => {
                    const angle = index * angleStep - Math.PI / 2;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    const content = btn.isLink ? (
                      <a
                        href={btn.href}
                        target={btn.target}
                        rel={btn.target ? 'noreferrer' : undefined}
                        className={`${styles.actionBtn} ${btn.isSchedule ? styles.scheduleCta : ''}`}
                      >
                        {btn.label}
                      </a>
                    ) : (
                      <button onClick={btn.onClick} className={styles.actionBtn}>
                        {btn.label}
                      </button>
                    );

                    return (
                      <div
                        key={index}
                        className={styles.revolvingNode}
                        style={{
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                          transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`
                        }}
                      >
                        <div className={styles.counterRotate}>{content}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Glowing small 3D globe in absolute center */}
                <div
                  className={`${styles.centerGlobeWrapper} ${isGlobeHovered ? styles.globeHovered : ''}`}
                  onClick={triggerOverride}
                  onMouseEnter={() => { setIsGlobeHovered(true); playTone(220, 0.1, 0.03, 'sine'); }}
                  onMouseLeave={() => setIsGlobeHovered(false)}
                >
                  <div className={styles.globeBlueGlow} />
                  <div className={styles.smallGlobeContainer}>
                    <SmallGlobe />
                  </div>

                  {/* Lock-on target lines / rings */}
                  <div className={styles.targetRings} />

                  <AnimatePresence>
                    {isGlobeHovered && overrideState === 'idle' && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 5, x: '-50%' }}
                        className={styles.globeTooltip}
                      >
                        [ CLICK TO ENGAGE OVERRIDE ]
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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

      <AnimatePresence>
        {isFormOpen && <ContactForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />}
      </AnimatePresence>

      {/* Fullscreen Override warning sequence overlays */}
      <AnimatePresence>
        {overrideState === 'warning' && (
          <div className={styles.overrideWarningContainer}>
            <div className={styles.overrideAlertBox}>
              <div className={styles.warningIcon}>⚠️</div>
              <h2 className={styles.warningTitle}>CRITICAL SECURITY BREACH</h2>
              <div className={styles.warningDivider} />
              <p className={styles.warningText}>INITIATING OVERRIDE PROTOCOL...</p>
              <div className={styles.warningProgressContainer}>
                <div className={styles.warningProgressBar} />
              </div>
            </div>
            <div className={styles.redScanlines} />
          </div>
        )}

        {overrideState === 'hdmi' && (
          <div className={styles.hdmiContainer}>
            <div className={styles.smpteBars}>
              <div className={styles.barColumn} style={{ backgroundColor: '#c0c0c0' }} />
              <div className={styles.barColumn} style={{ backgroundColor: '#c0c000' }} />
              <div className={styles.barColumn} style={{ backgroundColor: '#00c0c0' }} />
              <div className={styles.barColumn} style={{ backgroundColor: '#00c000' }} />
              <div className={styles.barColumn} style={{ backgroundColor: '#c000c0' }} />
              <div className={styles.barColumn} style={{ backgroundColor: '#c00000' }} />
              <div className={styles.barColumn} style={{ backgroundColor: '#0000c0' }} />
            </div>
            <div className={styles.smpteMiddle}>
              <div className={styles.midColumn} style={{ backgroundColor: '#0000c0' }} />
              <div className={styles.midColumn} style={{ backgroundColor: '#131313' }} />
              <div className={styles.midColumn} style={{ backgroundColor: '#c000c0' }} />
              <div className={styles.midColumn} style={{ backgroundColor: '#131313' }} />
              <div className={styles.midColumn} style={{ backgroundColor: '#00c0c0' }} />
              <div className={styles.midColumn} style={{ backgroundColor: '#131313' }} />
              <div className={styles.midColumn} style={{ backgroundColor: '#c0c0c0' }} />
            </div>
            <div className={styles.smpteBottom}>
              <div className={styles.botColumn1} style={{ backgroundColor: '#002147' }} />
              <div className={styles.botColumn2} style={{ backgroundColor: '#ffffff' }} />
              <div className={styles.botColumn3} style={{ backgroundColor: '#310062' }} />
              <div className={styles.botColumn4} style={{ backgroundColor: '#131313' }} />
              <div className={styles.botColumnPluge}>
                <div style={{ backgroundColor: '#090909' }} />
                <div style={{ backgroundColor: '#131313' }} />
                <div style={{ backgroundColor: '#1d1d1d' }} />
              </div>
              <div className={styles.botColumn5} style={{ backgroundColor: '#131313' }} />
            </div>
            <div className={styles.glitchNoiseOverlay} />
            <div className={styles.crtScanlines} />
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Contact;
