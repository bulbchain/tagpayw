import React from 'react';
import { SOCIAL_LINKS, CONTRACT_ADDRESSES, BRAND_ASSETS } from '../constants';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="neon-card max-w-xl w-full p-5 sm:p-7 flex flex-col gap-5 shadow-2xl max-h-[85vh] overflow-y-auto bg-[#010c17]">
        <div className="flex items-center justify-between border-b border-[#00f5b8]/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg overflow-hidden p-[1px] bg-gradient-to-tr from-[#9945FF] to-[#00f5b8] shadow-[0_0_8px_rgba(0,245,184,0.3)] shrink-0">
              <img
                src={BRAND_ASSETS.LOGO_PATH}
                alt={BRAND_ASSETS.LOGO_ALT}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-[7px]"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.fallback) {
                    target.dataset.fallback = 'true';
                    target.src = '/tagpay-logo.png';
                  }
                }}
              />
            </div>
            <span className="font-sans text-[16px] sm:text-[18px] font-bold text-white">
              TagPay Solana & pump.fun Architecture
            </span>
          </div>
          <button type="button" onClick={onClose} className="text-[#8fa8bd] hover:text-white text-[18px] p-1">
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4 font-sans text-[13px] text-[#8fa8bd] leading-relaxed">
          <div>
            <h4 className="text-white font-bold font-mono text-[14px] mb-1 text-[#00f5b8]">
              1. Deterministic Solana PDA Vaults
            </h4>
            <p>
              Every social identifier across X, GitHub, Twitch, and YouTube has a deterministic Solana Program Derived Address (PDA) calculated using seeds <code className="text-[#00f5b8] bg-[#010810] px-1 rounded">[b"tagpay", hash(normalized_handle)]</code>. No pre-registration, transaction, or SOL is needed for a recipient to begin receiving trading volume fees.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold font-mono text-[14px] mb-1 text-[#00f5b8]">
              2. 100% Locked pump.fun Creator Fee Router
            </h4>
            <p>
              When a creator coin is launched via TagPay, the token's bonding curve fee recipient is hardcoded to the recipient's secure Solana PDA address directly in the deployment instruction to pump.fun Program <code className="text-[#00f5b8] bg-[#010810] px-1 rounded">{CONTRACT_ADDRESSES.PUMP_FUN_PROGRAM_ID.slice(0, 10)}...</code>. TagPay has zero intermediary custody.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold font-mono text-[14px] mb-1 text-[#00f5b8]">
              3. AWS Nitro Secure Enclaves (TEE) & ed25519 MPC
            </h4>
            <p>
              Key shares are held inside hardware-isolated trusted execution environments. To authorize a withdrawal to their Phantom wallet, the creator provides an OAuth identity token, which the enclave attests cryptographically before signing the ed25519 release transaction on Solana.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold font-mono text-[14px] mb-1 text-[#00f5b8]">
              4. pump.fun Bonding Curve Graduation to Raydium
            </h4>
            <p>
              Each token begins on a pump.fun fair-launch bonding curve. Once ~85 SOL is collected in bonding reserves, liquidity automatically seeds into Raydium AMM, locking liquidity permanently with no rug risk.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <a
            href={SOCIAL_LINKS.TWITTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-4 bg-[#010810] border border-[#00f5b8]/30 hover:border-[#00f5b8] text-center text-[#00f5b8] font-mono text-[11px] font-bold rounded-xl"
          >
            Follow {SOCIAL_LINKS.TWITTER_HANDLE} ↗
          </a>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-[#00f5b8] hover:bg-[#5cffd2] text-[#010a12] font-mono font-black uppercase text-[12px] rounded-xl cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
