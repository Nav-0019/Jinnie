import React, { useState } from 'react';
import { Cake, Copy, Check, MessageSquare, Sparkles } from 'lucide-react';
import { createWhatsAppShareUrl, copyToClipboard } from '../utils/shareMessage';
import { soundEffects } from '../utils/audioSynthesizer';

export function CakeSliceGame({ content, boyNickname = 'Persistent Boy', recipientPhone = '' }) {
  const [selectedSlice, setSelectedSlice] = useState(content.slices[0]);
  const [userWish, setUserWish] = useState('');
  const [userDare, setUserDare] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleSelectSlice = (slice) => {
    soundEffects.click();
    setSelectedSlice(slice);
  };

  // Compile formatted message for preview & sharing
  const shareMessageText = `🎂 18th Birthday Cake Slice #${selectedSlice.number} — ${selectedSlice.label}
✨ Message: "${selectedSlice.prompt}"
${userWish ? `🌟 My Wish: "${userWish}"\n` : ''}${userDare ? `🎯 My Dare for ${boyNickname}: "${userDare}"\n` : ''}
Sent from "A Little World Made for You" ❤️`;

  const handleWhatsAppShare = () => {
    soundEffects.click();
    const url = createWhatsAppShareUrl(shareMessageText, recipientPhone);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyMessage = async () => {
    soundEffects.click();
    const res = await copyToClipboard(shareMessageText);
    if (res.success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  return (
    <div className="slice-game-container">
      {/* Slices Grid Selector */}
      <div className="slices-selector-panel">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--accent-gold)' }}>
          Choose a Slice of Cake:
        </h3>
        <div className="slices-selector-grid">
          {content.slices.map((slice) => {
            const isSelected = selectedSlice.id === slice.id;
            return (
              <button
                key={slice.id}
                className={`slice-card-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelectSlice(slice)}
                aria-pressed={isSelected}
              >
                <span className="slice-number">Slice {slice.number}</span>
                <span className="slice-label">{slice.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Slice Details & Sharing */}
      <div className="slice-details-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Cake size={22} color="#D8B778" />
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-ivory-light)' }}>
            Slice {selectedSlice.number}: {selectedSlice.label}
          </h3>
        </div>

        <div className="slice-prompt-box">
          <p>{selectedSlice.prompt}</p>
        </div>

        {/* Wish Input */}
        <div className="slice-form-group">
          <label htmlFor="user-wish-input">Your 18th Birthday Wish (Optional):</label>
          <input
            id="user-wish-input"
            type="text"
            className="slice-input"
            placeholder="Write a wish for your upcoming year..."
            value={userWish}
            onChange={(e) => setUserWish(e.target.value)}
          />
        </div>

        {/* Dare Input */}
        <div className="slice-form-group">
          <label htmlFor="user-dare-input">Give {boyNickname} A Dare (Optional):</label>
          <input
            id="user-dare-input"
            type="text"
            className="slice-input"
            placeholder={selectedSlice.darePlaceholder}
            value={userDare}
            onChange={(e) => setUserDare(e.target.value)}
          />
        </div>

        {/* Live Message Preview */}
        <div className="share-preview-card">
          <div className="preview-title">
            <Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Preview Message for {boyNickname}:
          </div>
          <div className="preview-content">{shareMessageText}</div>
        </div>

        {/* Sharing Action Buttons */}
        <div className="share-btn-row">
          <button
            className="btn-whatsapp-share"
            onClick={handleWhatsAppShare}
            title="Share via WhatsApp"
          >
            <MessageSquare size={18} />
            <span>Tag Him on WhatsApp</span>
          </button>

          <button
            className="btn-copy-share"
            onClick={handleCopyMessage}
            title="Copy message to clipboard"
          >
            {copySuccess ? <Check size={18} color="#D8B778" /> : <Copy size={18} />}
            <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
