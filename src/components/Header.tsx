import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { formatSolAddress, SOCIAL_LINKS, PROTOCOL_CONFIG } from '../constants';
import { Logo } from './Logo';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  walletConnected: boolean;
  walletAddress: string;
  onOpenWalletModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  walletConnected,
  walletAddress,
  onOpenWalletModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'tag-for-@', label: 'TAG FOR @' },
    { id: 'coins', label: 'COINS' },
    { id: 'send', label: 'SEND' },
    { id: 'claim', label: 'CLAIM' },
    { id: 'feed', label: 'FEED' }
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-[#010810]/95 backdrop-blur-md border-b border-[#00f5b8]/15">
      <div className="h-16 w-full max-w-[1360px] mx-auto px-3 sm:px-6 md:px-8 flex items-center justify-between gap-3">
        {/* Brand / Logo + Solana Chain Badge */}
        <div 
          className="flex items-center gap-2.5 shrink-0 cursor-pointer select-none group"
          onClick={() => {
            setActiveTab('tag-for-@');
            setMobileMenuOpen(false);
          }}
        >
          <Logo size="sm" showBadge={true} />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6 font-mono text-[11px] uppercase tracking-wider">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`relative py-1.5 transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-[#8fa8bd] hover:text-white'
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f5b8] shadow-[0_0_8px_#00f5b8]"></span>
                )}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick External Links (Desktop) */}
          <a
            href={SOCIAL_LINKS.TWITTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Follow on Twitter / X"
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-[#010c17] border border-[#00f5b8]/20 text-[#8fa8bd] hover:text-[#00f5b8] hover:border-[#00f5b8] transition-colors"
          >
            <span className="text-[12px] font-mono font-bold">𝕏</span>
          </a>

          <a
            href={SOCIAL_LINKS.PUMP_FUN_COIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="View on pump.fun"
            className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#010c17] border border-[#00f5b8]/20 text-[#8fa8bd] hover:text-[#00f5b8] hover:border-[#00f5b8] font-mono text-[10px] font-bold transition-colors"
          >
            <span>💊</span>
            <span>pump.fun</span>
          </a>

          {/* CONNECT PHANTOM / WALLET Pill Button matching tagpay.png */}
          <button
            type="button"
            onClick={onOpenWalletModal}
            className="px-3.5 sm:px-5 py-2 bg-[#00f5b8] hover:bg-[#5cffd2] text-[#010a12] font-mono text-[10px] sm:text-[11px] font-black uppercase tracking-wider rounded-full transition-all shadow-[0_6px_16px_rgba(0,245,184,0.35)] hover:shadow-[0_8px_20px_rgba(0,245,184,0.5)] cursor-pointer flex items-center gap-1.5 touch-manipulation min-h-[38px]"
          >
            {walletConnected ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#010a12] animate-pulse"></span>
                <span>{formatSolAddress(walletAddress, 4)}</span>
              </>
            ) : (
              <>
                <span className="text-[13px]">👻</span>
                <span>CONNECT</span>
              </>
            )}
          </button>

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="lg:hidden p-2 text-[#8fa8bd] hover:text-white rounded-lg touch-manipulation flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            <span className="font-mono text-[18px] font-bold">
              {mobileMenuOpen ? '✕' : '☰'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#020e1a] border-b border-[#00f5b8]/20 px-4 py-3 flex flex-col gap-1.5 font-mono text-[12px] animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-2 mb-1 border-b border-[#00f5b8]/10 text-[10px] text-[#8fa8bd]">
            <Logo size="xs" showBadge={false} />
            <div className="flex items-center gap-2">
              <a href={SOCIAL_LINKS.TWITTER_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">𝕏 Twitter</a>
              <span>·</span>
              <a href={SOCIAL_LINKS.PUMP_FUN_COIN_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">pump.fun</a>
            </div>
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3.5 py-2.5 rounded-xl transition-colors flex items-center justify-between touch-manipulation ${
                activeTab === item.id
                  ? 'bg-[#00f5b8]/15 text-[#00f5b8] font-bold border border-[#00f5b8]/40'
                  : 'text-[#8fa8bd] hover:text-white hover:bg-[#010810]'
              }`}
            >
              <span>{item.label}</span>
              {activeTab === item.id && (
                <span className="w-2 h-2 rounded-full bg-[#00f5b8]"></span>
              )}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
