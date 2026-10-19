import React, { useState } from 'react';
import { BookOpen, Heart } from 'lucide-react';
import { soundEffects } from '../utils/audioSynthesizer';

export function BookOpening({ content, onOpen }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenBook = () => {
    setIsOpen(true);
    soundEffects.pageFlip();
    setTimeout(() => {
      onOpen();
    }, 600);
  };

  return (
    <div className="book-hero">
      <div
        className={`storybook-cover ${isOpen ? 'animate-glow' : ''}`}
        onClick={handleOpenBook}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleOpenBook();
          }
        }}
        aria-label="Storybook cover: Click to open your story"
      >
        {/* Decorative gold corners */}
        <div className="book-corner-decor book-corner-tl" />
        <div className="book-corner-decor book-corner-tr" />
        <div className="book-corner-decor book-corner-bl" />
        <div className="book-corner-decor book-corner-br" />

        <div className="book-header-section">
          <div className="book-emblem">
            <Heart size={44} fill="#D8B778" color="#D8B778" />
          </div>
          <span className="section-tag">{content.tag}</span>
          <h1 className="book-main-title">{content.title}</h1>
          <p className="book-subtitle">{content.subtitle}</p>
        </div>

        <div className="book-center-content">
          <blockquote className="book-quote">
            {content.quote}
          </blockquote>
          <p className="book-subtitle" style={{ fontSize: '0.9rem', maxWidth: '320px', margin: '0 auto' }}>
            {content.introText}
          </p>
        </div>

        <div className="book-footer-section">
          <button
            className="btn-open-story"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenBook();
            }}
          >
            <BookOpen size={20} />
            <span>{content.buttonText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
