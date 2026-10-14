import { CreatorProfile, CoinLaunch, DirectSend, AssetOption } from '../types';
import { CONTRACT_ADDRESSES, SOCIAL_LINKS } from '../constants';

export const INITIAL_CREATORS: Record<string, CreatorProfile> = {
  '@_TJRTrades': {
    handle: '@_TJRTrades',
    platform: 'x',
    name: 'TJR Trades',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    verified: true,
    solVaultPda: 'TJRvau1t7xK89pQ1R2S3T4U5V6W7X8Y9ZabcdeFGH12',
    unclaimedUsd: '$14,820.45',
    unclaimedSol: '80.32 SOL',
    accumulation24h: '+4.12 SOL past 24h',
    coins: [
      {
        name: '$TJR Protocol',
        symbol: '$TJR',
        fee: '1.0% Creator Fee Tier',
        volume24h: '$2.4M',
        earnedCutSol: '42.50 SOL',
        mintAddress: 'TJRMint11111111111111111111111111111111111',
        bondingCurveProgress: 78
      },
      {
        name: '$TRADE Index',
        symbol: '$TRD',
        fee: '0.75% Creator Fee Tier',
        volume24h: '$890k',
        earnedCutSol: '8.20 SOL',
        mintAddress: 'TRDMint22222222222222222222222222222222222',
        bondingCurveProgress: 42
      }
    ],
    tipsPending: [
      { from: '@ansem', amount: '12.50 SOL', txHash: '5xY9...3pQa', timeAgo: '4 hrs ago' }
    ]
  },
  '@elonmusk': {
    handle: '@elonmusk',
    platform: 'x',
    name: 'Elon Musk',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrPDLjPxp5FVahDtbZbxOjZLtSrQ2EBX5rtc-u_syFol0gB4r-MGOpzwC2xGrjtmleXVYxS-sfRI_fnGb2AXbTHiyIWO_eR0IxBG2FZnZYBDO7xhAd_i1rA1R6S8RRhYNhyl6VIVCFWMkheww7YgBPEzM6P8LlLnPpK5MbkK5cs5bY7LDirEDESQmgEKLGjjrBeOCZgGeR2M_9_mVQEU46D0KQvQ6_6waYKpNh6by3DhQlEsh1RJcyrQ',
    verified: true,
    solVaultPda: 'MuskVau1tX9Y8Z7A6B5C4D3E2F1G0H1I2J3K4L5M6N7',
    unclaimedUsd: '$342,109.12',
    unclaimedSol: '1,854.20 SOL',
    accumulation24h: '+86.40 SOL past 24h',
    coins: [
      {
        name: 'Musk Rocket',
        symbol: '$MUSK',
        fee: '1.0% Creator Fee Tier',
        volume24h: '$18.2M',
        earnedCutSol: '1,420.50 SOL',
        mintAddress: 'MuskMint3333333333333333333333333333333333',
        bondingCurveProgress: 100 // Graduated to Raydium
      },
      {
        name: '$MARS Rover',
        symbol: '$MARS',
        fee: '0.5% Creator Fee Tier',
        volume24h: '$4.1M',
        earnedCutSol: '312.40 SOL',
        mintAddress: 'MarsMint4444444444444444444444444444444444',
        bondingCurveProgress: 64
      }
    ],
    tipsPending: [
      { from: '@0xmert', amount: '25.00 SOL', txHash: '4kR8...7mNv', timeAgo: '2 hrs ago' }
    ]
  },
  '@vitalikbuterin': {
    handle: '@vitalikbuterin',
    platform: 'x',
    name: 'Vitalik Buterin',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    verified: true,
    solVaultPda: 'Vita1ikSo1Vau1tX9Y8Z7A6B5C4D3E2F1G0H1I2J3K4',
    unclaimedUsd: '$218,450.00',
    unclaimedSol: '1,184.00 SOL',
    accumulation24h: '+42.10 SOL past 24h',
    coins: [
      {
        name: '$VITALIK Genesis',
        symbol: '$VITALIK',
        fee: '1.0% Creator Fee Tier',
        volume24h: '$12.8M',
        earnedCutSol: '920.00 SOL',
        mintAddress: 'Vita1Mint555555555555555555555555555555555',
        bondingCurveProgress: 94
      }
    ],
    tipsPending: [
      { from: '@toly', amount: '50.00 SOL', txHash: '3nLt...9xWq', timeAgo: '5 hrs ago' }
    ]
  },
  '@ansem': {
    handle: '@ansem',
    platform: 'x',
    name: 'Ansem',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    verified: true,
    solVaultPda: 'AnsemVau1t8Z7A6B5C4D3E2F1G0H1I2J3K4L5M6N7P8',
    unclaimedUsd: '$68,490.00',
    unclaimedSol: '371.20 SOL',
    accumulation24h: '+18.45 SOL past 24h',
    coins: [
      {
        name: '$ANSEM Alpha',
        symbol: '$ANSEM',
        fee: '1.2% Creator Fee Tier',
        volume24h: '$6.7M',
        earnedCutSol: '345.10 SOL',
        mintAddress: 'AnsemMint666666666666666666666666666666666',
        bondingCurveProgress: 88
      }
    ],
    tipsPending: [
      { from: '@cobie', amount: '10.00 SOL', txHash: '2bKm...4vTy', timeAgo: '1 hr ago' }
    ]
  },
  '@ishowspeed': {
    handle: '@ishowspeed',
    platform: 'youtube',
    name: 'IShowSpeed',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    verified: true,
    solVaultPda: 'SpeedVau1t7A6B5C4D3E2F1G0H1I2J3K4L5M6N7P8Q9',
    unclaimedUsd: '$29,310.80',
    unclaimedSol: '158.80 SOL',
    accumulation24h: '+12.50 SOL past 24h',
    coins: [
      {
        name: '$SPEED Coin',
        symbol: '$SPEED',
        fee: '1.0% Creator Fee Tier',
        volume24h: '$3.9M',
        earnedCutSol: '158.80 SOL',
        mintAddress: 'SpeedMint777777777777777777777777777777777',
        bondingCurveProgress: 72
      }
    ],
    tipsPending: []
  },
  '@AFCAjax': {
    handle: '@AFCAjax',
    platform: 'x',
    name: 'AFC Ajax',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    verified: true,
    solVaultPda: 'AjaxVau1t6B5C4D3E2F1G0H1I2J3K4L5M6N7P8Q9R0',
    unclaimedUsd: '$12,400.00',
    unclaimedSol: '67.20 SOL',
    accumulation24h: '+4.80 SOL past 24h',
    coins: [
      {
        name: '$AJAX Club Token',
        symbol: '$AJAX',
        fee: '1.0% Creator Fee Tier',
        volume24h: '$1.8M',
        earnedCutSol: '67.20 SOL',
        mintAddress: 'AjaxMint8888888888888888888888888888888888',
        bondingCurveProgress: 56
      }
    ],
    tipsPending: []
  },
  '@op': {
    handle: '@op',
    platform: 'github',
    name: 'Open Protocol Dev',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    verified: true,
    solVaultPda: 'OpenDevVau1t5C4D3E2F1G0H1I2J3K4L5M6N7P8Q9R1',
    unclaimedUsd: '$8,920.00',
    unclaimedSol: '48.35 SOL',
    accumulation24h: '+3.10 SOL past 24h',
    coins: [
      {
        name: '$CDIT Protocol',
        symbol: '$CDIT',
        fee: '1.0% Creator Fee Tier',
        volume24h: '$950k',
        earnedCutSol: '48.35 SOL',
        mintAddress: 'CditMint9999999999999999999999999999999999',
        bondingCurveProgress: 38
      }
    ],
    tipsPending: []
  }
};

