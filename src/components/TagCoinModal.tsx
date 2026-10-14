import React from 'react';
import { TagCoinView } from './TagCoinView';

interface TagCoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialHandle?: string;
}

export const TagCoinModal: React.FC<TagCoinModalProps> = ({
  isOpen,
  onClose,
  initialHandle
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto neon-card p-3 sm:p-6 md:p-8 bg-[#010c17] my-3 sm:my-8 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full border border-[#00f5b8]/30 bg-[#010810] flex items-center justify-center text-[#8fa8bd] hover:text-white hover:border-[#00f5b8] transition-colors cursor-pointer z-10 touch-manipulation"
          aria-label="Close modal"
        >
          ✕
        </button>

        <TagCoinView
          initialHandle={initialHandle}
          onSuccessComplete={onClose}
        />
      </div>
    </div>
  );
};
