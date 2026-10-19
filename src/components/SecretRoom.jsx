import React, { useState } from 'react';
import { Lightbulb, Mail, ChevronDown } from 'lucide-react';
import { MemoryWall } from './MemoryWall';
import { soundEffects } from '../utils/audioSynthesizer';

export function SecretRoom({ content, onScrollToConfession }) {
  const [isLit, setIsLit] = useState(false);

  const handleToggleSwitch = () => {
    soundEffects.lightSwitch();
    setIsLit((prev) => !prev);
  };

  return (
    <div className={`secret-room-container ${isLit ? 'room-lit' : 'room-dark'}`}>
      {/* Background Room Photo with fairy lights & rose carpet */}
      <div
        className="room-backdrop"
        style={{
          backgroundImage: `url('/images/room/secret_room.jpg')`,
        }}
        aria-hidden="true"
      />

      {/* Atmospheric dark shadow gradient */}
      <div className="room-shadow-overlay" aria-hidden="true" />

      {/* Discoverable Wall Switch */}
      <div className="wall-switch-wrapper">
        <div
          className="wall-switch"
          onClick={handleToggleSwitch}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleToggleSwitch();
          }}
          aria-label={isLit ? 'Turn off room lights' : 'Turn on room lights'}
        >
          <div className={`switch-toggle-rocker ${isLit ? 'on' : ''}`} />
        </div>

        <div className="switch-hint-label">
          <Lightbulb size={16} style={{ display: 'inline', marginRight: '6px' }} />
          {isLit ? 'The room is illuminated ✨' : content.switchPrompt}
        </div>
      </div>

      {/* When lights are ON: Memory Wall is revealed */}
      {isLit && (
        <>
          <MemoryWall memories={content.memories} />

          {/* Central Letter invitation to Chapter 7 */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              marginTop: '3.5rem',
              textAlign: 'center',
            }}
          >
            <button
              className="btn-primary-action"
              onClick={onScrollToConfession}
              style={{ padding: '1rem 2.2rem', fontSize: '1.1rem' }}
            >
              <Mail size={20} />
              <span>Read the Letter in the Room</span>
              <ChevronDown size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
