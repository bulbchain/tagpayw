export type Platform = 'x' | 'github' | 'twitch' | 'youtube';

export interface CreatorCoin {
  name: string;
  symbol: string;
  fee: string;
  volume24h: string;
  earnedCutSol: string;
  price?: string;
  marketCap?: string;
  mintAddress?: string;
  bondingCurveProgress?: number; // 0-100% on pump.fun
}

export interface PendingTip {
  from: string;
  amount: string; // e.g. "1.50 SOL"
  txHash: string;
  timeAgo: string;
  memo?: string;
}

export interface CreatorProfile {
  handle: string;
  platform: Platform;
  name: string;
  avatarUrl: string;
  verified: boolean;
  solVaultPda: string; // Solana Program Derived Address (PDA)
  unclaimedUsd: string;
  unclaimedSol: string;
  accumulation24h: string;
  coins: CreatorCoin[];
  tipsPending: PendingTip[];
}

export interface CoinLaunch {
  id: string;
  symbol: string;
  name: string;
  creatorHandle: string;
  creatorCutPct: number;
  timeAgo: string;
  status: string;
  volume24h?: string;
  earnedCut?: string;
  price?: string;
  contractAddress?: string; // Solana Mint Address
  pair?: 'SOL' | 'USDC';
  holdersCount?: number;
  bondingCurveProgress?: number; // 0-100% towards Raydium graduation
  pumpFunUrl?: string;
  solRaised?: number;
}

export interface DirectSend {
  id: string;
  senderHandle: string;
  recipientHandle: string;
  asset: string;
  amount: string;
  usdValue: string;
  slotNumber: string; // Solana Slot
  timeAgo: string;
  assetType: 'crypto' | 'stock';
  memo?: string;
  txHash?: string;
}

export interface ClaimEvent {
  id: string;
  creatorHandle: string;
  amountSol: string;
  amountUsd: string;
  destinationWallet: string;
  slotNumber: string;
  timeAgo: string;
  txHash: string;
}

export interface AssetOption {
  symbol: string;
  name: string;
  type: 'crypto' | 'stock';
  price: number;
  unit: string;
  badge: string;
  iconType: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  description?: string;
  txHash?: string;
}

export type ActiveTab = 'tag-for-@' | 'coins' | 'send' | 'claim' | 'feed';
