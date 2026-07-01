import React from 'react';

interface GeoveraLogoProps {
  className?: string;
  height?: number;
  width?: number;
  showText?: boolean;
}

export const GeoveraLogo: React.FC<GeoveraLogoProps> = ({ 
  className = '', 
  height, 
  width,
  showText = false
}) => {
  // Desktop: height = 48px, Tablet: 40px, Mobile: 32px
  const displayHeight = height || 48;
  const displayWidth = width || displayHeight;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Dynamic SVG Icon */}
      <svg
        width={displayWidth}
        height={displayHeight}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-all duration-300"
      >
        {/* Blue outer location pin with open left side to form a G */}
        <path 
          d="M50 92C50 92 82 58 82 34C82 16.3 67.7 2 50 2C32.3 2 18 16.3 18 34C18 45 23 56 30 65" 
          stroke="#0B4F8A" 
          strokeWidth="12" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        {/* Green inner crossbar and curve completing the "G" shape */}
        <path 
          d="M46 34H66V44C66 53 58.8 60.2 50 60.2C41.2 60.2 34 53 34 44" 
          stroke="#16A34A" 
          strokeWidth="10" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <circle cx="50" cy="34" r="8" fill="#16A34A" />
      </svg>

      {showText && (
        <div className="flex flex-col select-none">
          <span className="text-sm font-black tracking-widest text-[#0B4F8A] font-display uppercase leading-none">
            GEOVERA
          </span>
          <span className="text-[8px] font-black uppercase tracking-wider text-[#16A34A] font-mono leading-none mt-1">
            Locate. Verify. Own.
          </span>
        </div>
      )}
    </div>
  );
};
