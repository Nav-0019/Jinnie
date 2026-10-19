import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Wind,
  Mic,
  MicOff,
  Lightbulb,
  Gift,
  RotateCcw,
  MessageSquare,
  Copy,
  Check,
  X,
  Lock,
  Unlock,
  ArrowDown
} from 'lucide-react';
import { JinnieCardsSwipe } from './JinnieCardsSwipe';
import { startBlowDetection, stopBlowDetection } from '../utils/microphoneDetector';
import { createWhatsAppShareUrl, copyToClipboard } from '../utils/shareMessage';
import { soundEffects } from '../utils/audioSynthesizer';

export function StoryOverlays({
  milestones,
  currentProgress,
  onStartJourney,
  universeRef,
  photos: _photos,
  girlNickname,
  boyNickname,
  recipientPhone,
  candlesBlown = false,
  onCandlesBlown,
  showCakeLockedNotice = false,
  onReplay,
  onScrollToProgress,
}) {
  // Cake microphone state
  const [isMicListening, setIsMicListening] = useState(false);

  // Gift state
  const [isGiftOpened, setIsGiftOpened] = useState(false);

  // Room & Switch state
  const [isRoomLit, setIsRoomLit] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Confession state
  const [confessionResponse, setConfessionResponse] = useState(null);
  const [userCustomNote, setUserCustomNote] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Blow out candles handler
  const handleBlowOutCandles = () => {
    if (candlesBlown) return;
    soundEffects.candleBlow();
    if (onCandlesBlown) {
      onCandlesBlown();
    }
    setIsMicListening(false);
    stopBlowDetection();

    if (universeRef.current) {
      universeRef.current.extinguishCandles();
    }

    // Confetti burst
    setTimeout(() => {
      soundEffects.celebration();
      try {
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#D8B778', '#9C27B0', '#FAF4EC', '#C5B4E3'],
        });
      } catch (e) {
        console.debug(e);
      }
    }, 300);
  };

  // Opt-in microphone listening for candle blowing
  const handleToggleMic = async () => {
    if (isMicListening) {
      stopBlowDetection();
      setIsMicListening(false);
      return;
    }

    const res = await startBlowDetection(() => {
      handleBlowOutCandles();
    });

    if (res.success) {
      setIsMicListening(true);
    } else {
      alert('Microphone access was denied or is unavailable. You can blow out the candles with the button!');
    }
  };

  // Open gift box
  const handleOpenGift = () => {
    if (isGiftOpened) return;
    setIsGiftOpened(true);
    soundEffects.giftOpen();
    if (universeRef.current) {
      universeRef.current.openGiftBox();
    }
    setTimeout(() => {
      onScrollToProgress(0.92); // Scroll smoothly into the room
    }, 700);
  };

  // Toggle room light switch
  const handleToggleSwitch = () => {
    const nextState = !isRoomLit;
    soundEffects.lightSwitch();
    setIsRoomLit(nextState);
    if (universeRef.current) {
      universeRef.current.setRoomLighting(nextState);
    }
  };

  // Confession response
  const handleSelectChoice = (choice) => {
    soundEffects.click();
    setConfessionResponse(choice);

    if (choice.id === 'same') {
      soundEffects.celebration();
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#9C27B0', '#BA68C8', '#D8B778', '#FFFFFF'],
        });
      } catch (e) {
        console.debug(e);
      }
    }
  };

  // Share response via WhatsApp
  const handleShareResponse = () => {
    soundEffects.click();
    const text = `🌹 A Universe Made for You — Response from ${girlNickname}
💜 My Answer: "${confessionResponse ? confessionResponse.label : 'Thoughtful silence'}"
${userCustomNote ? `📝 Message for you, ${boyNickname}: "${userCustomNote}"\n` : ''}
Sent to my Bewakuf from our celestial universe ✨`;

    const url = createWhatsAppShareUrl(text, recipientPhone);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyNote = async () => {
    soundEffects.click();
    const text = `🌹 Response from ${girlNickname} to you (${boyNickname}):
My Answer: "${confessionResponse ? confessionResponse.label : 'Shared'}"
${userCustomNote ? `Note: "${userCustomNote}"` : ''}`;
    const res = await copyToClipboard(text);
    if (res.success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  return (
    <div className="narrative-overlay-layer">
      {/* MILESTONE 1: Opening Proem */}
      <section
        className={`overlay-card milestone-hero ${currentProgress < 0.08 ? 'visible' : 'faded'}`}
      >
        <span className="cosmic-tag">{milestones[0].tag}</span>
        <h1 className="cosmic-title">{milestones[0].title}</h1>
        <p className="cosmic-quote">{milestones[0].subtitle}</p>
        <p className="cosmic-caption">{milestones[0].caption}</p>

        <button className="btn-begin-journey" onClick={onStartJourney}>
          <Sparkles size={18} />
          <span>{milestones[0].buttonText}</span>
        </button>
      </section>

      {/* MILESTONE 2: Across 6 Months of Distance */}
      <section
        className={`overlay-card ${currentProgress >= 0.08 && currentProgress < 0.20 ? 'visible' : 'faded'}`}
      >
        <span className="cosmic-tag">{milestones[1].tag}</span>
        <h2 className="cosmic-heading">{milestones[1].title}</h2>
        {milestones[1].body.map((p, i) => (
          <p key={i} className="cosmic-body">{p}</p>
        ))}
        <div className="easter-egg-badge">
          <span>{milestones[1].easterEggHint}</span>
        </div>
      </section>

      {/* MILESTONE 3: The First Clash */}
      <section
        className={`overlay-card ${currentProgress >= 0.20 && currentProgress < 0.34 ? 'visible' : 'faded'}`}
      >
        <span className="cosmic-tag text-purple">{milestones[2].tag}</span>
        <h2 className="cosmic-heading">{milestones[2].title}</h2>
        {milestones[2].body.map((p, i) => (
          <p key={i} className="cosmic-body">{p}</p>
        ))}
      </section>

      {/* MILESTONE 4: When Words Went Too Far (Distance & Block) */}
      <section
        className={`overlay-card ${currentProgress >= 0.34 && currentProgress < 0.46 ? 'visible' : 'faded'}`}
      >
        <span className="cosmic-tag">{milestones[3].tag}</span>
        <h2 className="cosmic-heading">{milestones[3].title}</h2>
        {milestones[3].body.map((p, i) => (
          <p key={i} className="cosmic-body">{p}</p>
        ))}
      </section>

      {/* MILESTONE 5: The Return (Reconnecting & Magic Shop Doorway) */}
      <section
        className={`overlay-card ${currentProgress >= 0.46 && currentProgress < 0.58 ? 'visible' : 'faded'}`}
      >
        <span className="cosmic-tag text-purple">{milestones[4].tag}</span>
        <h2 className="cosmic-heading">{milestones[4].title}</h2>
        {milestones[4].body.map((p, i) => (
          <p key={i} className="cosmic-body">{p}</p>
        ))}
        <div className="easter-egg-badge">
          <span>{milestones[4].easterEggDoorway}</span>
        </div>
      </section>

      {/* MILESTONE 6: Five Months of Talking */}
      <section
        className={`overlay-card ${currentProgress >= 0.58 && currentProgress < 0.70 ? 'visible' : 'faded'}`}
      >
        <span className="cosmic-tag">{milestones[5].tag}</span>
        <h2 className="cosmic-heading">{milestones[5].title}</h2>
        {milestones[5].body.map((p, i) => (
          <p key={i} className="cosmic-body">{p}</p>
        ))}
      </section>

      {/* MILESTONE 7: 18th Birthday Cake & 18 Candles */}
      <section
        className={`overlay-card interactive-cake-card ${currentProgress >= 0.68 && currentProgress < 0.82 ? 'visible' : 'faded'}`}
      >
        <span className="cosmic-tag text-gold">{milestones[6].tag}</span>
        <h2 className="cosmic-heading">{milestones[6].title}</h2>

        {/* Lock / Unlocked Status Badge */}
        {!candlesBlown ? (
          <div className={`cake-lock-badge ${showCakeLockedNotice ? 'cake-lock-shake' : ''}`}>
            <Lock size={15} />
            <span>
              {showCakeLockedNotice
                ? '🔒 Make your 18th wish first! Blow out all 18 candles to continue scrolling'
                : '🔒 Locked: Blow out all 18 candles with a full breath to unlock scrolling'}
            </span>
          </div>
        ) : (
          <div className="cake-unlocked-badge">
            <Unlock size={15} />
            <span>🔓 Wish Released to the Stars · Scroll Unlocked!</span>
          </div>
        )}

        <div className="interactive-cake-actions">
          {!candlesBlown ? (
            <>
              <button
                className="btn-cosmic-primary btn-blow-full"
                onClick={handleBlowOutCandles}
              >
                <Wind size={20} />
                <span>Blow Out All 18 Candles</span>
              </button>

              <button
                className={`btn-cosmic-secondary ${isMicListening ? 'mic-active' : ''}`}
                onClick={handleToggleMic}
                title="Blow directly into your device microphone"
              >
                {isMicListening ? <Mic size={18} color="#E1BEE7" /> : <MicOff size={18} />}
                <span>{isMicListening ? 'Listening... Blow full into mic!' : 'Use Microphone to Blow'}</span>
              </button>
            </>
          ) : (
            <div className="candles-extinguished-note">
              <Sparkles size={24} color="#D8B778" style={{ margin: '0 auto 0.5rem' }} />
              <h4>Happy 18th Birthday, {girlNickname}! 🎂✨</h4>
              <p>All 18 candles are extinguished. Your wish is carried across our cosmos.</p>
              <button
                className="btn-continue-journey"
                onClick={() => onScrollToProgress(0.85)}
              >
                <span>Continue Into The World I Made For You</span>
                <ArrowDown size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* MILESTONE 8: The Mysterious Gift Box */}
      <section
        className={`overlay-card ${currentProgress >= 0.82 && currentProgress < 0.90 ? 'visible' : 'faded'}`}
      >
        <span className="cosmic-tag text-purple">{milestones[7].tag}</span>
        <h2 className="cosmic-heading">{milestones[7].title}</h2>
        {milestones[7].body.map((p, i) => (
          <p key={i} className="cosmic-body">{p}</p>
        ))}

        <button
          className="btn-cosmic-primary"
          onClick={handleOpenGift}
          style={{ margin: '1.5rem auto 0' }}
        >
          <Gift size={20} />
          <span>{isGiftOpened ? 'Gift Opened ✨' : 'Tap to Open My Gift for You'}</span>
        </button>
      </section>

      {/* MILESTONE 9: Her Secret Room & Physical Wall Switch & Swipe Cards */}
      <section
        className={`overlay-card room-switch-card ${currentProgress >= 0.90 && currentProgress < 0.96 ? 'visible' : 'faded'}`}
      >
        <span className="cosmic-tag text-gold">{milestones[8].tag}</span>
        <h2 className="cosmic-heading">{milestones[8].title}</h2>
        {milestones[8].body.map((p, i) => (
          <p key={i} className="cosmic-body">{p}</p>
        ))}

        {/* Accessible HTML light switch toggle overlay */}
        <div className="room-switch-control">
          <button
            className={`btn-room-switch ${isRoomLit ? 'switch-on' : 'switch-off'}`}
            onClick={handleToggleSwitch}
            aria-pressed={isRoomLit}
          >
            <Lightbulb size={22} />
            <span>{isRoomLit ? 'Room Illuminated · Golden Warmth' : 'Click to Turn On the Light Switch'}</span>
          </button>
        </div>

        {/* Photo Compliment Cards Swipe Deck */}
        {isRoomLit && (
          <div className="room-photos-container">
            <JinnieCardsSwipe
              onSelectPhoto={(card) =>
                setSelectedPhoto({
                  src: card.image,
                  title: card.title,
                  caption: card.compliment,
                })
              }
            />
          </div>
        )}
      </section>

      {/* MILESTONE 10: The Sincere Confession */}
      <section
        className={`overlay-card confession-final-card ${currentProgress >= 0.96 ? 'visible' : 'faded'}`}
      >
        <span className="cosmic-tag text-purple">{milestones[9].tag}</span>
        <h2 className="cosmic-heading">{milestones[9].title}</h2>

        <div className="confession-letter-box">
          <h3 className="letter-salutation">
            {milestones[9].confession.salutation}
          </h3>

          <div className="letter-body">
            {milestones[9].confession.paragraphs.map((para, i) => (
              <p
                key={i}
                className={i === 5 ? 'confession-bold-statement' : ''}
              >
                {para}
              </p>
            ))}
          </div>

          {/* Three Respectful Choices */}
          <div className="confession-choices-grid">
            {milestones[9].confession.choices.map((c) => (
              <button
                key={c.id}
                className={`choice-button ${confessionResponse?.id === c.id ? 'active' : ''}`}
                onClick={() => handleSelectChoice(c)}
              >
                <span>{c.label}</span>
              </button>
            ))}
          </div>

          {/* Sincere Feedback Card */}
          {confessionResponse && (
            <div className="choice-feedback-banner">
              <h4>{confessionResponse.responseTitle}</h4>
              <p>{confessionResponse.responseText}</p>
            </div>
          )}

          {/* Optional Free Text Note */}
          <div className="optional-response-form">
            <label htmlFor="jinnie-note">
              Write anything you want to tell me (Optional):
            </label>
            <textarea
              id="jinnie-note"
              className="note-textarea"
              placeholder="Your honest thoughts, a tease, or whatever you want to tell me..."
              value={userCustomNote}
              onChange={(e) => setUserCustomNote(e.target.value)}
            />

            <div className="response-actions-row">
              <button
                className="btn-whatsapp-send"
                onClick={handleShareResponse}
                title="Send reply to me on WhatsApp"
              >
                <MessageSquare size={16} />
                <span>Send to me on WhatsApp ({boyNickname}) 💌</span>
              </button>

              <button
                className="btn-copy-note"
                onClick={handleCopyNote}
                title="Copy your message"
              >
                {copySuccess ? <Check size={16} color="#BA68C8" /> : <Copy size={16} />}
                <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Replay Option */}
        <div className="replay-experience-row">
          <button className="btn-replay-journey" onClick={onReplay}>
            <RotateCcw size={18} />
            <span>Replay the Journey</span>
          </button>
        </div>
      </section>

      {/* Lightbox Preview for Jinnie's Photos */}
      {selectedPhoto && (
        <div
          className="photo-lightbox-modal"
          onClick={() => setSelectedPhoto(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close"
              onClick={() => setSelectedPhoto(null)}
            >
              <X size={20} />
            </button>
            <img src={selectedPhoto.src} alt={selectedPhoto.title} />
            <div className="lightbox-desc">
              <h4>{selectedPhoto.title}</h4>
              <p>{selectedPhoto.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
