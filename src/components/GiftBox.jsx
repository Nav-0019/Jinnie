import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { soundEffects } from '../utils/audioSynthesizer';

export function GiftBox({ content, onGiftOpen }) {
  const [isOpen, setIsOpen] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (isOpen) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotate({ x: -y * 0.08, y: x * 0.08 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  const handleOpenGift = () => {
    if (isOpen) return;
    setIsOpen(true);
    soundEffects.giftOpen();

    setTimeout(() => {
      onGiftOpen();
    }, 1100);
  };

  return (
    <div
      className="gift-scene"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`gift-box-3d ${isOpen ? 'opened' : 'animate-float'}`}
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        }}
        onClick={handleOpenGift}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleOpenGift();
        }}
        aria-label="Floating Gift Box: Click to open"
      >
        {/* Box Lid with Bow */}
        <div className="gift-lid">
          <div className="gift-bow">🎀</div>
        </div>

        {/* Box Body with Ribbons */}
        <div className="gift-box-body">
          <div className="gift-ribbon-vertical" />
          <div className="gift-ribbon-horizontal" />
        </div>

        {/* Light burst effect upon opening */}
        {isOpen && <div className="gift-light-burst" />}
      </div>

      <p
        style={{
          marginTop: '2.5rem',
          fontFamily: 'var(--font-serif)',
          fontSize: '1.2rem',
          color: 'var(--accent-gold-bright)',
          textAlign: 'center',
          maxWidth: '450px',
        }}
      >
        {isOpen ? 'Opening your surprise...' : content.hint}
      </p>

      {isOpen && (
        <div style={{ marginTop: '1rem', color: 'var(--accent-gold)', animation: 'floatGentle 2s infinite' }}>
          <ChevronDown size={28} />
        </div>
      )}
    </div>
  );
}
