import React from 'react';
import { Star } from 'lucide-react';

export function StarRating({
  value = 0,
  onChange = null,
  size = 20,
  maxStars = 5,
  readOnly = false,
  className = ''
}) {
  return (
    <div style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }} className={className}>
      {Array.from({ length: maxStars }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= value;

        return (
          <button
            key={i}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange && onChange(starValue)}
            style={{
              background: 'none',
              border: 'none',
              padding: '2px',
              cursor: readOnly ? 'default' : 'pointer',
              color: isFilled ? '#fbbf24' : 'rgba(255, 255, 255, 0.2)',
              transition: 'transform 0.15s ease, color 0.15s ease',
              display: 'grid',
              placeItems: 'center'
            }}
            title={`${starValue} / ${maxStars}`}
          >
            <Star
              size={size}
              fill={isFilled ? '#fbbf24' : 'transparent'}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
}
