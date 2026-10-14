import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CONTRACT_ADDRESSES,
  SOCIAL_LINKS,
  SOLANA_CONFIG,
  PROTOCOL_CONFIG,
  BRAND_ASSETS,
  formatSolAddress
} from '../constants';

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContractModal: React.FC<ContractModalProps> = ({ isOpen, onClose }) => {
  const { addToast } = useApp();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    addToast({
      type: 'success',
      title: `${label} Copied!`,
      description: text
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div 
        className="neon-card max-w-xl w-full p-5 sm:p-7 flex flex-col gap-5 shadow-2xl bg-[#010c17] animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#00f5b8]/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg overflow-hidden p-[1px] bg-gradient-to-tr from-[#9945FF] to-[#00f5b8] shadow-[0_0_8px_rgba(0,245,184,0.3)] shrink-0">
              <img
                src={BRAND_ASSETS.LOGO_PATH}
                alt={BRAND_ASSETS.LOGO_ALT}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-[7px]"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.fallback) {
                    target.dataset.fallback = 'true';
                    target.src = '/tagpay-logo.png';
                  }
                }}
              />
            </div>
            <span className="font-sans text-[16px] sm:text-[18px] font-bold text-white">
              TagPay Solana & pump.fun Contracts
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8fa8bd] hover:text-white cursor-pointer text-[18px] p-1.5 touch-manipulation"
          >
            ✕
          </button>
        </div>

        {/* Addresses Box */}
        <div className="flex flex-col gap-3 font-mono text-[12px]">
          {/* $TAG Mint Address */}
          <div className="p-3.5 bg-[#010810] border border-[#00f5b8]/30 rounded-xl flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[#8fa8bd] text-[10px] uppercase">
              <span>$TAG OFFICIAL MINT ADDRESS (SOLANA TOKEN-2022 / SPL)</span>
              <span className="text-[#00f5b8] font-bold">VERIFIED</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#00f5b8] font-bold break-all select-all text-[11px] sm:text-[12px]">
                {CONTRACT_ADDRESSES.TAG_TOKEN_MINT}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(CONTRACT_ADDRESSES.TAG_TOKEN_MINT, '$TAG Mint', 'mint')}
                className="px-2.5 py-1 bg-[#00f5b8] hover:bg-[#5cffd2] text-[#010a12] font-black rounded text-[10px] uppercase cursor-pointer shrink-0 touch-manipulation"
              >
                {copiedKey === 'mint' ? 'COPIED' : 'COPY'}
              </button>
            </div>
          </div>

          {/* pump.fun Program ID */}
          <div className="p-3 bg-[#010810] border border-[#00f5b8]/20 rounded-xl flex flex-col gap-1">
            <div className="flex justify-between items-center text-[#8fa8bd] text-[10px] uppercase">
              <span>PUMP.FUN BONDING CURVE PROGRAM ID</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-white font-mono break-all select-all text-[11px]">
                {CONTRACT_ADDRESSES.PUMP_FUN_PROGRAM_ID}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(CONTRACT_ADDRESSES.PUMP_FUN_PROGRAM_ID, 'pump.fun Program', 'pump')}
                className="px-2 py-0.5 bg-[#010c17] border border-[#00f5b8]/40 hover:bg-[#00f5b8]/20 text-[#00f5b8] rounded text-[10px] font-bold uppercase cursor-pointer shrink-0"
              >
                {copiedKey === 'pump' ? 'COPIED' : 'COPY'}
              </button>
            </div>
          </div>

          {/* TagPay Program ID */}
          <div className="p-3 bg-[#010810] border border-[#00f5b8]/20 rounded-xl flex flex-col gap-1">
            <div className="flex justify-between items-center text-[#8fa8bd] text-[10px] uppercase">
              <span>TAGPAY ENCLAVE ROUTER PROGRAM ID</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-white font-mono break-all select-all text-[11px]">
                {CONTRACT_ADDRESSES.TAGPAY_PROGRAM_ID}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(CONTRACT_ADDRESSES.TAGPAY_PROGRAM_ID, 'TagPay Program', 'tagpay')}
                className="px-2 py-0.5 bg-[#010c17] border border-[#00f5b8]/40 hover:bg-[#00f5b8]/20 text-[#00f5b8] rounded text-[10px] font-bold uppercase cursor-pointer shrink-0"
              >
                {copiedKey === 'tagpay' ? 'COPIED' : 'COPY'}
              </button>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="flex flex-col gap-2 text-[#8fa8bd] pt-1">
            <div className="flex justify-between border-b border-[#00f5b8]/15 py-1.5 flex-wrap gap-1">
              <span>Chain & Cluster:</span>
              <span className="text-white font-bold">{SOLANA_CONFIG.NETWORK_NAME}</span>
            </div>
            <div className="flex justify-between border-b border-[#00f5b8]/15 py-1.5 flex-wrap gap-1">
              <span>Launchpad Target:</span>
              <span className="text-[#00f5b8] font-bold">pump.fun Bonding Curve</span>
            </div>
            <div className="flex justify-between border-b border-[#00f5b8]/15 py-1.5 flex-wrap gap-1">
              <span>Graduation AMM:</span>
              <span className="text-white font-bold">Raydium Pool V4 (~85 SOL Target)</span>
            </div>
            <div className="flex justify-between border-b border-[#00f5b8]/15 py-1.5 flex-wrap gap-1">
              <span>Creator Cut Guarantee:</span>
              <span className="text-[#00f5b8] font-bold">100% Locked to Solana PDA</span>
            </div>
            <div className="flex justify-between border-b border-[#00f5b8]/15 py-1.5 flex-wrap gap-1">
              <span>Official Twitter:</span>
              <a href={SOCIAL_LINKS.TWITTER_URL} target="_blank" rel="noopener noreferrer" className="text-[#00f5b8] hover:underline font-bold">
                {SOCIAL_LINKS.TWITTER_HANDLE} ↗
              </a>
            </div>
          </div>

          {/* Quick External Links */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={SOCIAL_LINKS.PUMP_FUN_COIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-[#010810] hover:bg-[#00f5b8]/15 border border-[#00f5b8]/30 rounded-xl text-center text-[#00f5b8] font-bold flex items-center justify-center gap-1.5"
            >
              <span>View on pump.fun</span>
              <span>↗</span>
            </a>
            <a
              href={SOCIAL_LINKS.SOLSCAN_TOKEN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-[#010810] hover:bg-[#00f5b8]/15 border border-[#00f5b8]/30 rounded-xl text-center text-[#8fa8bd] hover:text-white flex items-center justify-center gap-1.5"
            >
              <span>View on Solscan</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-[#00f5b8] hover:bg-[#5cffd2] text-[#010a12] font-mono font-black uppercase text-[12px] rounded-xl cursor-pointer touch-manipulation"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};
