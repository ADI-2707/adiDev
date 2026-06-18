
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import styles from './Skills.module.css';
import { playTone } from '../../../utils/audio';


const MODULES_DATA = {
  python: {
    name: 'Python',
    code: 'SYS_MOD_PY',
    purpose: 'Backend Processing, Automation Scripts & API Gateways',
    usedIn: 'Automation Pipelines, Stockyard Helper Services',
    deployment: 'Production Verified (L2 Systems)',
    patterns: 'OOP Scripting, REST APIs, ETL Data Pipeline Automation',
    diagram: 'backend'
  },
  react: {
    name: 'React',
    code: 'SYS_MOD_RT',
    purpose: 'Dynamic Component UI Rendering & Frontend Systems',
    usedIn: 'Stockyard Client, E-Learning Client, Blazor CRM Dashboard',
    deployment: 'Production Host (Edge Deployment)',
    patterns: 'Context Providers, Dynamic Hooks, Responsive Architecture, Component-Driven Views',
    diagram: 'frontend'
  },
  electron: {
    name: 'Electron',
    code: 'SYS_MOD_EL',
    purpose: 'Cross-Platform Native Desktop Application Shell',
    usedIn: 'Stockyard Desktop Client',
    deployment: 'Production Package (Compiled binaries)',
    patterns: 'IPC Bridge Communication, Main/Renderer Process Separation, Offline Cache Storage',
    diagram: 'desktop'
  },
  docker: {
    name: 'Docker',
    code: 'SYS_MOD_DK',
    purpose: 'Containerized Infrastructure & Environment Mirroring',
    usedIn: 'All Local Development and VPS Host Deployments',
    deployment: 'Kubernetes Ready (Containerized Cluster)',
    patterns: 'Multi-stage Dockerfile Compiles, Volume Binding, Microservice Orchestration',
    diagram: 'infra'
  },
  django: {
    name: 'Django',
    code: 'SYS_MOD_DJ',
    purpose: 'High-Level Python MVC Backend Framework',
    usedIn: 'E-Learning Backend API, CRM Database Core',
    deployment: 'Production Deployed (REST Endpoint Services)',
    patterns: 'DRF Serializers, ORM Migrations, Role-Based Access Middleware',
    diagram: 'backend'
  },
  redis: {
    name: 'Redis',
    code: 'SYS_MOD_RD',
    purpose: 'In-Memory Cache Cache Store & Session Management',
    usedIn: 'E-Learning Stream Cache, CRM App Sessions',
    deployment: 'Production Buffer (Scaled Cache Cluster)',
    patterns: 'Key-Value Cache Storage, Rate Limiting, Pub-Sub Event Sockets',
    diagram: 'database'
  },
  postgresql: {
    name: 'PostgreSQL',
    code: 'SYS_MOD_PG',
    purpose: 'Enterprise Relational Database Management System',
    usedIn: 'E-Learning Platform, Stockyard Core Data Warehouse',
    deployment: 'Verified Persistent Storage (Replica-safe Clusters)',
    patterns: 'Database Constraints, Structured Indexing, Raw SQL CTE Query Optimizations',
    diagram: 'database'
  },
  nextjs: {
    name: 'Next.js',
    code: 'SYS_MOD_NX',
    purpose: 'Server-Side Rendering (SSR) & Static Site Framework',
    usedIn: 'Client Landing Frameworks, adiDev Assessment Console',
    deployment: 'Production Verified (CDN edge cached)',
    patterns: 'SSR page routes, API Middleware functions, Incremental Static Regeneration',
    diagram: 'frontend'
  },
  nginx: {
    name: 'Nginx',
    code: 'SYS_MOD_NG',
    purpose: 'High Performance HTTP Reverse Proxy & Gateway Router',
    usedIn: 'Server API Routing Gateways, Local Docker Services',
    deployment: 'Production Host (Gateway Router)',
    patterns: 'SSL Certificate Offloading, Reverse Proxy Caching, Round-Robin Load Balancing',
    diagram: 'infra'
  },
  git: {
    name: 'Git',
    code: 'SYS_MOD_GT',
    purpose: 'Distributed Version Control & Merge Automation',
    usedIn: 'All Source Control Operations, CI/CD deployment runs',
    deployment: 'CI/CD Managed (GitHub Actions integrations)',
    patterns: 'Gitflow branching structures, Commit verification, Automation webhook alerts',
    diagram: 'devops'
  },
  linux: {
    name: 'Linux',
    code: 'SYS_MOD_LX',
    purpose: 'Operational Host Operating System and Server Kernel',
    usedIn: 'Ubuntu VPS hosts, Docker base images, development environments',
    deployment: 'Production Host Kernel (Bare-metal and virtual cloud servers)',
    patterns: 'Bash scripting, systemd service management, SSH credential handshakes',
    diagram: 'infra'
  }
};

