'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Clock, 
  Truck, 
  HeartHandshake, 
  MessageCircle,
  Gem,
  Gift
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';
import { REVIEWS } from '@/lib/data';
import { buildWhatsAppCustomOrderUrl } from '@/lib/utils';

export default function HomePage() {
  const { products, settings } = useStore();

  // Only active products on public storefront
  const activeProducts = products.filter((p) => p.status !== 'inactive');

  const bestSellers = activeProducts.filter((p) => p.isBestSeller || p.isPopular).slice(0, 4);
  const newArrivals = activeProducts.filter((p) => p.isNewArrival).slice(0, 4);

  

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION WITH EXACT PRESERVED TAGLINE */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:py-24 bg-gradient-to-b from-[#FFF9F0] via-[#F5EBDD]/50 to-[#FFF9F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Story & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#F5EBDD] border border-[#E8DCCB] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#A9823D]">
                <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>100% Handmade Luxury Resin Studio</span>
              </div>

              {/* Exact Tagline Preserved */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#332820] leading-[1.15] tracking-tight">
                Preserving memories in liquid glass and pure gold.
              </h1>

              <p className="text-base sm:text-lg text-[#85796B] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Discover bespoke luxury handmade resin creations, custom artisanal keepsakes, and timeless design pieces, poured with non-yellowing UV optical art resin.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/products"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#332820] hover:bg-[#A9823D] text-[#FFF9F0] px-8 py-3.5 rounded-full font-semibold text-sm shadow-card transition-all duration-300 active:scale-98 group"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/custom-order"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C6A15B] hover:bg-[#A9823D] text-white px-7 py-3.5 rounded-full font-semibold text-sm shadow-gold transition-all duration-300 active:scale-98"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Customize on WhatsApp</span>
                </Link>
              </div>

              {/* Trust Metrics */}
              <div className="pt-6 border-t border-[#E8DCCB] grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-left">
                <div>
                  <p className="font-serif text-2xl font-bold text-[#332820]">5,000+</p>
                  <p className="text-xs text-[#85796B]">Resin Keepsakes Poured</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-[#332820]">4.9 / 5</p>
                  <p className="text-xs text-[#85796B]">From 800+ Reviews</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-[#332820]">100%</p>
                  <p className="text-xs text-[#85796B]">UV Non-Yellowing</p>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Card - Luxury Studio Atelier (No old demo product images) */}
                <div className="relative rounded-3xl overflow-hidden shadow-elevation border-4 border-white aspect-[4/5] bg-gradient-to-br from-[#332820] via-[#43352A] to-[#1F1712] flex flex-col justify-between p-6 sm:p-8 text-white group">
                  {/* Subtle Luxury Ambient Glow & Light Shimmer */}
                  <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#C6A15B]/20 blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-[#A9823D]/15 blur-2xl pointer-events-none" />

                  {/* Studio Atelier Tag & Icon */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full text-[11px] font-semibold text-[#C6A15B] tracking-wider uppercase">
                      <Sparkles className="w-3 h-3 text-[#C6A15B]" />
                      Studio Atelier
                    </span>
                    <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-[#C6A15B]/30 flex items-center justify-center text-[#C6A15B]">
                      <Gem className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Studio Center Emblem */}
                  <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-6">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-[#C6A15B]/30 bg-gradient-to-b from-[#C6A15B]/20 to-transparent flex items-center justify-center shadow-gold mb-4 group-hover:scale-105 transition-transform duration-500">
                      <Sparkles className="w-9 h-9 text-[#C6A15B]" />
                    </div>
                    <span className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-[#FFF9F0]">
                      ResinAura
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mt-1">
                      Artisan Studio
                    </span>
                  </div>

                  {/* Preserved Typography & Story */}
                  <div className="relative z-10 pt-4 border-t border-white/10">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A15B] mb-1 block">
                      Artisan Craftsmanship
                    </span>
                    <h3 className="font-serif text-xl font-bold text-white">
                      Handcrafted Luxury Resin Studio
                    </h3>
                    <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                      Each heirloom piece is individually hand-poured in small artisan batches with diamond-grade optical art resin and enduring hand-finished details.
                    </p>
                  </div>
                </div>

                {/* Floating Studio Quality Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-elevation border border-[#E8DCCB] max-w-[200px] hidden sm:block">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-full bg-[#C6A15B] flex items-center justify-center text-white">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#332820]">Studio Quality</span>
                  </div>
                  <p className="text-[11px] text-[#85796B]">48-hour cured with diamond-grade optical clarity.</p>
                </div>

                {/* Floating Rating Pill */}
                <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full shadow-elevation border border-[#E8DCCB] flex items-center gap-2">
                  <Star className="w-4 h-4 fill-[#C6A15B] text-[#C6A15B]" />
                  <span className="text-xs font-bold text-[#332820]">4.9 Star Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. POPULAR & BEST SELLERS SECTION (Only displayed when products exist) */}
      {bestSellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#A9823D]">
                <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
                Popular &amp; Customer Favorites
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#332820] mt-1">
                Popular Resin Masterpieces
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-[#332820] hover:text-[#A9823D] flex items-center gap-1 underline underline-offset-4"
            >
              <span>View All Popular Pieces</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 4. CUSTOM ORDER SPOTLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#332820] via-[#43352A] to-[#332820] text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-elevation border border-[#C6A15B]/30">
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-[#C6A15B]/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 rounded-full bg-[#A9823D]/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-5 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 bg-[#C6A15B]/20 border border-[#C6A15B]/40 text-[#C6A15B] text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Bespoke Resin Studio Service
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Create Your Own Design: Preserved in Pure Resin
              </h2>

              <p className="text-sm sm:text-base text-stone-300 max-w-2xl leading-relaxed">
                Have dried wedding varmalas, special milestone flowers, or a custom name plate vision?
                Our master resin artists work directly with you one-on-one on WhatsApp to design your dream keepsake.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-left">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <span className="text-[#C6A15B] font-serif text-xl font-bold">01.</span>
                  <h4 className="text-xs font-bold text-white mt-1">Share Reference</h4>
                  <p className="text-[11px] text-stone-400 mt-0.5">Send photos &amp; requirements on WhatsApp.</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <span className="text-[#C6A15B] font-serif text-xl font-bold">02.</span>
                  <h4 className="text-xs font-bold text-white mt-1">Live Artisan Preview</h4>
                  <p className="text-[11px] text-stone-400 mt-0.5">We share molds, flower layouts &amp; color swatches.</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <span className="text-[#C6A15B] font-serif text-xl font-bold">03.</span>
                  <h4 className="text-xs font-bold text-white mt-1">Safely Delivered</h4>
                  <p className="text-[11px] text-stone-400 mt-0.5">Cured for 48 hours &amp; bubble-packed to perfection.</p>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/custom-order"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C6A15B] hover:bg-[#A9823D] text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-gold transition-all duration-300"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Customize Your Order</span>
                </Link>

                <a
                  href={buildWhatsAppCustomOrderUrl({
                    productType: 'Custom Keepsake',
                    customizationDetails: 'Looking for a bespoke resin piece',
                    preferredDesign: 'Gold flakes with floral preservation',
                    quantity: 1,
                  })}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-full font-semibold text-sm transition-all"
                >
                  <span>Chat Direct on WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 relative flex justify-center">
              <div className="relative w-full max-w-xs aspect-square rounded-3xl overflow-hidden border-2 border-[#C6A15B]/40 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop"
                  alt="Custom Resin Artistry"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                  <p className="text-xs font-semibold text-[#FFF9F0]">
                    ✨ Bespoke WhatsApp Studio Consultation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS (Only displayed when products exist) */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#A9823D]">
                <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
                Fresh From The Pouring Studio
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#332820] mt-1">
                New Resin Arrivals
              </h2>
            </div>
            <Link
              href="/products?sort=newest"
              className="text-xs font-bold text-[#332820] hover:text-[#A9823D] flex items-center gap-1 underline underline-offset-4"
            >
              <span>Explore All New Pieces</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 6. VERIFIED CUSTOMER REVIEWS */}
      <section className="bg-[#F5EBDD]/60 py-16 border-y border-[#E8DCCB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-[#A9823D] font-bold">
              Kind Words From Patrons
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#332820] mt-1">
              Loved by Resin Art Enthusiasts
            </h2>
            <div className="flex items-center justify-center gap-1 mt-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#C6A15B] text-[#C6A15B]" />
              ))}
              <span className="text-xs font-bold text-[#332820] ml-2">4.9 Overall Rating</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REVIEWS.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl p-6 border border-[#E8DCCB] shadow-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#C6A15B] text-[#C6A15B]" />
                      ))}
                    </div>
                    {review.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#332820] italic leading-relaxed">
                    &quot;{review.comment}&quot;
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E8DCCB]/60 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#332820]">{review.customerName}</h4>
                  <span className="text-[10px] text-[#85796B]">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
