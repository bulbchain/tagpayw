import React, { useState } from 'react';
import { Platform, AssetOption, DirectSend } from '../types';
import { CRYPTO_ASSETS, STOCK_ASSETS } from '../data/mockData';
import { useApp } from '../context/AppContext';
import {
  SOLANA_CONFIG,
  PROTOCOL_CONFIG,
  SOCIAL_LINKS,
  formatSolAddress
} from '../constants';

interface SendViewProps {
  initialRecipient?: string;
}

export const SendView: React.FC<SendViewProps> = ({ initialRecipient = '@elonmusk' }) => {
  const {
    sendDirect,
    directSends,
    walletConnected,
    walletBalanceSol,
    connectPhantom,
    latestMempoolTxId,
    currentSolanaSlot,
    isMempoolStreaming,
    toggleMempoolStream
  } = useApp();
  const [platform, setPlatform] = useState<Platform>('x');
  const [recipientInput, setRecipientInput] = useState<string>(
    initialRecipient.startsWith('@') ? initialRecipient.slice(1) : initialRecipient
  );
  const [assetType, setAssetType] = useState<'crypto' | 'stock'>('crypto');
  const [selectedAsset, setSelectedAsset] = useState<AssetOption>(CRYPTO_ASSETS[0]);
  const [amount, setAmount] = useState<string>('0.05');
  const [memo, setMemo] = useState<string>('Creator tip via TagPay on Solana');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccessReceipt, setSendSuccessReceipt] = useState<DirectSend | null>(null);

  const parsedAmount = parseFloat(amount) || 0;
  const usdValue = (parsedAmount * selectedAsset.price).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  const normalizedRecipient = `@${recipientInput.trim()}`;

  const handleSend = () => {
    if (!recipientInput.trim() || parsedAmount <= 0) return;
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      const receipt = sendDirect({
        recipientHandle: normalizedRecipient,
        asset: selectedAsset.symbol,
        amount,
        assetType,
        memo: memo || 'Instant value routing via TagPay on Solana'
      });
      setSendSuccessReceipt(receipt);
    }, 1000);
  };

  return (
    <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10">
      {/* Top Telemetry Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#00f5b8]/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00f5b8] animate-ping"></span>
            <span className="font-mono text-[10px] text-[#8fa8bd] uppercase tracking-widest">
              SOLANA // NON-CUSTODIAL ATOMIC DISPATCH // ~400MS FINALITY
            </span>
          </div>
          <h1 className="font-sans text-[26px] sm:text-[34px] md:text-[40px] font-black text-white tracking-tight uppercase">
            Just Send Someone
          </h1>
          <p className="font-sans text-[14px] sm:text-[15px] text-[#8fa8bd] mt-1 max-w-2xl leading-relaxed">
            Send SOL, USDC, or tokenized stocks straight to any social handle on Solana. Funds deposit straight into their deterministic PDA vault.
          </p>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 bg-[#020e1a] border-2 border-[#00f5b8] px-4 sm:px-5 py-2.5 rounded-2xl font-mono text-[11px] text-[#8fa8bd] shrink-0 self-stretch sm:self-auto justify-between sm:justify-start">
          <div>
            <div className="text-[#475e75] text-[10px]">SETTLEMENT SPEED</div>
            <div className="text-[#00f5b8] font-bold">~400ms [Solana]</div>
          </div>
          <div className="h-6 w-px bg-[#00f5b8]/30"></div>
          <div>
            <div className="text-[#475e75] text-[10px]">PROTOCOL CUT</div>
            <div className="text-white font-bold">0.00% ZERO</div>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: Send Configuration */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="neon-card p-5 sm:p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-[#00f5b8]/20 pb-3">
              <span className="font-sans font-bold text-white text-[15px] sm:text-[16px]">
                Recipient & Asset Selection
              </span>
              <span className="font-mono text-[10px] text-[#00f5b8] uppercase">
                ZERO ESCROW HOLD
              </span>
            </div>

            {/* Platform Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
              {(['x', 'github', 'twitch', 'youtube'] as Platform[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer font-bold touch-manipulation ${
                    platform === p
                      ? 'bg-[#00f5b8] text-[#010a12] border-[#00f5b8] shadow-[0_0_12px_rgba(0,245,184,0.3)]'
                      : 'bg-[#010810] border-[#00f5b8]/30 text-[#8fa8bd] hover:text-white'
                  }`}
                >
                  {p === 'x' ? '𝕏 Twitter' : p.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Recipient Handle Input */}
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[11px] text-[#8fa8bd] flex justify-between">
                <span>RECIPIENT SOCIAL IDENTIFIER</span>
                <span className="text-[#00f5b8]">Deterministic Solana PDA</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 font-mono font-bold text-[#00f5b8] text-[16px]">
                  @
                </span>
                <input
                  type="text"
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value.replace('@', ''))}
                  placeholder="elonmusk, toly, ansem..."
                  className="w-full pl-9 pr-4 py-3 bg-[#010810] border-2 border-[#00f5b8]/50 focus:border-[#00f5b8] focus:outline-none rounded-xl text-white font-mono text-[14px]"
                />
              </div>
            </div>

            {/* Asset Type Selector: Crypto (SOL/USDC) vs Stocks */}
            <div className="flex flex-col gap-3 pt-1">
              <div className="flex items-center justify-between">
                <label className="font-mono text-[11px] text-[#8fa8bd]">ASSET CATEGORY</label>
                <div className="flex items-center gap-1 font-mono text-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      setAssetType('crypto');
                      setSelectedAsset(CRYPTO_ASSETS[0]);
                    }}
                    className={`px-3 py-1 rounded-lg border font-bold cursor-pointer transition-colors ${
                      assetType === 'crypto'
                        ? 'bg-[#00f5b8] text-[#010a12] border-[#00f5b8]'
                        : 'bg-[#010810] border-[#00f5b8]/30 text-[#8fa8bd]'
                    }`}
                  >
                    SOLANA ASSETS
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAssetType('stock');
                      setSelectedAsset(STOCK_ASSETS[0]);
                    }}
                    className={`px-3 py-1 rounded-lg border font-bold cursor-pointer transition-colors ${
                      assetType === 'stock'
                        ? 'bg-[#00f5b8] text-[#010a12] border-[#00f5b8]'
                        : 'bg-[#010810] border-[#00f5b8]/30 text-[#8fa8bd]'
                    }`}
                  >
                    TOKENIZED STOCKS
                  </button>
                </div>
              </div>

              {/* Asset Chips Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[12px]">
                {(assetType === 'crypto' ? CRYPTO_ASSETS : STOCK_ASSETS).map((asset) => (
                  <button
                    key={asset.symbol}
                    type="button"
                    onClick={() => setSelectedAsset(asset)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 text-center transition-all cursor-pointer touch-manipulation ${
                      selectedAsset.symbol === asset.symbol
                        ? 'bg-[#00f5b8] text-[#010a12] border-[#00f5b8] shadow-[0_0_12px_rgba(0,245,184,0.3)]'
                        : 'bg-[#010810] border-[#00f5b8]/30 text-white hover:border-[#00f5b8]/60'
                    }`}
                  >
                    <span className="text-[18px]">{asset.badge}</span>
                    <span className="font-bold text-[13px]">{asset.symbol}</span>
                    <span className={`text-[10px] ${selectedAsset.symbol === asset.symbol ? 'text-[#010a12]' : 'text-[#8fa8bd]'}`}>
                      ${asset.price.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex justify-between items-center font-mono text-[11px] text-[#8fa8bd]">
                <span>AMOUNT TO SEND</span>
                {walletConnected && (
                  <span>Available: {walletBalanceSol.toFixed(3)} SOL</span>
                )}
              </div>
              <div className="relative flex items-center">
                <input
                  type="number"
                  step="0.1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-[#010810] border-2 border-[#00f5b8]/50 focus:border-[#00f5b8] focus:outline-none rounded-xl text-white font-mono text-[18px] font-bold"
                />
                <span className="absolute right-4 font-mono font-bold text-[#00f5b8] text-[14px]">
                  {selectedAsset.symbol} (~{usdValue})
                </span>
              </div>

              {/* Quick Amount Chips */}
              <div className="flex items-center gap-2 pt-1 font-mono text-[11px]">
                {(selectedAsset.symbol === 'ETH'
                  ? ['0.01', '0.025', '0.05', '0.1']
                  : selectedAsset.symbol === 'USDC'
                  ? ['2.5', '5.0', '10.0', '25.0']
                  : ['0.02', '0.05', '0.1', '0.25']
                ).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className="flex-1 py-1.5 rounded-lg bg-[#010810] border border-[#00f5b8]/30 hover:border-[#00f5b8] text-[#8fa8bd] hover:text-[#00f5b8] transition-colors cursor-pointer text-center"
                  >
                    {preset} {selectedAsset.symbol}
                  </button>
                ))}
              </div>
            </div>

            {/* Memo Input */}
            <div className="flex flex-col gap-1.5 pt-1">
              <label className="font-mono text-[11px] text-[#8fa8bd]">ON-CHAIN MEMO</label>
              <input
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="Optional message..."
                className="w-full px-4 py-2.5 bg-[#010810] border border-[#00f5b8]/40 focus:border-[#00f5b8] focus:outline-none rounded-xl text-white font-mono text-[13px]"
              />
            </div>

            {/* Submit Send Button */}
            {!walletConnected ? (
              <button
                type="button"
                onClick={connectPhantom}
                className="w-full py-4 bg-[#00f5b8] hover:bg-[#5cffd2] text-[#010a12] font-mono text-[13px] font-black uppercase tracking-wider rounded-xl transition-all shadow-[0_8px_20px_rgba(0,245,184,0.35)] hover:shadow-[0_12px_28px_rgba(0,245,184,0.5)] cursor-pointer text-center flex items-center justify-center gap-2 touch-manipulation"
              >
                <span>👻 CONNECT PHANTOM TO SEND</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={isSending || !recipientInput.trim() || parsedAmount <= 0}
                onClick={handleSend}
                className={`w-full py-4 font-mono text-[13px] font-black uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-2 touch-manipulation ${
                  isSending
                    ? 'bg-[#00f5b8]/50 text-[#010a12] cursor-wait'
                    : 'bg-[#00f5b8] hover:bg-[#5cffd2] text-[#010a12] shadow-[0_8px_20px_rgba(0,245,184,0.35)] hover:shadow-[0_12px_28px_rgba(0,245,184,0.5)] cursor-pointer'
                }`}
              >
                {isSending ? (
                  <>
                    <span className="w-3 h-3 rounded-full border-2 border-[#010a12] border-t-transparent animate-spin"></span>
                    <span>Broadcasting via Solana RPC...</span>
                  </>
                ) : (
                  <>
                    <span>SEND {amount} {selectedAsset.symbol} TO {normalizedRecipient}</span>
                    <span>→</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Success Receipt */}
          {sendSuccessReceipt && (
            <div className="neon-card p-5 sm:p-6 bg-gradient-to-b from-[#00f5b8]/10 to-[#010c17] border-2 border-[#00f5b8] flex flex-col gap-3 font-mono text-[12px] animate-in fade-in">
              <div className="flex items-center justify-between border-b border-[#00f5b8]/30 pb-2">
                <span className="text-[#00f5b8] font-bold text-[14px]">✓ Sent on Solana</span>
                <span className="text-[#8fa8bd]">{sendSuccessReceipt.slotNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8fa8bd]">Recipient:</span>
                <span className="text-white font-bold">{sendSuccessReceipt.recipientHandle}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8fa8bd]">Amount:</span>
                <span className="text-[#00f5b8] font-black text-[14px]">
                  {sendSuccessReceipt.amount} {sendSuccessReceipt.asset} ({sendSuccessReceipt.usdValue})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8fa8bd]">Solana Signature:</span>
                <span className="text-white select-all">{formatSolAddress(sendSuccessReceipt.txHash || '', 8)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right 5 Columns: Recent Sends & Animated Solana Mempool */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="neon-card p-5 sm:p-6 flex flex-col gap-4">
            {/* Mempool Header */}
            <div className="flex items-center justify-between border-b border-[#00f5b8]/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f5b8] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00f5b8]"></span>
                </span>
                <span className="font-mono text-[11px] text-white font-black tracking-wider uppercase">
                  SOLANA TRANSACTION MEMPOOL
                </span>
              </div>
              <button
                type="button"
                onClick={toggleMempoolStream}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00f5b8]/10 border border-[#00f5b8]/30 hover:bg-[#00f5b8]/20 text-[#00f5b8] font-mono text-[10px] font-bold transition-all cursor-pointer"
                title={isMempoolStreaming ? 'Click to pause stream' : 'Click to resume stream'}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isMempoolStreaming ? 'bg-[#00f5b8] animate-pulse' : 'bg-[#8fa8bd]'}`}></span>
                <span>{isMempoolStreaming ? 'LIVE' : 'PAUSED'}</span>
              </button>
            </div>

            {/* Live Mempool Stats Strip */}
            <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#010810] border border-[#00f5b8]/20 rounded-xl font-mono text-[10px]">
              <div className="flex flex-col">
                <span className="text-[#8fa8bd] uppercase text-[9px]">LATEST BLOCK SLOT</span>
                <span className="text-white font-bold text-[12px] flex items-center gap-1">
                  <span className="text-[#00f5b8]">#{currentSolanaSlot.toLocaleString()}</span>
                  <span className="text-[9px] text-[#00f5b8] animate-pulse">●</span>
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[#8fa8bd] uppercase text-[9px]">SPEED & FINALITY</span>
                <span className="text-[#00f5b8] font-bold text-[12px]">
                  ~2,480 TPS <span className="text-white text-[10px] font-normal">· 400ms</span>
                </span>
              </div>
            </div>

            {/* Stream Transactions */}
            <div className="flex flex-col gap-2.5 max-h-[480px] overflow-y-auto pr-0.5">
              {directSends.slice(0, 7).map((tx) => {
                const isNew = tx.id === latestMempoolTxId;
                return (
                  <div
                    key={tx.id}
                    className={`p-3 rounded-xl border flex items-center justify-between font-mono text-[11px] transition-all duration-500 ${
                      isNew
                        ? 'bg-[#00f5b8]/15 border-[#00f5b8] shadow-[0_0_18px_rgba(0,245,184,0.4)] scale-[1.01]'
                        : 'bg-[#010810] border-[#00f5b8]/20 hover:border-[#00f5b8]/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Asset Badge */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[13px] border shrink-0 ${
                        tx.asset === 'SOL'
                          ? 'bg-[#00f5b8]/10 text-[#00f5b8] border-[#00f5b8]/40'
                          : tx.asset === 'ETH'
                          ? 'bg-[#627eea]/15 text-[#8fa8bd] border-[#627eea]/50'
                          : tx.asset === 'USDC'
                          ? 'bg-[#2775ca]/15 text-[#00f5b8] border-[#2775ca]/50'
                          : 'bg-[#010810] text-[#8fa8bd] border-[#00f5b8]/30'
                      }`}>
                        {tx.asset === 'SOL' ? '◎' : tx.asset === 'ETH' ? 'Ξ' : tx.asset === 'USDC' ? '$' : '🏷'}
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-white">
                          <span className="text-[#8fa8bd]">{tx.senderHandle}</span>
                          <span className="text-[#00f5b8] font-bold">→</span>
                          <span className="font-bold text-white">{tx.recipientHandle}</span>
                          {isNew && (
                            <span className="px-1.5 py-0.2 rounded bg-[#00f5b8] text-[#010a12] font-black text-[9px] uppercase tracking-wide animate-pulse">
                              LIVE
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-[#8fa8bd] mt-0.5">
                          <span className={isNew ? 'text-[#00f5b8] font-bold' : ''}>{tx.timeAgo}</span>
                          <span>·</span>
                          <span className="text-[#475e75]">{tx.slotNumber}</span>
                          {tx.memo && (
                            <>
                              <span>·</span>
                              <span className="text-[#8fa8bd] truncate max-w-[110px]">"{tx.memo}"</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 pl-2">
                      <span className="text-[#00f5b8] font-black text-[12px]">
                        {tx.amount} {tx.asset}
                      </span>
                      <span className="text-[10px] text-[#8fa8bd]">{tx.usdValue}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Status ticker */}
            <div className="pt-1 flex items-center justify-between font-mono text-[10px] text-[#8fa8bd] border-t border-[#00f5b8]/15">
              <span>Atomic Non-Custodial Routing</span>
              <span className="text-[#00f5b8] font-bold">0% Protocol Extraction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
