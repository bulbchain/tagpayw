import React from 'react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#010c17]/95 border-2 border-[#00f5b8] p-4 rounded-xl shadow-[0_12px_28px_rgba(0,0,0,0.85),0_0_18px_rgba(0,245,184,0.3)] backdrop-blur-md flex items-start justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#00f5b8] text-[20px] pt-0.5 shrink-0">
              {toast.type === 'error' ? 'error' : toast.type === 'info' ? 'info' : 'check_circle'}
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-[12px] font-black text-white uppercase tracking-wider">
                {toast.title}
              </span>
              {toast.description && (
                <span className="font-sans text-[12px] text-[#8fa8bd] leading-tight">
                  {toast.description}
                </span>
              )}
              {toast.txHash && (
                <span className="font-mono text-[10px] text-[#00f5b8] mt-1">
                  TX: {toast.txHash}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="text-[#8fa8bd] hover:text-white transition-colors cursor-pointer text-[14px] p-0.5"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
