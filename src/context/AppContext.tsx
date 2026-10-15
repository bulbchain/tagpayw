import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ActiveTab,
  CreatorProfile,
  CoinLaunch,
  DirectSend,
  ClaimEvent,
  ToastMessage,
  Platform
} from '../types';
import {
  INITIAL_CREATORS,
  INITIAL_COIN_LAUNCHES,
  INITIAL_DIRECT_SENDS
} from '../data/mockData';
import {
  CONTRACT_ADDRESSES,
  SOLANA_CONFIG,
  SOCIAL_LINKS,
  PROTOCOL_CONFIG,
  formatSolAddress
} from '../constants';

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Phantom & Solana Wallet
  walletConnected: boolean;
  walletAddress: string;
  walletBalanceSol: number;
  walletProvider: string;
  isPhantomInstalled: boolean;
  connectPhantom: () => Promise<boolean>;
  connectWallet: (providerName?: string) => Promise<boolean>;
  disconnectWallet: () => void;

  // Data
  creators: Record<string, CreatorProfile>;
  coinLaunches: CoinLaunch[];
  directSends: DirectSend[];
  claims: ClaimEvent[];
  getCreator: (handle: string, defaultPlatform?: Platform) => CreatorProfile;

  // Actions
  launchCoin: (
    data: {
      symbol: string;
      name: string;
      creatorHandle: string;
      pair: 'SOL' | 'USDC';
      genesisTip?: { amount: string; memo: string };
    }
  ) => CoinLaunch;
  sendDirect: (
    data: {
      recipientHandle: string;
      asset: string;
      amount: string;
      assetType: 'crypto' | 'stock';
      memo?: string;
    }
  ) => DirectSend;
  claimVault: (
    handle: string,
    destinationWallet: string
  ) => { amountSol: string; amountUsd: string; txHash: string };
  tradeCoin: (
    coinId: string,
    tradeType: 'buy' | 'sell',
    solAmount: number
  ) => void;

  // Modals & Navigation state
  isTagModalOpen: boolean;
  setIsTagModalOpen: (open: boolean) => void;
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: (open: boolean) => void;
  isContractModalOpen: boolean;
  setIsContractModalOpen: (open: boolean) => void;
  isDocsModalOpen: boolean;
  setIsDocsModalOpen: (open: boolean) => void;
  selectedCoinForTrade: CoinLaunch | null;
  setSelectedCoinForTrade: (coin: CoinLaunch | null) => void;

  prefilledHandleForTag: string;
  setPrefilledHandleForTag: (handle: string) => void;
  prefilledHandleForSend: string;
  setPrefilledHandleForSend: (handle: string) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Helper stats
  globalUnclaimedPoolUsd: number;

  // Live Mempool Stream
  latestMempoolTxId: string | null;
  currentSolanaSlot: number;
  isMempoolStreaming: boolean;
  toggleMempoolStream: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CREATORS: 'tagpay_solana_creators_v2',
  COIN_LAUNCHES: 'tagpay_solana_coin_launches_v2',
  DIRECT_SENDS: 'tagpay_solana_direct_sends_v3',
  CLAIMS: 'tagpay_solana_claims_v2',
  WALLET: 'tagpay_solana_wallet_v2'
};