const SchematicDiagram = ({ type }) => {
  if (type === 'frontend') {
    return (
      <svg viewBox="0 0 400 150" className={styles.schematic}>
        <rect x="10" y="45" width="90" height="60" rx="4" fill="var(--bg-secondary)" stroke="var(--accent-blue)" strokeWidth="1" />
        <text x="55" y="75" fill="var(--text-primary)" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">User UI</text>
        <path d="M 100 75 L 140 75" stroke="var(--accent-cyan)" strokeWidth="1.5" strokeDasharray="3" />
        <polygon points="140,75 133,70 133,80" fill="var(--accent-cyan)" />
        
        <rect x="140" y="25" width="120" height="100" rx="4" fill="var(--bg-tertiary)" stroke="var(--accent-cyan)" strokeWidth="1" />
        <text x="200" y="55" fill="var(--text-primary)" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">React Core</text>
        <text x="200" y="75" fill="var(--accent-blue)" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">- State Hooks</text>
        <text x="200" y="95" fill="var(--accent-blue)" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">- Virtual DOM</text>
        
        <path d="M 260 75 L 300 75" stroke="var(--accent-cyan)" strokeWidth="1.5" strokeDasharray="3" />
        <polygon points="300,75 293,70 293,80" fill="var(--accent-cyan)" />
        <rect x="300" y="45" width="90" height="60" rx="4" fill="var(--bg-secondary)" stroke="var(--accent-blue)" strokeWidth="1" />
        <text x="345" y="75" fill="var(--text-primary)" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">REST API</text>
      </svg>
    );
  }
  if (type === 'backend') {
    return (
      <svg viewBox="0 0 400 150" className={styles.schematic}>
        <rect x="10" y="45" width="90" height="60" rx="4" fill="var(--bg-secondary)" stroke="var(--accent-blue)" strokeWidth="1" />
        <text x="55" y="75" fill="var(--text-primary)" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">API Router</text>
        <path d="M 100 75 L 140 75" stroke="var(--accent-cyan)" strokeWidth="1.5" />
        
        <rect x="140" y="30" width="120" height="90" rx="4" fill="var(--bg-tertiary)" stroke="var(--accent-cyan)" strokeWidth="1" />
        <text x="200" y="60" fill="var(--text-primary)" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">Controller Layer</text>
        <text x="200" y="80" fill="var(--accent-blue)" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">Business Rules</text>
        
        <path d="M 260 75 L 300 75" stroke="var(--accent-cyan)" strokeWidth="1.5" />
        <rect x="300" y="45" width="90" height="60" rx="4" fill="var(--bg-secondary)" stroke="var(--accent-blue)" strokeWidth="1" />
        <text x="345" y="75" fill="var(--text-primary)" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">Postgres DB</text>
      </svg>
    );
  }
  if (type === 'desktop') {
    return (
      <svg viewBox="0 0 400 150" className={styles.schematic}>
        <rect x="20" y="25" width="110" height="100" rx="4" fill="var(--bg-secondary)" stroke="var(--accent-blue)" strokeWidth="1" />
        <text x="75" y="60" fill="var(--text-primary)" fontSize="9" textAnchor="middle" fontFamily="var(--font-mono)">Electron Main</text>
        <text x="75" y="80" fill="var(--text-muted)" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">(OS Privileged)</text>
        
        <path d="M 130 55 L 270 55" stroke="var(--accent-cyan)" strokeWidth="1.5" strokeDasharray="3" />
        <text x="200" y="45" fill="var(--accent-cyan)" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">IPC Bridge</text>
        <path d="M 270 95 L 130 95" stroke="var(--accent-blue)" strokeWidth="1.5" strokeDasharray="3" />
        <text x="200" y="115" fill="var(--accent-blue)" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">Callbacks</text>
        
        <rect x="270" y="25" width="110" height="100" rx="4" fill="var(--bg-secondary)" stroke="var(--accent-blue)" strokeWidth="1" />
        <text x="325" y="60" fill="var(--text-primary)" fontSize="9" textAnchor="middle" fontFamily="var(--font-mono)">Renderer UI</text>
        <text x="325" y="80" fill="var(--text-muted)" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">(React Shell)</text>
      </svg>
    );
  }
  if (type === 'database') {
    return (
      <svg viewBox="0 0 400 150" className={styles.schematic}>
        <rect x="10" y="45" width="90" height="60" rx="4" fill="var(--bg-secondary)" stroke="var(--accent-blue)" strokeWidth="1" />
        <text x="55" y="75" fill="var(--text-primary)" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">SQL Call</text>
        <path d="M 100 75 L 140 75" stroke="var(--accent-cyan)" strokeWidth="1.5" />
        
        <rect x="140" y="30" width="120" height="90" rx="4" fill="var(--bg-tertiary)" stroke="var(--accent-cyan)" strokeWidth="1" />
        <text x="200" y="60" fill="var(--text-primary)" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">Query Compiler</text>
        <text x="200" y="80" fill="var(--accent-blue)" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">Index Scan / Filters</text>
        
        <path d="M 260 75 L 300 75" stroke="var(--accent-cyan)" strokeWidth="1.5" />
        <rect x="300" y="45" width="90" height="60" rx="4" fill="var(--bg-secondary)" stroke="var(--accent-blue)" strokeWidth="1" />
        <text x="345" y="75" fill="var(--text-primary)" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">Data Disk</text>
      </svg>
    );
  }
  // Default infra
  return (
    <svg viewBox="0 0 400 150" className={styles.schematic}>
      <rect x="10" y="45" width="90" height="60" rx="4" fill="var(--bg-secondary)" stroke="var(--accent-blue)" strokeWidth="1" />
      <text x="55" y="75" fill="var(--text-primary)" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">VPC Ingress</text>
      <path d="M 100 75 L 140 75" stroke="var(--accent-cyan)" strokeWidth="1.5" />
      
      <rect x="140" y="30" width="120" height="90" rx="4" fill="var(--bg-tertiary)" stroke="var(--accent-cyan)" strokeWidth="1" />
      <text x="200" y="60" fill="var(--text-primary)" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">Container Core</text>
      <text x="200" y="80" fill="var(--accent-blue)" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">Nginx Proxy Route</text>
      
      <path d="M 260 75 L 300 75" stroke="var(--accent-cyan)" strokeWidth="1.5" />
      <rect x="300" y="45" width="90" height="60" rx="4" fill="var(--bg-secondary)" stroke="var(--accent-blue)" strokeWidth="1" />
      <text x="345" y="75" fill="var(--text-primary)" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">App Instance</text>
    </svg>
  );
};

