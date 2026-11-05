'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function ToastContainer() {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-elevation border transition-all duration-300 animate-in slide-in-from-top-4 ${
              isSuccess
                ? 'bg-[#FFF9F0] border-[#C6A15B] text-[#332820]'
                : isError
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-stone-50 border-stone-200 text-stone-900'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#A9823D] shrink-0 mt-0.5" />}
            {isError && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />}
            {!isSuccess && !isError && <Info className="w-5 h-5 text-[#85796B] shrink-0 mt-0.5" />}

            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-semibold">{toast.title}</h5>
              {toast.message && <p className="text-xs text-[#85796B] mt-0.5">{toast.message}</p>}
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[#85796B] hover:text-[#332820] p-1 rounded-lg"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

