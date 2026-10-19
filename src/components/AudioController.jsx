import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { getAssetUrl } from '../utils/assetPath';

export function AudioController({ shouldPlay, startUnmuted = true }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(!startUnmuted);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (shouldPlay) {
      audio.volume = 0.75;
      audio.muted = !startUnmuted;

      audio.play()
        .then(() => {
          setIsPlaying(true);
          setIsMuted(!startUnmuted);
        })
        .catch((err) => {
          console.warn('Audio play request:', err);
        });
    }
  }, [shouldPlay, startUnmuted]);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isPlaying) {
      audio.volume = 0.75;
      audio.muted = false;
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
        })
        .catch((e) => console.warn(e));
      return;
    }

    if (isMuted) {
      audio.muted = false;
      setIsMuted(false);
    } else {
      audio.muted = true;
      setIsMuted(true);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={getAssetUrl("/assets/audio/background-music.mp3")}
        loop
        preload="auto"
      />
      <button
        className={`audio-control-btn ${isPlaying && !isMuted ? 'active-playing' : ''}`}
        onClick={toggleMute}
        title={isMuted ? 'Unmute Background Song' : 'Mute Background Song'}
        aria-label={isMuted ? 'Unmute Background Song' : 'Mute Background Song'}
      >
        {isMuted || !isPlaying ? (
          <VolumeX size={18} />
        ) : (
          <Volume2 size={18} className="audio-icon-pulse" />
        )}
        <span className="audio-label">
          {isMuted || !isPlaying ? 'Muted' : 'Bewakuf\'s Song Playing 🎵'}
        </span>
      </button>
    </>
  );
}
