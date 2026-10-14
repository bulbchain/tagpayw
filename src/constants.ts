/**
 * TagPay Protocol - Unified Solana & pump.fun Configuration
 * 
 * ALL contract addresses, token mints, program IDs, RPC endpoints,
 * social media handles, and platform URLs are defined HERE.
 * Every component in the application MUST import from this file.
 */

// ==========================================
// 1. SOLANA NETWORK & RPC CONFIGURATION
// ==========================================
export const SOLANA_CONFIG = {
  NETWORK_NAME: 'Solana Mainnet-Beta',
  CLUSTER: 'mainnet-beta',
  CHAIN_ID: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
  RPC_ENDPOINT: 'https://api.mainnet-beta.solana.com',
  EXPLORER_BASE_URL: 'https://solscan.io',
  PUMP_FUN_BASE_URL: 'https://pump.fun',
  RAYDIUM_BASE_URL: 'https://raydium.io',
  DEXSCREENER_BASE_URL: 'https://dexscreener.com/solana',
  COMMITMENT: 'confirmed' as const,
};

// ==========================================
// 2. CONTRACT ADDRESSES & TOKEN MINTS (SOLANA BASE58)
// ==========================================
export const CONTRACT_ADDRESSES = {
  // $TAG Official Token Mint Address on Solana / pump.fun
  TAG_TOKEN_MINT: 'coming soon...',

  // TagPay Core Protocol Program ID (Solana Anchor / Native)
  TAGPAY_PROGRAM_ID: 'TagPay1111111111111111111111111111111111111',

  // pump.fun Official Bonding Curve Program ID
  PUMP_FUN_PROGRAM_ID: 'coming soon',

  // pump.fun Global Fee Vault & Mint Authority
  PUMP_FUN_FEE_VAULT: 'coming soon',

  // TagPay Non-Custodial MPC Enclave Router & Buyback Vault (Solana PDA)
  TAGPAY_TREASURY_VAULT: 'TagVau1tXzW3kL9k4D5M7N8P9Q1R2S3T4U5V6W7X8Y9Z',

  // Raydium Liquidity Pool V4 Program ID (Graduation target from pump.fun)
  RAYDIUM_AMM_PROGRAM_ID: 'coming soon',

  // Wrapped SOL Native Mint
  WSOL_MINT: 'So11111111111111111111111111111111111111112',

  // Official Solana USDC Mint
  USDC_MINT: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
};

// Alias export for backward compatibility & easy shorthand
export const OFFICIAL_TAG_CA = CONTRACT_ADDRESSES.TAG_TOKEN_MINT;
export const PUMP_FUN_PROGRAM = CONTRACT_ADDRESSES.PUMP_FUN_PROGRAM_ID;

// ==========================================
// 3. SOCIAL MEDIA HANDLES & EXTERNAL URLS
// ==========================================
export const SOCIAL_LINKS = {
  // Twitter / X
  TWITTER_HANDLE: '@TagPaySolana',
  TWITTER_DISPLAY: 'TagPay on X',
  TWITTER_URL: 'https://x.com/TagPaySolana',

  // Telegram Community
  TELEGRAM_HANDLE: '@TagPaySolCommunity',
  TELEGRAM_URL: 'https://t.me/TagPaySolana',

  // pump.fun Official Launch Coin Page
  PUMP_FUN_COIN_URL: `https://pump.fun/coin/${CONTRACT_ADDRESSES.TAG_TOKEN_MINT}`,

  // DexScreener Live Solana Chart
  DEXSCREENER_URL: `https://dexscreener.com/solana/${CONTRACT_ADDRESSES.TAG_TOKEN_MINT}`,

  // Solscan Token Explorer
  SOLSCAN_TOKEN_URL: `https://solscan.io/token/${CONTRACT_ADDRESSES.TAG_TOKEN_MINT}`,
  SOLSCAN_ACCOUNT_URL: (address: string) => `https://solscan.io/account/${address}`,
  SOLSCAN_TX_URL: (txHash: string) => `https://solscan.io/tx/${txHash}`,

  // pump.fun Explorer & bonding curve
  PUMP_FUN_BONDING_URL: (mint: string) => `https://pump.fun/coin/${mint}`,

  // Phantom Wallet Download & Deep Links
  PHANTOM_DOWNLOAD_URL: 'https://phantom.app/download',
  PHANTOM_DEEP_LINK: (url: string) => `https://phantom.app/ul/browse/${encodeURIComponent(url)}?ref=${encodeURIComponent(url)}`,

  // Documentation & GitHub
  DOCS_URL: 'https://docs.tagpay.fun',
  GITHUB_URL: 'https://github.com/tagpay-solana/tagpay-protocol',
};

// ==========================================
// 4. PROTOCOL PARAMETERS & PUMP.FUN SPECS
// ==========================================
export const PROTOCOL_CONFIG = {
  APP_NAME: 'TAGPAY',
  TOKEN_NAME: 'TagPay',
  TOKEN_SYMBOL: '$TAG',
  APP_TAGLINE: 'Tag a coin on pump.fun for any @. 100% creator fees locked.',
  CHAIN_NAME: 'Solana',
  NATIVE_CURRENCY: 'SOL',
  STABLE_CURRENCY: 'USDC',
  SOL_PRICE_USD: 184.50, // Real-time reference estimate
  
  // pump.fun standard token metrics
  TOTAL_SUPPLY: '1,000,000,000', // 1 Billion tokens standard on pump.fun
  INITIAL_VIRTUAL_SOL_RESERVES: 30, // pump.fun virtual reserves
  BONDING_CURVE_GRADUATION_SOL: 85, // ~85 SOL to graduate to Raydium ($69,000 market cap)
  
  // Fees
  PUMP_FUN_LAUNCH_FEE_SOL: 0.02, // ~0.02 SOL launch cost on pump.fun
  TAGPAY_PROTOCOL_FEE_SOL: 0.005, // 0.005 SOL protocol fee for buyback & burn of $TAG
  ESTIMATED_TX_FEE_SOL: 0.00005, // Solana micro-penny gas fee (~$0.009)
  
  CREATOR_FEE_PERCENT: 100, // 100% of creator revenue streamed directly to creator
};

// ==========================================
// 4B. OFFICIAL BRAND ASSETS & LOGO
// ==========================================
export const BRAND_ASSETS = {
  LOGO_PATH: '/tagpaylogo.png',
  LOGO_PUBLIC_PATH: '/tagpaylogo.png',
  LOGO_FALLBACK_PATH: '/tagpay-logo.png',
  LOGO_ALT: 'TagPay Official Logo',
};

// ==========================================
// 5. HELPER FORMATTERS
// ==========================================
export const formatSolAddress = (address: string, chars = 4): string => {
  if (!address) return '';
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

export const formatSolAmount = (amount: number | string, decimals = 3): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};
