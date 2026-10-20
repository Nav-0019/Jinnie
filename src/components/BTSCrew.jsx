import React, { useState, useEffect } from 'react';
import { pop, burstSparkles, rainEmojis } from '../utils/audioSynth';
import { BTS_MEMBERS } from '../utils/btsGifs';

// Peek-a-boo Member in corner of card
export function PeekMember({
  memberIndex = 0,
  position = 'r',
  hint = 'Psst… he built a whole universe for you 👀',
  onCollect,
  isCollected = false,
}) {
  const member = BTS_MEMBERS[memberIndex % BTS_MEMBERS.length];
  const [isWiggling, setIsWiggling] = useState(false);
  const [speech, setSpeech] = useState(hint);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setIsSpeaking(true);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  const handleClick = (e) => {
    e.stopPropagation();
    setIsWiggling(true);
    pop(650 + memberIndex * 60);

    const rect = e.currentTarget.getBoundingClientRect();
    burstSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2, ['💜', '✨'], 6, 70);

    const randomLine =
      member.lines[Math.floor(Math.random() * member.lines.length)];
    setSpeech(`<b>${member.name}</b> 💜<br>${randomLine}`);
    setIsSpeaking(true);

    if (onCollect) {
      onCollect(member.name);
    }

    setTimeout(() => setIsWiggling(false), 600);
  };

  return (
    <div
      className={`pk ${position} up ${isWiggling ? 'wig' : ''} ${
        isCollected ? 'got' : ''
      } ${isSpeaking ? 'say' : ''}`}
    >
      <div className="sb" dangerouslySetInnerHTML={{ __html: speech }} />
      <div className="pkc">
        <img
          className="cb gif"
          src={member.gif}
          alt={member.name}
          referrerPolicy="no-referrer"
          onClick={handleClick}
        />
      </div>
    </div>
  );
}

// Lineup Crowd of all 7 members
export function BTSCrowd({ onCollect, collected = [] }) {
  const [activeSpeech, setActiveSpeech] = useState(null);

  const handleMemberClick = useCallback((e, m) => {
    e.stopPropagation();
    pop(520 + m.id * 75);
    const rect = e.currentTarget.getBoundingClientRect();
    burstSparkles(rect.left + rect.width / 2, rect.top, ['💜', '✨'], 6, 60);

    const lineIdx = (Date.now() + m.id) % m.lines.length;
    const randomLine = m.lines[lineIdx];
    setActiveSpeech({
      name: m.name,
      text: randomLine,
      x: rect.left + rect.width / 2,
      y: rect.top - 20,
    });

    if (onCollect) {
      onCollect(m.name);
    }

    setTimeout(() => {
      setActiveSpeech((prev) => (prev?.name === m.name ? null : prev));
    }, 3600);
  }, [onCollect]);

  return (
    <>
      <div className="crowd" aria-label="ARMY BTS Crew">
        {BTS_MEMBERS.map((m, idx) => {
          const isGot = collected.includes(m.name);
          return (
            <div
              key={m.name}
              className={`ci ${isGot ? 'got' : ''}`}
              style={{ '--k': idx }}
              onClick={(e) => handleMemberClick(e, m)}
              title={`Tap ${m.name}`}
            >
              <img
                className="cb gif"
                src={m.gif}
                alt={m.name}
                referrerPolicy="no-referrer"
              />
            </div>
          );
        })}
      </div>

      {activeSpeech && (
        <div
          className="mn"
          style={{ left: `${activeSpeech.x}px`, top: `${activeSpeech.y}px` }}
        >
          <div className="sb">
            <b>{activeSpeech.name}</b> 💜<br />
            {activeSpeech.text}
          </div>
        </div>
      )}
    </>
  );
}

// Floating Purple Whale (Whale)
export function CosmicWhale({ onComplete }) {
  useEffect(() => {
    rainEmojis(['💜', '✨', '🐋', '💖'], 30);
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 6500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="whale" aria-hidden="true">
      <svg viewBox="0 0 300 130">
        <defs>
          <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d33cff" />
            <stop offset="1" stopColor="#7a2bd8" />
          </linearGradient>
        </defs>
        <path
          d="M8,74C40,22 170,12 244,52C262,40 282,30 298,34C290,52 286,62 292,80C270,74 262,74 244,68C170,108 60,118 8,74Z"
          fill="url(#wg)"
        />
        <path
          d="M30,76C90,64 170,66 236,66C170,98 70,104 30,76Z"
          fill="#f3d9ff"
          opacity=".8"
        />
        <path
          d="M120,78C132,100 150,118 168,122C170,104 158,88 150,76Z"
          fill="#e66bff"
        />
        <circle cx="52" cy="62" r="3" fill="#2a1a2e" />
      </svg>
    </div>
  );
}

// Runners on scroll
export function ScrollRunners({ isScrolling = false, direction = 1 }) {
  const [runners, setRunners] = useState([]);

  useEffect(() => {
    if (!isScrolling) return;

    const timer = setTimeout(() => {
      const id = Date.now();
      const count = 3 + Math.floor(Math.random() * 3);
      const startIdx = Math.floor(Math.random() * BTS_MEMBERS.length);
      const members = Array.from({ length: count }, (_, i) =>
        BTS_MEMBERS[(startIdx + i) % BTS_MEMBERS.length]
      );
      setRunners((prev) => [...prev, { id, members, direction }]);

      setTimeout(() => {
        setRunners((prev) => prev.filter((r) => r.id !== id));
      }, 3800);
    }, 0);

    return () => clearTimeout(timer);
  }, [isScrolling, direction]);

  return (
    <>
      {runners.map((r) => (
        <div
          key={r.id}
          className={`run ${r.direction > 0 ? '' : 'rev'}`}
          style={{
            animation: `${
              r.direction > 0 ? 'runRight' : 'runLeft'
            } 3.6s linear forwards`,
          }}
        >
          {r.members.map((m, i) => (
            <div
              key={i}
              className="rn"
              style={{ animationDelay: `${-i * 0.13}s` }}
            >
              <img
                className="cb gif"
                src={m.gif}
                alt={m.name}
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
