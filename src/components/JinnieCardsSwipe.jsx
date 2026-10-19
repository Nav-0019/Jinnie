import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart, Sparkles, ZoomIn } from 'lucide-react';
import { soundEffects } from '../utils/audioSynthesizer';
import { getAssetUrl } from '../utils/assetPath';

const JINNIE_CARDS = [
  {
    id: 1,
    image: getAssetUrl("/assets/images/photo1.jpg"),
    tag: "Your Beautiful Soul",
    title: "The Purest Heart in My Universe",
    compliment: "Beyond anything words or pictures can capture, it is the sheer purity of your soul that leaves me in awe. In a world full of pretend, you are unapologetically, genuinely yourself. You have this quiet, radiant kindness you don't even brag about, and that is the rarest kind of beauty to me. Your soul is a soft light in a loud world."
  },
  {
    id: 2,
    image: getAssetUrl("/assets/images/photo2.jpg"),
    tag: "Your Cute Little Anger",
    title: "The Most Adorable Fire",
    compliment: "Even your small anger is the most endearing thing in this universe to me. When you get mad, when you cross your arms and say 'I'm dramatic?! Fine, bye!' — you try so hard to look dangerous and intimidating, but honestly you just look breathtakingly cute to me. Your little dramatic sighs and pouts make my heart melt every single time. I wouldn't trade that fire for anything."
  },
  {
    id: 3,
    image: getAssetUrl("/assets/images/photo3.jpg"),
    tag: "Your Electric Energy",
    title: "Infectious Vibe & Laughter",
    compliment: "Your energy lights up everything around me, even across a cold phone screen hundreds of miles away. When you're excited about something, your whole vibe shifts, and it is impossible for me not to smile. You bring vibrant color into days that used to feel monochrome. Talking to you is the easiest, sweetest part of my day."
  },
  {
    id: 4,
    image: getAssetUrl("/assets/images/photo4.jpg"),
    tag: "Your Nonchalant Charm",
    title: "The Cool Mystery with a Caring Heart",
    compliment: "My undisputed nonchalant queen. The way you pretend to act so cool, mysterious, and 'whatever,' but your eyes and your little caring check-ins give away how deeply you actually feel. You act unbothered, yet you remember the smallest things I told you weeks ago. That balance of effortless composure and secret tenderness completely captivates me."
  },
  {
    id: 5,
    image: getAssetUrl("/assets/images/photo5.jpg"),
    tag: "Your Radiant Smile",
    title: "A Smile That Heals Every Storm",
    compliment: "Your smile has this unbelievable superpower to wash away any bad day of mine in five seconds flat. When you genuinely laugh at my silly jokes at 2 AM and cover your face, my whole universe suddenly feels right where it belongs. Never let anyone dim that glow, Jinnie, because it's the brightest light in my sky."
  },
  {
    id: 6,
    image: getAssetUrl("/assets/images/photo6.jpg"),
    tag: "Turning Eighteen",
    title: "The Brightest Star in My Sky",
    compliment: "Eighteen years ago, this universe was blessed with someone truly extraordinary. Out of 8 billion people, our paths crossed, collided, parted, and found their way back to each other. You are stunning in every single way, Jinnie — your soul, your mind, your fiery spirit, and that golden heart of yours. Happy 18th Birthday, from your Bewakuf, to my favorite person in the world."
  }
];

export function JinnieCardsSwipe({ onSelectPhoto }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const currentCard = JINNIE_CARDS[currentIndex];

  const handleNext = () => {
    soundEffects.click();
    setCurrentIndex((prev) => (prev + 1) % JINNIE_CARDS.length);
  };

  const handlePrev = () => {
    soundEffects.click();
    setCurrentIndex((prev) => (prev - 1 + JINNIE_CARDS.length) % JINNIE_CARDS.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        handleNext(); // swipe left -> next
      } else {
        handlePrev(); // swipe right -> prev
      }
    }
  };

  return (
    <div className="jinnie-swipe-showcase">
      <div className="swipe-header">
        <Sparkles size={18} color="#D8B778" />
        <span className="swipe-header-title">What I Adore About Your Soul & Energy</span>
        <span className="swipe-counter">
          {currentIndex + 1} / {JINNIE_CARDS.length}
        </span>
      </div>

      {/* Swipeable Main Card */}
      <div
        className="jinnie-card-stage"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="jinnie-portrait-card">
          <div className="card-photo-wrapper">
            <img
              src={currentCard.image}
              alt={currentCard.title}
              className="portrait-img"
              loading="eager"
            />
            <button
              className="btn-enlarge-photo"
              onClick={() => onSelectPhoto && onSelectPhoto(currentCard)}
              title="View Full Size"
            >
              <ZoomIn size={16} />
            </button>
            <div className="card-tag-pill">
              <Heart size={14} color="#BA68C8" fill="#BA68C8" />
              <span>{currentCard.tag}</span>
            </div>
          </div>

          <div className="card-compliment-content">
            <h4 className="card-title">{currentCard.title}</h4>
            <p className="card-text">{currentCard.compliment}</p>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          className="btn-nav-arrow arrow-left"
          onClick={handlePrev}
          aria-label="Previous compliment"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          className="btn-nav-arrow arrow-right"
          onClick={handleNext}
          aria-label="Next compliment"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Swipe Indicator Dots */}
      <div className="swipe-dots-row">
        {JINNIE_CARDS.map((card, idx) => (
          <button
            key={card.id}
            className={`swipe-dot ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => {
              soundEffects.click();
              setCurrentIndex(idx);
            }}
            aria-label={`Go to card ${idx + 1}`}
          />
        ))}
      </div>

      <p className="swipe-hint">
        👈 Swipe left or right to read what I love most about you 👉
      </p>
    </div>
  );
}
