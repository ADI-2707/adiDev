import { useLenis } from './hooks/useLenis';
import { useScrollSection } from './hooks/useScrollSection';
import Navbar from './components/Navbar/Navbar';
import CompanionCanvas from './components/companion/CompanionCanvas';
import Hero from './components/sections/Hero/Hero';
import About from './components/sections/About/About';
import Skills from './components/sections/Skills/Skills';
import Experience from './components/sections/Experience/Experience';
import Projects from './components/sections/Projects/Projects';
import Contact from './components/sections/Contact/Contact';
import Game from './components/sections/Game/Game';
import Footer from './components/sections/Footer/Footer';

const SECTION_IDS = ['hero', 'about', 'skills', 'experience', 'projects', 'contact', 'game'];

const App = () => {
  useLenis();
  const activeSection = useScrollSection(SECTION_IDS);

  return (
    <div>
      <div className="galaxy-background" />
      <div className={`space-overlay ${activeSection === 'hero' ? '' : 'darker'}`} />
      <Navbar />

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

      <CompanionCanvas activeSection={activeSection} />
    </div>
  );
};

export default App;