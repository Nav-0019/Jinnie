import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Flame, Sparkles, Wind, Plus, CheckCircle2 } from 'lucide-react';
import { soundEffects } from '../utils/audioSynthesizer';

const TOTAL_CANDLES = 18;

export function BirthdayCake({ content, girlNickname = 'Drama Queen' }) {
  const [candlesPlaced, setCandlesPlaced] = useState(0);
  const [isLit, setIsLit] = useState(false);
  const [isBlownOut, setIsBlownOut] = useState(false);

  // Add 1 candle
  const handleAddCandle = () => {
    if (candlesPlaced < TOTAL_CANDLES) {
      soundEffects.candleLight();
      setCandlesPlaced((prev) => prev + 1);
    }
  };

  // Quick place all 18 candles
  const handlePlaceAllCandles = () => {
    soundEffects.candleLight();
    setCandlesPlaced(TOTAL_CANDLES);
  };

  // Light up the candles
  const handleLightCandles = () => {
    soundEffects.candleLight();
    setIsLit(true);
    setIsBlownOut(false);
  };

  // Blow out candles
  const handleBlowOut = () => {
    soundEffects.candleBlow();
    setIsLit(false);
    setIsBlownOut(true);

    // Fire celebratory confetti bursts
    setTimeout(() => {
      soundEffects.celebration();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D8B778', '#9F243D', '#F4E7D7', '#F5DCA5'],
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#D8B778', '#9F243D', '#FAF4EC'],
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#D8B778', '#9F243D', '#FAF4EC'],
          });
        }, 250);
      } catch (err) {
        console.debug('Confetti error', err);
      }
    }, 400);
  };

  return (
    <div className="cake-stage">
      {/* Candles counter banner */}
      <div className="cake-counter-banner">
        <Sparkles size={20} color="#D8B778" />
        <span>Candles on the Cake:</span>
        <span className="candle-count-display">
          {candlesPlaced} / {TOTAL_CANDLES}
        </span>
      </div>

      <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-ivory-muted)' }}>
        {content.instructions}
      </p>

      {/* Visual Cake Structure */}
      <div
        className="cake-visual-wrapper"
        onClick={handleAddCandle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleAddCandle();
        }}
        aria-label="Birthday Cake: Click to place candles"
        style={{ cursor: candlesPlaced < TOTAL_CANDLES ? 'pointer' : 'default' }}
      >
        {/* Candles row on top tier */}
        <div className="candles-grid-layer">
          {Array.from({ length: TOTAL_CANDLES }).map((_, index) => {
            const hasCandle = index < candlesPlaced;
            return (
              <div
                key={index}
                className={hasCandle ? 'candle-item' : 'candle-slot-empty'}
                title={`Candle ${index + 1}`}
              >
                {hasCandle && (
                  <>
                    <div className="candle-wick" />
                    {isLit && <div className="candle-flame" />}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Top Cake Tier */}
        <div className="cake-tier cake-tier-top">
          <div className="cake-frosting-drip" />
          <div className="cake-ribbon" />
          <span
            style={{
              position: 'absolute',
              top: '32px',
              fontFamily: 'var(--font-serif)',
              fontSize: '1.4rem',
              fontWeight: 700,
              color: '#7A1930',
              letterSpacing: '0.1em',
            }}
          >
            18th
          </span>
        </div>

        {/* Bottom Cake Tier */}
        <div className="cake-tier cake-tier-bottom">
          <div className="cake-frosting-drip" />
          <div className="cake-ribbon" />
          <span
            style={{
              position: 'absolute',
              top: '38px',
              fontFamily: 'var(--font-serif)',
              fontSize: '1.2rem',
              fontWeight: 600,
              color: '#7A1930',
            }}
          >
            HAPPY BIRTHDAY
          </span>
        </div>

        {/* Elegant Gold Cake Stand */}
        <div className="cake-stand" />
      </div>

      {/* Interactive Controls */}
      <div className="cake-actions">
        {candlesPlaced < TOTAL_CANDLES && (
          <>
            <button className="btn-primary-action" onClick={handleAddCandle}>
              <Plus size={18} />
              <span>Add Candle ({candlesPlaced + 1}/18)</span>
            </button>
            <button className="btn-secondary-action" onClick={handlePlaceAllCandles}>
              <span>Place All 18 Candles</span>
            </button>
          </>
        )}

        {candlesPlaced === TOTAL_CANDLES && !isLit && !isBlownOut && (
          <button className="btn-primary-action" onClick={handleLightCandles}>
            <Flame size={18} color="#FFE072" />
            <span>Light the 18 Candles</span>
          </button>
        )}

        {isLit && (
          <div style={{ textAlign: 'center', width: '100%', marginTop: '1rem' }}>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '1.25rem',
                color: 'var(--accent-gold-bright)',
                marginBottom: '1rem',
              }}
            >
              {content.wishPrompt}
            </p>
            <button
              className="btn-primary-action"
              onClick={handleBlowOut}
              style={{ margin: '0 auto' }}
            >
              <Wind size={18} />
              <span>Blow Out the Candles</span>
            </button>
          </div>
        )}
      </div>

      {/* Celebration Message Box */}
      {isBlownOut && (
        <div className="celebration-box animate-glow">
          <CheckCircle2 size={36} color="#D8B778" style={{ margin: '0 auto 0.75rem' }} />
          <h3>Happy 18th Birthday, {girlNickname}!</h3>
          <p style={{ color: 'var(--text-ivory)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            {content.cakeQuote}
          </p>
        </div>
      )}
    </div>
  );
}
