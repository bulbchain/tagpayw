import React, { useState, useEffect } from 'react';
import { Platform, CoinLaunch } from '../types';
import { useApp } from '../context/AppContext';
import {
  CONTRACT_ADDRESSES,
  SOCIAL_LINKS,
  PROTOCOL_CONFIG,
  formatSolAddress
} from '../constants';

interface TagCoinViewProps {
  initialHandle?: string;
  onSuccessComplete?: () => void;
}

export const TagCoinView: React.FC<TagCoinViewProps> = ({
  initialHandle = '@elonmusk',
  onSuccessComplete
}) => {
  const { launchCoin, getCreator, walletConnected, connectPhantom, setActiveTab } = useApp();
  const [platform, setPlatform] = useState<Platform>('x');
  const [handleInput, setHandleInput] = useState<string>(
    initialHandle.startsWith('@') ? initialHandle.slice(1) : initialHandle
  );
  const [coinName, setCoinName] = useState<string>('Musk Protocol');
  const [ticker, setTicker] = useState<string>('$MUSK');
  const [liquidityPair, setLiquidityPair] = useState<'SOL' | 'USDC'>('SOL');
  const [attachGenesisTip, setAttachGenesisTip] = useState<boolean>(false);
  const [genesisTipAmount, setGenesisTipAmount] = useState<string>('0.5');
  const [genesisMemo, setGenesisMemo] = useState<string>('Genesis Block pump.fun launch 🚀');

  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deployStep, setDeployStep] = useState<string>('');
  const [deployedCoin, setDeployedCoin] = useState<CoinLaunch | null>(null);
  const [liveRevenueCounter, setLiveRevenueCounter] = useState<number>(14.85);

  // Auto-sync ticker and name when handle input changes
  useEffect(() => {
    if (handleInput.trim()) {
      const clean = handleInput.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      const suggestedTicker = clean.length > 5 ? `$${clean.slice(0, 5)}` : `$${clean}`;
      setTicker(suggestedTicker);
      const capitalized = handleInput.charAt(0).toUpperCase() + handleInput.slice(1);
      setCoinName(`${capitalized} Protocol`);
    }
  }, [handleInput]);

  // Live revenue ticking simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveRevenueCounter((prev) => +(prev + 0.005).toFixed(3));
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const normalizedHandle = `@${handleInput.trim()}`;
  const matchedCreator = getCreator(normalizedHandle, platform);

  const handleLaunch = () => {
    if (!handleInput.trim()) return;
    setIsDeploying(true);
    setDeployStep('1/3 Creating SPL Token Mint on pump.fun bonding curve...');

    setTimeout(() => {
      setDeployStep(`2/3 Binding 100% creator fee router to Solana PDA for ${normalizedHandle}...`);
      setTimeout(() => {
        setDeployStep('3/3 Broadcasting transaction to Solana Mainnet & seeding pump.fun curve...');
        setTimeout(() => {
          setIsDeploying(false);
          const result = launchCoin({
            symbol: ticker.startsWith('$') ? ticker : `$${ticker}`,
            name: coinName || `${ticker} Protocol`,
            creatorHandle: normalizedHandle,
            pair: liquidityPair,
            genesisTip: attachGenesisTip && parseFloat(genesisTipAmount) > 0
              ? { amount: genesisTipAmount, memo: genesisMemo }
              : undefined
          });
          setDeployedCoin(result);
        }, 850);
      }, 850);
    }, 750);
  };

  return (
    <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10">
      {/* Top Protocol Telemetry Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#00f5b8]/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00f5b8] animate-pulse"></span>
            <span className="font-mono text-[10px] text-[#8fa8bd] uppercase tracking-widest">
              SOLANA // PUMP.FUN LAUNCHPAD // 100% CREATOR FEE LOCK
            </span>
          </div>
          <h1 className="font-sans text-[26px] sm:text-[34px] md:text-[40px] font-black text-white tracking-tight uppercase">
            Tag a coin on pump.fun
          </h1>
          <p className="font-sans text-[14px] sm:text-[15px] text-[#8fa8bd] mt-1 max-w-2xl leading-relaxed">
            Deploy an SPL token on Solana directly to the <strong className="text-white">pump.fun</strong> bonding curve, permanently bound to any creator's handle. 100% of creator fees route autonomously into their non-custodial Solana PDA vault.
          </p>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 bg-[#020e1a] border-2 border-[#00f5b8] px-4 sm:px-5 py-2.5 rounded-2xl font-mono text-[11px] text-[#8fa8bd] shrink-0 self-stretch sm:self-auto justify-between sm:justify-start">
          <div>
            <div className="text-[#475e75] text-[10px]">PUMP.FUN FEE</div>
            <div className="text-white font-bold">{PROTOCOL_CONFIG.PUMP_FUN_LAUNCH_FEE_SOL} SOL (~$3.69)</div>
          </div>
          <div className="h-6 w-px bg-[#00f5b8]/30"></div>
          <div>
            <div className="text-[#475e75] text-[10px]">CREATOR CUT</div>
            <div className="text-[#00f5b8] font-bold">100% LOCKED</div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Workflow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: Step-by-Step Creator Configuration */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Step 01: Social Identifier */}
          <div className="neon-card p-5 sm:p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-[#00f5b8]/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] bg-[#00f5b8] text-[#010a12] font-black px-2 py-0.5 rounded">
                  STEP 01
                </span>
                <span className="font-sans font-bold text-white text-[15px] sm:text-[16px]">
                  Target Social Identifier
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#00f5b8] uppercase tracking-wider">
                SOLANA PDA BINDING
              </span>
            </div>

            {/* Platform Selection Tabs */}
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

            {/* Handle Input */}
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[11px] text-[#8fa8bd] flex justify-between">
                <span>CREATOR HANDLE</span>
                <span className="text-[#00f5b8]">Deterministic Address Ready</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 font-mono font-bold text-[#00f5b8] text-[16px]">
                  @
                </span>
                <input
                  type="text"
                  value={handleInput}
                  onChange={(e) => setHandleInput(e.target.value.replace('@', ''))}
                  placeholder="elonmusk, toly, ansem..."
                  className="w-full pl-9 pr-4 py-3 bg-[#010810] border-2 border-[#00f5b8]/50 focus:border-[#00f5b8] focus:outline-none rounded-xl text-white font-mono text-[14px] transition-all"
                />
              </div>
            </div>

            {/* Quick Suggestions Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="font-mono text-[10px] text-[#475e75]">POPULAR:</span>
              {['elonmusk', 'toly', 'vitalikbuterin', 'ansem', '_TJRTrades'].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHandleInput(h)}
                  className="px-2 py-0.5 rounded bg-[#010810] hover:bg-[#00f5b8]/15 border border-[#00f5b8]/20 font-mono text-[10px] text-[#8fa8bd] hover:text-[#00f5b8] transition-colors cursor-pointer"
                >
                  @{h}
                </button>
              ))}
            </div>
          </div>

          {/* Step 02: Token Parameters on pump.fun */}
          <div className="neon-card p-5 sm:p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-[#00f5b8]/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] bg-[#00f5b8] text-[#010a12] font-black px-2 py-0.5 rounded">
                  STEP 02
                </span>
                <span className="font-sans font-bold text-white text-[15px] sm:text-[16px]">
                  Token Parameters on pump.fun
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#8fa8bd] uppercase">
                1B FIXED SUPPLY
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[11px] text-[#8fa8bd]">TOKEN NAME</label>
                <input
                  type="text"
                  value={coinName}
                  onChange={(e) => setCoinName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#010810] border-2 border-[#00f5b8]/40 focus:border-[#00f5b8] focus:outline-none rounded-xl text-white font-mono text-[13px]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[11px] text-[#8fa8bd]">TICKER SYMBOL</label>
                <input
                  type="text"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2.5 bg-[#010810] border-2 border-[#00f5b8]/40 focus:border-[#00f5b8] focus:outline-none rounded-xl text-white font-mono text-[13px]"
                />
              </div>
            </div>

            {/* Bonding Pair & Standard Specs */}
            <div className="p-3.5 bg-[#010810] border border-[#00f5b8]/20 rounded-xl flex flex-col gap-2 font-mono text-[11px]">
              <div className="flex justify-between items-center text-[#8fa8bd]">
                <span>BONDING CURVE PAIR:</span>
                <span className="text-[#00f5b8] font-bold">SOL (Standard pump.fun curve)</span>
              </div>
              <div className="flex justify-between items-center text-[#8fa8bd]">
                <span>TOTAL SUPPLY:</span>
                <span className="text-white font-bold">{PROTOCOL_CONFIG.TOTAL_SUPPLY} TOKENS</span>
              </div>
              <div className="flex justify-between items-center text-[#8fa8bd]">
                <span>RAYDIUM GRADUATION TARGET:</span>
                <span className="text-white font-bold">~{PROTOCOL_CONFIG.BONDING_CURVE_GRADUATION_SOL} SOL ($69,000 MCap)</span>
              </div>
            </div>
          </div>

          {/* Step 03: Genesis SOL Tip (Optional) */}
          <div className="neon-card p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#00f5b8]/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] bg-[#00f5b8] text-[#010a12] font-black px-2 py-0.5 rounded">
                  STEP 03
                </span>
                <span className="font-sans font-bold text-white text-[15px] sm:text-[16px]">
                  Attach Genesis Tip (Optional)
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={attachGenesisTip}
                  onChange={(e) => setAttachGenesisTip(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[#010810] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#8fa8bd] peer-checked:after:bg-[#010a12] peer-checked:bg-[#00f5b8] after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
              </label>
            </div>

            {attachGenesisTip && (
              <div className="flex flex-col gap-3 font-mono text-[12px] pt-1">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-[10px] text-[#8fa8bd] mb-1 block">TIP AMOUNT (SOL)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={genesisTipAmount}
                      onChange={(e) => setGenesisTipAmount(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#010810] border border-[#00f5b8]/40 focus:border-[#00f5b8] rounded-xl text-white font-bold"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-[#8fa8bd] mb-1 block">TRANSACTION MEMO</label>
                    <input
                      type="text"
                      value={genesisMemo}
                      onChange={(e) => setGenesisMemo(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#010810] border border-[#00f5b8]/40 focus:border-[#00f5b8] rounded-xl text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Launch Action Button */}
          {!walletConnected ? (
            <button
              type="button"
              onClick={connectPhantom}
              className="w-full py-4 bg-[#00f5b8] hover:bg-[#5cffd2] text-[#010a12] font-mono text-[13px] font-black uppercase tracking-wider rounded-xl transition-all shadow-[0_8px_20px_rgba(0,245,184,0.35)] hover:shadow-[0_12px_28px_rgba(0,245,184,0.5)] cursor-pointer text-center flex items-center justify-center gap-2 touch-manipulation"
            >
              <span>👻 CONNECT PHANTOM WALLET TO LAUNCH</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={isDeploying || !handleInput.trim()}
              onClick={handleLaunch}
              className={`w-full py-4 font-mono text-[13px] font-black uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-2 touch-manipulation ${
                isDeploying
                  ? 'bg-[#00f5b8]/50 text-[#010a12] cursor-wait'
                  : 'bg-[#00f5b8] hover:bg-[#5cffd2] text-[#010a12] shadow-[0_8px_20px_rgba(0,245,184,0.35)] hover:shadow-[0_12px_28px_rgba(0,245,184,0.5)] cursor-pointer'
              }`}
            >
              {isDeploying ? (
                <>
                  <span className="w-3 h-3 rounded-full border-2 border-[#010a12] border-t-transparent animate-spin"></span>
                  <span>{deployStep}</span>
                </>
              ) : (
                <>
                  <span>DEPLOY {ticker} ON PUMP.FUN</span>
                  <span>→</span>
                </>
              )}
            </button>
          )}

          {/* Deployed Success Card */}
          {deployedCoin && (
            <div className="neon-card p-6 bg-gradient-to-b from-[#00f5b8]/10 to-[#010c17] border-2 border-[#00f5b8] flex flex-col gap-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[#00f5b8]/30 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#00f5b8] animate-ping"></span>
                  <span className="font-sans font-black text-white text-[18px]">
                    {deployedCoin.symbol} Live on pump.fun!
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[#00f5b8] font-bold">
                  BONDING ACTIVE ✓
                </span>
              </div>

              <div className="p-3 bg-[#010810] border border-[#00f5b8]/30 rounded-xl font-mono text-[12px] flex flex-col gap-1.5">
                <span className="text-[10px] text-[#8fa8bd] uppercase">Solana SPL Token Mint Address</span>
                <span className="text-[#00f5b8] font-bold break-all select-all">
                  {deployedCoin.contractAddress}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <a
                  href={deployedCoin.pumpFunUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-[#00f5b8] hover:bg-[#5cffd2] text-[#010a12] font-mono text-[12px] font-black uppercase rounded-xl text-center flex items-center justify-center gap-1.5"
                >
                  <span>Trade on pump.fun</span>
                  <span>↗</span>
                </a>
                <button
                  type="button"
                  onClick={() => setActiveTab('coins')}
                  className="py-3 px-4 bg-[#010c17] border-2 border-[#00f5b8] text-[#00f5b8] font-mono text-[12px] font-bold uppercase rounded-xl text-center"
                >
                  View in Registry
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right 5 Columns: Creator Preview & Bonding Card */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Creator Enclave Preview Card */}
          <div className="neon-card p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#00f5b8]/20 pb-3">
              <span className="font-mono text-[11px] text-[#8fa8bd] uppercase">
                TARGET CREATOR PROFILE
              </span>
              <span className="font-mono text-[10px] text-[#00f5b8] font-bold">
                100% FEE RECIPIENT
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={matchedCreator.avatarUrl}
                alt={matchedCreator.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#00f5b8]"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-sans font-black text-white text-[18px]">
                    {matchedCreator.name}
                  </h3>
                  {matchedCreator.verified && (
                    <span className="text-[#00f5b8] text-[14px]">✓</span>
                  )}
                </div>
                <span className="font-mono text-[12px] text-[#00f5b8]">
                  {normalizedHandle}
                </span>
              </div>
            </div>

            {/* Solana PDA Vault */}
            <div className="p-3 bg-[#010810] border border-[#00f5b8]/20 rounded-xl flex flex-col gap-1 font-mono text-[11px]">
              <span className="text-[10px] text-[#8fa8bd] uppercase">DETERMINISTIC SOLANA PDA VAULT</span>
              <span className="text-white font-medium break-all select-all">
                {matchedCreator.solVaultPda}
              </span>
            </div>

            {/* Live Accumulation Stats */}
            <div className="grid grid-cols-2 gap-3 pt-1 font-mono text-[12px]">
              <div className="p-3 bg-[#010810] rounded-xl border border-[#00f5b8]/20">
                <div className="text-[10px] text-[#8fa8bd]">ACCUMULATED SOL</div>
                <div className="text-[#00f5b8] font-black text-[16px] mt-0.5">
                  {matchedCreator.unclaimedSol}
                </div>
              </div>
              <div className="p-3 bg-[#010810] rounded-xl border border-[#00f5b8]/20">
                <div className="text-[10px] text-[#8fa8bd]">USD EQUIVALENT</div>
                <div className="text-white font-black text-[16px] mt-0.5">
                  {matchedCreator.unclaimedUsd}
                </div>
              </div>
            </div>
          </div>

          {/* pump.fun Bonding Curve Mechanics Card */}
          <div className="neon-card p-5 sm:p-6 flex flex-col gap-4 font-mono text-[12px]">
            <div className="flex items-center justify-between border-b border-[#00f5b8]/20 pb-3">
              <span className="font-sans font-bold text-white text-[15px]">
                pump.fun Fair Launch Model
              </span>
              <span className="text-[10px] text-[#00f5b8] uppercase font-bold">
                NO PRESALE · NO TEAM ALLOC
              </span>
            </div>

            <p className="font-sans text-[13px] text-[#8fa8bd] leading-relaxed">
              Every token launches with equal access. As buyers purchase along the bonding curve, price rises predictably. When bonding hits <strong className="text-white">~85 SOL</strong>, liquidity graduates to Raydium and burns LP tokens permanently.
            </p>

            <div className="p-3.5 bg-[#010810] rounded-xl border border-[#00f5b8]/20 flex flex-col gap-2">
              <div className="flex justify-between items-center text-[#8fa8bd] text-[11px]">
                <span>Bonding Curve Target:</span>
                <span className="text-[#00f5b8] font-bold">85 SOL ($69,000 MCap)</span>
              </div>
              <div className="flex justify-between items-center text-[#8fa8bd] text-[11px]">
                <span>Creator Revenue Stream:</span>
                <span className="text-white font-bold">1.0% of all swap volume</span>
              </div>
              <div className="flex justify-between items-center text-[#8fa8bd] text-[11px]">
                <span>Official Launchpad:</span>
                <a href={SOCIAL_LINKS.PUMP_FUN_COIN_URL} target="_blank" rel="noopener noreferrer" className="text-[#00f5b8] hover:underline font-bold">
                  pump.fun ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
