import React, { useState } from 'react';
import { X, ZoomIn, Sparkles } from 'lucide-react';
import { soundEffects } from '../utils/audioSynthesizer';

export function MemoryWall({ memories }) {
  const [activeMemory, setActiveMemory] = useState(null);

  const handleOpenMemory = (mem) => {
    soundEffects.click();
    setActiveMemory(mem);
  };

  const handleCloseMemory = () => {
    soundEffects.click();
    setActiveMemory(null);
  };

  return (
    <>
      <div className="memory-wall-grid">
        {memories.map((mem) => (
          <div
            key={mem.id}
            className="memory-frame"
            onClick={() => handleOpenMemory(mem)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleOpenMemory(mem);
            }}
            aria-label={`View memory: ${mem.title}`}
          >
            <div className="memory-image-box">
              <img
                src={mem.image}
                alt={mem.title}
                loading="lazy"
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  background: 'rgba(0,0,0,0.6)',
                  borderRadius: '50%',
                  padding: '4px',
                  color: '#D8B778',
                }}
              >
                <ZoomIn size={16} />
              </div>
            </div>
            <div className="memory-info">
              <h4 className="memory-title">{mem.title}</h4>
              <p className="memory-caption">{mem.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeMemory && (
        <div
          className="lightbox-backdrop"
          onClick={handleCloseMemory}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="lightbox-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="lightbox-close-btn"
              onClick={handleCloseMemory}
              aria-label="Close memory preview"
            >
              <X size={20} />
            </button>

            <div style={{ width: '100%', maxHeight: '420px', overflow: 'hidden' }}>
              <img
                src={activeMemory.image}
                alt={activeMemory.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ padding: '1.5rem 2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Sparkles size={18} color="#D8B778" />
                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-ivory-light)' }}>
                  {activeMemory.title}
                </h3>
              </div>
              <p style={{ color: 'var(--text-ivory)', fontSize: '1rem', lineHeight: 1.6 }}>
                {activeMemory.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
