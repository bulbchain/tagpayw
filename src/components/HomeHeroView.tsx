import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { useApp } from '../context/AppContext';
import {
  CONTRACT_ADDRESSES,
  SOCIAL_LINKS,
  PROTOCOL_CONFIG,
  BRAND_ASSETS,
  formatSolAddress
} from '../constants';

const CREATOR_HANDLES = [
  '@elonmusk',
  '@vitalikbuterin',
  '@ansem',
  '@_TJRTrades',
  '@ishowspeed',
  '@toly',
  '@cobie'
];

interface HomeHeroViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  onSelectHandleForCoin?: (handle: string) => void;
  onSelectHandleForSend?: (handle: string) => void;
  onOpenLaunchModal?: () => void;
}

export const HomeHeroView: React.FC<HomeHeroViewProps> = ({
  setActiveTab,
  onSelectHandleForCoin,
  onSelectHandleForSend,
  onOpenLaunchModal
}) => {
  const { addToast } = useApp();
  const [handleIndex, setHandleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Typewriter effect: types the '@' and the handle character-by-character for every tag
  React.useEffect(() => {
    const currentTarget = CREATOR_HANDLES[handleIndex];
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      // Typing forward from empty string
      if (displayText.length < currentTarget.length) {
        // Extra deliberate keystroke on the initial '@'
        const delay = displayText.length === 0 ? 250 : 105;
        timer = setTimeout(() => {
          setDisplayText(currentTarget.slice(0, displayText.length + 1));
        }, delay);
      } else {
        // Pause after the complete handle finishes typing so user can read it
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      // Deleting backwards all the way including the '@'
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 50);
      } else {
        // Pause briefly on empty cursor state before starting next tag
        timer = setTimeout(() => {
          setIsDeleting(false);
          setHandleIndex((prev) => (prev + 1) % CREATOR_HANDLES.length);
        }, 350);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, handleIndex]);

  const contractAddress = CONTRACT_ADDRESSES.TAG_TOKEN_MINT;

  const handleCopyCA = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    addToast({
      type: 'success',
      title: 'Solana Contract Copied!',
      description: contractAddress
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const nextHandle = () => {
    setIsDeleting(false);
    setDisplayText('');
    setHandleIndex((prev) => (prev + 1) % CREATOR_HANDLES.length);
  };

  return (
    <div className="flex flex-col gap-14 sm:gap-20 md:gap-24 w-full">
      {/* Hero Section */}
      <section className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 pt-4 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Hero Copy & CTA Buttons */}
          <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6">
            {/* Top Solana Network Tag with TagPay Logo */}
            <div className="flex items-center gap-2.5 self-start flex-wrap">
              <div className="relative w-8 h-8 rounded-xl overflow-hidden p-[1px] bg-gradient-to-tr from-[#9945FF] to-[#00f5b8] shadow-[0_0_12px_rgba(0,245,184,0.35)] shrink-0">
                <img
                  src={BRAND_ASSETS.LOGO_PATH}
                  alt={BRAND_ASSETS.LOGO_ALT}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-[11px]"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = 'true';
                      target.src = '/tagpay-logo.png';
                    }
                  }}
                />
              </div>
              <div className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-[11px] text-[#00f5b8] bg-[#00f5b8]/10 border border-[#00f5b8]/30 px-3 py-1.5 rounded-full uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#00f5b8] animate-pulse"></span>
                <span>LIVE ON SOLANA MAINNET · PUMP.FUN BONDING CURVE</span>
              </div>
            </div>

            {/* Main Headline with Typewriter Animation */}
            <h1 className="font-sans text-[36px] sm:text-[48px] md:text-[58px] lg:text-[64px] font-black tracking-tight text-white uppercase leading-[1.05]">
              TAG A COIN FOR ANY{' '}
              <span
                onClick={nextHandle}
                className="text-[#00f5b8] underline decoration-[#00f5b8]/50 hover:decoration-[#00f5b8] cursor-pointer transition-all inline-flex items-baseline hover:scale-[1.02]"
                title="Click to cycle creator"
              >
                <span className="font-mono text-[#00f5b8]">
                  {displayText || '\u200B'}
                </span>
                <span className="typewriter-cursor"></span>
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="font-sans text-[15px] sm:text-[17px] md:text-[18px] text-[#8fa8bd] leading-relaxed max-w-xl">
              Deploy an SPL coin permanently bound to any creator's handle on <strong className="text-white">pump.fun</strong>. 100% of trading creator fees route into their non-custodial Solana PDA vault. No custody. No account needed.
            </p>

            {/* Action Buttons matching tagpay.png */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full pt-2">
              <button
                type="button"
                onClick={() => {
                  if (onOpenLaunchModal) {
                    onSelectHandleForCoin?.(CREATOR_HANDLES[handleIndex]);
                    onOpenLaunchModal();
                  } else {
                    setActiveTab('tag-for-@');
                  }
                }}
                className="px-6 py-4 bg-[#00f5b8] hover:bg-[#5cffd2] text-[#010a12] font-mono text-[13px] font-black uppercase tracking-wider rounded-xl transition-all shadow-[0_8px_20px_rgba(0,245,184,0.35)] hover:shadow-[0_12px_28px_rgba(0,245,184,0.5)] hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 touch-manipulation"
              >
                <span>TAG FOR @</span>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('send')}
                className="px-6 py-4 bg-[#010c17] hover:bg-[#00f5b8]/10 text-[#00f5b8] font-mono text-[13px] font-bold uppercase tracking-wider rounded-xl border-2 border-[#00f5b8] transition-all shadow-[0_8px_20px_rgba(0,0,0,0.6)] hover:-translate-y-0.5 cursor-pointer text-center touch-manipulation"
              >
                JUST SEND SOMEONE
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('claim')}
                className="px-6 py-4 bg-[#010c17] hover:bg-[#04192e] text-[#8fa8bd] hover:text-white font-mono text-[13px] font-bold uppercase tracking-wider rounded-xl border border-[#00f5b8]/30 transition-all shadow-[0_8px_20px_rgba(0,0,0,0.6)] hover:-translate-y-0.5 cursor-pointer text-center touch-manipulation"
              >
                GOT A TAG? CLAIM IT
              </button>
            </div>

            {/* Quick links to Socials and pump.fun */}
            <div className="flex items-center gap-4 pt-1 font-mono text-[11px] text-[#8fa8bd]">
              <span>Quick Links:</span>
              <a
                href={SOCIAL_LINKS.TWITTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00f5b8] hover:underline flex items-center gap-1 font-bold"
              >
                <span>𝕏</span>
                <span>↗</span>
              </a>
              <span>·</span>
              <a
                href={SOCIAL_LINKS.PUMP_FUN_COIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00f5b8] hover:underline flex items-center gap-1 font-bold"
              >
                <span>💊 pump.fun</span>
                <span>↗</span>
              </a>
              <span>·</span>
              <a
                href={SOCIAL_LINKS.DEXSCREENER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8fa8bd] hover:text-white flex items-center gap-1"
              >
                <span>DexScreener</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          {/* Right Column: $TAG Solana Contract & pump.fun Metrics Card */}
          <div className="lg:col-span-5 w-full">
            <div className="neon-card p-5 sm:p-7 flex flex-col gap-4 relative overflow-hidden">
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl overflow-hidden p-[1px] bg-gradient-to-tr from-[#9945FF] to-[#00f5b8] shadow-[0_0_10px_rgba(0,245,184,0.3)] shrink-0">
                    <img
                      src={BRAND_ASSETS.LOGO_PATH}
                      alt={BRAND_ASSETS.LOGO_ALT}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-[11px]"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.fallback) {
                          target.dataset.fallback = 'true';
                          target.src = '/tagpay-logo.png';
                        }
                      }}
                    />
                  </div>
                  <span className="font-sans text-[22px] sm:text-[26px] font-black text-white tracking-tight">
                    {PROTOCOL_CONFIG.TOKEN_SYMBOL}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#00f5b8]/15 border border-[#00f5b8]/40 text-[#00f5b8] font-mono text-[10px] font-bold">
                    SOLANA
                  </span>
                </div>
                <span className="font-mono text-[11px] font-bold text-[#8fa8bd] uppercase">
                  CA
                </span>
              </div>

              {/* Solana Contract Address */}
              <div className="p-3 bg-[#010810] border border-[#00f5b8]/20 rounded-xl flex flex-col gap-1">
                <span className="text-[10px] font-mono text-[#8fa8bd] uppercase">Contract Address</span>
                <div className="font-mono text-[12px] sm:text-[13px] text-white break-all select-all font-medium">
                  {contractAddress}
                </div>
              </div>

              {/* Metrics Bar */}
              <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] text-[#00f5b8] font-bold tracking-wide py-0.5 flex-wrap">
                <span>$TAG BOUGHT BACK PROGRAM</span>
                <span>·</span>
                <span>GET SOL FROM LAUNCH FEES</span>
              </div>

              {/* Fee description */}
              <p className="font-sans text-[12px] text-[#8fa8bd] leading-relaxed">
                Launch fee: 0.02 SOL to pump.fun bonding curve + 0.005 SOL to TagPay. Paid by the launcher, never from creator fees. It buys back and burns $TAG on Solana.
              </p>

              {/* Action Buttons: TAP TO COPY & VIEW ON PUMP.FUN */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleCopyCA}
                  className="flex-1 py-3.5 bg-[#00f5b8] hover:bg-[#5cffd2] text-[#010a12] font-mono text-[12px] font-black uppercase tracking-wider rounded-xl transition-all shadow-[0_8px_20px_rgba(0,245,184,0.35)] hover:shadow-[0_12px_28px_rgba(0,245,184,0.5)] cursor-pointer text-center touch-manipulation"
                >
                  {copied ? '✓ COPIED TO CLIPBOARD' : 'TAP TO COPY CA'}
                </button>
                <a
                  href={SOCIAL_LINKS.PUMP_FUN_COIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-4 bg-[#010c17] hover:bg-[#00f5b8]/10 border-2 border-[#00f5b8] text-[#00f5b8] font-mono text-[12px] font-black uppercase rounded-xl transition-all text-center flex items-center justify-center gap-1.5 touch-manipulation"
                >
                  <span>pump.fun</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Banner: Solid Neon Mint with bold black text */}
      <div className="w-full bg-[#00f5b8] py-2.5 overflow-hidden shadow-[0_0_20px_rgba(0,245,184,0.35)]">
        <div className="animate-marquee gap-8 items-center text-[#010a12] font-mono font-black text-[11px] sm:text-[12px] tracking-wider uppercase whitespace-nowrap">
          <span className="pr-8">
            ✦ SOLANA MAINNET &nbsp;&nbsp;&nbsp;&nbsp; ✦ PUMP.FUN LAUNCHPAD &nbsp;&nbsp;&nbsp;&nbsp; ✦ PHANTOM WALLET READY &nbsp;&nbsp;&nbsp;&nbsp; ✦ 100% CREATOR FEES LOCKED &nbsp;&nbsp;&nbsp;&nbsp; ✦ CLAIM WHENEVER &nbsp;&nbsp;&nbsp;&nbsp; ✦ ZERO INTERMEDIARY CUSTODY &nbsp;&nbsp;&nbsp;&nbsp; ✦ SOL · USDC · 50+ ASSETS
          </span>
          <span className="pr-8">
            ✦ SOLANA MAINNET &nbsp;&nbsp;&nbsp;&nbsp; ✦ PUMP.FUN LAUNCHPAD &nbsp;&nbsp;&nbsp;&nbsp; ✦ PHANTOM WALLET READY &nbsp;&nbsp;&nbsp;&nbsp; ✦ 100% CREATOR FEES LOCKED &nbsp;&nbsp;&nbsp;&nbsp; ✦ CLAIM WHENEVER &nbsp;&nbsp;&nbsp;&nbsp; ✦ ZERO INTERMEDIARY CUSTODY &nbsp;&nbsp;&nbsp;&nbsp; ✦ SOL · USDC · 50+ ASSETS
          </span>
        </div>
      </div>

      {/* Three Moves Section */}
      <section className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 border-b border-[#00f5b8]/20 pb-4">
            <h2 className="font-sans text-[28px] sm:text-[36px] font-black text-white tracking-tight uppercase">
              THREE MOVES. THAT'S THE WHOLE APP.
            </h2>
            <span className="font-mono text-[12px] text-[#00f5b8] font-bold">
              ZERO SETUP REQUIRED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 01 */}
            <div className="neon-card p-6 flex flex-col gap-4">
              <div className="font-mono text-[14px] text-[#00f5b8] font-bold">01</div>
              <h3 className="font-sans text-[20px] font-black text-white uppercase tracking-tight">
                TYPE AN @ HANDLE
              </h3>
              <p className="font-sans text-[13px] text-[#8fa8bd] leading-relaxed">
                Enter any X, GitHub, Twitch, or YouTube handle. TagPay deterministically computes their Solana PDA vault. No signup or key generation required on their end.
              </p>
            </div>

            {/* Step 02 */}
            <div className="neon-card p-6 flex flex-col gap-4">
              <div className="font-mono text-[14px] text-[#00f5b8] font-bold">02</div>
              <h3 className="font-sans text-[20px] font-black text-white uppercase tracking-tight">
                TAG A COIN OR SEND
              </h3>
              <p className="font-sans text-[13px] text-[#8fa8bd] leading-relaxed">
                Launch an SPL creator coin directly onto <strong className="text-white">pump.fun</strong> with 100% creator fees locked, or send direct peer-to-peer SOL, USDC, or tokenized assets.
              </p>
            </div>

            {/* Step 03 */}
            <div className="neon-card p-6 flex flex-col gap-4">
              <div className="font-mono text-[14px] text-[#00f5b8] font-bold">03</div>
              <h3 className="font-sans text-[20px] font-black text-white uppercase tracking-tight">
                THEY CLAIM ON PHANTOM
              </h3>
              <p className="font-sans text-[13px] text-[#8fa8bd] leading-relaxed">
                The creator verifies their social handle anytime to unlock their secure MPC vault. All accumulated trading cuts and tips route straight to their Phantom wallet with zero middleman fee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Freshly Tagged on pump.fun + Activity Stream */}
      <section className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#00f5b8]/20 pb-4">
            <div>
              <div className="font-mono text-[11px] text-[#00f5b8] font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00f5b8] animate-pulse"></span>
                PUMP.FUN BONDING POOLS
              </div>
              <h2 className="font-sans text-[28px] sm:text-[34px] font-black text-white tracking-tight uppercase mt-0.5">
                Freshly Tagged Coins
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('coins')}
              className="px-4 py-2 bg-[#010c17] hover:bg-[#00f5b8]/10 text-[#00f5b8] font-mono text-[12px] font-bold uppercase rounded-xl border border-[#00f5b8] transition-all cursor-pointer"
            >
              EXPLORE ALL COINS →
            </button>
          </div>

          {/* 2x2 Token Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { symbol: '$TJR', name: 'TJR Protocol', creator: '@_TJRTrades', volume: '$2.4M', cut: '42.5 SOL', progress: 78 },
              { symbol: '$AJAX', name: 'Ajax Club Token', creator: '@AFCAjax', volume: '$1.8M', cut: '67.2 SOL', progress: 56 },
              { symbol: '$SPEED', name: 'Speed Coin', creator: '@ishowspeed', volume: '$3.9M', cut: '158.8 SOL', progress: 72 },
              { symbol: '$CDIT', name: 'CDIT Solana', creator: '@op', volume: '$950k', cut: '48.3 SOL', progress: 38 }
            ].map((token) => (
              <div key={token.symbol} className="neon-card p-5 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[20px] font-black text-[#00f5b8]">{token.symbol}</span>
                    <span className="font-mono text-[10px] text-[#8fa8bd] uppercase">{token.progress}% BONDED</span>
                  </div>
                  <h4 className="font-sans font-bold text-white text-[15px]">{token.name}</h4>
                  <div className="font-mono text-[11px] text-[#8fa8bd] mt-1">
                    for <strong className="text-white">{token.creator}</strong>
                  </div>
                  {/* Bonding curve bar */}
                  <div className="w-full bg-[#010810] h-1.5 rounded-full mt-3 overflow-hidden border border-[#00f5b8]/30">
                    <div className="bg-[#00f5b8] h-full rounded-full" style={{ width: `${token.progress}%` }}></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#00f5b8]/20 flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#8fa8bd]">Volume: {token.volume}</span>
                  <span className="text-[#00f5b8] font-bold">{token.cut}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Activity Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              { from: '@ansem', to: '@cobie', amount: '15.5 SOL', value: '$2,859.75', ago: '38s ago' },
              { from: '@toly', to: '@mom', amount: '500 USDC', value: '$500.00', ago: '2m ago' },
              { from: '@hsaka', to: '@gainzy', amount: '5 AAPL', value: '$1,174.00', ago: '5m ago' },
              { from: '@0xmert', to: '@toly', amount: '25.0 SOL', value: '$4,612.50', ago: '11m ago' }
            ].map((pill, idx) => (
              <div
                key={idx}
                className="bg-[#010c17] border border-[#004d40] rounded-full px-5 py-3 flex items-center justify-between font-mono text-[12px] shadow-[0_8px_20px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-white font-bold">{pill.from}</span>
                  <span className="text-[#00f5b8]">→</span>
                  <span className="text-[#8fa8bd]">{pill.to}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[#00f5b8] font-bold">{pill.amount}</span>
                  <span className="text-[#475e75] text-[10px] hidden sm:inline">{pill.ago}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Non-Custodial Guarantees */}
      <section className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 pb-12">
        <div className="neon-card p-6 sm:p-8 flex flex-col gap-6">
          <div className="border-b border-[#00f5b8]/20 pb-4">
            <span className="font-mono text-[11px] text-[#00f5b8] font-bold uppercase tracking-wider">
              PROTOCOL ARCHITECTURE
            </span>
            <h3 className="font-sans text-[24px] sm:text-[30px] font-black text-white uppercase tracking-tight mt-1">
              Non-Custodial Guarantees on Solana
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-[12px]">
            <div>
              <div className="text-[#00f5b8] font-bold text-[14px] mb-1">01 // PDA DETERMINISTIC VAULTS</div>
              <p className="text-[#8fa8bd] font-sans leading-relaxed">
                Every social handle has a program derived address on Solana calculated from seed hash. No pre-deposit or gas is needed to accumulate funds.
              </p>
            </div>
            <div>
              <div className="text-[#00f5b8] font-bold text-[14px] mb-1">02 // 100% PUMP.FUN FEE LOCK</div>
              <p className="text-[#8fa8bd] font-sans leading-relaxed">
                Byte-1 of the token deployment establishes the creator PDA as the irreversible fee recipient. TagPay holds zero custody tokens.
              </p>
            </div>
            <div>
              <div className="text-[#00f5b8] font-bold text-[14px] mb-1">03 // PHANTOM 1-CLICK CLAIM</div>
              <p className="text-[#8fa8bd] font-sans leading-relaxed">
                Creators verify through OAuth attestation. The hardware enclave signs the ed25519 release to their Phantom address in sub-second time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
