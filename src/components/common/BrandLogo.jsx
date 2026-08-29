import React from 'react';

export function BrandLogo({ size = 'md', showText = true, className = '' }) {
  const badgeSize = size === 'sm' ? 'w-8 h-8 text-sm' : size === 'lg' ? 'w-12 h-12 text-2xl' : 'w-10 h-10 text-lg';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex-shrink-0">
        <svg
          width={size === 'sm' ? 32 : size === 'lg' ? 48 : 38}
          height={size === 'sm' ? 32 : size === 'lg' ? 48 : 38}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'drop-shadow(0 4px 14px rgba(0, 169, 224, 0.4))' }}
        >
          <rect width="100" height="100" rx="24" fill="url(#nexus_grad)" />
          <path
            d="M28 72V28L72 72V28"
            stroke="white"
            strokeWidth="13"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="28" cy="28" r="4" fill="#00d2ff" />
          <circle cx="72" cy="72" r="4" fill="#00d2ff" />
          <defs>
            <linearGradient id="nexus_grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0075c9" />
              <stop offset="0.6" stopColor="#00a9e0" />
              <stop offset="1" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="brand-text">
          <h1 style={{ margin: 0, fontSize: size === 'sm' ? '15px' : '18px', fontWeight: 800 }}>
            NEXUS
          </h1>
          <span style={{ fontSize: '9.5px', letterSpacing: '1.5px', color: 'var(--cyan)', fontWeight: 700 }}>
            UNIVERSITY
          </span>
        </div>
      )}
    </div>
  );
}
