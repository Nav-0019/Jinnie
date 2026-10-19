import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Clock, Smile } from 'lucide-react';
import { soundEffects } from '../utils/audioSynthesizer';

export function ConfessionLetter({ content }) {
  const [selectedChoice, setSelectedChoice] = useState(null);

  const handleSelectChoice = (choice) => {
    soundEffects.click();
    setSelectedChoice(choice);

    if (choice.id === 'yes') {
      soundEffects.celebration();
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#9F243D', '#D8B778', '#FAF4EC'],
        });
      } catch (e) {
        console.debug(e);
      }
    }
  };

  const { letter } = content;

  return (
    <div className="confession-card">
      <div className="confession-salutation">{letter.salutation}</div>

      <div className="confession-text">
        {letter.paragraphs.slice(0, 4).map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}

        <div className="confession-highlight">
          <Heart size={22} style={{ display: 'inline', marginRight: '8px' }} />
          <span>I like you. More than just a friend.</span>
        </div>

        {letter.paragraphs.slice(5).map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>

      {/* Three Respectful Choices */}
      <div className="confession-choices-row" role="group" aria-label="Confession response choices">
        <button
          className="btn-choice btn-choice-yes"
          onClick={() => handleSelectChoice(letter.choices[0])}
        >
          <Heart size={16} style={{ display: 'inline', marginRight: '6px' }} />
          <span>{letter.choices[0].label}</span>
        </button>

        <button
          className="btn-choice btn-choice-time"
          onClick={() => handleSelectChoice(letter.choices[1])}
        >
          <Clock size={16} style={{ display: 'inline', marginRight: '6px' }} />
          <span>{letter.choices[1].label}</span>
        </button>

        <button
          className="btn-choice btn-choice-friend"
          onClick={() => handleSelectChoice(letter.choices[2])}
        >
          <Smile size={16} style={{ display: 'inline', marginRight: '6px' }} />
          <span>{letter.choices[2].label}</span>
        </button>
      </div>

      {/* Response Message Banner */}
      {selectedChoice && (
        <div className="choice-response-banner">
          <h4>{selectedChoice.responseTitle}</h4>
          <p>{selectedChoice.responseText}</p>
        </div>
      )}
    </div>
  );
}