const Skills = ({ activeStage, setStage }) => {
  const [selectedModule, setSelectedModule] = useState('react');

  if (activeStage !== 3) return null;

  const activeModuleData = MODULES_DATA[selectedModule];

  const handleSelectModule = (key) => {
    playTone(700, 0.04, 0.015);
    setSelectedModule(key);
  };

  return (
    <section id="skills" className={styles.section}>
      <div className={`${styles.container} c-space`}>
        <div className={styles.splitGrid}>
          {}
          <div className={styles.gridColumn}>
            <div className="tech-panel" style={{ height: '100%' }}>
              <div className="tech-panel-header">
                <span>INSTALLED SYSTEM MODULES // REGISTRY</span>
                <span>COUNT: 11</span>
              </div>
              <div className={`${styles.gridBody} tech-panel-body`}>
                <div className={styles.modulesGrid}>
                  {Object.entries(MODULES_DATA).map(([key, item]) => {
                    const isSelected = selectedModule === key;
                    return (
                      <button
                        key={key}
                        onClick={() => handleSelectModule(key)}
                        className={`${styles.moduleCard} ${isSelected ? styles.moduleCardSelected : ''}`}
                      >
                        <div className={styles.cardIndicatorRow}>
                          <span className={styles.moduleCode}>{item.code}</span>
                          <span className={`${styles.moduleDot} ${isSelected ? styles.dotSelected : ''}`} />
                        </div>
                        <span className={styles.moduleName}>{item.name.toUpperCase()}</span>
                        <span className={styles.moduleStatus}>STATUS: LOADED</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {}
          <div className={styles.detailColumn}>
            <AnimatePresence mode="wait">
              {activeModuleData ? (
                <motion.div
                  key={selectedModule}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="tech-panel"
                  style={{ height: '100%' }}
                >
                  <div className="tech-panel-header">
                    <span>SPECIFICATION FILE // {activeModuleData.code}</span>
                    <span className={styles.accentText}>READ_ONLY</span>
                  </div>
                  <div className="tech-panel-body">
                    <div className={styles.docWrapper}>
                      <div className={styles.docField}>
                        <span className={styles.docLabel}>MODULE NAME</span>
                        <h3 className={styles.docValueTitle}>{activeModuleData.name}</h3>
                      </div>
                      
                      <div className={styles.docField}>
                        <span className={styles.docLabel}>OPERATIONAL PURPOSE</span>
                        <p className={styles.docValueText}>{activeModuleData.purpose}</p>
                      </div>

                      <div className={styles.docField}>
                        <span className={styles.docLabel}>SYSTEM DEPENDENTS</span>
                        <p className={styles.docValueText}>{activeModuleData.usedIn}</p>
                      </div>

                      <div className={styles.docField}>
                        <span className={styles.docLabel}>DEPLOYMENT PROFILE</span>
                        <p className={styles.docValueText}>{activeModuleData.deployment}</p>
                      </div>

                      <div className={styles.docField}>
                        <span className={styles.docLabel}>ARCHITECTURAL PATTERNS</span>
                        <p className={styles.docValueText}>{activeModuleData.patterns}</p>
                      </div>

                      <div className={styles.schematicWrapper}>
                        <span className={styles.docLabel} style={{ marginBottom: '10px' }}>SYSTEM BLUEPRINT SCHEMATIC</span>
                        <div className={styles.schematicBox}>
                          <SchematicDiagram type={activeModuleData.diagram} />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className={`${styles.emptyDetail} tech-panel`}>
                  <div className="tech-panel-header">
                    <span>SPECIFICATION TERMINAL // IDLE</span>
                  </div>
                  <div className="tech-panel-body tech-mono">
                    SELECT A SYSTEM MODULE FROM REGISTER TO INSPECT SPECIFICATIONS.
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className={styles.bottomNav}>
          <button 
            onClick={() => setStage(4)} 
            className={styles.nextCta}
          >
            INITIALIZE CASE INVESTIGATIONS &gt;&gt;
          </button>
        </div>
      </div>
    </section>
  );
};

export default Skills;
