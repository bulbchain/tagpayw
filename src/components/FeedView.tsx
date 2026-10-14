import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SOCIAL_LINKS, formatSolAddress } from '../constants';

interface FeedViewProps {
  onTagHandle: (handle: string) => void;
  onSendHandle: (handle: string) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({ onTagHandle, onSendHandle }) => {
  const {
    coinLaunches,
    directSends,
    claims,
    setSelectedCoinForTrade,
    latestMempoolTxId,
    currentSolanaSlot
  } = useApp();
  const [filter, setFilter] = useState<'all' | 'coins' | 'sends' | 'claims'>('all');

  return (
    <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#00f5b8]/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00f5b8] animate-pulse"></span>
            <span className="font-mono text-[10px] text-[#8fa8bd] uppercase tracking-widest">
              SOLANA // PROTOCOL MEMPOOL STREAM // SLOT #{currentSolanaSlot.toLocaleString()} // ~2,480 TPS
            </span>
          </div>
          <h1 className="font-sans text-[26px] sm:text-[34px] md:text-[40px] font-black text-white tracking-tight uppercase">
            Protocol Live Feed
          </h1>
          <p className="font-sans text-[14px] sm:text-[15px] text-[#8fa8bd] mt-1 max-w-2xl leading-relaxed">
            Real-time on-chain events across TagPay. Every coin launch on pump.fun, atomic peer send, and fee harvest is recorded transparently on Solana.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 font-mono text-[11px] overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'coins', 'sends', 'claims'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-xl border transition-colors cursor-pointer font-bold uppercase touch-manipulation ${
                filter === f
                  ? 'bg-[#00f5b8] text-[#010a12] border-[#00f5b8] shadow-[0_0_12px_rgba(0,245,184,0.3)]'
                  : 'bg-[#010810] border-[#00f5b8]/30 text-[#8fa8bd] hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Feed Stream */}
      <div className="flex flex-col gap-3.5">
        {/* Claims */}
        {(filter === 'all' || filter === 'claims') &&
          claims.map((claim) => (
            <div
              key={claim.id}
              className="neon-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#5cffd2] transition-all"
            >
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-[#00f5b8]/10 border-2 border-[#00f5b8] text-[#00f5b8] font-mono font-black text-[16px] flex items-center justify-center shrink-0">
                  <span>👻</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] text-[#8fa8bd] flex-wrap">
                    <span className="text-[#00f5b8] font-bold">SOLANA PDA CLAIM</span>
                    <span>·</span>
                    <span>{claim.timeAgo}</span>
                    <span>·</span>
                    <span>{claim.slotNumber}</span>
                  </div>
                  <div className="font-sans text-[15px] sm:text-[16px] font-bold text-white mt-1">
                    <span className="text-[#00f5b8] font-mono">{claim.creatorHandle}</span> claimed{' '}
                    <span className="text-white font-mono font-bold">{claim.amountSol}</span> ({claim.amountUsd})
                  </div>
                  <div className="font-mono text-[10px] sm:text-[11px] text-[#8fa8bd] mt-0.5">
                    Transferred to Phantom {formatSolAddress(claim.destinationWallet, 6)} · 0% fee
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-stretch sm:self-center font-mono text-[11px]">
                <button
                  type="button"
                  onClick={() => onSendHandle(claim.creatorHandle)}
                  className="w-full sm:w-auto px-4 py-2 bg-[#00f5b8]/15 hover:bg-[#00f5b8] text-[#00f5b8] hover:text-[#010a12] border border-[#00f5b8] rounded-xl font-bold transition-all cursor-pointer text-center"
                >
                  SEND TO {claim.creatorHandle}
                </button>
              </div>
            </div>
          ))}

        {/* Render coins */}
        {(filter === 'all' || filter === 'coins') &&
          coinLaunches.map((item) => (
            <div
              key={item.id}
              className="neon-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#5cffd2] transition-all"
            >
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-[#00f5b8] text-[#010a12] font-mono font-black text-[15px] sm:text-[16px] flex items-center justify-center shrink-0">
                  {item.symbol.replace('$', '').slice(0, 3)}
                </div>
                <div>
                  <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] text-[#8fa8bd] flex-wrap">
                    <span className="text-[#00f5b8] font-bold">PUMP.FUN LAUNCH</span>
                    <span>·</span>
                    <span>{item.timeAgo}</span>
                    <span>·</span>
                    <span className="text-white font-bold">{item.bondingCurveProgress || 50}% Bonded</span>
                  </div>
                  <div className="font-sans text-[15px] sm:text-[16px] font-bold text-white mt-1">
                    <span className="text-[#00f5b8] font-mono">{item.symbol}</span> ({item.name}) deployed for{' '}
                    <span className="text-white font-mono">{item.creatorHandle}</span>
                  </div>
                  <div className="font-mono text-[10px] sm:text-[11px] text-[#8fa8bd] mt-0.5">
                    100% of trading cuts locked to Solana PDA · Mint: {formatSolAddress(item.contractAddress || '', 6)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-stretch sm:self-center font-mono text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectedCoinForTrade(item)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-[#00f5b8] hover:bg-[#5cffd2] text-[#010a12] font-black rounded-xl transition-all cursor-pointer text-center"
                >
                  TRADE {item.symbol}
                </button>
                <a
                  href={item.pumpFunUrl || SOCIAL_LINKS.PUMP_FUN_COIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-[#010810] border border-[#00f5b8]/30 text-[#00f5b8] rounded-xl hover:bg-[#00f5b8]/10"
                >
                  pump.fun ↗
                </a>
              </div>
            </div>
          ))}

        {/* Direct Sends */}
        {(filter === 'all' || filter === 'sends') &&
          directSends.map((send) => {
            const isNew = send.id === latestMempoolTxId;
            return (
              <div
                key={send.id}
                className={`neon-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-500 ${
                  isNew
                    ? 'border-[#00f5b8] bg-[#00f5b8]/15 shadow-[0_0_24px_rgba(0,245,184,0.4)] scale-[1.01]'
                    : 'hover:border-[#5cffd2]'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                  <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-[#010810] border-2 flex items-center justify-center shrink-0 font-mono font-black text-[16px] ${
                    send.asset === 'SOL'
                      ? 'border-[#00f5b8] text-[#00f5b8]'
                      : send.asset === 'ETH'
                      ? 'border-[#627eea] text-[#8fa8bd] text-white'
                      : send.asset === 'USDC'
                      ? 'border-[#2775ca] text-[#00f5b8]'
                      : 'border-[#00f5b8] text-[#8fa8bd]'
                  }`}>
                    {send.asset === 'SOL' ? '◎' : send.asset === 'ETH' ? 'Ξ' : send.asset === 'USDC' ? '$' : '⚡'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] text-[#8fa8bd] flex-wrap">
                      <span className="text-[#00f5b8] font-bold">SOLANA PEER SEND</span>
                      <span>·</span>
                      <span className={isNew ? 'text-[#00f5b8] font-bold' : ''}>{send.timeAgo}</span>
                      <span>·</span>
                      <span>{send.slotNumber}</span>
                      {isNew && (
                        <span className="px-1.5 py-0.2 rounded bg-[#00f5b8] text-[#010a12] font-black text-[9px] uppercase tracking-wide animate-pulse">
                          LIVE
                        </span>
                      )}
                    </div>
                    <div className="font-sans text-[15px] sm:text-[16px] font-bold text-white mt-1">
                      <span className="text-white font-mono">{send.senderHandle}</span> sent{' '}
                      <span className="text-[#00f5b8] font-mono font-bold">
                        {send.amount} {send.asset}
                      </span>{' '}
                      ({send.usdValue}) to <span className="text-white font-mono">{send.recipientHandle}</span>
                    </div>
                  {send.memo && (
                    <div className="font-mono text-[10px] sm:text-[11px] text-[#8fa8bd] italic mt-0.5">
                      "{send.memo}"
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-stretch sm:self-center font-mono text-[11px]">
                <button
                  type="button"
                  onClick={() => onTagHandle(send.recipientHandle)}
                  className="w-full sm:w-auto px-4 py-2 bg-[#010810] hover:bg-[#00f5b8]/10 text-[#00f5b8] border border-[#00f5b8] rounded-xl font-bold transition-all cursor-pointer text-center"
                >
                  TAG {send.recipientHandle}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
