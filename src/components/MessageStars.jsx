import React, { useState } from 'react';
import { pop, burstSparkles } from '../utils/audioSynth';
import { BTS_MEMBERS } from '../utils/btsGifs';

const MESSAGES = [
  'You’re unapologetically, gloriously yourself.',
  'Your dramatic reactions are my favourite show.',
  'Every late-night message felt like starlight.',
  'I’m sorry for the words that hurt. I’m so glad you came back.',
  'Five months in, and I still smile at your name. 💜',
];

const STAR_POSITIONS = [
  { left: '10%', top: '22%' },
  { left: '62%', top: '12%' },
  { left: '28%', top: '58%' },
  { left: '74%', top: '52%' },
  { left: '48%', top: '30%' },
];

const CHIBI_QUOTES = [
  'Told you 🤭',
  'Ooh, she tapped it!',
  'Read it out loud! 📣',
  'Aww… 🥹',
  'Don’t cry 😭💜',
];

export function MessageStars() {
  const [activeMessage, setActiveMessage] = useState('Tap a star… ✦');
  const [tappedStars, setTappedStars] = useState(new Set());
  const [miniPopup, setMiniPopup] = useState(null);

  const handleStarClick = (e, index) => {
    e.stopPropagation();
    setActiveMessage(MESSAGES[index]);
    pop(520 + index * 90);

    const rect = e.currentTarget.getBoundingClientRect();
    burstSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2, ['✨', '💜'], 6, 70);

    setTappedStars((prev) => new Set([...prev, index]));

    const member = BTS_MEMBERS[index % BTS_MEMBERS.length];
    setMiniPopup({
      x: rect.left + rect.width / 2,
      y: rect.top - 12,
      quote: CHIBI_QUOTES[index % CHIBI_QUOTES.length],
      member,
    });

    setTimeout(() => {
      setMiniPopup((prev) => (prev?.quote === CHIBI_QUOTES[index % CHIBI_QUOTES.length] ? null : prev));
    }, 2400);
  };

  return (
    <div className="message-stars-card">
      <h2 className="cosmic-heading">Message stars</h2>
      <p className="cosmic-body">Five stars carry secret messages for you. Tap them. ✦</p>

      <div id="arena">
        {STAR_POSITIONS.map((pos, idx) => {
          const isTapped = tappedStars.has(idx);
          return (
            <button
              key={idx}
              className="ms"
              style={{
                left: pos.left,
                top: pos.top,
                animationDelay: `${idx * 0.4}s`,
              }}
              onClick={(e) => handleStarClick(e, idx)}
              aria-label={`Message star ${idx + 1}`}
            >
              {isTapped ? '💫' : '⭐'}
            </button>
          );
        })}
      </div>

      <div className="msg" id="sm">
        {activeMessage}
      </div>

      {miniPopup && (
        <div
          className="mn"
          style={{ left: `${miniPopup.x}px`, top: `${miniPopup.y}px` }}
        >
          <img
            className="cb gif"
            src={miniPopup.member.gif}
            alt={miniPopup.member.name}
            referrerPolicy="no-referrer"
          />
          <div className="sb">
            <b>{miniPopup.member.name}</b> 💜<br />
            {miniPopup.quote}
          </div>
        </div>
      )}
    </div>
  );
}
