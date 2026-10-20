import React, { useState, useEffect, useRef, useCallback } from 'react';
import { pop, playArpeggio, rainEmojis } from '../utils/audioSynth';
import { BTS_GIFS } from '../utils/btsGifs';

const CANDLE_COLORS = ['#ff8fb8', '#7fe0ff', '#ffe27a', '#9cf0c0', '#c6a8ff'];

// Generate 18 candle positions (11 on outer ring, 7 on inner ring)
const CANDLE_SLOTS = [];
for (let si = 0; si < 11; si++) {
  const sa = (si / 11) * 6.283 + 0.3;
  CANDLE_SLOTS.push({
    x: 180 + Math.cos(sa) * 100,
    y: 198 + Math.sin(sa) * 20,
  });
}
for (let si = 0; si < 7; si++) {
  const sa = (si / 7) * 6.283;
  CANDLE_SLOTS.push({
    x: 180 + Math.cos(sa) * 50,
    y: 197 + Math.sin(sa) * 9,
  });
}

export function CakeGame({ isCompleted = false, onComplete }) {
  // Phase 1: placing (0-18), Phase 2: lighting, Phase 3: blowing, Phase 4: finished
  const [phase, setPhase] = useState(isCompleted ? 4 : 1);
  const [placedCandles, setPlacedCandles] = useState(() =>
    isCompleted
      ? CANDLE_SLOTS.map((s, i) => ({
          slot: s,
          color: CANDLE_COLORS[i % CANDLE_COLORS.length],
          lit: false,
          blownOut: true,
        }))
      : []
  );

  const [title, setTitle] = useState(
    isCompleted ? '🎉 Happy 18th Birthday, Jinnie! 🎉' : 'Plant 18 candles 🎂'
  );
  const [subtitle, setSubtitle] = useState(
    isCompleted
      ? 'Every candle out. Wish accepted. 💜'
      : 'Drag or tap the candle from below to place it on top of the cake.'
  );

  const [haloOpacity, setHaloOpacity] = useState(0);
  const [blowPower, setBlowPower] = useState(isCompleted ? 1 : 0);
  const [isMicActive, setIsMicActive] = useState(false);
  const [showCelebrationGif, setShowCelebrationGif] = useState(false);

  const isHoldingRef = useRef(false);
  const blowPowerRef = useRef(isCompleted ? 1 : 0);
  const micStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const cakeSvgRef = useRef(null);

  // Dragging state
  const [dragState, setDragState] = useState(null);

  const finishCelebration = useCallback(() => {
    setPhase(4);
    isHoldingRef.current = false;
    setTitle('🎉 Happy 18th Birthday, Jinnie! 🎉');
    setSubtitle('Every candle out. Wish accepted into the universe. 💜');
    setHaloOpacity(0);
    setShowCelebrationGif(true);

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
    }

    playArpeggio([523, 659, 784, 1047, 1319]);
    rainEmojis(['💜', '🎉', '✨', '🎂', '💖'], 45);

    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  // Phase 2: Sequential Lighting
  const startLightingSequence = useCallback((candlesList) => {
    setPhase(2);
    setTitle('Lighting them up… 🔥');
    setSubtitle('Watch all eighteen flames illuminate your sky.');

    candlesList.forEach((c, idx) => {
      setTimeout(() => {
        setPlacedCandles((prev) =>
          prev.map((item, i) => (i === idx ? { ...item, lit: true } : item))
        );
        pop(500 + idx * 30);
      }, 400 + idx * 130);
    });

    const totalTime = 400 + 18 * 130;
    setTimeout(() => {
      setHaloOpacity(1);
      setTitle('Happy 18th, Jinnie! 💜');
      setSubtitle('Close your eyes for a moment, and make a secret wish…');
    }, totalTime + 300);

    setTimeout(() => {
      setPhase(3);
      setTitle('Now blow! 🌬️');
      setSubtitle(
        'Allow the mic and blow into your phone, or hold down the button below!'
      );
    }, totalTime + 2700);
  }, []);

  // 1. Placement Handler (Drag or Tap)
  const placeNextCandle = useCallback((targetSlot = null) => {
    if (phase !== 1) return;
    const currentCount = placedCandles.length;
    if (currentCount >= 18) return;

    let slot = targetSlot;
    if (!slot) {
      const usedSlots = new Set(placedCandles.map((p) => p.slot));
      slot = CANDLE_SLOTS.find((s) => !usedSlots.has(s));
    }
    if (!slot) return;

    const color = CANDLE_COLORS[currentCount % CANDLE_COLORS.length];
    const newPlaced = [
      ...placedCandles,
      { slot, color, lit: false, blownOut: false },
    ];
    newPlaced.sort((a, b) => a.slot.y - b.slot.y);
    setPlacedCandles(newPlaced);

    pop(420 + currentCount * 35);

    const nextCount = newPlaced.length;
    if (nextCount < 18) {
      setSubtitle(`${18 - nextCount} more to go. You’re doing great! 💜`);
    } else {
      startLightingSequence(newPlaced);
    }
  }, [phase, placedCandles, startLightingSequence]);

  // Phase 3: Blow Detection Loop
  useEffect(() => {
    if (phase !== 3) return;

    let animId;
    let lastTime = performance.now();
    let ambientLevel = 0;
    const buf = new Float32Array(1024);
    const startTime = performance.now();

    const loop = (now) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000 || 0.016);
      lastTime = now;

      let micLevel = 0;
      if (analyserRef.current) {
        analyserRef.current.getFloatTimeDomainData(buf);
        let q = 0;
        for (let i = 0; i < buf.length; i++) q += buf[i] * buf[i];
        const rms = Math.sqrt(q / buf.length);
        if (now - startTime < 800) {
          ambientLevel = Math.max(ambientLevel, rms);
        } else {
          micLevel = Math.max(0, Math.min(1, (rms - ambientLevel * 1.4 - 0.01) / 0.12));
        }
      }

      const activeLevel = Math.max(micLevel, isHoldingRef.current ? 0.95 : 0);
      let power = blowPowerRef.current;
      if (activeLevel > 0.25) {
        power += activeLevel * dt * 0.65;
      } else {
        power -= dt * 0.2;
      }
      power = Math.max(0, Math.min(1, power));
      blowPowerRef.current = power;
      setBlowPower(power);
      setHaloOpacity(Math.max(0.1, 1 - power));

      // Extinguish candles progressively as bar fills
      const numExtinguished = Math.floor(power * 18.99);
      setPlacedCandles((prev) =>
        prev.map((c, idx) => ({
          ...c,
          blownOut: idx < numExtinguished,
        }))
      );

      if (power >= 1) {
        finishCelebration();
        return;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [phase, finishCelebration]);

  // Microphone Setup
  const handleEnableMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtxClass();
      if (ctx.state === 'suspended') ctx.resume();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      src.connect(analyser);

      micStreamRef.current = stream;
      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      setIsMicActive(true);
      setSubtitle('Stay quiet for a moment… then BLOW into your mic with full power! 💨');
    } catch (err) {
      console.debug('Mic access error', err);
      setSubtitle('Microphone not allowed here. Use the "Hold to blow" button below 👇');
    }
  };

  // Pointer drag candle logic
  const handleCandleTrayPointerDown = (e) => {
    if (phase !== 1 || placedCandles.length >= 18) return;
    e.preventDefault();
    const currentColor =
      CANDLE_COLORS[placedCandles.length % CANDLE_COLORS.length];
    setDragState({
      x: e.clientX,
      y: e.clientY - 14,
      color: currentColor,
    });

    const onMove = (ev) => {
      setDragState({
        x: ev.clientX,
        y: ev.clientY - 14,
        color: currentColor,
      });
    };

    const onUp = (ev) => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      setDragState(null);

      if (cakeSvgRef.current) {
        const rect = cakeSvgRef.current.getBoundingClientRect();
        const sx = ((ev.clientX - rect.left) / rect.width) * 360;
        const sy = ((ev.clientY - 14 - rect.top) / rect.height) * 330;

        if (sx >= 50 && sx <= 310 && sy >= 135 && sy <= 250) {
          const usedSlots = new Set(placedCandles.map((p) => p.slot));
          let bestSlot = null;
          let bestDist = 1e9;
          CANDLE_SLOTS.forEach((s) => {
            if (usedSlots.has(s)) return;
            const d = (s.x - sx) ** 2 + (s.y - sy) ** 2;
            if (d < bestDist) {
              bestDist = d;
              bestSlot = s;
            }
          });
          if (bestSlot) {
            placeNextCandle(bestSlot);
            return;
          }
        }
      }
      placeNextCandle();
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const candleCounter = placedCandles.length;

  return (
    <div className="cake-game-container">
      <h2 className="cake-title">{title}</h2>
      <p className="cake-subtitle">{subtitle}</p>

      {/* Interactive Cake SVG Area */}
      <div className="cake-wrapper">
        <div
          id="halo"
          style={{ opacity: haloOpacity, transition: 'opacity .8s' }}
        />

        <svg
          ref={cakeSvgRef}
          viewBox="0 0 360 330"
          className="cake-svg"
          role="img"
          aria-label="18th Birthday Cake"
        >
          <defs>
            <linearGradient id="cb" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffc3d2" />
              <stop offset="1" stopColor="#ff8eaa" />
            </linearGradient>
            <radialGradient id="gl">
              <stop offset="0" stopColor="#ffd27a" stopOpacity=".8" />
              <stop offset="1" stopColor="#ff9a3c" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff6c8" />
              <stop offset=".5" stopColor="#ffc24a" />
              <stop offset="1" stopColor="#ff7a2a" />
            </linearGradient>
          </defs>

          {/* Plate */}
          <ellipse cx="180" cy="294" rx="160" ry="24" fill="#cfcbe6" />
          <ellipse cx="180" cy="290" rx="156" ry="21" fill="#f3f1ff" />

          {/* Cake Base */}
          <path
            d="M52,198 L52,268 Q52,298 180,298 Q308,298 308,268 L308,198 Z"
            fill="url(#cb)"
          />
          {/* Middle Frosting Ribbon */}
          <path
            d="M52,238 Q180,266 308,238 L308,252 Q180,280 52,252 Z"
            fill="#fff4e6"
          />
          {/* Cake Top */}
          <ellipse cx="180" cy="198" rx="128" ry="34" fill="#fff6ea" />

          {/* Decorative Frosting Drops & Sprinkles */}
          <g>
            {[72, 99, 126, 153, 180, 207, 234, 261, 288].map((x, i) => (
              <ellipse
                key={i}
                cx={x}
                cy={198 + 34 * Math.sqrt(Math.max(0, 1 - ((x - 180) / 128) ** 2)) + 4}
                rx={11}
                ry={9 + (i % 3) * 3}
                fill="#fff6ea"
              />
            ))}
            {[
              { x: 90, y: 220, c: '#ff6f9c', r: 20 },
              { x: 130, y: 250, c: '#5cc8ff', r: -40 },
              { x: 175, y: 235, c: '#ffd24a', r: 60 },
              { x: 220, y: 255, c: '#7be0a8', r: -15 },
              { x: 260, y: 225, c: '#b58cff', r: 35 },
              { x: 110, y: 265, c: '#ff8fb8', r: 80 },
              { x: 150, y: 280, c: '#7fe0ff', r: -50 },
              { x: 200, y: 275, c: '#ffe27a', r: 25 },
              { x: 240, y: 270, c: '#c6a8ff', r: -70 },
            ].map((sp, i) => (
              <rect
                key={i}
                x={sp.x}
                y={sp.y}
                width="7"
                height="2.8"
                rx="1.4"
                fill={sp.c}
                transform={`rotate(${sp.r} ${sp.x} ${sp.y})`}
              />
            ))}
          </g>

          {/* Target Zone Guide */}
          <ellipse
            cx="180"
            cy="198"
            rx="124"
            ry="31"
            fill="none"
            stroke="#ffe3a3"
            strokeWidth="2"
            strokeDasharray="6 6"
            opacity={phase === 1 ? 0.6 : 0}
            style={{ transition: 'opacity .3s' }}
          />

          {/* Render Placed Candles */}
          <g>
            {placedCandles.map((c, i) => {
              const isLit = c.lit && !c.blownOut;
              const isOut = c.blownOut;
              return (
                <g
                  key={i}
                  className={`cn ${isLit ? 'lit' : ''} ${isOut ? 'out' : ''}`}
                  transform={`translate(${c.slot.x}, ${c.slot.y})`}
                  style={{ '--lean': `${blowPower * 35}` }}
                >
                  <g className="pl">
                    <rect
                      x="-3.5"
                      y="-36"
                      width="7"
                      height="36"
                      rx="2"
                      fill={c.color}
                    />
                    <path
                      d="M-3.5,-27 l7,-4 M-3.5,-18 l7,-4 M-3.5,-9 l7,-4"
                      stroke="#fff"
                      strokeOpacity=".65"
                      strokeWidth="2.2"
                    />
                    <rect
                      x="-0.6"
                      y="-42"
                      width="1.2"
                      height="6"
                      fill="#4a3a3a"
                    />
                  </g>

                  {isLit && (
                    <g className="fl2">
                      <g className="fl">
                        <g className="ff">
                          <ellipse
                            cx="0"
                            cy="-53"
                            rx="10"
                            ry="14"
                            fill="url(#gl)"
                          />
                          <path
                            d="M0,-61 C6,-53 6,-46 0,-44 C-6,-46 -6,-53 0,-61 Z"
                            fill="url(#fg)"
                          />
                        </g>
                      </g>
                    </g>
                  )}

                  {isOut && (
                    <circle className="smk" cx="0" cy="-46" r="4" fill="#bbb" />
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Phase 1: Draggable/Tappable Candle Tray */}
      {phase === 1 && (
        <div id="tray">
          <div
            id="tc"
            onPointerDown={handleCandleTrayPointerDown}
            onClick={() => placeNextCandle()}
            title="Tap or drag to place candle onto cake"
            style={{ cursor: 'grab' }}
          >
            <svg viewBox="-8 -46 16 48" width="42" height="120">
              <rect
                x="-3.5"
                y="-36"
                width="7"
                height="36"
                rx="2"
                fill={CANDLE_COLORS[candleCounter % CANDLE_COLORS.length]}
              />
              <path
                d="M-3.5,-27 l7,-4 M-3.5,-18 l7,-4 M-3.5,-9 l7,-4"
                stroke="#fff"
                strokeOpacity=".65"
                strokeWidth="2.2"
              />
              <rect x="-0.6" y="-42" width="1.2" height="6" fill="#4a3a3a" />
            </svg>
          </div>
          <span id="cn">{candleCounter} / 18</span>
        </div>
      )}

      {/* Phase 3: Blow controls & gauge */}
      {phase === 3 && (
        <div id="bp">
          <div id="meter">
            <div id="mf" style={{ width: `${blowPower * 100}%` }} />
          </div>
          <div className="blow-buttons-row">
            {!isMicActive && (
              <button id="mic" onClick={handleEnableMic}>
                Allow mic & blow 🎤
              </button>
            )}
            <button
              id="hold"
              onPointerDown={(e) => {
                e.preventDefault();
                isHoldingRef.current = true;
              }}
              onPointerUp={() => {
                isHoldingRef.current = false;
              }}
              onPointerLeave={() => {
                isHoldingRef.current = false;
              }}
              onPointerCancel={() => {
                isHoldingRef.current = false;
              }}
            >
              Hold to blow instead 🌬️
            </button>
          </div>
        </div>
      )}

      {/* Floating Dragged Candle Proxy */}
      {dragState && (
        <div
          className="drag"
          style={{ left: `${dragState.x}px`, top: `${dragState.y}px` }}
        >
          <svg viewBox="-8 -46 16 48" width="42" height="120">
            <rect
              x="-3.5"
              y="-36"
              width="7"
              height="36"
              rx="2"
              fill={dragState.color}
            />
            <path
              d="M-3.5,-27 l7,-4 M-3.5,-18 l7,-4 M-3.5,-9 l7,-4"
              stroke="#fff"
              strokeOpacity=".65"
              strokeWidth="2.2"
            />
            <rect x="-0.6" y="-42" width="1.2" height="6" fill="#4a3a3a" />
          </svg>
        </div>
      )}

      {/* BTS Celebration GIF popup when completed */}
      {showCelebrationGif && (
        <div className="cake-completed-banner">
          <img
            src={BTS_GIFS.celebration1}
            alt="BTS Celebration"
            className="celebration-sticker"
            referrerPolicy="no-referrer"
          />
          <p className="banner-txt">
            💜 All 18 candles blown! Scroll down to open your gift 🎁
          </p>
        </div>
      )}
    </div>
  );
}
