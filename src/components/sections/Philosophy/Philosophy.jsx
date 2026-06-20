import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Philosophy.module.css';
import { playTone } from '../../../utils/audio';


import { RATIONALE_DATA } from '../../../data/philosophyData';

const Philosophy = ({ activeStage, setStage }) => {
  const [selectedItem, setSelectedItem] = useState('react');

  if (activeStage !== 6) return null;

  const activeRationale = RATIONALE_DATA.find((r) => r.id === selectedItem);

  const handleSelectRationale = (id) => {
    playTone(600, 0.05, 0.02);
    setSelectedItem(id);
  };

  return (
    <section id="philosophy" className={styles.section}>
      <div className={`${styles.container} c-space`}>
        <div className={styles.statementWrapper}>
          <span className={styles.monoPre}>&gt; OPERATOR_STATEMENT:</span>
          <h2 className={styles.statementText}>
            “Good software isn't written. <span className={styles.accentText}>It's engineered.</span>”
          </h2>
        </div>

        <div className={styles.splitGrid}>
          { }
          <div className={styles.selectorColumn}>
            <div className="tech-panel" style={{ height: '100%' }}>
              <div className="tech-panel-header">
                <span>RATIONALE INDEX // WHY_CHOICES</span>
                <span>LEVEL_6</span>
              </div>
              <div className={`${styles.panelBody} tech-panel-body`}>
                <div className={styles.rationaleList}>
                  {RATIONALE_DATA.map((item) => {
                    const isSelected = selectedItem === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectRationale(item.id)}
                        className={`${styles.rationaleCard} ${isSelected ? styles.rationaleSelected : ''}`}
                      >
                        <span className={styles.ratTitle}>{item.title}</span>
                        <span className={styles.ratDecision}>{item.decision}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          { }
          <div className={styles.detailColumn}>
            <AnimatePresence mode="wait">
              {activeRationale && (
                <motion.div
                  key={selectedItem}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="tech-panel"
                  style={{ height: '100%' }}
                >
                  <div className="tech-panel-header">
                    <span>TRADE_OFF REPORT // ARCH_JUDGEMENT</span>
                    <span className={styles.cyanText}>EVAL_LOG</span>
                  </div>
                  <div className="tech-panel-body">
                    <div className={styles.reportWrapper}>
                      <div className={styles.reportField}>
                        <span className={styles.reportLabel}>TECHNOLOGY DEPLOYED</span>
                        <h4 className={styles.reportTitle}>{activeRationale.title.replace('Why ', '')}</h4>
                      </div>

                      <div className={styles.reportField}>
                        <span className={styles.reportLabel}>DECISION SPEC</span>
                        <p className={styles.reportValue}>{activeRationale.decision}</p>
                      </div>

                      <div className={styles.reportField}>
                        <span className={styles.reportLabel}>JUSTIFICATION / REASON</span>
                        <p className={styles.reportValue} style={{ color: 'var(--text-primary)' }}>{activeRationale.reason}</p>
                      </div>

                      <div className={styles.reportField} style={{ borderBottom: 'none', paddingBottom: 0 }}>
                        <span className={styles.reportLabel} style={{ color: 'var(--status-critical)' }}>UNDERSTOOD TRADEOFF</span>
                        <p className={styles.reportValue}>{activeRationale.tradeoff}</p>
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
            onClick={() => setStage(7)}
            className={styles.nextCta}
          >
            ACTIVATE LIVE OPERATIONS GATE &gt;&gt;
          </button>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
