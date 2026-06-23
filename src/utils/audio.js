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

    osc.frequency.setValueAtTime(1000 + Math.random() * 200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.02);

    gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.02);
  } catch {
    void 0;
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
  } catch {
    void 0;
  }
};

export const playSuccess = () => {
  if (window.__soundMuted) return;

  playTone(520, 0.08, 0.06);
  setTimeout(() => {
    playTone(659.25, 0.15, 0.06);
  }, 100);
};

export const playDoorSlide = () => {
  if (window.__soundMuted) return;
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.8;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);


    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, ctx.currentTime);

    filter.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.4);
    filter.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.8);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noise.start();
  } catch {
    void 0;
  }
};

export const playPrinter = () => {
  if (window.__soundMuted) return;

  try {
    getAudioContext();

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
  } catch {
    void 0;
  }
};

export const playCRTClick = () => {
  if (window.__soundMuted) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2000, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.04);

    gainNode.gain.setValueAtTime(0.015, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    void 0;
  }
};

export const playNotification = () => {
  if (window.__soundMuted) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    void 0;
  }
};

export const playScanSweep = () => {
  if (window.__soundMuted) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, ctx.currentTime);
    
    filter.type = 'peaking';
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.5);
    filter.frequency.linearRampToValueAtTime(200, ctx.currentTime + 1.0);

    gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.0);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.0);
  } catch {
    void 0;
  }
};

export const playAccessDenied = () => {
  if (window.__soundMuted) return;
  try {
    const ctx = getAudioContext();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(110, ctx.currentTime);
    
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(115, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start();
    osc2.start();
    
    osc1.stop(ctx.currentTime + 0.6);
    osc2.stop(ctx.currentTime + 0.6);
  } catch {
    void 0;
  }
};

export const playOverrideWarning = (duration = 1.5) => {
  if (window.__soundMuted) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, ctx.currentTime);

    // Retro rising-falling siren effect
    for (let t = 0; t < duration; t += 0.25) {
      osc.frequency.setValueAtTime(220, ctx.currentTime + t);
      osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + t + 0.12);
      osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + t + 0.25);
    }

    gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.03, ctx.currentTime + duration - 0.2);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    void 0;
  }
};

export const playGlitchStatic = (duration = 2.0) => {
  if (window.__soundMuted) return;
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      const crackle = Math.random() > 0.985 ? (Math.random() * 2 - 1) * 3 : 0;
      data[i] = (white * 0.12 + crackle * 0.2) * (1 - i / bufferSize);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, ctx.currentTime);
    filter.Q.setValueAtTime(0.6, ctx.currentTime);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.07, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noise.start();
  } catch {
    void 0;
  }
};

