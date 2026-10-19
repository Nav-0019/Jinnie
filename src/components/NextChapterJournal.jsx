import React, { useState } from 'react';
import { BookMarked, MessageSquare, Copy, Check, Feather } from 'lucide-react';
import { createWhatsAppShareUrl, copyToClipboard } from '../utils/shareMessage';
import { soundEffects } from '../utils/audioSynthesizer';

export function NextChapterJournal({ content, boyNickname = 'Persistent Boy', recipientPhone = '' }) {
  const [memory, setMemory] = useState('');
  const [message, setMessage] = useState('');
  const [nextChapter, setNextChapter] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const formattedJournalText = `📖 The Next Chapter — From Her to Her Bewakuf
🌹 A Memory of Us:
${memory || '(Not written yet)'}

💌 One Thing I Want to Tell You, Bewakuf:
${message || '(Not written yet)'}

✨ What I Hope for Next:
${nextChapter || '(Not written yet)'}

Sent to you from "A Universe Made for You" ❤️`;

  const handleWhatsAppShare = () => {
    soundEffects.click();
    const url = createWhatsAppShareUrl(formattedJournalText, recipientPhone);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyJournal = async () => {
    soundEffects.click();
    const res = await copyToClipboard(formattedJournalText);
    if (res.success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="journal-container">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Feather size={32} color="#D8B778" style={{ margin: '0 auto 0.5rem' }} />
          <h3 style={{ fontSize: '1.8rem', color: 'var(--text-ivory-light)' }}>
            Your Thoughts & Words
          </h3>
          <p style={{ color: 'var(--text-ivory-muted)', fontSize: '0.95rem' }}>
            {content.subtitle}
          </p>
        </div>

        {/* Field 1: Memory */}
        <div className="journal-field">
          <label className="journal-label" htmlFor="journal-memory">
            <span>01. One memory of us:</span>
          </label>
          <textarea
            id="journal-memory"
            className="journal-textarea"
            placeholder={content.prompts[0].placeholder}
            value={memory}
            onChange={(e) => setMemory(e.target.value)}
          />
        </div>

        {/* Field 2: Message */}
        <div className="journal-field">
          <label className="journal-label" htmlFor="journal-message">
            <span>02. One thing you want to tell me:</span>
          </label>
          <textarea
            id="journal-message"
            className="journal-textarea"
            placeholder={content.prompts[1].placeholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Field 3: Next Chapter */}
        <div className="journal-field">
          <label className="journal-label" htmlFor="journal-next">
            <span>03. The next chapter:</span>
          </label>
          <textarea
            id="journal-next"
            className="journal-textarea"
            placeholder={content.prompts[2].placeholder}
            value={nextChapter}
            onChange={(e) => setNextChapter(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="journal-actions-row">
          <button
            className="btn-whatsapp-share"
            onClick={handleWhatsAppShare}
            title="Share with me via WhatsApp"
          >
            <MessageSquare size={18} />
            <span>Send to me ({boyNickname}) via WhatsApp 💌</span>
          </button>

          <button
            className="btn-copy-share"
            onClick={handleCopyJournal}
            title="Copy your words to clipboard"
          >
            {copySuccess ? <Check size={18} color="#D8B778" /> : <Copy size={18} />}
            <span>{copySuccess ? 'Copied to Clipboard!' : 'Copy Journal Text'}</span>
          </button>
        </div>
      </div>

      {/* Outro: Closing Storybook Card */}
      <div className="closing-storybook-card animate-glow">
        <BookMarked size={42} color="#D8B778" style={{ margin: '0 auto 1rem' }} />
        <h3 className="closing-title">{content.closingTitle}</h3>
        <p className="closing-sub">{content.closingSubtitle}</p>
        <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--accent-gold)' }}>
          Made with ❤️ for your 18th Birthday
        </p>
      </div>
    </div>
  );
}
