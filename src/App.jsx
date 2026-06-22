import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar/Navbar';
import CompanionCanvas from './components/companion/CompanionCanvas';
import Hero from './components/sections/Hero/Hero';
import About from './components/sections/About/About';
import Skills from './components/sections/Skills/Skills';
import Projects from './components/sections/Projects/Projects';
import Experience from './components/sections/Experience/Experience';
import Philosophy from './components/sections/Philosophy/Philosophy';
import Operations from './components/sections/Operations/Operations';
import Testimonials from './components/sections/Testimonials/Testimonials';
import Contact from './components/sections/Contact/Contact';
import AdminOverride from './components/sections/AdminOverride/AdminOverride';
import { playDoorSlide } from './utils/audio';

const STAGE_HASHES = {
  0: '',
  1: '#dossier',
  2: '#evaluation',
  3: '#systems',
  4: '#cases',
  5: '#facilities',
  6: '#philosophy',
  7: '#operations',
  8: '#testimonials',
  9: '#report',
  10: '#override',
};

const HASH_TO_STAGE = {
  '': 0,
  '#dossier': 1,
  '#evaluation': 2,
  '#systems': 3,
  '#cases': 4,
  '#facilities': 5,
  '#philosophy': 6,
  '#operations': 7,
  '#testimonials': 8,
  '#report': 9,
  '#override': 10,
};

const App = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [maxUnlockedStage, setMaxUnlockedStage] = useState(1);
  const [soundMuted, setSoundMuted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);


  useEffect(() => {
    window.__soundMuted = soundMuted;
  }, [soundMuted]);


  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const stage = HASH_TO_STAGE[hash] !== undefined ? HASH_TO_STAGE[hash] : 0;

      setActiveStage(stage);
      if (stage > maxUnlockedStage) {
        setMaxUnlockedStage(stage);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [maxUnlockedStage]);


  const handleSetStage = (newStage) => {
    if (newStage === activeStage) return;

    setIsTransitioning(true);
    playDoorSlide();

    setTimeout(() => {
      // Halfway through (door closed): swap components and hashes
      setActiveStage(newStage);
      if (newStage > maxUnlockedStage) {
        setMaxUnlockedStage(newStage);
      }
      window.location.hash = STAGE_HASHES[newStage] || '';
    }, 400);

    setTimeout(() => {
      // Transition complete: open doors
      setIsTransitioning(false);
    }, 800);
  };

  const toggleMute = () => {
    setSoundMuted((m) => !m);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      { }
      <div className="galaxy-background" />
      <div className="space-overlay" />
      {activeStage === 0 && <div className="scanline-sweep" />}

      { }
      <Navbar
        activeStage={activeStage}
        setStage={handleSetStage}
        maxUnlockedStage={maxUnlockedStage}
        soundMuted={soundMuted}
        toggleMute={toggleMute}
      />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          {activeStage === 0 && (
            <motion.div key="boot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, display: 'flex' }}>
              <Hero activeStage={activeStage} setStage={handleSetStage} />
            </motion.div>
          )}
          {activeStage === 1 && (
            <motion.div key="dossier" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, display: 'flex' }}>
              <Hero activeStage={activeStage} setStage={handleSetStage} />
            </motion.div>
          )}
          {activeStage === 2 && (
            <motion.div key="eval" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, display: 'flex' }}>
              <About activeStage={activeStage} setStage={handleSetStage} />
            </motion.div>
          )}
          {activeStage === 3 && (
            <motion.div key="skills" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, display: 'flex' }}>
              <Skills activeStage={activeStage} setStage={handleSetStage} />
            </motion.div>
          )}
          {activeStage === 4 && (
            <motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, display: 'flex' }}>
              <Projects activeStage={activeStage} setStage={handleSetStage} />
            </motion.div>
          )}
          {activeStage === 5 && (
            <motion.div key="experience" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, display: 'flex' }}>
              <Experience activeStage={activeStage} setStage={handleSetStage} />
            </motion.div>
          )}
          {activeStage === 6 && (
            <motion.div key="philosophy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, display: 'flex' }}>
              <Philosophy activeStage={activeStage} setStage={handleSetStage} />
            </motion.div>
          )}
          {activeStage === 7 && (
            <motion.div key="operations" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, display: 'flex' }}>
              <Operations activeStage={activeStage} setStage={handleSetStage} />
            </motion.div>
          )}
          {activeStage === 8 && (
            <motion.div key="testimonials" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, display: 'flex' }}>
              <Testimonials activeStage={activeStage} setStage={handleSetStage} />
            </motion.div>
          )}
          {activeStage === 9 && (
            <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, display: 'flex' }}>
              <Contact activeStage={activeStage} setStage={handleSetStage} unlockOverride={() => setMaxUnlockedStage(10)} />
            </motion.div>
          )}
          {activeStage === 10 && (
            <motion.div key="override" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, display: 'flex' }}>
              <AdminOverride activeStage={activeStage} setStage={handleSetStage} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      { }
      <CompanionCanvas activeStage={activeStage} />

      { }
      <AnimatePresence>
        {isTransitioning && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', pointerEvents: 'none' }}>
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              style={{
                width: '50%',
                height: '100%',
                backgroundColor: 'var(--bg-secondary)',
                borderRight: '1px solid var(--accent-blue)',
                boxShadow: '10px 0 30px rgba(0,0,0,0.5)',
                pointerEvents: 'auto'
              }}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: '0%' }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              style={{
                width: '50%',
                height: '100%',
                backgroundColor: 'var(--bg-secondary)',
                borderLeft: '1px solid var(--accent-blue)',
                boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
                pointerEvents: 'auto'
              }}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;