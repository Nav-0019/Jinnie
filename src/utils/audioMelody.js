/**
 * Pure Web Audio API gentle ambient music generator
 * Provides an ethereal, romantic music-box soundscape without external audio files
 */

class AmbientMelodyPlayer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.notes = [
      261.63, // C4
      329.63, // E4
      392.00, // G4
      493.88, // B4
      523.25, // C5
      659.25, // E5
      783.99, // G5
      880.00  // A5
    ];
    this.step = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  playNote(freq) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 3);
    } catch {
      // Audio autoplay policy
    }
  }

  start() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isPlaying = true;

    const playSequence = () => {
      if (!this.isPlaying) return;
      const melodyPattern = [0, 2, 4, 1, 3, 5, 2, 4, 6, 3, 5, 7];
      const noteIdx = melodyPattern[this.step % melodyPattern.length];
      const note = this.notes[noteIdx % this.notes.length];
      this.playNote(note);

      // Play soft harmony chord note occasionally
      if (this.step % 3 === 0) {
        const harmonyNote = this.notes[(noteIdx + 2) % this.notes.length] / 2;
        this.playNote(harmonyNote);
      }

      this.step++;
      const nextDelay = [700, 950, 1200][Math.floor(Math.random() * 3)];
      this.timer = setTimeout(playSequence, nextDelay);
    };

    playSequence();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }
}

export const ambientPlayer = new AmbientMelodyPlayer();
