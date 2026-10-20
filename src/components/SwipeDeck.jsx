import React, { useState, useEffect, useRef, useCallback } from 'react';
import { pop, burstSparkles, rainEmojis } from '../utils/audioSynth';
import { BTS_GIFS } from '../utils/btsGifs';

const COMPLIMENT_CARDS = [
  {
    icon: '🌸',
    title: 'Your beautiful soul',
    desc: 'Pure, honest, gloriously unapologetic.',
  },
  {
    icon: '😭',
    title: 'Your dramatic reactions',
    desc: 'My favourite show, every single day.',
  },
  {
    icon: '⚡',
    title: 'Your energy',
    desc: 'It fills my ordinary days with light.',
  },
  {
    icon: '🪞',
    title: 'Your honesty',
    desc: 'Even when it’s blunt. Especially then.',
  },
  {
    icon: '🌙',
    title: 'Our late nights',
    desc: 'The best talks happen after midnight.',
  },
  {
    icon: '💜',
    title: 'You',
    desc: 'Exactly as you are.',
  },
];

export function SwipeDeck({ isUnlocked = false, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(isUnlocked ? COMPLIMENT_CARDS.length : 0);
  const [isReadyToSwipe, setIsReadyToSwipe] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const startXRef = useRef(0);
  const readyTimerRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

  // Arm timer for each card after mount or index change
  useEffect(() => {
    if (currentIndex >= COMPLIMENT_CARDS.length) return;

    if (readyTimerRef.current) clearTimeout(readyTimerRef.current);

    readyTimerRef.current = setTimeout(() => {
      setIsReadyToSwipe(true);
      pop(880);
    }, 1800);

    return () => clearTimeout(readyTimerRef.current);
  }, [currentIndex]);

  const handleSwipe = (direction) => {
    if (!isReadyToSwipe && currentIndex < COMPLIMENT_CARDS.length) {
      showToast('Take a moment to read it first 💜');
      return;
    }

    pop(direction > 0 ? 820 : 560);
    burstSparkles(
      window.innerWidth / 2 + direction * 60,
      window.innerHeight * 0.45,
      [direction > 0 ? '💜' : '🌙', '✨'],
      6,
      80
    );

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setIsReadyToSwipe(false);
    setDragOffset(0);

    if (nextIndex >= COMPLIMENT_CARDS.length) {
      showToast('Letter unlocked 💌');
      rainEmojis(['💜', '💌', '✨'], 35);
      if (onComplete) {
        onComplete();
      }
    }
  };

  // Pointer drag handling
  const handlePointerDown = (e) => {
    if (currentIndex >= COMPLIMENT_CARDS.length) return;
    startXRef.current = e.clientX;
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const diff = e.clientX - startXRef.current;
    setDragOffset(diff);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(dragOffset) > 80) {
      handleSwipe(dragOffset > 0 ? 1 : -1);
    } else {
      setDragOffset(0);
    }
  };

  const isFinished = currentIndex >= COMPLIMENT_CARDS.length;

  return (
    <div className="swipe-deck-section">
      <h2 className="deck-heading">What I adore about your soul</h2>

      {!isFinished ? (
        <>
          <div
            className="deck"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {COMPLIMENT_CARDS.map((card, idx) => {
              const diff = idx - currentIndex;
              if (diff < 0) return null;
              if (diff > 2) return null;

              const isTop = diff === 0;
              const transform = isTop
                ? `translateX(${dragOffset}px) rotate(${dragOffset / 16}deg)`
                : `scale(${1 - diff * 0.06}) translateY(${diff * 14}px)`;

              return (
                <div
                  key={idx}
                  className={`dc ${isTop ? 'top' : ''} ${
                    isTop && isReadyToSwipe ? 'ready' : ''
                  }`}
                  style={{
                    zIndex: 20 - idx,
                    transform,
                    transition: isDragging && isTop ? 'none' : 'transform .35s, opacity .35s',
                  }}
                >
                  <span className="rb" />
                  <span
                    className="st y"
                    style={{ opacity: isTop ? Math.max(0, dragOffset / 75) : 0 }}
                  >
                    LOVE 💜
                  </span>
                  <span
                    className="st n"
                    style={{ opacity: isTop ? Math.max(0, -dragOffset / 75) : 0 }}
                  >
                    KEEP 🌙
                  </span>

                  <i>{card.icon}</i>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </div>
              );
            })}
          </div>

          <div className={`dbtn ${!isReadyToSwipe ? 'wait' : ''}`}>
            <button
              onClick={() => handleSwipe(-1)}
              aria-label="Keep for later"
              title="Keep for later 🌙"
            >
              🌙
            </button>
            <button
              onClick={() => handleSwipe(1)}
              aria-label="Love it"
              title="Love it 💜"
            >
              💜
            </button>
          </div>

          <div className="cnt">
            {currentIndex + 1} / {COMPLIMENT_CARDS.length} · read each card, then swipe 💌
          </div>
        </>
      ) : (
        <div className="deck-finished-view">
          <img
            src={BTS_GIFS.celebration2}
            alt="BTS Celebration"
            className="celebration-sticker"
            referrerPolicy="no-referrer"
          />
          <p className="finished-title">All read 💜 Your letter is unlocking…</p>
          <p className="finished-sub">Scroll down to read what I wrote for you 💌</p>
        </div>
      )}

      {toastMessage && <div className="toast">{toastMessage}</div>}
    </div>
  );
}
