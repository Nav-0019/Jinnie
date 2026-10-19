import React, { useState } from 'react';
import { X, Check, Settings } from 'lucide-react';
import { soundEffects } from '../utils/audioSynthesizer';

export function PersonalizeModal({
  isOpen,
  onClose,
  personalization,
  onSave,
}) {
  const [formData, setFormData] = useState({
    girlNickname: personalization.girlNickname || 'Drama Queen',
    boyNickname: personalization.boyNickname || 'Persistent Boy',
    recipientPhone: personalization.recipientPhone || '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    soundEffects.click();
    onSave(formData);
    onClose();
  };

  return (
    <div
      className="lightbox-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="lightbox-modal"
        style={{ maxWidth: '500px', padding: '2rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="lightbox-close-btn"
          onClick={onClose}
          aria-label="Close settings"
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <Settings size={22} color="#D8B778" />
          <h3 style={{ fontSize: '1.5rem', color: 'var(--text-ivory-light)' }}>
            Personalize Story
          </h3>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-ivory-muted)', marginBottom: '1.5rem' }}>
          Update the nicknames or configure WhatsApp sharing number for testing:
        </p>

        <form onSubmit={handleSubmit}>
          <div className="slice-form-group">
            <label htmlFor="p-girl">Her Nickname / Name:</label>
            <input
              id="p-girl"
              type="text"
              className="slice-input"
              value={formData.girlNickname}
              onChange={(e) => setFormData({ ...formData, girlNickname: e.target.value })}
              required
            />
          </div>

          <div className="slice-form-group">
            <label htmlFor="p-boy">His Nickname / Name:</label>
            <input
              id="p-boy"
              type="text"
              className="slice-input"
              value={formData.boyNickname}
              onChange={(e) => setFormData({ ...formData, boyNickname: e.target.value })}
              required
            />
          </div>

          <div className="slice-form-group">
            <label htmlFor="p-phone">Recipient WhatsApp Number (Optional):</label>
            <input
              id="p-phone"
              type="tel"
              className="slice-input"
              placeholder="e.g. 919876543210 (country code + number)"
              value={formData.recipientPhone}
              onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-ivory-muted)', marginTop: '4px', display: 'block' }}>
              Used only for client-side WhatsApp link generation. Not stored anywhere else.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button
              type="button"
              className="btn-secondary-action"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary-action"
            >
              <Check size={18} />
              <span>Save & Update</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
