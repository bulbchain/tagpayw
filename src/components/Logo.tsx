import React from 'react';
import { BRAND_ASSETS, PROTOCOL_CONFIG } from '../constants';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showBadge?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  showBadge = false,
  className = ''
}) => {
  const sizeMap = {
    xs: { img: 'w-6 h-6', radius: 'rounded-md', text: 'text-[14px]', sub: 'text-[7px]' },
    sm: { img: 'w-8 h-8 sm:w-9 sm:h-9', radius: 'rounded-xl', text: 'text-[17px] sm:text-[19px]', sub: 'text-[8px]' },
    md: { img: 'w-10 h-10', radius: 'rounded-xl', text: 'text-[21px]', sub: 'text-[9px]' },
    lg: { img: 'w-14 h-14', radius: 'rounded-2xl', text: 'text-[26px]', sub: 'text-[10px]' },
    xl: { img: 'w-20 h-20', radius: 'rounded-2xl', text: 'text-[34px]', sub: 'text-[12px]' },
  };

  const current = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Neon Gradient Bordered Icon Box */}
      <div
        className={`relative ${current.img} ${current.radius} p-[1.5px] bg-gradient-to-tr from-[#9945FF] via-[#00f5b8] to-[#00f5b8] shadow-[0_0_15px_rgba(0,245,184,0.35)] shrink-0 transition-all duration-300 group-hover:shadow-[0_0_24px_rgba(0,245,184,0.65)]`}
      >
        <div className={`w-full h-full ${current.radius} overflow-hidden bg-[#010810] flex items-center justify-center`}>
          <img
            src={BRAND_ASSETS.LOGO_PATH}
            alt={BRAND_ASSETS.LOGO_ALT}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.triedFallback1) {
                target.dataset.triedFallback1 = 'true';
                target.src = BRAND_ASSETS.LOGO_FALLBACK_PATH;
              } else if (!target.dataset.triedFallback2) {
                target.dataset.triedFallback2 = 'true';
                target.src = '/tagpay-logo.jpg';
              }
            }}
          />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-mono ${current.text} font-black tracking-wider text-[#00f5b8] drop-shadow-[0_0_12px_rgba(0,245,184,0.4)] leading-none`}>
              {PROTOCOL_CONFIG.APP_NAME}
            </span>
            {showBadge && (
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#00f5b8]/10 border border-[#00f5b8]/30 font-mono text-[8px] font-bold text-[#00f5b8] uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00f5b8] animate-pulse"></span>
                SOLANA
              </span>
            )}
          </div>
          <span className={`font-mono ${current.sub} text-[#8fa8bd] tracking-widest uppercase mt-0.5 font-bold`}>
            WEB3 PROTOCOL
          </span>
        </div>
      )}
    </div>
  );
};
