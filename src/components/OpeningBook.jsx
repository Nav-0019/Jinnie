import React, { useState } from 'react';
import { storyContent } from '../content/storyContent';
import { BookOpen, Sparkles, ChevronDown } from 'lucide-react';

export default function OpeningBook({ onOpen }) {
  const [isOpen, setIsOpen] = useState(false);
  const { opening } = storyContent;

  const handleOpen = () => {
    setIsOpen(true);
    if (onOpen) onOpen();
  };

  const handleContinue = () => {
    const nextSec = document.getElementById('beginning');
    if (nextSec) {
      nextSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="opening" className="opening-section" aria-label="Prologue">
      <div className="opening-content">
        <header className="opening-header">
          <div className="kicker-tag">
            <Sparkles size={14} className="sparkle-icon" />
            <span>{opening.kicker}</span>
            <Sparkles size={14} className="sparkle-icon" />
          </div>
          <p className="opening-quote">“{opening.tagline}”</p>
        </header>

        {/* 3D Storybook Element */}
        <div className={`storybook-container ${isOpen ? 'book-is-open' : ''}`}>
          <div className="storybook">
            {/* Front Cover (when closed) */}
            <div className="book-cover" onClick={handleOpen} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleOpen()} aria-label="Book Cover: Click to open">
              <div className="cover-border">
                <div className="corner-ornament top-left">❦</div>
                <div className="corner-ornament top-right">❦</div>
                <div className="corner-ornament bottom-left">❦</div>
                <div className="corner-ornament bottom-right">❦</div>

                <div className="cover-emboss">
                  <span className="cover-date">18th Birthday Edition</span>
                  <h1 className="cover-title">{opening.bookTitle}</h1>
                  <div className="gold-divider">
                    <span className="gold-gem">✦</span>
                  </div>
                  <p className="cover-hint">Dedicated to you</p>
                </div>

                <div className="ribbon-bookmark" />
              </div>
            </div>

            {/* Inside Left Page */}
            <div className="book-page page-left">
              <div className="page-inner">
                <span className="page-watermark">18</span>
                <span className="page-label">Prologue · Dedication</span>
                <div className="page-ornament">✻ ✻ ✻</div>
                <h2 className="inside-title">{opening.subtitle}</h2>
                <p className="inside-text">
                  {opening.subtext}
                </p>
                <div className="inside-note">
                  “Some people enter our lives quietly, and others arrive with pure dramatic flair.”
                </div>
              </div>
            </div>

            {/* Inside Right Page */}
            <div className="book-page page-right">
              <div className="page-inner">
                <span className="page-number">Page 1</span>
                <div className="inside-scroll-invite">
                  <p className="invite-lead">A six-month journey of arguments, apologies, laughter, and something quiet turning into something real.</p>
                  
                  <button 
                    onClick={handleContinue}
                    className="btn-story-primary btn-turn-page"
                    id="open-story-btn"
                  >
                    <span>Turn the page</span>
                    <ChevronDown size={18} />
                  </button>
                  <p className="small-hint">{opening.scrollHint}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trigger Button if not yet opened */}
        {!isOpen && (
          <div className="open-action-bar">
            <button 
              onClick={handleOpen}
              className="btn-story-primary pulse-action"
              aria-expanded={isOpen}
            >
              <BookOpen size={18} />
              <span>{opening.cta}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
