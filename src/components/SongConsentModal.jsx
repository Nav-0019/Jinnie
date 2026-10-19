import React from 'react';
import { Music, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { soundEffects } from '../utils/audioSynthesizer';

export function SongConsentModal({
  isOpen,
  girlNickname = "Jinnie",
  boyNickname = "Bewakuf",
  onAgreeAndPlay,
  onDeclineSilence,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="song-consent-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="song-modal-title"
    >
      <div className="song-consent-card animate-glow">
        <div className="song-modal-icon-wrap">
          <div className="song-icon-circle">
            <Music size={28} className="text-purple" />
          </div>
          <Sparkles size={18} color="#D8B778" className="song-sparkle-decor" />
        </div>

        <span className="cosmic-tag text-purple">Special 18th Birthday Surprise</span>

        <h3 id="song-modal-title" className="song-modal-title">
          A Song Made for {girlNickname} 🎵
        </h3>

        <div className="song-modal-body">
          <p>
            Hey <strong>{girlNickname}</strong>, <strong>{boyNickname}</strong> put in genuine effort to write and record his own song just for you, hoping to impress you on your 18th birthday.
          </p>
          <p>
            Would you like to hear it playing in the background as you travel through our universe?
          </p>
        </div>

        <div className="song-modal-actions">
          <button
            className="btn-agree-song"
            onClick={() => {
              soundEffects.click();
              onAgreeAndPlay();
            }}
          >
            <Volume2 size={18} />
            <span>Yes, Play Your Song 💜</span>
          </button>

          <button
            className="btn-silent-option"
            onClick={() => {
              soundEffects.click();
              onDeclineSilence();
            }}
          >
            <VolumeX size={16} />
            <span>Continue in Silence</span>
          </button>
        </div>

        <p className="song-modal-footnote">
          You can mute or unmute the soundtrack anytime using the button in the top corner.
        </p>
      </div>
    </div>
  );
}
