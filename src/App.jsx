import { useLenis } from './hooks/useLenis';
import { useScrollSection } from './hooks/useScrollSection';
import Navbar from './components/Navbar';
import CompanionCanvas from './components/companion/CompanionCanvas';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Experience from './components/sections/Experience';
import Projects from './components/sections/Projects';
import Contact from './components/sections/Contact';
import Game from './components/sections/Game';
import Footer from './components/sections/Footer';

const SECTION_IDS = ['hero', 'about', 'skills', 'experience', 'projects', 'contact', 'game'];

const App = () => {
  useLenis();
  const activeSection = useScrollSection(SECTION_IDS);

  return (
    <div className="relative min-h-screen bg-primary text-white overflow-x-hidden">
      {/* Navigation */}
      <Navbar />

      {/* Page sections */}
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
        <Game />
      </main>

      <Footer />

      {/* Persistent companion overlay — hidden on hero, visible everywhere else */}
      {activeSection !== 'hero' && (
        <CompanionCanvas activeSection={activeSection} />
      )}
    </div>
  );
};

export default App;