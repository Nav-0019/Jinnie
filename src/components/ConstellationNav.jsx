import React from 'react';

export function ConstellationNav({ milestones, currentProgress, onSelectMilestone }) {
  return (
    <nav className="constellation-nav" aria-label="Journey Milestones Progress">
      <div className="constellation-track">
        {/* Subtle connecting line */}
        <div className="constellation-line" />
        <div
          className="constellation-line-fill"
          style={{ height: `${Math.min(100, Math.max(0, currentProgress * 100))}%` }}
        />

        {milestones.map((m, index) => {
          const isActive = currentProgress >= m.progress - 0.04 && currentProgress <= m.progress + 0.06;
          const isPassed = currentProgress > m.progress;

          return (
            <button
              key={m.id}
              className={`constellation-star ${isActive ? 'active' : ''} ${isPassed ? 'passed' : ''}`}
              style={{ top: `${(index / (milestones.length - 1)) * 100}%` }}
              onClick={() => onSelectMilestone(m.progress)}
              aria-label={`Jump to ${m.tag}: ${m.title}`}
            >
              <span className="star-core" />
              <div className="star-tooltip">
                <span className="tooltip-tag">{m.tag}</span>
                <span className="tooltip-title">{m.title}</span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
