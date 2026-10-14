import React, { useState } from 'react';
import { CoinLaunch } from '../types';
import { useApp } from '../context/AppContext';
import {
  PROTOCOL_CONFIG,
  SOCIAL_LINKS,
  CONTRACT_ADDRESSES,
  formatSolAddress
} from '../constants';

interface TradeModalProps {
  coin: CoinLaunch | null;
  onClose: () => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({ coin, onClose }) => {
  const { tradeCoin, walletConnected, walletBalanceSol, connectPhantom } = useApp();
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [solAmount, setSolAmount] = useState<string>('0.5');
  const [isExecuting, setIsExecuting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!coin) return null;

  const parsedSol = parseFloat(solAmount) || 0;
  const unitPrice = parseFloat(coin.price?.replace('$', '') || '0.000042') || 0.000042;
  const estimatedTokens = Math.floor((parsedSol * PROTOCOL_CONFIG.SOL_PRICE_USD) / unitPrice);
  const creatorCutSol = +(parsedSol * 0.01).toFixed(4);
  const creatorCutUsd = +(creatorCutSol * PROTOCOL_CONFIG.SOL_PRICE_USD).toFixed(2);

  const handleSwap = () => {
    if (parsedSol <= 0) return;
    setIsExecuting(true);
    setSuccessMessage(null);

    setTimeout(() => {
      setIsExecuting(false);
      tradeCoin(coin.id, tradeType, parsedSol);
      setSuccessMessage(
        `Successfully ${tradeType === 'buy' ? 'bought' : 'sold'} ${estimatedTokens.toLocaleString()} ${coin.symbol}! ${creatorCutSol} SOL creator fees streamed autonomously to ${coin.creatorHandle}.`
      );
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="neon-card max-w-lg w-full p-5 sm:p-7 flex flex-col gap-5 relative bg-[#010c17] animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#00f5b8]/20 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00f5b8] text-[#010a12] font-mono font-black text-[16px] flex items-center justify-center shrink-0">
              {coin.symbol.replace('$', '').slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-sans font-black text-white text-[17px] sm:text-[18px]">{coin.name}</h3>
                <span className="font-mono text-[12px] text-[#00f5b8] font-bold">{coin.symbol}</span>
              </div>
              <span className="font-mono text-[11px] text-[#8fa8bd]">
                100% Fees → <strong className="text-white">{coin.creatorHandle}</strong>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[#8fa8bd] hover:text-white transition-colors cursor-pointer text-[18px] p-1 touch-manipulation"
          >
            ✕
          </button>
        </div>

        {/* Buy / Sell Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#010810] border border-[#00f5b8]/30 rounded-xl font-mono text-[12px]">
          <button
            type="button"
            onClick={() => {
              setTradeType('buy');
              setSuccessMessage(null);
            }}
            className={`py-2 rounded-lg font-black transition-all cursor-pointer touch-manipulation ${
              tradeType === 'buy'
                ? 'bg-[#00f5b8] text-[#010a12] shadow-[0_0_12px_rgba(0,245,184,0.3)]'
                : 'text-[#8fa8bd] hover:text-white'
            }`}
          >
            BUY {coin.symbol}
          </button>
          <button
            type="button"
            onClick={() => {
              setTradeType('sell');
              setSuccessMessage(null);
            }}
            className={`py-2 rounded-lg font-black transition-all cursor-pointer touch-manipulation ${
              tradeType === 'sell'
                ? 'bg-[#00f5b8] text-[#010a12] shadow-[0_0_12px_rgba(0,245,184,0.3)]'
                : 'text-[#8fa8bd] hover:text-white'
            }`}
          >
            SELL {coin.symbol}
          </button>
        </div>

        {/* pump.fun Bonding Curve Notice */}
        <div className="p-3 bg-[#010810] border border-[#00f5b8]/20 rounded-xl flex flex-col gap-1.5 font-mono text-[11px]">
          <div className="flex justify-between items-center text-[#8fa8bd]">
            <span>PUMP.FUN BONDING POOL:</span>
            <span className="text-[#00f5b8] font-bold">{coin.bondingCurveProgress || 50}% to Raydium</span>
          </div>
          <div className="w-full bg-[#020e1a] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#00f5b8] h-full rounded-full" style={{ width: `${coin.bondingCurveProgress || 50}%` }}></div>
          </div>
        </div>

        {/* Trade Amount Input */}
        <div className="flex flex-col gap-2 font-mono text-[12px]">
          <div className="flex justify-between items-center text-[#8fa8bd] text-[11px]">
            <span>{tradeType === 'buy' ? 'YOU PAY (SOL)' : 'YOU SELL (SOL VALUE)'}</span>
            {walletConnected && (
              <span>Balance: {walletBalanceSol.toFixed(3)} SOL</span>
            )}
          </div>

          <div className="relative flex items-center">
            <input
              type="number"
              step="0.1"
              value={solAmount}
              onChange={(e) => setSolAmount(e.target.value)}
              className="w-full px-4 py-3 bg-[#010810] border-2 border-[#00f5b8]/50 focus:border-[#00f5b8] focus:outline-none rounded-xl text-white font-mono text-[18px] font-bold"
            />
            <span className="absolute right-4 font-mono font-bold text-[#00f5b8]">
              SOL
            </span>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-4 gap-2 pt-1 text-[11px]">
            {['0.1', '0.5', '1.0', '2.5'].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setSolAmount(amt)}
                className="py-1.5 bg-[#010810] hover:bg-[#00f5b8]/15 border border-[#00f5b8]/30 hover:border-[#00f5b8] rounded-lg text-[#8fa8bd] hover:text-[#00f5b8] transition-colors cursor-pointer text-center"
              >
                {amt} SOL
              </button>
            ))}
          </div>

          {/* Token Estimate & Creator Fee Breakdown */}
          <div className="p-3 bg-[#010810] border border-[#00f5b8]/20 rounded-xl flex flex-col gap-2 text-[11px] text-[#8fa8bd] mt-2">
            <div className="flex justify-between items-center">
              <span>Estimated {coin.symbol}:</span>
              <span className="text-white font-bold">~{estimatedTokens.toLocaleString()} tokens</span>
            </div>
            <div className="flex justify-between items-center">
              <span>1.0% Creator Fee Stream:</span>
              <span className="text-[#00f5b8] font-bold">+{creatorCutSol} SOL (${creatorCutUsd})</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-[#475e75]">
              <span>Execution Route:</span>
              <span>pump.fun Bonding Curve Program</span>
            </div>
          </div>
        </div>

        {/* Success Message Banner */}
        {successMessage && (
          <div className="p-3 bg-[#00f5b8]/15 border border-[#00f5b8] rounded-xl text-[#00f5b8] font-mono text-[11px] leading-relaxed animate-in fade-in">
            ✓ {successMessage}
          </div>
        )}

        {/* Action Button */}
        {!walletConnected ? (
          <button
            type="button"
            onClick={connectPhantom}
            className="w-full py-3.5 bg-[#00f5b8] hover:bg-[#5cffd2] text-[#010a12] font-mono text-[12px] font-black uppercase rounded-xl transition-all shadow-[0_8px_20px_rgba(0,245,184,0.35)] cursor-pointer text-center"
          >
            👻 CONNECT PHANTOM TO TRADE
          </button>
        ) : (
          <button
            type="button"
            disabled={isExecuting || parsedSol <= 0}
            onClick={handleSwap}
            className={`w-full py-3.5 font-mono text-[12px] font-black uppercase rounded-xl transition-all text-center flex items-center justify-center gap-2 ${
              isExecuting
                ? 'bg-[#00f5b8]/50 text-[#010a12] cursor-wait'
                : 'bg-[#00f5b8] hover:bg-[#5cffd2] text-[#010a12] shadow-[0_8px_20px_rgba(0,245,184,0.35)] cursor-pointer'
            }`}
          >
            {isExecuting ? (
              <>
                <span className="w-3 h-3 rounded-full border-2 border-[#010a12] border-t-transparent animate-spin"></span>
                <span>Executing on pump.fun...</span>
              </>
            ) : (
              <span>{tradeType === 'buy' ? 'CONFIRM BUY' : 'CONFIRM SELL'} ON PUMP.FUN →</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
