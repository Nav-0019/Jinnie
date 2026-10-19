/**
 * Subtle romantic Web Audio sound effects and ambient music box.
 * Zero external audio dependencies, runs anywhere without CORS or missing file errors.
 */

let audioCtx = null;
let ambientInterval = null;
let isMuted = true;

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playNote(freq, duration = 1.2, type = 'sine', volume = 0.15) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Warm envelope
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.debug('Audio play failed', e);
  }
}

// Gentle romantic sound effects
export const soundEffects = {
  click: () => {
    playNote(523.25, 0.2, 'sine', 0.08); // C5
  },
  pageFlip: () => {
    playNote(392.00, 0.4, 'triangle', 0.06); // G4
    setTimeout(() => playNote(440.00, 0.4, 'sine', 0.05), 80);
  },
  candleLight: () => {
    playNote(659.25, 0.5, 'sine', 0.12); // E5
    setTimeout(() => playNote(880.00, 0.6, 'sine', 0.1), 100);
  },
  candleBlow: () => {
    const ctx = getAudioContext();
    if (isMuted || !ctx) return;
    try {
      // Noise buffer for gentle breath whoosh
      const bufferSize = ctx.sampleRate * 0.6;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-3 * (i / bufferSize));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.5);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {
      console.debug(e);
    }
  },
  lightSwitch: () => {
    playNote(220, 0.1, 'square', 0.08);
    setTimeout(() => {
      // Golden bloom chords
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        setTimeout(() => playNote(freq, 2.0, 'sine', 0.07), idx * 120);
      });
    }, 150);
  },
  giftOpen: () => {
    [440, 554.37, 659.25, 880, 1108.73].forEach((f, i) => {
      setTimeout(() => playNote(f, 1.5, 'sine', 0.08), i * 90);
    });
  },
  celebration: () => {
    [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51].forEach((f, i) => {
      setTimeout(() => playNote(f, 1.8, 'sine', 0.09), i * 110);
    });
  }
};

// Gentle ambient music box melody
const ambientChords = [
  [392.00, 493.88, 587.33], // G major
  [329.63, 392.00, 493.88], // E minor
  [261.63, 329.63, 392.00], // C major
  [293.66, 369.99, 440.00], // D major
];

export function toggleAmbientSound(enable) {
  isMuted = !enable;
  if (isMuted) {
    if (ambientInterval) {
      clearInterval(ambientInterval);
      ambientInterval = null;
    }
  } else {
    getAudioContext();
    let chordIdx = 0;
    if (!ambientInterval) {
      const playStep = () => {
        if (isMuted) return;
        const chord = ambientChords[chordIdx % ambientChords.length];
        chord.forEach((freq, idx) => {
          setTimeout(() => playNote(freq, 2.5, 'sine', 0.04), idx * 350);
        });
        chordIdx++;
      };
      playStep();
      ambientInterval = setInterval(playStep, 3500);
    }
  }
  return !isMuted;
}

export function getMuteState() {
  return isMuted;
}
