import React from 'react';

export function RadialProgress({
  value = 0,
  max = 100,
  size = 120,
  strokeWidth = 10,
  label = 'Index',
  sublabel = '/ 100',
  color = 'var(--cyan)'
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  let strokeColor = color;
  if (value >= 80) strokeColor = '#10b981';
  else if (value >= 60) strokeColor = '#f59e0b';
  else if (value >= 40) strokeColor = '#ef4444';
  else strokeColor = '#dc2626';

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.4s ease',
            filter: `drop-shadow(0 0 8px ${strokeColor}66)`
          }}
        />
      </svg>

      <div style={{ position: 'absolute', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: size * 0.24, fontWeight: 800, fontFamily: 'var(--font-mono)', lineHeight: 1, color: 'var(--text-main)' }}>
          {value}
        </span>
        {sublabel && (
          <span style={{ fontSize: size * 0.09, color: 'var(--text-dim)', marginTop: 2, fontWeight: 600 }}>
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
