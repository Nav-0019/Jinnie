import React, { useState } from 'react';
import { pop, burstSparkles } from '../utils/audioSynth';

export function GiftSection({ isOpened = false, onOpen }) {
  const [opened, setOpened] = useState(isOpened);

  const handleOpen = (e) => {
    if (opened) return;
    setOpened(true);
    pop(920);

    const rect = e.currentTarget.getBoundingClientRect();
    burstSparkles(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      ['✨', '💜', '🎀', '🎁'],
      14,
      120
    );

    if (onOpen) {
      onOpen();
    }
  };

  return (
    <div className="gift-card-content">
      <div
        className={`big-gift-icon ${opened ? 'opened' : ''}`}
        onClick={handleOpen}
        title="Tap to open the gift!"
      >
        {opened ? '✨' : '🎁'}
      </div>

      <h2 className="cosmic-heading">A surprise in the stars</h2>
      <p className="cosmic-body">
        {opened
          ? 'The portal is open! Scroll to see what I built for you 💜'
          : 'One last thing is waiting for you in the quiet of space.'}
      </p>

      {!opened ? (
        <button className="btn-open-gift" onClick={handleOpen}>
          Open the gift 🎁
        </button>
      ) : (
        <div className="gift-opened-badge">
          <span>Gift opened ✨ Scroll down to continue ↓</span>
        </div>
      )}
    </div>
  );
}
