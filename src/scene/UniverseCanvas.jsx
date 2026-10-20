import React, { useEffect, useRef } from 'react';
import { burstSparkles } from '../utils/audioSynth';

export function UniverseCanvas({ scrollProgress = 0, scrollVelocity = 0 }) {
  const canvasRef = useRef(null);
  const scrollRef = useRef({ progress: 0, velocity: 0 });

  useEffect(() => {
    scrollRef.current.progress = scrollProgress;
    scrollRef.current.velocity = scrollVelocity;
  }, [scrollProgress, scrollVelocity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationId;
    let time = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // Stars & Galaxy arrays
    const stars = [];
    for (let i = 0; i < 260; i++) {
      stars.push({
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        z: Math.random(),
      });
    }

    const galaxyStars = [];
    for (let i = 0; i < 650; i++) {
      const rr = Math.pow(Math.random(), 0.7);
      const arm = i % 2;
      galaxyStars.push({
        r: rr,
        a: rr * 3.2 + arm * Math.PI + (Math.random() - 0.5) * 0.55,
        s: Math.random() * 1.4 + 0.5,
      });
    }

    // Procedural Nebula Offscreen Buffer
    const NW = 160;
    const NH = 1000;
    const nebulaCanvas = document.createElement('canvas');
    nebulaCanvas.width = NW;
    nebulaCanvas.height = NH;

    function hash(x, y) {
      const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
      return h - Math.floor(h);
    }

    function valueNoise(x, y) {
      const xi = Math.floor(x);
      const yi = Math.floor(y);
      const xf = x - xi;
      const yf = y - yi;
      const u = xf * xf * (3 - 2 * xf);
      const v = yf * yf * (3 - 2 * yf);
      return (
        hash(xi, yi) * (1 - u) * (1 - v) +
        hash(xi + 1, yi) * u * (1 - v) +
        hash(xi, yi + 1) * (1 - u) * v +
        hash(xi + 1, yi + 1) * u * v
      );
    }

    function fbm(x, y) {
      let s = 0;
      let a = 0.5;
      for (let o = 0; o < 5; o++) {
        s += a * valueNoise(x, y);
        x = x * 2.03 + 17;
        y = y * 2.03 + 9;
        a *= 0.5;
      }
      return s;
    }

    const PAL = [
      [0, [150, 110, 235]],
      [0.1, [90, 60, 190]],
      [0.2, [190, 90, 240]],
      [0.3, [120, 100, 255]],
      [0.4, [150, 60, 170]],
      [0.5, [70, 50, 130]],
      [0.6, [255, 120, 210]],
      [0.7, [170, 100, 255]],
      [0.8, [90, 80, 220]],
      [0.9, [240, 90, 230]],
      [1, [175, 110, 255]],
    ];

    function getPaletteColor(t) {
      for (let i = 1; i < PAL.length; i++) {
        if (t <= PAL[i][0]) {
          const a = PAL[i - 1];
          const b = PAL[i];
          const k = (t - a[0]) / (b[0] - a[0]);
          return [0, 1, 2].map((j) => a[1][j] + (b[1][j] - a[1][j]) * k);
        }
      }
      return PAL[10][1];
    }

    // Generate Nebula texture once
    (() => {
      const nCtx = nebulaCanvas.getContext('2d');
      const imgData = nCtx.createImageData(NW, NH);
      const d = imgData.data;

      for (let y = 0; y < NH; y++) {
        const col = getPaletteColor(y / NH);
        for (let x = 0; x < NW; x++) {
          const nx = (x / NW) * 3.2;
          const ny = (y / NH) * 3.2;
          const w = fbm(nx + 5, ny) * 1.6;
          const n = fbm(nx + w, ny + fbm(nx, ny + 3));
          const gas = Math.pow(Math.max(0, n - 0.28) * 2, 1.7);
          const dk = Math.min(
            0.85,
            Math.max(0, fbm(nx * 1.7 + 40, ny * 1.7) - 0.5) * 2.4
          );
          const b = gas * (1 - dk) * 0.95;
          const idx = (y * NW + x) * 4;

          d[idx] = 4 + col[0] * b;
          d[idx + 1] = 6 + col[1] * b;
          d[idx + 2] = 14 + col[2] * b;
          d[idx + 3] = 255;
        }
      }
      nCtx.putImageData(imgData, 0, 0);

      // Embedded starlight glow specks
      for (let k = 0; k < 40; k++) {
        nCtx.save();
        nCtx.translate(Math.random() * NW, Math.random() * NH);
        nCtx.rotate(Math.random() * 3);
        nCtx.scale(1, 0.4);
        const r = 1.5 + Math.random() * 3;
        const q = nCtx.createRadialGradient(0, 0, 0, 0, 0, r);
        q.addColorStop(0, 'rgba(255,240,220,.9)');
        q.addColorStop(1, 'rgba(200,190,255,0)');
        nCtx.fillStyle = q;
        nCtx.beginPath();
        nCtx.arc(0, 0, r, 0, 6.283);
        nCtx.fill();
        nCtx.restore();
      }

      for (let k = 0; k < 260; k++) {
        nCtx.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.7})`;
        nCtx.fillRect(
          Math.floor(Math.random() * NW),
          Math.floor(Math.random() * NH),
          1,
          1
        );
      }
    })();

    // Celestial rendering helpers
    function glow(x, y, r, c0, c1) {
      const q = ctx.createRadialGradient(x, y, 0, x, y, r);
      q.addColorStop(0, c0);
      q.addColorStop(1, c1);
      ctx.fillStyle = q;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 6.283);
      ctx.fill();
    }

    function ring(x, y, R, t, c) {
      const p = (t * 0.45) % 1;
      ctx.strokeStyle = c.replace('A', String((1 - p) * 0.8));
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, R * (0.3 + p * 1.6), 0, 6.283);
      ctx.stroke();
    }

    function spark(x, y, s, a) {
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.beginPath();
      ctx.moveTo(x, y - s);
      ctx.quadraticCurveTo(x, y, x + s, y);
      ctx.quadraticCurveTo(x, y, x, y + s);
      ctx.quadraticCurveTo(x, y, x - s, y);
      ctx.quadraticCurveTo(x, y, x, y - s);
      ctx.fill();
    }

    // Celestial objects dictionary
    const CELESTIAL = {
      earth: (x, y, R, t) => {
        const B = (u) => {
          const a = 1 - u;
          return [
            a * a * a * (x - R * 1.7) +
              3 * a * a * u * (x - R * 0.5) +
              3 * a * u * u * (x + R * 1.2) +
              u * u * u * (x + R * 1.7),
            a * a * a * (y + R * 0.6) +
              3 * a * a * u * (y - R * 1.3) +
              3 * a * u * u * (y + R * 1.1) +
              u * u * u * (y - R * 0.4),
          ];
        };
        const h = (t * 0.12) % 1.25;
        for (let k = 0; k < 46; k++) {
          const u = h - (k / 46) * 0.45;
          if (u < 0 || u > 1) continue;
          const p = B(u);
          const f = 1 - k / 46;
          ctx.fillStyle = `rgba(215,232,255,${Math.pow(f, 1.6) * 0.85})`;
          ctx.beginPath();
          ctx.arc(p[0], p[1], f * 2.6 + 0.4, 0, 6.283);
          ctx.fill();
        }
        if (h <= 1) {
          const q = B(h);
          glow(q[0], q[1], R * 0.3, 'rgba(255,255,255,1)', 'rgba(160,200,255,0)');
        }
      },
      constellation: (x, y, R, t) => {
        const P = [
          [-0.95, 0.2],
          [-0.55, -0.1],
          [-0.2, 0.12],
          [0.15, -0.15],
          [0.3, 0.4],
          [0.65, 0.1],
          [0.95, 0.5],
        ];
        ctx.strokeStyle = 'rgba(183,156,255,.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        P.forEach((p, i) => {
          const px = x + p[0] * R * 1.3;
          const py = y + p[1] * R * 1.1;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
        P.forEach((p, i) => {
          glow(
            x + p[0] * R * 1.3,
            y + p[1] * R * 1.1,
            R * (0.16 + 0.05 * Math.sin(t * 2 + i)),
            '#fff',
            'rgba(255,217,138,0)'
          );
        });
      },
      nebula: (x, y, R, t) => {
        [0, 1].forEach((k) => {
          const o = (k ? 1 : -1) * R * (0.5 + 0.1 * Math.sin(t * 0.8));
          glow(
            x + o,
            y + (k ? -1 : 1) * R * 0.1,
            R * 1.2,
            k ? 'rgba(255,200,120,.6)' : 'rgba(150,100,255,.65)',
            'rgba(0,0,0,0)'
          );
        });
        glow(x, y, R * 0.5, 'rgba(255,255,255,.6)', 'rgba(255,255,255,0)');
        for (let i = 0; i < 22; i++) {
          const a = i * 2.4 + t * 0.5;
          const d = R * (0.2 + 0.6 * (((i * 37) % 10) / 10));
          ctx.fillStyle = `rgba(255,255,255,${0.5 + 0.5 * Math.sin(t * 3 + i)})`;
          ctx.fillRect(x + Math.cos(a) * d, y + Math.sin(a) * d * 0.7, 2, 2);
        }
      },
      grb: (x, y, R, t) => {
        const p = Math.pow(Math.max(0, Math.sin(t * 1.6)), 6);
        glow(
          x,
          y,
          R * (0.7 + p * 0.5),
          `rgba(255,255,255,${0.6 + p * 0.4})`,
          'rgba(120,180,255,0)'
        );
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-0.55);
        const L = R * 2.6;
        const q = ctx.createLinearGradient(-L, 0, L, 0);
        q.addColorStop(0, 'rgba(150,200,255,0)');
        q.addColorStop(0.5, `rgba(200,230,255,${0.5 + p * 0.5})`);
        q.addColorStop(1, 'rgba(150,200,255,0)');
        ctx.fillStyle = q;
        const h = R * 0.07 * (1 + p * 3);
        ctx.fillRect(-L, -h, L * 2, h * 2);
        ctx.restore();
        ring(x, y, R, t, 'rgba(160,210,255,A)');
      },
      blackhole: (x, y, R, t) => {
        glow(x, y, R * 1.5, 'rgba(255,140,60,.18)', 'rgba(0,0,0,0)');
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-0.22);
        ctx.scale(1, 0.3);
        for (let i = 0; i < 7; i++) {
          ctx.strokeStyle = `hsla(${25 + i * 14},95%,${62 - i * 3}%,.85)`;
          ctx.lineWidth = R * 0.05;
          ctx.setLineDash([R * 0.5, R * 0.12]);
          ctx.lineDashOffset = -t * 30 * (1 + i * 0.3);
          ctx.beginPath();
          ctx.arc(0, 0, R * (0.8 + i * 0.1), 0, 6.283);
          ctx.stroke();
        }
        ctx.restore();
        ctx.setLineDash([]);
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x, y, R * 0.5, 0, 6.283);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,200,140,.9)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.strokeStyle = 'rgba(255,170,90,.6)';
        ctx.lineWidth = R * 0.06;
        ctx.beginPath();
        ctx.arc(x, y, R * 0.62, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();
      },
      deadplanet: (x, y, R, t) => {
        const q = ctx.createRadialGradient(
          x - R * 0.3,
          y - R * 0.3,
          R * 0.1,
          x,
          y,
          R * 0.85
        );
        q.addColorStop(0, '#9aa0ad');
        q.addColorStop(0.6, '#3a3f4c');
        q.addColorStop(1, '#0b0d14');
        ctx.fillStyle = q;
        ctx.beginPath();
        ctx.arc(x, y, R * 0.85, 0, 6.283);
        ctx.fill();
        [
          [-0.3, -0.2, 0.18],
          [0.25, 0.1, 0.22],
          [-0.1, 0.38, 0.12],
          [0.38, -0.35, 0.1],
        ].forEach((c) => {
          ctx.fillStyle = 'rgba(0,0,0,.3)';
          ctx.beginPath();
          ctx.arc(x + c[0] * R, y + c[1] * R, c[2] * R, 0, 6.283);
          ctx.fill();
        });
        ctx.strokeStyle = 'rgba(0,0,0,.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - R * 0.1, y - R * 0.8);
        ctx.lineTo(x + R * 0.05, y - R * 0.3);
        ctx.lineTo(x - R * 0.12, y + R * 0.05);
        ctx.lineTo(x + R * 0.1, y + R * 0.5);
        ctx.lineTo(x, y + R * 0.84);
        ctx.stroke();
        for (let i = 0; i < 18; i++) {
          const a = i * 0.35 + t * 0.1;
          ctx.fillStyle = 'rgba(150,155,170,.55)';
          ctx.fillRect(x + Math.cos(a) * R * 1.25, y + Math.sin(a) * R * 0.3, 2, 2);
        }
      },
      starbirth: (x, y, R, t) => {
        const p = 0.5 + 0.5 * Math.sin(t * 2);
        glow(
          x,
          y,
          R * (1.1 + 0.2 * p),
          'rgba(255,230,160,.9)',
          'rgba(255,150,90,0)'
        );
        ctx.strokeStyle = 'rgba(255,230,170,.7)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
          const a = i * 0.785 + t * 0.3;
          ctx.beginPath();
          ctx.moveTo(x + Math.cos(a) * R * 0.3, y + Math.sin(a) * R * 0.3);
          ctx.lineTo(
            x + Math.cos(a) * R * (1 + 0.3 * p),
            y + Math.sin(a) * R * (1 + 0.3 * p)
          );
          ctx.stroke();
        }
        glow(x, y, R * 0.22, '#fff', 'rgba(255,255,255,0)');
        ring(x, y, R, t, 'rgba(255,200,140,A)');
      },
      galaxy: (x, y, R, t) => {
        glow(x, y, R * 0.6, 'rgba(255,230,170,.8)', 'rgba(255,200,120,0)');
        const c = Math.cos(0.4);
        const s = Math.sin(0.4);
        galaxyStars.forEach((p) => {
          const a = p.a + t * 0.08;
          const px = Math.cos(a) * p.r * R * 1.5;
          const py = Math.sin(a) * p.r * R * 0.7;
          ctx.fillStyle =
            p.r < 0.3
              ? 'rgba(255,230,180,.9)'
              : `rgba(190,170,255,${0.9 - p.r * 0.5})`;
          ctx.fillRect(x + px * c - py * s, y + px * s + py * c, p.s, p.s);
        });
      },
      messagestars: (x, y, R, t) => {
        CELESTIAL.constellation(x, y, R * 0.9, t + 2);
      },
    };

    // Render loop
    const animate = (timestamp) => {
      time = timestamp / 1000;
      const progress = scrollRef.current.progress;
      const velocity = scrollRef.current.velocity;

      // 1. Draw Nebula Background
      const sc = width / NW;
      const dh = NH * sc;
      const off = -progress * Math.max(0, dh - height);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(nebulaCanvas, 0, off, width, dh);

      // Vignette
      const v = ctx.createRadialGradient(
        width / 2,
        height / 2,
        height * 0.25,
        width / 2,
        height / 2,
        height * 0.85
      );
      v.addColorStop(0, 'rgba(0,0,0,.2)');
      v.addColorStop(1, 'rgba(0,0,0,.68)');
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, width, height);

      // Cosmic background glints
      [
        [0.9, 0.52, 9],
        [0.85, 0.9, 15],
        [0.1, 0.76, 8],
        [0.18, 0.2, 6],
      ].forEach((s, i) => {
        spark(
          width * s[0],
          height * s[1],
          s[2] * (0.7 + 0.3 * Math.sin(time * 1.5 + i * 2)),
          0.55 + 0.4 * Math.sin(time * 1.5 + i * 2)
        );
      });

      // 2. Stars with scroll velocity warp streak
      const sp = 0.0015 + Math.abs(velocity) * 0.0016;
      const ln = Math.abs(velocity) * 0.0022;

      stars.forEach((s) => {
        s.z -= sp;
        if (s.z <= 0.03) {
          s.z = 1;
          s.x = Math.random() * 2 - 1;
          s.y = Math.random() * 2 - 1;
        }
        if (s.z > 1.05) s.z = 0.05;

        const sx = width / 2 + (s.x / s.z) * width * 0.45;
        const sy = height / 2 + (s.y / s.z) * width * 0.45;
        if (sx < -20 || sx > width + 20 || sy < -20 || sy > height + 20) {
          s.z = 1;
          s.x = Math.random() * 2 - 1;
          s.y = Math.random() * 2 - 1;
          return;
        }

        const al = Math.min(1, (1.05 - s.z) * 1.1);
        ctx.strokeStyle = ctx.fillStyle = `rgba(236,233,255,${al})`;

        if (ln > 0.004) {
          const z2 = s.z + ln * (velocity > 0 ? 1 : -1);
          const x2 = width / 2 + (s.x / z2) * width * 0.45;
          const y2 = height / 2 + (s.y / z2) * width * 0.45;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        } else {
          ctx.fillRect(sx, sy, 1.6 * (1.2 - s.z), 1.6 * (1.2 - s.z));
        }
      });

      // 3. Active Celestial Object interpolation based on scrollProgress
      const milestones = [
        { key: 'earth', center: 0.02, span: 0.08 },
        { key: 'constellation', center: 0.12, span: 0.08 },
        { key: 'nebula', center: 0.22, span: 0.08 },
        { key: 'grb', center: 0.32, span: 0.08 },
        { key: 'blackhole', center: 0.42, span: 0.08 },
        { key: 'deadplanet', center: 0.52, span: 0.08 },
        { key: 'starbirth', center: 0.62, span: 0.08 },
        { key: 'galaxy', center: 0.72, span: 0.08 },
        { key: 'messagestars', center: 0.82, span: 0.08 },
      ];

      const R = Math.min(width, height) * 0.28;
      const cy = height * 0.38;

      milestones.forEach((m) => {
        const dist = Math.abs(progress - m.center);
        if (dist < m.span) {
          const alpha = Math.max(0, 1 - dist / m.span);
          ctx.globalAlpha = Math.pow(alpha, 1.2);
          const drawFn = CELESTIAL[m.key];
          if (drawFn) {
            drawFn(width / 2, cy, R, time);
          }
          ctx.globalAlpha = 1;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    // Click anywhere to burst purple starlight
    const handlePointerDown = (e) => {
      if (e.target.closest && e.target.closest('button, input, textarea, a, .dc'))
        return;
      burstSparkles(e.clientX, e.clientY, ['✦', '✨', '💜'], 5, 65);
    };

    window.addEventListener('pointerdown', handlePointerDown);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  return (
    <>
      <canvas id="cv" ref={canvasRef} aria-hidden="true" />
      <div className="tint" aria-hidden="true" />
    </>
  );
}
