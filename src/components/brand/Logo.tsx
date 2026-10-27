import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  inverted?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
  inverted = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const titleSizes = {
    sm: 'text-base leading-tight',
    md: 'text-xl leading-tight',
    lg: 'text-2xl leading-tight',
    xl: 'text-3xl leading-tight',
  };

  const taglineSizes = {
    sm: 'text-[9px] tracking-wider',
    md: 'text-[10px] tracking-widest',
    lg: 'text-xs tracking-widest',
    xl: 'text-sm tracking-widest',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Official dead.croco Emblem */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#1b4332] via-[#0f291e] to-[#081c13] shadow-md border border-[#52b788]/30 overflow-hidden shrink-0 group hover:border-[#52b788] transition-all duration-300`}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1 drop-shadow"
        >
          {/* Crocodile Armor Back Ridge */}
          <path
            d="M8 32C12 28 14 26 18 26C21 26 23 28 26 25C29 22 31 22 36 21C40 20.2 44 23 44 23L42 27C38 27 34 26 31 28C28 30 25 29 22 33C19 37 13 38 8 32Z"
            fill="#52b788"
          />
          {/* Main Croc Head & Jaws */}
          <path
            d="M6 31C6 31 10 20 18 19C24 18.2 28 21 34 20C39 19.2 43 14 43 14C43 14 44 19 40 23C36 26.5 32 27 27 28C22 29 17 33 13 36C9 39 6 36 6 31Z"
            fill="#d8f3dc"
          />
          {/* Armored Scales Texture */}
          <path
            d="M17 19L20 22M23 20L26 23M29 20L32 23"
            stroke="#1b4332"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          {/* Lower Jaw Teeth Silhouette */}
          <path
            d="M33 26.5L34 24.5L36 26.2L37.5 24.2L39 26"
            stroke="#0f291e"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Distinctive Dead Eye Mark (X Eye) */}
          <line
            x1="18.5"
            y1="23.5"
            x2="23.5"
            y2="28.5"
            stroke="#0f291e"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <line
            x1="23.5"
            y1="23.5"
            x2="18.5"
            y2="28.5"
            stroke="#0f291e"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Subtle safety crown / shield apex */}
          <circle cx="21" cy="26" r="1.1" fill="#74c69d" />
        </svg>

        {/* Ambient glow highlight */}
        <div className="absolute inset-0 bg-radial from-[#52b788]/20 to-transparent pointer-events-none" />
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span
            className={`font-extrabold tracking-tight font-sans ${titleSizes[size]} ${
              inverted ? 'text-white' : 'text-[#0f291e]'
            }`}
          >
            dead<span className="text-[#2d6a4f]">.</span>croco
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#d8f3dc] text-[#1b4332] border border-[#74c69d]/40">
            v2.6
          </span>
        </div>
        {showTagline && (
          <span
            className={`font-bold uppercase font-mono tracking-wider ${taglineSizes[size]} ${
              inverted ? 'text-[#95d5b2]' : 'text-[#2d6a4f]'
            }`}
          >
            BE DEAD LIKE CROCO
          </span>
        )}
      </div>
    </div>
  );
};
