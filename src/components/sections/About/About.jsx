
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import styles from './About.module.css';
import { playSuccess, playTone } from '../../../utils/audio';

const TIMELINE_EVENTS = [
  { year: '2019', event: 'Engineering Started', desc: 'First line of code written; focused on programming fundamentals.' },
  { year: '2022', event: 'Degree Completed', desc: 'B.Tech in Computer Science and Engineering completed.' },
  { year: '2023', event: 'Entered Industry', desc: 'Joined VSM Venture Control Systems, deploying full-stack systems.' },
  { year: '2024', event: 'L2 Software', desc: 'Promoted to lead internal UI architectures and core backend systems.' },
  { year: '2025', event: 'Stockyard System', desc: 'Designed and shipped the offline warehouse client platform.' },
  { year: 'PRESENT', event: 'Building Larger Systems', desc: 'Scaling industrial automation frameworks and multi-tenant architectures.' },
];

const About = ({ activeStage, setStage }) => {
  const [scanStep, setScanStep] = useState(0); 
  const [academicProgress, setAcademicProgress] = useState(0);
  const [professionalProgress, setProfessionalProgress] = useState(0);
  const [technicalProgress, setTechnicalProgress] = useState(0);
  
  const [expandedCard, setExpandedCard] = useState(null);

  
  useEffect(() => {
    if (activeStage !== 2) return;
    
    
    let interval;
    if (scanStep === 0) {
      interval = setInterval(() => {
        setAcademicProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            playTone(600, 0.05, 0.02);
            setScanStep(1);
            return 100;
          }
          return prev + 10;
        });
      }, 80);
    } 
    // Professional Scan
    else if (scanStep === 1) {
      interval = setInterval(() => {
        setProfessionalProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            playTone(600, 0.05, 0.02);
            setScanStep(2);
            return 100;
          }
          return prev + 10;
        });
      }, 80);
    } 
    // Technical Scan
    else if (scanStep === 2) {
      interval = setInterval(() => {
        setTechnicalProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            playSuccess();
            setScanStep(3);
            return 100;
          }
          return prev + 10;
        });
      }, 80);
    }

    return () => clearInterval(interval);
  }, [scanStep, activeStage]);

  if (activeStage !== 2) return null;

  return (
    <section id="about" className={styles.section}>
      <div className={`${styles.container} c-space`}>
        <AnimatePresence mode="wait">
          {scanStep < 3 ? (
            <motion.div
              key="scanning-console"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`${styles.scanConsole} tech-panel`}
            >
              <div className="tech-panel-header">
                <span>SYSTEM SCAN IN PROGRESS // TELEMETRY_INIT</span>
                <span>SEC_LEVEL_2</span>
              </div>
              <div className={`${styles.scanBody} tech-panel-body tech-mono`}>
                <div className={styles.scanLine}>
                  <span>Scanning Academic History...</span>
                  <div className={styles.scanProgressRow}>
                    <span className={styles.scanBar}>[{'█'.repeat(academicProgress / 10) + ' '.repeat(10 - academicProgress / 10)}]</span>
                    <span className={academicProgress === 100 ? styles.successText : ''}>
                      {academicProgress}% {academicProgress === 100 ? 'COMPLETE' : 'RUNNING'}
                    </span>
                  </div>
                </div>

                <div className={styles.scanLine} style={{ opacity: scanStep >= 1 ? 1 : 0.25 }}>
                  <span>Scanning Professional Experience...</span>
                  <div className={styles.scanProgressRow}>
                    <span className={styles.scanBar}>[{'█'.repeat(professionalProgress / 10) + ' '.repeat(10 - professionalProgress / 10)}]</span>
                    <span className={professionalProgress === 100 ? styles.successText : ''}>
                      {professionalProgress}% {professionalProgress === 100 ? 'COMPLETE' : scanStep === 1 ? 'RUNNING' : 'PENDING'}
                    </span>
                  </div>
                </div>

                <div className={styles.scanLine} style={{ opacity: scanStep >= 2 ? 1 : 0.25 }}>
                  <span>Scanning Technical Capability...</span>
                  <div className={styles.scanProgressRow}>
                    <span className={styles.scanBar}>[{'█'.repeat(technicalProgress / 10) + ' '.repeat(10 - technicalProgress / 10)}]</span>
                    <span className={technicalProgress === 100 ? styles.successText : ''}>
                      {technicalProgress}% {technicalProgress === 100 ? 'COMPLETE' : scanStep === 2 ? 'RUNNING' : 'PENDING'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="evaluation-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={styles.resultsGrid}
            >
              {}
              <div className={styles.summaryBlock}>
                <div className="tech-panel">
                  <div className="tech-panel-header">
                    <span>EVALUATION SUMMARY // ARCH_FINDINGS</span>
                    <span className={styles.successText}>SYSTEM_VERIFIED</span>
                  </div>
                  <div className="tech-panel-body">
                    <div className={styles.summaryGrid}>
                      <div className={styles.summaryField}>
                        <span className={styles.summaryLabel}>EDUCATION</span>
                        <span className={styles.summaryValue}>B.Tech</span>
                      </div>
                      <div className={styles.summaryField}>
                        <span className={styles.summaryLabel}>CURRENT POSITION</span>
                        <span className={styles.summaryValue}>System Engineer</span>
                      </div>
                      <div className={styles.summaryField}>
                        <span className={styles.summaryLabel}>DOMAIN EXPERIENCE</span>
                        <span className={styles.summaryValue}>Industrial Automation</span>
                      </div>
                      <div className={styles.summaryField}>
                        <span className={styles.summaryLabel}>PRIMARY STRENGTH</span>
                        <span className={styles.summaryValue}>Building Full Stack Systems</span>
                      </div>
                    </div>
                  </div>
                </div>

                {}
                <div className={styles.personalitySection}>
                  <h3 className={styles.sectionHeader}>WHY WAS THIS ENGINEER BUILT? // MOTIVATION</h3>
                  <div className={styles.personalityGrid}>
                    {[
                      {
                        id: 'problem',
                        title: 'Problem Solver',
                        story: 'A diagnostic mindset shaped by early hands-on engineering challenges. Enjoys diving deep into stack traces, tracking down race conditions, and building custom tooling to optimize dev loops. Believes any bug, given enough telemetry, is solvable.'
                      },
                      {
                        id: 'system',
                        title: 'Systems Thinker',
                        story: 'Focuses on the architecture behind the code. Designs applications with failure boundaries, scaling hooks, and clear data flows. Prioritizes maintainability and long-term modularity over immediate convenience.'
                      },
                      {
                        id: 'auto',
                        title: 'Industrial Automation',
                        story: 'Experienced in bridging the gap between mechanical processes and digital control loops. Translates industrial process logic (PLC data, telemetry metrics) into clean, high-performance web and desktop control interfaces.'
                      },
                      {
                        id: 'build',
                        title: 'Always Building',
                        story: 'Constantly prototyping personal ideas, exploring new libraries, and learning. Keeps a log of side projects, game designs, and performance investigations to continuously refine technical competence.'
                      }
                    ].map((card) => {
                      const isExpanded = expandedCard === card.id;
                      return (
                        <div
                          key={card.id}
                          className={`${styles.personalityCard} ${isExpanded ? styles.personalityExpanded : ''}`}
                          onClick={() => setExpandedCard(isExpanded ? null : card.id)}
                        >
                          <div className={styles.personalityHeader}>
                            <span className={styles.cardTitle}>{card.title}</span>
                            <span className={styles.cardToggle}>{isExpanded ? '[-] CLOSE' : '[+] INSPECT'}</span>
                          </div>
                          {isExpanded && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              transition={{ duration: 0.2 }}
                              className={styles.cardStory}
                            >
                              {card.story}
                            </motion.p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {}
              <div className={styles.timelineBlock}>
                <div className="tech-panel" style={{ height: '100%' }}>
                  <div className="tech-panel-header">
                    <span>MISSION HISTORY // RECRUITMENT_LOG</span>
                    <span>ACTIVE_TIMELINE</span>
                  </div>
                  <div className={`${styles.timelineBody} tech-panel-body`}>
                    <div className={styles.timelineList}>
                      {TIMELINE_EVENTS.map((evt, idx) => (
                        <div key={idx} className={styles.timelineItem}>
                          <div className={styles.timelineYearCol}>
                            <span className={styles.timelineYear}>{evt.year}</span>
                            <div className={styles.timelineNode} />
                            {idx < TIMELINE_EVENTS.length - 1 && <div className={styles.timelineLineConnector} />}
                          </div>
                          <div className={styles.timelineDescCol}>
                            <span className={styles.timelineTitle}>{evt.event}</span>
                            <span className={styles.timelineDesc}>{evt.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {scanStep === 3 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={styles.bottomNav}
          >
            <button 
              onClick={() => setStage(3)} 
              className={styles.nextCta}
            >
              ADVANCE TO MODULE ASSESSMENT &gt;&gt;
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default About;