export const INITIAL_COIN_LAUNCHES: CoinLaunch[] = [
  {
    id: 'c1',
    symbol: '$TJR',
    name: '$TJR Protocol',
    creatorHandle: '@_TJRTrades',
    creatorCutPct: 100,
    timeAgo: '3h ago',
    status: 'pump.fun Bonding Curve (78% filled)',
    volume24h: '$2.4M',
    earnedCut: '+42.50 SOL collected',
    price: '$0.0042',
    contractAddress: 'TJRMint11111111111111111111111111111111111',
    pair: 'SOL',
    bondingCurveProgress: 78,
    solRaised: 66.3,
    pumpFunUrl: 'https://pump.fun/coin/TJRMint11111111111111111111111111111111111'
  },
  {
    id: 'c2',
    symbol: '$AJAX',
    name: '$AJAX Official',
    creatorHandle: '@AFCAjax',
    creatorCutPct: 100,
    timeAgo: '6h ago',
    status: 'Verified identity match on pump.fun',
    volume24h: '$1.8M',
    earnedCut: '+67.20 SOL collected',
    price: '$0.0125',
    contractAddress: 'AjaxMint8888888888888888888888888888888888',
    pair: 'SOL',
    bondingCurveProgress: 56,
    solRaised: 47.6,
    pumpFunUrl: 'https://pump.fun/coin/AjaxMint8888888888888888888888888888888888'
  },
  {
    id: 'c3',
    symbol: '$SPEED',
    name: '$SPEED Coin',
    creatorHandle: '@ishowspeed',
    creatorCutPct: 100,
    timeAgo: '6h ago',
    status: 'pump.fun bonding active · YouTube claim live',
    volume24h: '$3.9M',
    earnedCut: '+158.80 SOL collected',
    price: '$0.0089',
    contractAddress: 'SpeedMint777777777777777777777777777777777',
    pair: 'SOL',
    bondingCurveProgress: 72,
    solRaised: 61.2,
    pumpFunUrl: 'https://pump.fun/coin/SpeedMint777777777777777777777777777777777'
  },
  {
    id: 'c4',
    symbol: '$CDIT',
    name: '$CDIT Solana',
    creatorHandle: '@op',
    creatorCutPct: 100,
    timeAgo: '9h ago',
    status: 'Solana High-Speed Settlement',
    volume24h: '$950K',
    earnedCut: '+48.35 SOL collected',
    price: '$0.0021',
    contractAddress: 'CditMint9999999999999999999999999999999999',
    pair: 'SOL',
    bondingCurveProgress: 38,
    solRaised: 32.3,
    pumpFunUrl: 'https://pump.fun/coin/CditMint9999999999999999999999999999999999'
  }
];

