import React, { useState } from 'react';
import { CoinLaunch } from '../types';
import { useApp } from '../context/AppContext';
import { SOCIAL_LINKS, PROTOCOL_CONFIG } from '../constants';

interface CoinsViewProps {
  onTagCreator: (handle: string) => void;
  onTradeCoin: (coin: CoinLaunch) => void;
}

export const CoinsView: React.FC<CoinsViewProps> = ({ onTagCreator, onTradeCoin }) => {
  const { coinLaunches, setIsTagModalOpen, setPrefilledHandleForTag } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'high-volume' | 'fresh'>('all');

  const filteredCoins = coinLaunches.filter((coin) => {
    const matchesSearch =
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.creatorHandle.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'high-volume') {
      const vol = parseFloat((coin.volume24h || '$0').replace(/[^0-9.]/g, '')) || 0;
      return vol > 1000000;
    }
    if (filter === 'fresh') {
      return (
        coin.timeAgo.toLowerCase().includes('just now') ||
        coin.timeAgo.toLowerCase().includes('3h') ||
        coin.timeAgo.toLowerCase().includes('6h') ||
        coin.timeAgo.toLowerCase().includes('9h')
      );
    }
    return true;
  });

  return (
    <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#00f5b8]/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00f5b8] animate-pulse"></span>
            <span className="font-mono text-[10px] text-[#8fa8bd] uppercase tracking-widest">
              SOLANA // PUMP.FUN BONDING REGISTRY // 100% CREATOR CUT
            </span>
          </div>
          <h1 className="font-sans text-[26px] sm:text-[34px] md:text-[40px] font-black text-white tracking-tight uppercase">
            Creator Coins on pump.fun
          </h1>
          <p className="font-sans text-[14px] sm:text-[15px] text-[#8fa8bd] mt-1 max-w-2xl leading-relaxed">
            Every tokenized social identity. 100% of trading fees settle autonomously into each creator's Solana PDA vault on every pump.fun swap.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setPrefilledHandleForTag('@vitalikbuterin');
            setIsTagModalOpen(true);
          }}
          className="px-5 sm:px-6 py-3 bg-[#00f5b8] hover:bg-[#5cffd2] text-[#010a12] font-mono text-[12px] sm:text-[13px] font-black uppercase rounded-xl transition-all shadow-[0_8px_20px_rgba(0,245,184,0.35)] hover:shadow-[0_12px_28px_rgba(0,245,184,0.5)] cursor-pointer shrink-0 touch-manipulation"
        >
          + LAUNCH ON PUMP.FUN
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search coin, ticker or @handle..."
            className="w-full px-4 py-2.5 bg-[#010810] border-2 border-[#00f5b8]/40 focus:border-[#00f5b8] focus:outline-none rounded-xl text-white font-mono text-[13px]"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 font-mono text-[11px] overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'high-volume', 'fresh'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-xl border transition-colors cursor-pointer font-bold uppercase whitespace-nowrap touch-manipulation ${
                filter === f
                  ? 'bg-[#00f5b8] text-[#010a12] border-[#00f5b8] shadow-[0_0_12px_rgba(0,245,184,0.3)]'
                  : 'bg-[#010810] border-[#00f5b8]/30 text-[#8fa8bd] hover:text-white'
              }`}
            >
              {f.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Coins */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCoins.map((coin) => {
          const progress = coin.bondingCurveProgress || 50;
          return (
            <div
              key={coin.id}
              className="neon-card p-5 sm:p-6 flex flex-col justify-between gap-5 relative group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#00f5b8]/15 border-2 border-[#00f5b8] text-[#00f5b8] font-mono font-black text-[18px] flex items-center justify-center shrink-0">
                      {coin.symbol.replace('$', '').slice(0, 3)}
                    </div>
                    <div>
                      <h3 className="font-sans font-black text-white text-[17px] group-hover:text-[#00f5b8] transition-colors">
                        {coin.name}
                      </h3>
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="text-[#00f5b8] font-bold">{coin.symbol}</span>
                        <span className="text-[#475e75]">·</span>
                        <span className="text-[#8fa8bd]">{coin.creatorHandle}</span>
                      </div>
                    </div>
                  </div>

                  <span className="font-mono text-[10px] text-[#00f5b8] bg-[#00f5b8]/10 px-2 py-0.5 rounded border border-[#00f5b8]/30 shrink-0 font-bold">
                    100% CUT
                  </span>
                </div>

                {/* Status & pump.fun Bonding Curve Progress */}
                <div className="p-3 bg-[#010810] rounded-xl border border-[#00f5b8]/20 flex flex-col gap-2 font-mono text-[11px]">
                  <div className="flex justify-between items-center text-[#8fa8bd]">
                    <span>pump.fun Bonding:</span>
                    <span className="text-[#00f5b8] font-bold">{progress}% to Raydium</span>
                  </div>
                  <div className="w-full bg-[#020e1a] h-2 rounded-full overflow-hidden border border-[#00f5b8]/30">
                    <div
                      className="bg-gradient-to-r from-[#00f5b8] to-[#5cffd2] h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-[#475e75]">
                    <span>Graduation: ~85 SOL</span>
                    <span>Status: {coin.status}</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-3 font-mono text-[11px]">
                  <div>
                    <span className="text-[#8fa8bd] block text-[10px]">24H VOLUME</span>
                    <span className="text-white font-bold text-[13px]">{coin.volume24h || '$1.2M'}</span>
                  </div>
                  <div>
                    <span className="text-[#8fa8bd] block text-[10px]">CREATOR FEES STREAMED</span>
                    <span className="text-[#00f5b8] font-bold text-[13px]">{coin.earnedCut || '+14.5 SOL'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#00f5b8]/20">
                <button
                  type="button"
                  onClick={() => onTradeCoin(coin)}
                  className="flex-1 py-2.5 bg-[#00f5b8] hover:bg-[#5cffd2] text-[#010a12] font-mono font-black text-[12px] uppercase rounded-xl transition-all shadow-[0_4px_12px_rgba(0,245,184,0.3)] cursor-pointer text-center touch-manipulation"
                >
                  SWAP / TRADE
                </button>
                <a
                  href={coin.pumpFunUrl || SOCIAL_LINKS.PUMP_FUN_COIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-[#010810] hover:bg-[#00f5b8]/15 border border-[#00f5b8]/40 text-[#00f5b8] rounded-xl font-mono text-[12px] flex items-center justify-center transition-colors"
                  title="View on pump.fun"
                >
                  💊
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
