import React, { useMemo } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

export function PetalsOverlay({ count = 20 }) {
  const prefersReduced = useReducedMotion();

  const petals = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      // Deterministic pseudo-random offset
      const offset = ((i * 37 + 13) % 9) - 4;
      return {
        id: i,
        left: `${(i * 100) / count + offset}%`,
        animationDuration: `${8 + (i % 6) * 2}s`,
        animationDelay: `${(i * 0.6)}s`,
        width: `${12 + (i % 4) * 4}px`,
        height: `${16 + (i % 4) * 5}px`,
      };
    });
  }, [count]);

  if (prefersReduced) return null;

  return (
    <div className="petals-overlay" aria-hidden="true">
      {petals.map((p) => (
        <div
          key={p.id}
          className="petal"
          style={{
            left: p.left,
            width: p.width,
            height: p.height,
            animation: `floatPetal ${p.animationDuration} linear infinite`,
            animationDelay: p.animationDelay,
          }}
        />
      ))}
    </div>
  );
}