// Helper to generate Solana-like Base58 addresses
const generateSolanaAddress = (prefix = 'Sol'): string => {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = prefix;
  while (result.length < 44) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

interface InjectedSolanaProvider {
  isPhantom?: boolean;
  isSolflare?: boolean;
  isBackpack?: boolean;
  connect?: () => Promise<{ publicKey?: { toString: () => string } }>;
  disconnect?: () => Promise<void>;
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('tag-for-@');

  // Check Phantom availability in browser window
  const [isPhantomInstalled, setIsPhantomInstalled] = useState<boolean>(false);

  useEffect(() => {
    const checkPhantom = () => {
      const anyWindow = typeof window !== 'undefined' ? (window as unknown as { solana?: { isPhantom?: boolean }; phantom?: { solana?: { isPhantom?: boolean } } }) : undefined;
      const isPhantom = Boolean(anyWindow?.solana?.isPhantom || anyWindow?.phantom?.solana?.isPhantom);
      setIsPhantomInstalled(isPhantom);
    };

    checkPhantom();
    // Re-check shortly after load as extension injection may have slight delay
    const timer = setTimeout(checkPhantom, 500);
    return () => clearTimeout(timer);
  }, []);

  // Wallet State
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [walletProvider, setWalletProvider] = useState<string>('');

  const [walletBalanceSol, setWalletBalanceSol] = useState<number>(18.450);

  // Creators Data
  const [creators, setCreators] = useState<Record<string, CreatorProfile>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CREATORS);
      return saved ? JSON.parse(saved) : INITIAL_CREATORS;
    } catch {
      return INITIAL_CREATORS;
    }
  });

  // Coin Launches Data
  const [coinLaunches, setCoinLaunches] = useState<CoinLaunch[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COIN_LAUNCHES);
      return saved ? JSON.parse(saved) : INITIAL_COIN_LAUNCHES;
    } catch {
      return INITIAL_COIN_LAUNCHES;
    }
  });

  // Direct Sends Data
  const [directSends, setDirectSends] = useState<DirectSend[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DIRECT_SENDS);
      return saved ? JSON.parse(saved) : INITIAL_DIRECT_SENDS;
    } catch {
      return INITIAL_DIRECT_SENDS;
    }
  });

  // Claims Data
  const [claims, setClaims] = useState<ClaimEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLAIMS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & Navigation
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [selectedCoinForTrade, setSelectedCoinForTrade] = useState<CoinLaunch | null>(null);

  const [prefilledHandleForTag, setPrefilledHandleForTag] = useState('@elonmusk');
  const [prefilledHandleForSend, setPrefilledHandleForSend] = useState('@vitalikbuterin');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist storage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CREATORS, JSON.stringify(creators));
    } catch (e) {
      console.warn('Failed to save creators', e);
    }
  }, [creators]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COIN_LAUNCHES, JSON.stringify(coinLaunches));
    } catch (e) {
      console.warn('Failed to save coin launches', e);
    }
  }, [coinLaunches]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DIRECT_SENDS, JSON.stringify(directSends));
    } catch (e) {
      console.warn('Failed to save direct sends', e);
    }
  }, [directSends]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));
    } catch (e) {
      console.warn('Failed to save claims', e);
    }
  }, [claims]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.WALLET,
        JSON.stringify({ connected: walletConnected, address: walletAddress, provider: walletProvider })
      );
    } catch (e) {
      console.warn('Failed to save wallet', e);
    }
  }, [walletConnected, walletAddress, walletProvider]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Live Solana Mempool Streaming Simulator
  const [currentSolanaSlot, setCurrentSolanaSlot] = useState<number>(309241850);
  const [latestMempoolTxId, setLatestMempoolTxId] = useState<string | null>(null);
  const [isMempoolStreaming, setIsMempoolStreaming] = useState<boolean>(true);

  const toggleMempoolStream = () => {
    setIsMempoolStreaming((prev) => !prev);
  };

  useEffect(() => {
    if (!isMempoolStreaming) return;

    let timer: ReturnType<typeof setTimeout>;

    const streamNextTx = () => {
      // Simulate live Solana mempool activity arriving every 2.8 - 4.2 seconds
      const delay = Math.floor(Math.random() * 1400) + 2800;
      timer = setTimeout(() => {
        const slotJump = Math.floor(Math.random() * 3) + 2;
        setCurrentSolanaSlot((prev) => {
          const newSlotNum = prev + slotJump;

          const senders = [
            '@ansem', '@toly', '@0xmert', '@blknoiz06', '@gainzy',
            '@saylor', '@frankdegods', '@rajgokal', '@cobie', '@beeple',
            '@hsaka', '@blkjack'
          ];
          const recipients = [
            '@elonmusk', '@vitalikbuterin', '@_TJRTrades', '@ishowspeed',
            '@toly', '@cobie', '@ansem', '@0xmert', '@saylor', '@gainzy'
          ];

          const sender = senders[Math.floor(Math.random() * senders.length)];
          let recipient = recipients[Math.floor(Math.random() * recipients.length)];
          if (recipient === sender) {
            recipient = sender === '@elonmusk' ? '@vitalikbuterin' : '@elonmusk';
          }

          // Distribute assets: SOL (60%), ETH (25%), USDC (15%)
          const roll = Math.random();
          let asset: 'SOL' | 'ETH' | 'USDC' = 'SOL';
          let amount = '0.05';
          let usdValue = '$9.23';
          let memo = 'creator tip';

          if (roll < 0.60) {
            asset = 'SOL';
            const solAmounts = [0.02, 0.035, 0.05, 0.065, 0.08, 0.12, 0.15, 0.22];
            const val = solAmounts[Math.floor(Math.random() * solAmounts.length)];
            amount = val.toString();
            usdValue = `$${(val * 184.50).toFixed(2)}`;
            const memos = [
              'alpha creator split',
              'chart analysis tip',
              'instant PDA transfer',
              'pump.fun launch reaction',
              'verified X bounty',
              'stream raid split'
            ];
            memo = memos[Math.floor(Math.random() * memos.length)];
          } else if (roll < 0.85) {
            asset = 'ETH';
            const ethAmounts = [0.008, 0.012, 0.018, 0.025, 0.035, 0.045];
            const val = ethAmounts[Math.floor(Math.random() * ethAmounts.length)];
            amount = val.toString();
            usdValue = `$${(val * 2640.00).toFixed(2)}`;
            const memos = [
              'Wormhole Portal transfer',
              'cross-chain creator tip',
              'multichain tag bounty',
              'starlink tag split',
              'L1 bridge settlement'
            ];
            memo = memos[Math.floor(Math.random() * memos.length)];
          } else {
            asset = 'USDC';
            const usdcAmounts = [2.50, 4.00, 5.00, 7.50, 10.00, 15.00];
            const val = usdcAmounts[Math.floor(Math.random() * usdcAmounts.length)];
            amount = val.toFixed(2);
            usdValue = `$${val.toFixed(2)}`;
            const memos = [
              'zero gas micropayment',
              'instant peer USDC split',
              'atomic dollar transfer',
              'creator reward settlement'
            ];
            memo = memos[Math.floor(Math.random() * memos.length)];
          }

          const newId = `s_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
          const newSlotStr = `#${newSlotNum}`;

          const newTx: DirectSend = {
            id: newId,
            senderHandle: sender,
            recipientHandle: recipient,
            asset,
            amount,
            usdValue,
            slotNumber: newSlotStr,
            timeAgo: 'Just now',
            assetType: 'crypto',
            memo
          };

          setDirectSends((prevList) => {
            const updated = prevList.map((item, idx) => {
              if (idx === 0) return { ...item, timeAgo: '4s ago' };
              if (idx === 1) return { ...item, timeAgo: '12s ago' };
              if (idx === 2) return { ...item, timeAgo: '28s ago' };
              if (idx === 3) return { ...item, timeAgo: '45s ago' };
              if (idx === 4) return { ...item, timeAgo: '1m ago' };
              if (idx === 5) return { ...item, timeAgo: '2m ago' };
              return item;
            });
            return [newTx, ...updated.slice(0, 24)];
          });

          setLatestMempoolTxId(newId);
          setTimeout(() => {
            setLatestMempoolTxId((curr) => (curr === newId ? null : curr));
          }, 1600);

          return newSlotNum;
        });

        streamNextTx();
      }, delay);
    };

    streamNextTx();

    return () => {
      clearTimeout(timer);
    };
  }, [isMempoolStreaming]);

  const connectWallet = async (providerName = 'Phantom'): Promise<boolean> => {
    const walletWindow = typeof window !== 'undefined'
      ? window as unknown as {
          solana?: InjectedSolanaProvider;
          phantom?: { solana?: InjectedSolanaProvider };
          solflare?: InjectedSolanaProvider;
          backpack?: InjectedSolanaProvider;
        }
      : undefined;

    const providers: Record<string, InjectedSolanaProvider | undefined> = {
      Phantom: walletWindow?.phantom?.solana
        ?? (walletWindow?.solana?.isPhantom ? walletWindow.solana : undefined),
      Solflare: walletWindow?.solflare?.isSolflare ? walletWindow.solflare : undefined,
      Backpack: walletWindow?.backpack?.isBackpack ? walletWindow.backpack : undefined
    };
    const provider = providers[providerName];

    if (!provider || typeof provider.connect !== 'function') {
      addToast({
        type: 'error',
        title: `${providerName} Not Found`,
        description: `Unable to detect the ${providerName} wallet. Install or unlock it, then try again.`
      });
      return false;
    }

    try {
      const response = await provider.connect();
      const publicKey = response.publicKey?.toString();
      if (!publicKey) {
        throw new Error(`${providerName} did not return a wallet address.`);
      }

      setWalletConnected(true);
      setWalletAddress(publicKey);
      setWalletProvider(providerName);
      addToast({
        type: 'success',
        title: `${providerName} Connected`,
        description: `Connected: ${formatSolAddress(publicKey, 6)} on Solana Mainnet`
      });
      return true;
    } catch (error) {
      const description = error instanceof Error && error.message
        ? error.message
        : `Could not connect to ${providerName}. Please try again.`;
      addToast({
        type: 'error',
        title: `${providerName} Connection Failed`,
        description
      });
      return false;
    }
  };

  const connectPhantom = async (): Promise<boolean> => connectWallet('Phantom');

  const disconnectWallet = () => {
    try {
      const walletWindow = typeof window !== 'undefined'
        ? window as unknown as {
            solana?: InjectedSolanaProvider;
            phantom?: { solana?: InjectedSolanaProvider };
            solflare?: InjectedSolanaProvider;
            backpack?: InjectedSolanaProvider;
          }
        : undefined;
      const provider = walletProvider === 'Phantom'
        ? walletWindow?.phantom?.solana ?? walletWindow?.solana
        : walletProvider === 'Solflare'
          ? walletWindow?.solflare
          : walletWindow?.backpack;
      void provider?.disconnect?.();
    } catch (e) {
      console.warn(e);
    }
    setWalletConnected(false);
    setWalletAddress('');
    setWalletProvider('');
    addToast({
      type: 'info',
      title: 'Wallet Disconnected',
      description: 'Disconnected from Solana Mainnet'
    });
  };

  // Retrieve or dynamically initialize a creator
  const getCreator = (handle: string, defaultPlatform: Platform = 'x'): CreatorProfile => {
    const normalized = handle.startsWith('@') ? handle : `@${handle.trim()}`;
    if (creators[normalized]) {
      return creators[normalized];
    }

    const cleanName = normalized.replace('@', '');
    const capitalized = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    const generatedPda = generateSolanaAddress('Vau1t');

    const newCreator: CreatorProfile = {
      handle: normalized,
      platform: defaultPlatform,
      name: capitalized,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
      verified: false,
      solVaultPda: generatedPda,
      unclaimedUsd: '$0.00',
      unclaimedSol: '0.00 SOL',
      accumulation24h: '0.00 SOL past 24h',
      coins: [],
      tipsPending: []
    };

    setCreators((prev) => ({
      ...prev,
      [normalized]: newCreator
    }));

    return newCreator;
  };

  // Launch a new Creator Coin on pump.fun
  const launchCoin = (data: {
    symbol: string;
    name: string;
    creatorHandle: string;
    pair: 'SOL' | 'USDC';
    genesisTip?: { amount: string; memo: string };
  }): CoinLaunch => {
    const normalized = data.creatorHandle.startsWith('@')
      ? data.creatorHandle
      : `@${data.creatorHandle.trim()}`;

    const newMint = generateSolanaAddress('pump');
    const newId = 'c_' + Date.now();
    const cleanSymbol = data.symbol.startsWith('$') ? data.symbol : `$${data.symbol}`;

    const newLaunch: CoinLaunch = {
      id: newId,
      symbol: cleanSymbol,
      name: data.name,
      creatorHandle: normalized,
      creatorCutPct: PROTOCOL_CONFIG.CREATOR_FEE_PERCENT,
      timeAgo: 'Just now',
      status: 'pump.fun Bonding Curve Active (1% filled)',
      volume24h: '$12.5K',
      earnedCut: '+0.15 SOL collected',
      price: '$0.000042',
      contractAddress: newMint,
      pair: data.pair,
      holdersCount: 1,
      bondingCurveProgress: 1,
      solRaised: 0.85,
      pumpFunUrl: `https://pump.fun/coin/${newMint}`
    };

    // Update Coin Launches list
    setCoinLaunches((prev) => [newLaunch, ...prev]);

    // Update or create creator profile with new coin
    setCreators((prev) => {
      const existing = prev[normalized] || getCreator(normalized);
      const newCoinEntry = {
        name: data.name,
        symbol: cleanSymbol,
        fee: '1.0% Creator Fee Tier',
        volume24h: '$12.5K',
        earnedCutSol: '0.15 SOL',
        mintAddress: newMint,
        bondingCurveProgress: 1
      };

      const pendingTips = [...existing.tipsPending];
      let updatedSol = parseFloat(existing.unclaimedSol) || 0;
      let updatedUsd = parseFloat(existing.unclaimedUsd.replace('$', '').replace(',', '')) || 0;

      if (data.genesisTip && parseFloat(data.genesisTip.amount) > 0) {
        const tipVal = parseFloat(data.genesisTip.amount);
        updatedSol += tipVal;
        updatedUsd += tipVal * PROTOCOL_CONFIG.SOL_PRICE_USD;
        pendingTips.unshift({
          from: walletConnected ? formatSolAddress(walletAddress, 4) : '@you',
          amount: `${tipVal.toFixed(2)} SOL`,
          txHash: generateSolanaAddress('tx').slice(0, 10),
          timeAgo: 'Just now',
          memo: data.genesisTip.memo
        });
      }

      return {
        ...prev,
        [normalized]: {
          ...existing,
          coins: [newCoinEntry, ...existing.coins],
          unclaimedSol: `${updatedSol.toFixed(2)} SOL`,
          unclaimedUsd: `$${updatedUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          tipsPending: pendingTips
        }
      };
    });

    addToast({
      type: 'success',
      title: 'Launched on pump.fun!',
      description: `${cleanSymbol} mint ${formatSolAddress(newMint, 6)} deployed with 100% creator fee locked.`,
      txHash: generateSolanaAddress('sig')
    });

    return newLaunch;
  };

  // Direct Peer-to-Peer Send on Solana
  const sendDirect = (data: {
    recipientHandle: string;
    asset: string;
    amount: string;
    assetType: 'crypto' | 'stock';
    memo?: string;
  }): DirectSend => {
    const normalized = data.recipientHandle.startsWith('@')
      ? data.recipientHandle
      : `@${data.recipientHandle.trim()}`;

    const numAmount = parseFloat(data.amount) || 0;
    const price = data.asset === 'SOL' ? PROTOCOL_CONFIG.SOL_PRICE_USD : data.asset === 'USDC' ? 1 : 230;
    const totalUsd = numAmount * price;

    const newId = 's_' + Date.now();
    const newTxHash = generateSolanaAddress('tx');
    const slot = `#${Math.floor(309200000 + Math.random() * 50000)}`;

    const newSend: DirectSend = {
      id: newId,
      senderHandle: walletConnected ? formatSolAddress(walletAddress, 4) : '@you',
      recipientHandle: normalized,
      asset: data.asset,
      amount: data.amount,
      usdValue: `$${totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      slotNumber: slot,
      timeAgo: 'Just now',
      assetType: data.assetType,
      memo: data.memo,
      txHash: newTxHash
    };

    setDirectSends((prev) => [newSend, ...prev]);
    setLatestMempoolTxId(newSend.id);
    setTimeout(() => {
      setLatestMempoolTxId((curr) => (curr === newSend.id ? null : curr));
    }, 2000);

    // Update creator vault
    setCreators((prev) => {
      const existing = prev[normalized] || getCreator(normalized);
      const prevSol = parseFloat(existing.unclaimedSol) || 0;
      const prevUsd = parseFloat(existing.unclaimedUsd.replace('$', '').replace(',', '')) || 0;

      const addedSol = data.asset === 'SOL' ? numAmount : totalUsd / PROTOCOL_CONFIG.SOL_PRICE_USD;

      return {
        ...prev,
        [normalized]: {
          ...existing,
          unclaimedSol: `${(prevSol + addedSol).toFixed(2)} SOL`,
          unclaimedUsd: `$${(prevUsd + totalUsd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          tipsPending: [
            {
              from: walletConnected ? formatSolAddress(walletAddress, 4) : '@you',
              amount: `${data.amount} ${data.asset}`,
              txHash: formatSolAddress(newTxHash, 5),
              timeAgo: 'Just now',
              memo: data.memo
            },
            ...existing.tipsPending
          ]
        }
      };
    });

    addToast({
      type: 'success',
      title: 'Sent on Solana!',
      description: `Sent ${data.amount} ${data.asset} to ${normalized} PDA vault.`,
      txHash: newTxHash
    });

    return newSend;
  };

  // Claim Vault to Phantom Wallet
  const claimVault = (
    handle: string,
    destinationWallet: string
  ): { amountSol: string; amountUsd: string; txHash: string } => {
    const normalized = handle.startsWith('@') ? handle : `@${handle.trim()}`;
    const creator = creators[normalized] || getCreator(normalized);

    const amountSol = creator.unclaimedSol;
    const amountUsd = creator.unclaimedUsd;
    const newTxHash = generateSolanaAddress('sig');

    // Reset creator unclaimed balance
    setCreators((prev) => {
      const current = prev[normalized];
      if (!current) return prev;
      return {
        ...prev,
        [normalized]: {
          ...current,
          unclaimedSol: '0.00 SOL',
          unclaimedUsd: '$0.00',
          accumulation24h: '0.00 SOL past 24h',
          tipsPending: []
        }
      };
    });

    // Add Claim Event
    const newClaim: ClaimEvent = {
      id: 'cl_' + Date.now(),
      creatorHandle: normalized,
      amountSol,
      amountUsd,
      destinationWallet,
      slotNumber: `#${Math.floor(309200000 + Math.random() * 50000)}`,
      timeAgo: 'Just now',
      txHash: newTxHash
    };

    setClaims((prev) => [newClaim, ...prev]);

    // Credit balance if connected
    if (walletConnected) {
      const claimedVal = parseFloat(amountSol) || 0;
      setWalletBalanceSol((prev) => +(prev + claimedVal).toFixed(3));
    }

    addToast({
      type: 'success',
      title: 'Vault Claimed to Phantom!',
      description: `Transferred ${amountSol} (${amountUsd}) to ${formatSolAddress(destinationWallet, 6)} on Solana.`,
      txHash: newTxHash
    });

    return { amountSol, amountUsd, txHash: newTxHash };
  };

  // Trade on pump.fun bonding curve
  const tradeCoin = (coinId: string, tradeType: 'buy' | 'sell', solAmount: number) => {
    const targetCoin = coinLaunches.find((c) => c.id === coinId);
    if (!targetCoin) return;

    const creatorCutSol = +(solAmount * 0.01).toFixed(4);
    const creatorCutUsd = +(creatorCutSol * PROTOCOL_CONFIG.SOL_PRICE_USD).toFixed(2);

    // Update bonding curve progress on pump.fun
    setCoinLaunches((prev) =>
      prev.map((c) => {
        if (c.id === coinId) {
          const currentProgress = c.bondingCurveProgress || 50;
          const currentSolRaised = c.solRaised || 40;
          const delta = tradeType === 'buy' ? solAmount : -solAmount * 0.8;
          const newSolRaised = Math.max(1, +(currentSolRaised + delta).toFixed(2));
          const newProgress = Math.min(100, Math.max(1, Math.round((newSolRaised / PROTOCOL_CONFIG.BONDING_CURVE_GRADUATION_SOL) * 100)));

          return {
            ...c,
            bondingCurveProgress: newProgress,
            solRaised: newSolRaised,
            status: newProgress >= 100
              ? 'Graduated to Raydium! Liquidity Seeded'
              : `pump.fun Bonding Curve (${newProgress}% filled)`
          };
        }
        return c;
      })
    );

    // Route 1% fee directly to creator's Solana vault
    setCreators((prev) => {
      const existing = prev[targetCoin.creatorHandle];
      if (!existing) return prev;
      const prevSol = parseFloat(existing.unclaimedSol) || 0;
      const prevUsd = parseFloat(existing.unclaimedUsd.replace('$', '').replace(',', '')) || 0;

      return {
        ...prev,
        [targetCoin.creatorHandle]: {
          ...existing,
          unclaimedSol: `${(prevSol + creatorCutSol).toFixed(2)} SOL`,
          unclaimedUsd: `$${(prevUsd + creatorCutUsd).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        }
      };
    });

    // Adjust wallet balance
    if (walletConnected) {
      if (tradeType === 'buy') {
        setWalletBalanceSol((prev) => Math.max(0, +(prev - solAmount).toFixed(3)));
      } else {
        setWalletBalanceSol((prev) => +(prev + solAmount * 0.95).toFixed(3));
      }
    }

    addToast({
      type: 'success',
      title: `${tradeType === 'buy' ? 'Bought' : 'Sold'} on pump.fun!`,
      description: `${solAmount} SOL swap executed. ${creatorCutSol} SOL streamed autonomously to ${targetCoin.creatorHandle}.`
    });
  };

  // Calculate global unclaimed pool in USD
  const globalUnclaimedPoolUsd = Object.values(creators).reduce((acc, c) => {
    const clean = parseFloat(c.unclaimedUsd.replace('$', '').replace(/,/g, '')) || 0;
    return acc + clean;
  }, 0);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        walletConnected,
        walletAddress,
        walletBalanceSol,
        walletProvider,
        isPhantomInstalled,
        connectPhantom,
        connectWallet,
        disconnectWallet,
        creators,
        coinLaunches,
        directSends,
        claims,
        getCreator,
        launchCoin,
        sendDirect,
        claimVault,
        tradeCoin,
        isTagModalOpen,
        setIsTagModalOpen,
        isWalletModalOpen,
        setIsWalletModalOpen,
        isContractModalOpen,
        setIsContractModalOpen,
        isDocsModalOpen,
        setIsDocsModalOpen,
        selectedCoinForTrade,
        setSelectedCoinForTrade,
        prefilledHandleForTag,
        setPrefilledHandleForTag,
        prefilledHandleForSend,
        setPrefilledHandleForSend,
        toasts,
        addToast,
        removeToast,
        globalUnclaimedPoolUsd,
        latestMempoolTxId,
        currentSolanaSlot,
        isMempoolStreaming,
        toggleMempoolStream
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
