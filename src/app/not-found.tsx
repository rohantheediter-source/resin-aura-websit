import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-28 text-center space-y-6">
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A9823D] bg-[#F5EBDD] px-3.5 py-1 rounded-full uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
        Page Not Found
      </span>

      <h1 className="font-serif text-5xl sm:text-6xl font-bold text-[#332820]">
        404
      </h1>

      <h2 className="font-serif text-2xl font-bold text-[#332820]">
        The Piece You Are Looking For Does Not Exist
      </h2>

      <p className="text-xs sm:text-sm text-[#85796B] leading-relaxed">
        The resin art piece or page you requested may have been relocated or archived. Explore our handcrafted collections or design your own bespoke piece.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#332820] hover:bg-[#A9823D] text-white px-6 py-3 rounded-full font-bold text-xs shadow-card transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <Link
          href="/products"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C6A15B] hover:bg-[#A9823D] text-white px-6 py-3 rounded-full font-bold text-xs shadow-gold transition-colors"
        >
          <span>Shop Collections</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

