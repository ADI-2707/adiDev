import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Experience.module.css';
import { playTone } from '../../../utils/audio';

import { FACILITIES_DATA } from '../../../data/experienceData';

const Experience = ({ activeStage, setStage }) => {
  const [selectedFac, setSelectedFac] = useState('fac-01');

  if (activeStage !== 5) return null;

  const currentFac = FACILITIES_DATA.find((f) => f.id === selectedFac);

  const handleSelectFac = (id) => {
    playTone(600, 0.05, 0.02);
    setSelectedFac(id);
  };

  return (
    <section id="experience" className={styles.section}>
      <div className={`${styles.container} c-space`}>
        <div className={styles.splitGrid}>
          { }
          <div className={styles.facListColumn}>
            <div className="tech-panel" style={{ height: '100%' }}>
              <div className="tech-panel-header">
                <span>DEPLOYMENT RACKS // FACILITY_REGISTRY</span>
                <span>LEVEL_5</span>
              </div>
              <div className={`${styles.facListBody} tech-panel-body`}>
                <div className={styles.facItemsList}>
                  {FACILITIES_DATA.map((fac) => {
                    const isSelected = selectedFac === fac.id;
                    return (
                      <button
                        key={fac.id}
                        onClick={() => handleSelectFac(fac.id)}
                        className={`${styles.facCard} ${isSelected ? styles.facCardSelected : ''}`}
                      >
                        <span className={styles.facCode}>{fac.code}</span>
                        <h4 className={styles.facTitle}>{fac.name.toUpperCase()}</h4>
                        <span className={styles.facPeriod}>{fac.period}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          { }
          <div className={styles.facDetailColumn}>
            <AnimatePresence mode="wait">
              {currentFac && (
                <motion.div
                  key={selectedFac}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="tech-panel"
                  style={{ height: '100%' }}
                >
                  <div className="tech-panel-header">
                    <span>SECURITY CLEARANCE REQUIRED // DECLASSIFIED_RECORD</span>
                    <span className={styles.roleBadge}>{currentFac.role.toUpperCase()}</span>
                  </div>
                  <div className="tech-panel-body">
                    { }
                    <div className={styles.blueprintWrapper}>
                      <div className={styles.blueprintSymbol}>
                        <div className={styles.gearOuter} />
                        <div className={styles.gearInner} />
                        <span className={styles.blueprintText}>SYS_FLOW_OK</span>
                      </div>
                      <div className={styles.blueprintLines}>
                        <div className={styles.gridLine} />
                        <div className={styles.gridLine} />
                        <span className={styles.blueprintCode}>SYSTEMS_ONLINE_STATUS: VERIFIED</span>
                      </div>
                    </div>

                    { }
                    <div className={styles.logsContainer}>
                      <div className={styles.logField}>
                        <span className={styles.logLabel}>[DELIVERABLES] PROJECTS DELIVERED</span>
                        <p className={styles.logValue}>{currentFac.projects}</p>
                      </div>

                      <div className={styles.logField}>
                        <span className={styles.logLabel}>[INFRASTRUCTURE] SYSTEMS DEPLOYED</span>
                        <p className={styles.logValue}>{currentFac.systems}</p>
                      </div>

                      <div className={styles.logField}>
                        <span className={styles.logLabel}>[RESPONSIBILITIES] SCOPE &amp; OWNERSHIP</span>
                        <p className={styles.logValue}>{currentFac.scope}</p>
                      </div>

                      <div className={styles.logField} style={{ borderBottom: 'none', paddingBottom: 0 }}>
                        <span className={styles.logLabel}>[RETROSPECTIVE] LESSONS LEARNED</span>
                        <p className={styles.logValue} style={{ color: 'var(--accent-cyan)' }}>{currentFac.lessons}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className={styles.bottomNav}>
          <button
            onClick={() => setStage(6)}
            className={styles.nextCta}
          >
            DECRYPT ENGINEERING PHILOSOPHY &gt;&gt;
          </button>
        </div>
      </div>
    </section>
  );
};

export default Experience;
