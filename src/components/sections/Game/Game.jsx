import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import RevealSection from '../../ui/RevealSection/RevealSection';
import { SectionTag } from '../../ui/Button/Button';
import styles from './Game.module.css';

const GAME_W = 480;
const GAME_H = 320;
const PLAYER_W = 36;
const PLAYER_H = 36;
const PLAYER_Y = GAME_H - PLAYER_H - 12;
const ASTEROID_SIZES = [18, 24, 30];

const createAsteroid = (score) => ({
  x: Math.random() * (GAME_W - 30) + 15,
  y: -30,
  r: ASTEROID_SIZES[Math.floor(Math.random() * ASTEROID_SIZES.length)],
  speed: 2 + Math.random() * 2 + score * 0.015,
  rotation: Math.random() * Math.PI * 2,
  rotSpeed: (Math.random() - 0.5) * 0.08,
});

const Game = () => {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    running: false,
    playerX: GAME_W / 2,
    asteroids: [],
    score: 0,
    lives: 3,
    frame: 0,
    spawnRate: 90,
    keys: {},
  });
  const rafRef = useRef(null);
  const [uiState, setUiState] = useState('idle');

  const startGame = () => {
    const s = stateRef.current;
    s.running = true;
    s.playerX = GAME_W / 2;
    s.asteroids = [];
    s.score = 0;
    s.lives = 3;
    s.frame = 0;
    s.spawnRate = 90;
    setUiState('running');
    loop();
  };

  const endGame = () => {
    stateRef.current.running = false;
    cancelAnimationFrame(rafRef.current);
    setUiState('dead');
  };

  const loop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s = stateRef.current;

    // Clear
    ctx.clearRect(0, 0, GAME_W, GAME_H);

    // Background
    ctx.fillStyle = '#030412';
    ctx.fillRect(0, 0, GAME_W, GAME_H);

    // Star particles (static via seeded positions)
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    for (let i = 0; i < 60; i++) {
      const sx = ((i * 137 + s.frame * 0.3) % GAME_W);
      const sy = ((i * 79 + s.frame * 0.1) % GAME_H);
      ctx.fillRect(sx, sy, 1, 1);
    }

    // Move player
    const SPEED = 5;
    if (s.keys['ArrowLeft'] || s.keys['a']) s.playerX = Math.max(PLAYER_W / 2, s.playerX - SPEED);
    if (s.keys['ArrowRight'] || s.keys['d']) s.playerX = Math.min(GAME_W - PLAYER_W / 2, s.playerX + SPEED);

    // Draw player (astronaut silhouette)
    const px = s.playerX - PLAYER_W / 2;
    const py = PLAYER_Y;
    // Helmet
    ctx.beginPath();
    ctx.arc(px + PLAYER_W / 2, py + 12, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#33c2cc';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px + PLAYER_W / 2, py + 12, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#030412';
    ctx.fill();
    // Body
    ctx.fillStyle = '#33c2cc';
    ctx.fillRect(px + 8, py + 22, PLAYER_W - 16, 14);

    // Spawn asteroids
    s.frame++;
    s.score = Math.floor(s.frame / 30);
    if (s.frame % s.spawnRate === 0) {
      s.asteroids.push(createAsteroid(s.score));
      if (s.spawnRate > 30) s.spawnRate -= 1;
    }

    // Draw & move asteroids
    s.asteroids = s.asteroids.filter((a) => a.y < GAME_H + 40);
    for (const a of s.asteroids) {
      a.y += a.speed;
      a.rotation += a.rotSpeed;

      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(a.rotation);
      ctx.beginPath();
      for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * Math.PI * 2;
        const r = a.r * (0.75 + Math.sin(i * 2.5) * 0.25);
        i === 0
          ? ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r)
          : ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
      }
      ctx.closePath();
      ctx.fillStyle = '#282b4b';
      ctx.strokeStyle = '#ea4884';
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Collision check
      const dx = a.x - s.playerX;
      const dy = a.y - (PLAYER_Y + 18);
      if (Math.sqrt(dx * dx + dy * dy) < a.r + 14) {
        s.asteroids = s.asteroids.filter((x) => x !== a);
        s.lives--;
        if (s.lives <= 0) { endGame(); return; }
      }
    }

    // HUD
    ctx.fillStyle = 'white';
    ctx.font = '12px monospace';
    ctx.fillText(`SCORE: ${s.score}`, 12, 20);
    // Lives
    for (let i = 0; i < s.lives; i++) {
      ctx.fillStyle = '#ea4884';
      ctx.fillText('♥', GAME_W - 20 - i * 18, 20);
    }

    rafRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    const onKey = (e, val) => { stateRef.current.keys[e.key] = val; };
    const down = (e) => onKey(e, true);
    const up = (e) => onKey(e, false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Mouse / touch move
  const handleMouseMove = (e) => {
    if (!stateRef.current.running) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = GAME_W / rect.width;
    stateRef.current.playerX = Math.max(
      PLAYER_W / 2,
      Math.min(GAME_W - PLAYER_W / 2, (e.clientX - rect.left) * scaleX)
    );
  };

  return (
    <section id="game" className={styles.section}>
      <div className={styles.header}>
        <RevealSection>
          <SectionTag label="Mini-Game" />
        </RevealSection>
        <RevealSection delay={0.1}>
          <h2 className={styles.heading}>
            Asteroid{' '}
            <span className={styles.gradientSpan}>
              Dodge
            </span>
          </h2>
        </RevealSection>
        <RevealSection delay={0.2}>
          <p className={styles.subtext}>
            Move your astronaut with arrow keys or mouse. Dodge asteroids. Don't die.
          </p>
        </RevealSection>
      </div>

      <RevealSection delay={0.3}>
        <div className={styles.wrapper}>
          {/* Game canvas container */}
          <div
            className={styles.canvasContainer}
            style={{ maxWidth: GAME_W, width: '100%' }}
          >
            <canvas
              ref={canvasRef}
              width={GAME_W}
              height={GAME_H}
              onMouseMove={handleMouseMove}
              className={styles.canvas}
            />

            {/* Overlay screens */}
            {uiState === 'idle' && (
              <div className={styles.overlay}>
                <div className={styles.emoji}>🚀</div>
                <p className={styles.hint}>Use arrow keys or mouse to move</p>
                <button
                  onClick={startGame}
                  className={styles.btnStart}
                >
                  Start Mission
                </button>
              </div>
            )}

            {uiState === 'dead' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={styles.deadOverlay}
              >
                <div className={styles.emoji}>💥</div>
                <p className={styles.deadTitle}>Mission Failed</p>
                <p className={styles.deadScore}>Score: {stateRef.current.score}</p>
                <div className={styles.deadBtnGroup}>
                  <button
                    onClick={startGame}
                    className={styles.btnTryAgain}
                  >
                    Try Again
                  </button>
                  <a
                    href="#contact"
                    className={styles.btnHire}
                  >
                    Hire Me Instead 😄
                  </a>
                </div>
              </motion.div>
            )}
          </div>

          <p className={styles.footnote}>
            Built with Canvas API · No physics engines harmed
          </p>
        </div>
      </RevealSection>
    </section>
  );
};

export default Game;
