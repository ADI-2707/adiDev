/* eslint-disable no-unused-vars, no-empty */
// Synthesized sound effects using the Web Audio API
// This avoids downloading external assets and ensures instant playback.

let audioCtx = null;


const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const playClick = () => {
  if (window.__soundMuted) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    // Higher frequency click/tick sound
    osc.frequency.setValueAtTime(1000 + Math.random() * 200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.02);
    
    gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.02);
  } catch (e) {
    // browser autoplay blocks
  }
};

export const playTone = (freq, duration = 0.1, volume = 0.05, type = 'sine') => {
  if (window.__soundMuted) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // browser autoplay blocks
  }
};

export const playSuccess = () => {
  if (window.__soundMuted) return;
  // A clean double tone (e.g. 520Hz then 650Hz)
  playTone(520, 0.08, 0.06);
  setTimeout(() => {
    playTone(659.25, 0.15, 0.06);
  }, 100);
};

export const playDoorSlide = () => {
  if (window.__soundMuted) return;
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.8; // 0.8 seconds
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Fill buffer with white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, ctx.currentTime);
    // Sweep lowpass filter frequency up and down for a swoosh sound
    filter.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.4);
    filter.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.8);
    
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
    
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    noise.start();
  } catch (e) {
    // browser autoplay blocks
  }
};

export const playPrinter = () => {
  if (window.__soundMuted) return;
  // Programmatic typewriter printer clicking & whirring sound
  try {
    const ctx = getAudioContext();
    // Simulate printer head scans
    const duration = 2.0;
    const interval = setInterval(() => {
      if (window.__soundMuted) {
        clearInterval(interval);
        return;
      }
      playTone(300 + Math.random() * 100, 0.05, 0.02, 'triangle');
    }, 80);
    
    setTimeout(() => {
      clearInterval(interval);
    }, duration * 1000);
  } catch (e) {}
};