export const INITIAL_DIRECT_SENDS: DirectSend[] = [
  {
    id: 's1',
    senderHandle: '@ansem',
    recipientHandle: '@cobie',
    asset: 'SOL',
    amount: '0.08',
    usdValue: '$14.76',
    slotNumber: '#309241842',
    timeAgo: '4s ago',
    assetType: 'crypto',
    memo: 'alpha creator split'
  },
  {
    id: 's2',
    senderHandle: '@0xmert',
    recipientHandle: '@toly',
    asset: 'SOL',
    amount: '0.15',
    usdValue: '$27.68',
    slotNumber: '#309241838',
    timeAgo: '12s ago',
    assetType: 'crypto',
    memo: 'RPC performance tip'
  },
  {
    id: 's3',
    senderHandle: '@blknoiz06',
    recipientHandle: '@elonmusk',
    asset: 'ETH',
    amount: '0.025',
    usdValue: '$66.00',
    slotNumber: '#309241831',
    timeAgo: '28s ago',
    assetType: 'crypto',
    memo: 'starlink tag reward'
  },
  {
    id: 's4',
    senderHandle: '@gainzy',
    recipientHandle: '@_TJRTrades',
    asset: 'SOL',
    amount: '0.05',
    usdValue: '$9.23',
    slotNumber: '#309241825',
    timeAgo: '45s ago',
    assetType: 'crypto',
    memo: 'chart stream tip'
  },
  {
    id: 's5',
    senderHandle: '@saylor',
    recipientHandle: '@vitalikbuterin',
    asset: 'USDC',
    amount: '5.00',
    usdValue: '$5.00',
    slotNumber: '#309241819',
    timeAgo: '1m ago',
    assetType: 'crypto',
    memo: 'atomic settlement test'
  },
  {
    id: 's6',
    senderHandle: '@frankdegods',
    recipientHandle: '@ishowspeed',
    asset: 'SOL',
    amount: '0.12',
    usdValue: '$22.14',
    slotNumber: '#309241812',
    timeAgo: '2m ago',
    assetType: 'crypto',
    memo: 'stream hype reaction'
  },
  {
    id: 's7',
    senderHandle: '@rajgokal',
    recipientHandle: '@ansem',
    asset: 'ETH',
    amount: '0.015',
    usdValue: '$39.60',
    slotNumber: '#309241804',
    timeAgo: '3m ago',
    assetType: 'crypto',
    memo: 'cross-chain portal transfer'
  },
  {
    id: 's8',
    senderHandle: '@cobie',
    recipientHandle: '@0xmert',
    asset: 'SOL',
    amount: '0.04',
    usdValue: '$7.38',
    slotNumber: '#309241795',
    timeAgo: '4m ago',
    assetType: 'crypto',
    memo: 'upOnly podcast tip'
  }
];

export const CRYPTO_ASSETS: AssetOption[] = [
  { symbol: 'SOL', name: 'Solana', type: 'crypto', price: 184.50, unit: 'SOL', badge: '◎', iconType: 'sol' },
  { symbol: 'USDC', name: 'USD Coin', type: 'crypto', price: 1.00, unit: 'USDC', badge: '$', iconType: 'usdc' },
  { symbol: 'TAG', name: 'TagPay Token', type: 'crypto', price: 0.042, unit: 'TAG', badge: '🏷', iconType: 'tag' },
  { symbol: 'ETH', name: 'Ethereum', type: 'crypto', price: 2640.00, unit: 'ETH', badge: 'Ξ', iconType: 'eth' }
];

export const STOCK_ASSETS: AssetOption[] = [
  { symbol: 'AAPL', name: 'Apple Inc', type: 'stock', price: 234.80, unit: 'AAPL', badge: '🍎', iconType: 'apple' },
  { symbol: 'TSLA', name: 'Tesla Inc', type: 'stock', price: 248.50, unit: 'TSLA', badge: '⚡', iconType: 'tesla' },
  { symbol: 'NVDA', name: 'Nvidia Corp', type: 'stock', price: 128.25, unit: 'NVDA', badge: '🟢', iconType: 'nvidia' },
  { symbol: 'GOOGL', name: 'Alphabet Inc', type: 'stock', price: 178.60, unit: 'GOOGL', badge: '🔍', iconType: 'google' },
  { symbol: 'MSFT', name: 'Microsoft', type: 'stock', price: 428.10, unit: 'MSFT', badge: '🪟', iconType: 'microsoft' },
  { symbol: 'AMZN', name: 'Amazon.com', type: 'stock', price: 194.30, unit: 'AMZN', badge: '📦', iconType: 'amazon' }
];
