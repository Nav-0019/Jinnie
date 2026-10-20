// Web Audio API Synthesizer & Particle Systems for Celestial Birthday Universe

let audioCtx = null;
let ambientOscs = null;
let isMuted = true;

export function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function pop(freq = 620) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const t = ctx.currentTime;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.31);
  } catch (e) {
    console.debug('Audio pop error', e);
  }
}

export function playArpeggio(notes = [523, 659, 784, 1047, 1319]) {
  notes.forEach((freq, i) => {
    setTimeout(() => {
      pop(freq);
    }, i * 140);
  });
}

export function toggleAmbientSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    if (ambientOscs) {
      ambientOscs.forEach((o) => {
        try {
          o.stop();
        } catch (err) {
          console.debug(err);
        }
      });
      ambientOscs = null;
      isMuted = true;
      return false;
    }

    const freqs = [55, 82.4, 110.5];
    ambientOscs = freqs.map((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      g.gain.value = 0.04 / (i + 1);
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      return o;
    });

    isMuted = false;
    return true;
  } catch (e) {
    console.debug('Audio ambient error', e);
    return false;
  }
}

export function getIsSoundOn() {
  return !isMuted;
}

// Particle visual effects
export function burstSparkles(x, y, emojis = ['✦', '✨', '💜'], count = 6, dist = 90) {
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.textContent = emojis[i % emojis.length];
    s.style.cssText = `position:fixed;left:${x}px;top:${y}px;z-index:9999;pointer-events:none;user-select:none;font-size:${16 + Math.random() * 16}px;`;
    document.body.appendChild(s);

    const a = Math.random() * 6.28;
    const r = dist * (0.5 + Math.random());
    const anim = s.animate(
      [
        { transform: 'translate(-50%, -50%)', opacity: 1 },
        {
          transform: `translate(calc(-50% + ${Math.cos(a) * r}px), calc(-50% + ${
            Math.sin(a) * r + 40
          }px)) rotate(${Math.random() * 400 - 200}deg)`,
          opacity: 0,
        },
      ],
      { duration: 1200, easing: 'cubic-bezier(.2,.8,.3,1)' }
    );
    anim.onfinish = () => s.remove();
  }
}

export function rainEmojis(emojis = ['💜', '🎉', '✨', '🎂', '💖'], count = 35) {
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.textContent = emojis[i % emojis.length];
    s.style.cssText = `position:fixed;top:-30px;left:${Math.random() * 100}vw;z-index:9999;pointer-events:none;user-select:none;font-size:${18 + Math.random() * 18}px;`;
    document.body.appendChild(s);

    const anim = s.animate(
      [
        { transform: 'translateY(0) rotate(0)' },
        { transform: `translateY(110vh) rotate(${Math.random() * 540}deg)` },
      ],
      {
        duration: 3000 + Math.random() * 3000,
        delay: Math.random() * 2200,
        easing: 'cubic-bezier(.25,.46,.45,.94)',
      }
    );
    anim.onfinish = () => s.remove();
  }
}
