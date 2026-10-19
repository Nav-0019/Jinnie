import React from 'react';

export function StorySection({
  id,
  tag,
  title,
  subtitle,
  children,
  className = '',
}) {
  return (
    <section id={id} className={`story-section ${className}`}>
      <div className="story-container">
        {(tag || title || subtitle) && (
          <div className="section-header">
            {tag && <span className="section-tag">{tag}</span>}
            {title && <h2 className="section-title">{title}</h2>}
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
