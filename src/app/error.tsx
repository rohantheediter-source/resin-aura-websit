'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto px-4 py-28 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
        <AlertCircle className="w-8 h-8" />
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#332820]">
        Something Went Wrong
      </h2>

      <p className="text-xs text-[#85796B]">
        An unexpected error occurred while loading this page. Please try refreshing or return to the shop.
      </p>

      <div className="flex justify-center gap-3 pt-2">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 bg-[#332820] hover:bg-[#A9823D] text-white px-5 py-2.5 rounded-full font-bold text-xs shadow-card transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#F5EBDD] text-[#332820] px-5 py-2.5 rounded-full font-semibold text-xs border border-[#E8DCCB] hover:bg-[#E8DCCB] transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

