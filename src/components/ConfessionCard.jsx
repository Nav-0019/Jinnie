import React, { useState } from 'react';
import { pop, burstSparkles, rainEmojis } from '../utils/audioSynth';
import { createWhatsAppShareUrl, copyToClipboard } from '../utils/shareMessage';

export function ConfessionCard({
  girlNickname = 'Jinnie',
  boyNickname = 'Bewakuf',
  recipientPhone = '+91 7310347742',
}) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [customNote, setCustomNote] = useState('');
  const [copied, setCopied] = useState(false);

  const choices = [
    {
      id: 'same',
      label: 'I feel the same way 💜',
      reply: 'Then the stars got it right. Happy birthday, Jinnie. 💜',
      celebrate: true,
    },
    {
      id: 'time',
      label: 'I need time to think 🌙',
      reply: 'Take all the time you need. The sky isn’t going anywhere, and neither am I.',
      celebrate: false,
    },
    {
      id: 'friend',
      label: 'I see you as a friend 🤝',
      reply: 'Then I’m grateful for exactly that. Best friend in the stars, always. Happy birthday, Jinnie.',
      celebrate: false,
    },
  ];

  const handleChoice = (e, choice) => {
    setSelectedAnswer(choice);
    pop(800);

    const rect = e.currentTarget.getBoundingClientRect();
    burstSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2, ['💜', '✨'], 10, 110);

    if (choice.celebrate) {
      rainEmojis(['💜', '💖', '✨', '🎉'], 40);
    }
  };

  const handleWhatsAppShare = () => {
    pop(600);
    const text = `🌹 A Universe Made for You — Response from ${girlNickname}
💜 My Answer: "${selectedAnswer ? selectedAnswer.label : 'Thoughtful silence'}"
${customNote ? `📝 Note for you, ${boyNickname}: "${customNote}"\n` : ''}
Sent to my Bewakuf from our celestial universe ✨`;

    const url = createWhatsAppShareUrl(text, recipientPhone);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = async () => {
    pop(600);
    const text = `🌹 Response from ${girlNickname} to you (${boyNickname}):
My Answer: "${selectedAnswer ? selectedAnswer.label : 'Shared'}"
${customNote ? `Note: "${customNote}"` : ''}`;

    const res = await copyToClipboard(text);
    if (res.success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <div className="confession-wrapper">
      {/* The Letter */}
      <div className="letter-card">
        <p className="letter-salutation">{girlNickname},</p>
        <p className="letter-body">
          I don’t know what the future holds, and I won’t pretend five months online
          means I know everything about you.
        </p>
        <p className="letter-body">
          But on your eighteenth birthday, I wanted to say what has been quietly
          growing in my heart.
        </p>
        <p className="letter-highlight">
          <b>I like you, {girlNickname}. Truly, honestly, more than a friend.</b>
        </p>
      </div>

      {/* Response Choices */}
      <div className="response-card">
        <h3 className="choice-title">So, what does your star say?</h3>

        <div className="ch2">
          {choices.map((c) => (
            <button
              key={c.id}
              className={`choice-btn ${
                selectedAnswer?.id === c.id ? 'active' : ''
              }`}
              onClick={(e) => handleChoice(e, c)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {selectedAnswer && (
          <div className="answer-display animate-fade-in">
            <p className="msg">{selectedAnswer.reply}</p>

            <div className="reply-note-box">
              <textarea
                className="note-input"
                placeholder={`Write a little note for ${boyNickname} (optional)…`}
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                rows={2}
              />

              <div className="share-actions">
                <button
                  className="btn-share-whatsapp"
                  onClick={handleWhatsAppShare}
                >
                  Send Answer on WhatsApp 💬
                </button>
                <button className="btn-copy-note" onClick={handleCopy}>
                  {copied ? 'Copied to Clipboard! ✨' : 'Copy Response 📋'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
