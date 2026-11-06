'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Instagram, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Gift, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function Footer() {
  const { settings } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#332820] text-[#FFF9F0] border-t border-[#A9823D]/20">
      {/* Value Badges Banner */}
      <div className="border-b border-[#FFF9F0]/10 py-10 bg-[#281f18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#C6A15B]/15 border border-[#C6A15B]/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-[#C6A15B]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#FFF9F0]">100% Handcrafted Resin</h4>
                <p className="text-xs text-[#85796B]">Hand-poured optical UV resin</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#C6A15B]/15 border border-[#C6A15B]/30 flex items-center justify-center shrink-0">
                <Gift className="w-6 h-6 text-[#C6A15B]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#FFF9F0]">Bespoke Packaging</h4>
                <p className="text-xs text-[#85796B]">Ready for luxury gifting</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#C6A15B]/15 border border-[#C6A15B]/30 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6 text-[#C6A15B]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#FFF9F0]">All-India Shipping</h4>
                <p className="text-xs text-[#85796B]">Free over ₹{settings.freeShippingThreshold}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#C6A15B]/15 border border-[#C6A15B]/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#C6A15B]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#FFF9F0]">Secure Checkout</h4>
                <p className="text-xs text-[#85796B]">Razorpay, COD &amp; WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl font-bold tracking-wider text-[#FFF9F0]">
                Resin<span className="text-[#C6A15B]">Aura</span>
              </span>
              <p className="text-xs uppercase tracking-[0.25em] text-[#C6A15B] font-medium">
                Artisan Resin &amp; Botanical Boutique
              </p>
            </Link>
            <p className="text-sm text-[#E8DCCB]/80 max-w-sm leading-relaxed">
              Every creation is poured with patience, capturing the elegance of liquid glass, genuine 24K gold flakes,
              and preserved natural florals into timeless heirlooms.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <a
                href="https://instagram.com/resinaura.store"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs font-medium text-[#FFF9F0] hover:text-[#C6A15B] transition-colors bg-[#FFF9F0]/10 px-3.5 py-2 rounded-full border border-[#FFF9F0]/15"
              >
                <Instagram className="w-4 h-4 text-[#C6A15B]" />
                @resinaura.store
              </a>
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs font-medium text-[#FFF9F0] hover:text-[#25D366] transition-colors bg-[#FFF9F0]/10 px-3.5 py-2 rounded-full border border-[#FFF9F0]/15"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                WhatsApp Care
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-serif text-base font-semibold text-[#FFF9F0] mb-4 tracking-wide">
              Resin Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E8DCCB]/80">
              <li>
                <Link href="/products?category=Resin+Alphabet+Keychains" className="hover:text-[#C6A15B] transition-colors">
                  Alphabet Keychains
                </Link>
              </li>
              <li>
                <Link href="/products?category=Custom+Name+Keychains" className="hover:text-[#C6A15B] transition-colors">
                  Custom Name Keychains
                </Link>
              </li>
              <li>
                <Link href="/products?category=Resin+Earrings" className="hover:text-[#C6A15B] transition-colors">
                  Resin Earrings
                </Link>
              </li>
              <li>
                <Link href="/products?category=Resin+Pendants" className="hover:text-[#C6A15B] transition-colors">
                  Resin Pendants
                </Link>
              </li>
              <li>
                <Link href="/products?category=Pressed+Flower+Resin+Jewellery" className="hover:text-[#C6A15B] transition-colors">
                  Pressed Flower Jewellery
                </Link>
              </li>
              <li>
                <Link href="/products?category=Custom+Resin+Gifts" className="hover:text-[#C6A15B] transition-colors">
                  Custom Gifts &amp; Clocks
                </Link>
              </li>
              <li>
                <Link href="/products?category=Handmade+Resin+Accessories" className="hover:text-[#C6A15B] transition-colors">
                  Coasters &amp; Name Plates
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Support */}
          <div>
            <h4 className="font-serif text-base font-semibold text-[#FFF9F0] mb-4 tracking-wide">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E8DCCB]/80">
              <li>
                <Link href="/custom-order" className="text-[#C6A15B] font-medium hover:underline">
                  Create Your Own Design
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-[#C6A15B] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#C6A15B] transition-colors">
                  My Account &amp; Orders
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#C6A15B] transition-colors">
                  The ResinAura Craft
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#C6A15B] transition-colors">
                  Contact Studio
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#C6A15B] transition-colors text-[#85796B]">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif text-base font-semibold text-[#FFF9F0] mb-4 tracking-wide">
              The Artisan Circle
            </h4>
            <p className="text-xs text-[#E8DCCB]/80 mb-3 leading-relaxed">
              Subscribe to get exclusive previews of new resin batches, wedding offers, and seasonal discounts.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you for joining our private circle!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-[#FFF9F0]/10 border border-[#FFF9F0]/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-[#C6A15B]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bg-[#C6A15B] hover:bg-[#A9823D] text-white p-1.5 rounded-lg transition-colors"
                    aria-label="Subscribe"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-[#85796B]">We respect your privacy. No spam ever.</p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-[#FFF9F0]/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#85796B] gap-4">
          <p>© {new Date().getFullYear()} ResinAura (@resinaura.store). All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Handmade with Love &amp; Pure 24K Gold in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
