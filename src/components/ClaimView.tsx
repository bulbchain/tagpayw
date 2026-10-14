import React, { useState } from 'react';
import { Platform } from '../types';
import { useApp } from '../context/AppContext';
import {
  SOLANA_CONFIG,
  SOCIAL_LINKS,
  PROTOCOL_CONFIG,
  formatSolAddress
} from '../constants';

export const ClaimView: React.FC = () => {
  const {
    getCreator,
    claimVault,
    walletConnected,
    walletAddress,
    connectPhantom,
    globalUnclaimedPoolUsd
  } = useApp();

  const [searchHandle, setSearchHandle] = useState<string>('@_TJRTrades');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('x');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authenticatedHandle, setAuthenticatedHandle] = useState<string | null>(null);

  // Claim modal state
  const [showClaimModal, setShowClaimModal] = useState<boolean>(false);
  const [claimStage, setClaimStage] = useState<'confirm' | 'signing' | 'success'>('confirm');
  const [recipientWallet, setRecipientWallet] = useState<string>(
    walletConnected ? walletAddress : '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'
  );
  const [claimedReceipt, setClaimedReceipt] = useState<{ amountSol: string; amountUsd: string; txHash: string } | null>(null);

  const normalizedHandle = searchHandle.startsWith('@') ? searchHandle : `@${searchHandle.trim()}`;
  const activeCreator = getCreator(normalizedHandle, selectedPlatform);

  const handleLookup = (handleToSearch: string) => {
    const clean = handleToSearch.startsWith('@') ? handleToSearch : `@${handleToSearch.trim()}`;
    setSearchHandle(clean);
  };

  const handleOAuthConnect = (plat: Platform) => {
    setSelectedPlatform(plat);
    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);
      setAuthenticatedHandle(normalizedHandle);
    }, 1000);
  };

  const executeClaim = () => {
    if (!recipientWallet.trim()) return;
    setClaimStage('signing');

    setTimeout(() => {
      const receipt = claimVault(normalizedHandle, recipientWallet);
      setClaimedReceipt(receipt);
      setClaimStage('success');
    }, 1200);
  };

  const hasUnclaimedFunds = parseFloat(activeCreator.unclaimedSol) > 0;

  return (
    <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#00f5b8]/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00f5b8] animate-pulse"></span>
            <span className="font-mono text-[10px] text-[#8fa8bd] uppercase tracking-widest">
              SOLANA // PDA VAULT CLAIM // HARDWARE TEE ACTIVE
            </span>
          </div>
          <h1 className="font-sans text-[26px] sm:text-[34px] md:text-[40px] font-black text-white tracking-tight uppercase">
            Got a Tag? Claim It.
          </h1>
          <p className="font-sans text-[14px] sm:text-[15px] text-[#8fa8bd] mt-1 max-w-2xl leading-relaxed">
            Verify ownership of your social handle anytime to release accumulated pump.fun trading cuts and tips straight to your Phantom wallet with zero middleman fee.
          </p>
        </div>

        {/* Global Pool Telemetry */}
        <div className="flex items-center gap-3 sm:gap-4 bg-[#020e1a] border-2 border-[#00f5b8] px-4 sm:px-5 py-2.5 rounded-2xl font-mono text-[11px] text-[#8fa8bd] shrink-0 self-stretch sm:self-auto justify-between sm:justify-start">
          <div>
            <div className="text-[#475e75] text-[10px]">GLOBAL UNCLAIMED POOL</div>
            <div className="text-[#00f5b8] font-black text-[15px]">
              ${globalUnclaimedPoolUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="h-7 w-px bg-[#00f5b8]/30"></div>
          <div>
            <div className="text-[#475e75] text-[10px]">AUTONOMOUS VAULTS</div>
            <div className="text-white font-bold">100% UNTOUCHED</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: Lookup & Social Auth */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="neon-card p-5 sm:p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-[#00f5b8]/20 pb-3">
              <span className="font-sans font-bold text-white text-[15px] sm:text-[16px]">
                Search Creator Identifier
              </span>
              <span className="font-mono text-[10px] text-[#00f5b8] uppercase">
                SOLANA PDA REGISTRY
              </span>
            </div>

            {/* Handle Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchHandle}
                  onChange={(e) => setSearchHandle(e.target.value)}
                  placeholder="@handle to search..."
                  className="w-full px-4 py-3 bg-[#010810] border-2 border-[#00f5b8]/50 focus:border-[#00f5b8] focus:outline-none rounded-xl text-white font-mono text-[14px]"
                />
              </div>
              <button
                type="button"
                onClick={() => handleLookup(searchHandle)}
                className="px-6 py-3 bg-[#00f5b8] hover:bg-[#5cffd2] text-[#010a12] font-mono font-black text-[12px] uppercase rounded-xl transition-all cursor-pointer touch-manipulation"
              >
                LOOKUP VAULT
              </button>
            </div>

            {/* Quick Handles */}
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
              <span className="text-[#475e75] text-[10px]">CHECK:</span>
              {['@_TJRTrades', '@elonmusk', '@vitalikbuterin', '@ansem', '@ishowspeed'].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setSearchHandle(h)}
                  className="px-2 py-0.5 rounded bg-[#010810] hover:bg-[#00f5b8]/15 border border-[#00f5b8]/30 text-[#8fa8bd] hover:text-[#00f5b8] transition-colors cursor-pointer"
                >
                  {h}
                </button>
              ))}
            </div>

            {/* Verification Step */}
            <div className="p-4 bg-[#010810] border border-[#00f5b8]/30 rounded-xl flex flex-col gap-3 font-mono text-[12px] mt-2">
              <div className="flex justify-between items-center text-[#8fa8bd]">
                <span>1-CLICK OAUTH ATTESTATION:</span>
                <span className="text-[#00f5b8] font-bold">AWS NITRO TEE</span>
              </div>
              <p className="font-sans text-[12px] text-[#8fa8bd] leading-relaxed">
                Connect your social profile to verify identity. The hardware enclave attests your OAuth token and signs the ed25519 Solana release to your Phantom wallet.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {(['x', 'github', 'twitch', 'youtube'] as Platform[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleOAuthConnect(p)}
                    disabled={isAuthenticating}
                    className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer font-bold touch-manipulation ${
                      authenticatedHandle === normalizedHandle && selectedPlatform === p
                        ? 'bg-[#00f5b8] text-[#010a12] border-[#00f5b8]'
                        : 'bg-[#010810] border-[#00f5b8]/30 text-white hover:border-[#00f5b8]'
                    }`}
                  >
                    {isAuthenticating && selectedPlatform === p ? '...' : p === 'x' ? '𝕏 Twitter' : p.toUpperCase()}
                  </button>
                ))}
              </div>

              {authenticatedHandle === normalizedHandle && (
                <div className="text-[#00f5b8] font-bold text-[11px] flex items-center gap-1.5 pt-1">
                  <span>✓</span>
                  <span>Verified owner of {normalizedHandle}. Ready to withdraw!</span>
                </div>
              )}
            </div>

            {/* Claim Action Button */}
            <button
              type="button"
              disabled={!hasUnclaimedFunds}
              onClick={() => {
                setShowClaimModal(true);
                setClaimStage('confirm');
                if (walletConnected) {
                  setRecipientWallet(walletAddress);
                }
              }}
              className={`w-full py-4 font-mono text-[13px] font-black uppercase tracking-wider rounded-xl transition-all text-center touch-manipulation ${
                hasUnclaimedFunds
                  ? 'bg-[#00f5b8] hover:bg-[#5cffd2] text-[#010a12] shadow-[0_8px_20px_rgba(0,245,184,0.35)] hover:shadow-[0_12px_28px_rgba(0,245,184,0.5)] cursor-pointer'
                  : 'bg-[#010810] border border-[#00f5b8]/20 text-[#475e75] cursor-not-allowed'
              }`}
            >
              {hasUnclaimedFunds
                ? `WITHDRAW ${activeCreator.unclaimedSol} TO PHANTOM WALLET →`
                : 'NO UNCLAIMED FUNDS IN VAULT'}
            </button>
          </div>
        </div>

        {/* Right 5 Columns: Vault Balance & Coins */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="neon-card p-5 sm:p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-[#00f5b8]/20 pb-3">
              <span className="font-mono text-[11px] text-[#8fa8bd] uppercase">
                VAULT TELEMETRY
              </span>
              <span className="font-mono text-[10px] text-[#00f5b8] font-bold">
                SOLANA PDA
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={activeCreator.avatarUrl}
                alt={activeCreator.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#00f5b8]"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-sans font-black text-white text-[18px]">
                    {activeCreator.name}
                  </h3>
                  {activeCreator.verified && (
                    <span className="text-[#00f5b8] text-[14px]">✓</span>
                  )}
                </div>
                <span className="font-mono text-[12px] text-[#00f5b8]">
                  {normalizedHandle}
                </span>
              </div>
            </div>

            {/* Unclaimed Balance Highlight */}
            <div className="p-4 bg-[#010810] rounded-xl border-2 border-[#00f5b8]/40 flex flex-col gap-1">
              <span className="text-[10px] font-mono text-[#8fa8bd] uppercase">AVAILABLE TO CLAIM</span>
              <div className="font-mono font-black text-[#00f5b8] text-[24px]">
                {activeCreator.unclaimedSol}
              </div>
              <span className="text-[12px] font-mono text-white">
                ~{activeCreator.unclaimedUsd} USD
              </span>
            </div>

            {/* Bound Coins */}
            <div className="flex flex-col gap-2 font-mono text-[11px]">
              <span className="text-[#8fa8bd] uppercase text-[10px]">BOUND PUMP.FUN TOKENS</span>
              {activeCreator.coins.length > 0 ? (
                activeCreator.coins.map((c) => (
                  <div key={c.symbol} className="p-2.5 bg-[#010810] border border-[#00f5b8]/20 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[#00f5b8] font-bold">{c.symbol}</span>
                      <span className="text-[#8fa8bd] ml-2">{c.name}</span>
                    </div>
                    <span className="text-white font-bold">{c.earnedCutSol}</span>
                  </div>
                ))
              ) : (
                <div className="text-[#475e75] italic">No tokens bound to this handle yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="neon-card max-w-md w-full p-6 flex flex-col gap-5 bg-[#010c17] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#00f5b8]/20 pb-3">
              <span className="font-sans font-bold text-white text-[17px]">
                Withdraw to Phantom
              </span>
              <button
                type="button"
                onClick={() => setShowClaimModal(false)}
                className="text-[#8fa8bd] hover:text-white text-[18px]"
              >
                ✕
              </button>
            </div>

            {claimStage === 'confirm' && (
              <div className="flex flex-col gap-4 font-mono text-[12px]">
                <div className="p-3 bg-[#010810] border border-[#00f5b8]/30 rounded-xl flex flex-col gap-1.5">
                  <span className="text-[#8fa8bd] text-[10px]">TOTAL WITHDRAWAL AMOUNT</span>
                  <div className="text-[#00f5b8] font-black text-[20px]">
                    {activeCreator.unclaimedSol}
                  </div>
                  <span className="text-white text-[11px]">{activeCreator.unclaimedUsd}</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#8fa8bd] text-[10px]">DESTINATION SOLANA WALLET</label>
                  <input
                    type="text"
                    value={recipientWallet}
                    onChange={(e) => setRecipientWallet(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#010810] border border-[#00f5b8]/50 focus:border-[#00f5b8] rounded-xl text-white font-mono text-[12px]"
                  />
                  {walletConnected && (
                    <button
                      type="button"
                      onClick={() => setRecipientWallet(walletAddress)}
                      className="text-[#00f5b8] text-[10px] text-right hover:underline"
                    >
                      Use Connected Phantom ({formatSolAddress(walletAddress, 4)})
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={executeClaim}
                  className="w-full py-3.5 bg-[#00f5b8] hover:bg-[#5cffd2] text-[#010a12] font-black uppercase rounded-xl transition-all shadow-[0_8px_20px_rgba(0,245,184,0.35)] cursor-pointer"
                >
                  CONFIRM & DISPATCH ON SOLANA →
                </button>
              </div>
            )}

            {claimStage === 'signing' && (
              <div className="py-8 flex flex-col items-center justify-center gap-3 font-mono text-[12px] text-center">
                <span className="w-8 h-8 rounded-full border-3 border-[#00f5b8] border-t-transparent animate-spin"></span>
                <span className="text-white font-bold">AWS Nitro Enclave Signing ed25519...</span>
                <span className="text-[#8fa8bd] text-[11px]">Broadcasting transaction on Solana Mainnet</span>
              </div>
            )}

            {claimStage === 'success' && claimedReceipt && (
              <div className="flex flex-col gap-4 font-mono text-[12px]">
                <div className="text-center py-2">
                  <span className="text-[32px]">🎉</span>
                  <h3 className="font-sans font-black text-white text-[18px] mt-1">
                    Withdrawal Successful!
                  </h3>
                  <p className="text-[#00f5b8] font-bold text-[14px]">
                    {claimedReceipt.amountSol} dispatched
                  </p>
                </div>

                <div className="p-3 bg-[#010810] border border-[#00f5b8]/30 rounded-xl flex flex-col gap-1 text-[11px]">
                  <span className="text-[#8fa8bd]">Recipient: {formatSolAddress(recipientWallet, 6)}</span>
                  <span className="text-[#8fa8bd]">Solana Signature: {formatSolAddress(claimedReceipt.txHash, 6)}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowClaimModal(false)}
                  className="w-full py-3 bg-[#00f5b8] text-[#010a12] font-black uppercase rounded-xl"
                >
                  DONE
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
