import React from 'react';
import { SOCIAL_LINKS, PROTOCOL_CONFIG } from '../constants';
import { Logo } from './Logo';

interface FooterProps {
  onOpenContract?: () => void;
  onOpenDocs?: () => void;
  onSendClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenContract, onOpenDocs, onSendClick }) => {
  return (
    <footer className="w-full bg-[#010810] border-t border-[#00f5b8]/15 mt-auto">
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-[12px]">
        {/* Brand Left */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <Logo size="sm" showText={true} showBadge={false} />
          <span className="text-[#475e75] hidden sm:inline">|</span>
          <span className="text-[#8fa8bd] text-[11px]">
            Solana & pump.fun Non-Custodial Protocol
          </span>
        </div>

        {/* Center Social & Explorer Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
          <a
            href={SOCIAL_LINKS.TWITTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8fa8bd] hover:text-[#00f5b8] transition-colors flex items-center gap-1"
          >
            <span>𝕏 {SOCIAL_LINKS.TWITTER_HANDLE}</span>
          </a>
          <span className="text-[#475e75]">·</span>
          <a
            href={SOCIAL_LINKS.PUMP_FUN_COIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8fa8bd] hover:text-[#00f5b8] transition-colors flex items-center gap-1"
          >
            <span>💊 pump.fun</span>
          </a>
          <span className="text-[#475e75]">·</span>
          <a
            href={SOCIAL_LINKS.DEXSCREENER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8fa8bd] hover:text-[#00f5b8] transition-colors"
          >
            DexScreener
          </a>
          <span className="text-[#475e75]">·</span>
          <a
            href={SOCIAL_LINKS.SOLSCAN_TOKEN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8fa8bd] hover:text-[#00f5b8] transition-colors"
          >
            Solscan
          </a>
        </div>

        {/* Right Action Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 text-[11px]">
          <button
            type="button"
            onClick={onOpenContract}
            className="text-[#8fa8bd] hover:text-[#00f5b8] transition-colors cursor-pointer"
          >
            // CONTRACTS
          </button>
          <button
            type="button"
            onClick={onOpenDocs}
            className="text-[#8fa8bd] hover:text-[#00f5b8] transition-colors cursor-pointer"
          >
            // DOCS
          </button>
          <button
            type="button"
            onClick={onSendClick}
            className="text-[#00f5b8] hover:text-[#5cffd2] font-bold transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>SEND SOMEONE</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
