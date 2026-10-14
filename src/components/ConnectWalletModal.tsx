import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  SOLANA_CONFIG,
  SOCIAL_LINKS,
  PROTOCOL_CONFIG,
  BRAND_ASSETS,
  formatSolAddress
} from '../constants';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    walletConnected,
    walletAddress,
    walletBalanceSol,
    walletProvider,
    isPhantomInstalled,
    connectPhantom,
    connectWallet,
    disconnectWallet,
    addToast
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [connecting, setConnecting] = useState(false);

  if (!isOpen) return null;

  const solanaWallets = [
    {
      id: 'phantom',
      name: 'Phantom',
      badge: isPhantomInstalled ? 'DETECTED' : 'RECOMMENDED',
      badgeColor: isPhantomInstalled ? 'text-[#00f5b8]' : 'text-[#ab9ff2]',
      desc: isPhantomInstalled ? 'Phantom browser extension ready' : 'Leading Solana wallet for pump.fun',
      icon: '👻',
      isPhantom: true
    },
    {
      id: 'solflare',
      name: 'Solflare',
      badge: 'SOLANA',
      badgeColor: 'text-[#ff9800]',
      desc: 'Popular web & mobile Solana wallet',
      icon: '🔥',
      isPhantom: false
    },
    {
      id: 'backpack',
      name: 'Backpack',
      badge: 'xNFT',
      badgeColor: 'text-[#e91e63]',
      desc: 'Next-gen Solana crypto wallet',
      icon: '🎒',
      isPhantom: false
    },
    {
      id: 'phantom-mobile',
      name: 'Phantom Mobile',
      badge: 'DEEP LINK',
      badgeColor: 'text-[#00f5b8]',
      desc: 'Open TagPay inside Phantom in-app browser',
      icon: '📱',
      isPhantom: false,
      isDeepLink: true
    }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    addToast({
      type: 'info',
      title: 'Solana Address Copied',
      description: walletAddress
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnectPhantom = async () => {
    setConnecting(true);
    try {
      await connectPhantom();
      onClose();
    } finally {
      setConnecting(false);
    }
  };

  const handleConnectOther = async (name: string, isDeepLink?: boolean) => {
    if (isDeepLink) {
      const currentUrl = window.location.href;
      window.open(SOCIAL_LINKS.PHANTOM_DEEP_LINK(currentUrl), '_blank');
      return;
    }
    setConnecting(true);
    try {
      await connectWallet(name);
      onClose();
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div 
        className="neon-card max-w-md w-full p-5 sm:p-7 flex flex-col gap-5 shadow-2xl relative bg-[#010c17] animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#00f5b8]/20 pb-3">
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
            <div>
              <div className="font-sans text-[16px] sm:text-[17px] font-bold text-white leading-tight">
                {walletConnected ? 'Connected Solana Account' : 'Connect Phantom Wallet'}
              </div>
              <div className="font-mono text-[9px] text-[#00f5b8] tracking-wider uppercase mt-0.5">
                TagPay · Solana & pump.fun
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8fa8bd] hover:text-white cursor-pointer text-[20px] p-1.5 touch-manipulation"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {walletConnected ? (
          /* Connected State */
          <div className="flex flex-col gap-4 font-mono text-[12px]">
            <div className="p-4 bg-[#010810] border border-[#00f5b8]/30 rounded-xl flex flex-col gap-3">
              <div className="flex justify-between items-center text-[#8fa8bd] flex-wrap gap-1">
                <span>Network:</span>
                <span className="text-[#00f5b8] font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00f5b8]"></span>
                  {SOLANA_CONFIG.NETWORK_NAME}
                </span>
              </div>

              <div className="flex justify-between items-center text-[#8fa8bd] flex-wrap gap-1">
                <span>Provider:</span>
                <span className="text-white font-bold flex items-center gap-1">
                  <span>👻</span>
                  <span>{walletProvider}</span>
                </span>
              </div>

              <div className="flex justify-between items-center text-[#8fa8bd] flex-wrap gap-1">
                <span>Solana Address:</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold select-all break-all">
                    {formatSolAddress(walletAddress, 6)}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-2.5 py-1 bg-[#00f5b8]/15 text-[#00f5b8] hover:bg-[#00f5b8] hover:text-[#010a12] rounded text-[10px] font-bold transition-colors cursor-pointer touch-manipulation"
                  >
                    {copied ? 'COPIED' : 'COPY'}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-[#8fa8bd] flex-wrap gap-1 border-t border-[#00f5b8]/15 pt-2">
                <span>SOL Balance:</span>
                <span className="text-[#00f5b8] font-black text-[13px]">
                  {walletBalanceSol.toFixed(3)} SOL (~${(walletBalanceSol * PROTOCOL_CONFIG.SOL_PRICE_USD).toFixed(2)})
                </span>
              </div>

              <div className="flex justify-between items-center text-[#8fa8bd] flex-wrap gap-1">
                <span>pump.fun Status:</span>
                <span className="text-white font-bold">Bonding Curve Ready ✓</span>
              </div>
            </div>

            {/* Solscan Explorer Link */}
            <a
              href={SOCIAL_LINKS.SOLSCAN_ACCOUNT_URL(walletAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 bg-[#010810] hover:bg-[#00f5b8]/10 border border-[#00f5b8]/30 text-[#8fa8bd] hover:text-white rounded-xl text-center transition-colors flex items-center justify-center gap-2"
            >
              <span>View Account on Solscan</span>
              <span>↗</span>
            </a>

            {/* Disconnect Button */}
            <button
              type="button"
              onClick={() => {
                disconnectWallet();
                onClose();
              }}
              className="w-full py-3 bg-[#010810] border border-red-500/50 hover:bg-red-500/20 text-red-400 font-bold rounded-xl transition-colors cursor-pointer text-center touch-manipulation"
            >
              DISCONNECT WALLET
            </button>
          </div>
        ) : (
          /* Disconnected State: Wallet Options */
          <div className="flex flex-col gap-3 font-mono text-[12px]">
            <p className="text-[#8fa8bd] text-[13px] font-sans leading-relaxed">
              Connect your Solana wallet to launch coins on <span className="text-[#00f5b8] font-bold">pump.fun</span> with 100% locked creator fees, or send instant SOL tips to any social handle.
            </p>

            {/* Phantom Highlight Card */}
            <button
              type="button"
              onClick={handleConnectPhantom}
              disabled={connecting}
              className="p-4 bg-gradient-to-r from-[#ab9ff2]/15 via-[#010810] to-[#00f5b8]/15 hover:border-[#00f5b8] border-2 border-[#00f5b8] rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer shadow-[0_8px_20px_rgba(0,245,184,0.25)] hover:shadow-[0_12px_28px_rgba(0,245,184,0.4)] group touch-manipulation"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ab9ff2]/20 border border-[#ab9ff2] flex items-center justify-center text-[22px] shrink-0">
                  👻
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white group-hover:text-[#00f5b8] text-[15px] flex items-center gap-1.5">
                    Connect Phantom
                    <span className="text-[10px] text-[#00f5b8] font-mono">★</span>
                  </span>
                  <span className="text-[11px] text-[#8fa8bd] font-sans">
                    {isPhantomInstalled ? 'Browser extension ready · 1-click sign' : 'Compatible with pump.fun & Solana'}
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-[#00f5b8] text-[#010a12] font-black rounded-lg text-[10px] uppercase shrink-0">
                {isPhantomInstalled ? 'CONNECT' : '1-CLICK'}
              </span>
            </button>

            {/* Other Wallet Options */}
            <div className="flex flex-col gap-2 pt-1">
              {solanaWallets.slice(1).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleConnectOther(opt.name, opt.isDeepLink)}
                  disabled={connecting}
                  className="p-3 bg-[#010810] hover:bg-[#00f5b8]/10 border border-[#00f5b8]/30 hover:border-[#00f5b8] rounded-xl flex items-center justify-between text-left transition-all cursor-pointer group touch-manipulation"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[18px]">{opt.icon}</span>
                    <div className="flex flex-col">
                      <span className="font-bold text-white group-hover:text-[#00f5b8] text-[12px]">
                        {opt.name}
                      </span>
                      <span className="text-[10px] text-[#8fa8bd] font-sans">
                        {opt.desc}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[10px] ${opt.badgeColor} font-bold tracking-wider shrink-0`}>
                    {opt.badge}
                  </span>
                </button>
              ))}
            </div>

            {/* Link to install Phantom if user needs it */}
            {!isPhantomInstalled && (
              <div className="pt-2 border-t border-[#00f5b8]/15 flex items-center justify-between text-[11px] text-[#8fa8bd]">
                <span>Don't have Phantom?</span>
                <a
                  href={SOCIAL_LINKS.PHANTOM_DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00f5b8] hover:underline font-bold flex items-center gap-1"
                >
                  <span>Install Extension</span>
                  <span>↗</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
