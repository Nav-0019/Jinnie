import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Settings, Sparkles } from 'lucide-react';
import { toggleAmbientSound, soundEffects } from '../utils/audioSynthesizer';

const CHAPTERS = [
  { id: 'chapter-1', label: '01: The Beginning' },
  { id: 'chapter-2', label: '02: Our Story' },
  { id: 'chapter-3', label: '03: 18th Birthday' },
  { id: 'chapter-4', label: '04: Cake Slices' },
  { id: 'chapter-5', label: '05: The Gift' },
  { id: 'chapter-6', label: '06: Secret Room' },
  { id: 'chapter-7', label: '07: Confession' },
  { id: 'chapter-8', label: '08: Her Chapter' },
];

export function StoryProgress({ activeChapter, onOpenSettings }) {

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleAudio = () => {
    soundEffects.click();
    const playing = toggleAmbientSound(!isAudioPlaying);
    setIsAudioPlaying(playing);
  };

  const scrollToChapter = (chapterId) => {
    soundEffects.click();
    const elem = document.getElementById(chapterId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="story-header-nav" role="banner">
        <div className="nav-brand">
          <Sparkles size={18} color="#D8B778" />
          <span>A Little World Made for You</span>
        </div>

        <div className="nav-controls">
          <button
            className="nav-icon-btn"
            onClick={handleToggleAudio}
            title={isAudioPlaying ? 'Mute Music Box' : 'Play Music Box'}
            aria-label={isAudioPlaying ? 'Mute Music Box' : 'Play Music Box'}
          >
            {isAudioPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          <button
            className="nav-icon-btn"
            onClick={() => {
              soundEffects.click();
              onOpenSettings();
            }}
            title="Personalize Details"
            aria-label="Personalize Names and Info"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      <div className="progress-bar-container" aria-hidden="true">
        <div
          className="progress-bar-fill"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <nav className="chapter-dots-nav" aria-label="Chapter quick navigation">
        {CHAPTERS.map((ch) => {
          const isActive = activeChapter === ch.id;
          return (
            <button
              key={ch.id}
              className={`chapter-dot ${isActive ? 'active' : ''}`}
              onClick={() => scrollToChapter(ch.id)}
              aria-label={`Jump to ${ch.label}`}
            >
              <span className="dot-tooltip">{ch.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
