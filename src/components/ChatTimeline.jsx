import React, { useState } from 'react';
import { AlertCircle, HeartHandshake, Sparkles } from 'lucide-react';
import { soundEffects } from '../utils/audioSynthesizer';

export function ChatTimeline({ content, girlNickname = 'Drama Queen', boyNickname = 'Persistent Boy' }) {
  const [activeShakeId, setActiveShakeId] = useState(null);

  const triggerClashShake = (id) => {
    soundEffects.click();
    setActiveShakeId(id);
    setTimeout(() => setActiveShakeId(null), 600);
  };

  const getBadgeClass = (type) => {
    if (type === 'clash') return 'badge-clash';
    if (type === 'peace') return 'badge-peace';
    return 'badge-warm';
  };

  const getBadgeIcon = (type) => {
    if (type === 'clash') return <AlertCircle size={14} />;
    if (type === 'peace') return <HeartHandshake size={14} />;
    return <Sparkles size={14} />;
  };

  return (
    <div className="timeline-track">
      <div className="timeline-line" aria-hidden="true" />

      {content.storyBeats.map((beat) => {
        const isShaking = activeShakeId === beat.id;

        return (
          <article
            key={beat.id}
            className={`timeline-beat-card ${isShaking ? 'animate-clash-shake' : ''}`}
            onClick={() => {
              if (beat.type === 'clash') triggerClashShake(beat.id);
            }}
          >
            <div className="beat-header">
              <span className={`beat-badge ${getBadgeClass(beat.type)}`}>
                {getBadgeIcon(beat.type)}
                <span>{beat.tag || beat.time}</span>
              </span>
              <span className="beat-time">{beat.time}</span>
            </div>

            <h3 className="beat-title">{beat.title}</h3>
            <p className="beat-summary">{beat.summary}</p>

            {beat.chatBubbles && (
              <div className="chat-container">
                {beat.chatBubbles.map((msg, index) => {
                  const isBoy = msg.sender === 'boy';
                  return (
                    <div
                      key={index}
                      className={`chat-bubble ${isBoy ? 'chat-boy' : 'chat-girl'}`}
                    >
                      <div className="chat-sender">
                        {isBoy ? boyNickname : girlNickname}
                      </div>
                      <div className="chat-text">{msg.text}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </article>
        );
      })}

      {/* Emotional Summary Card */}
      <div
        className="timeline-beat-card"
        style={{
          textAlign: 'center',
          borderColor: 'var(--accent-gold)',
          background: 'linear-gradient(135deg, rgba(70, 25, 41, 0.95), rgba(30, 7, 17, 0.95))',
          boxShadow: '0 0 25px var(--accent-gold-glow)',
        }}
      >
        <Sparkles size={28} color="#D8B778" style={{ margin: '0 auto 1rem' }} />
        <blockquote
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.25rem',
            fontStyle: 'italic',
            color: 'var(--accent-gold-bright)',
            lineHeight: 1.6,
          }}
        >
          {content.emotionalLine}
        </blockquote>
      </div>
    </div>
  );
}
