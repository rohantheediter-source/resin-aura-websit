import React from 'react';
import Link from 'next/link';
import { Sparkles, Flower2, ShieldCheck, HeartHandshake, ArrowRight, Instagram } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#FFF9F0] via-[#F5EBDD]/60 to-[#FFF9F0] py-16 sm:py-24 border-b border-[#E8DCCB]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#F5EBDD] border border-[#E8DCCB] px-4 py-1.5 rounded-full text-xs font-bold text-[#A9823D] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
            Our Handcrafted Legacy
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#332820] leading-tight">
            Crafting Timeless Heirlooms in Liquid Glass &amp; Real Florals
          </h1>
          <p className="text-base sm:text-lg text-[#85796B] leading-relaxed max-w-2xl mx-auto">
            At ResinAura (@resinaura.store), we believe that every fleeting moment—from your bridal garlands to a newborn&apos;s first keepsake—deserves to be preserved forever in crystal clarity.
          </p>
        </div>
      </section>

      {/* The Story & Philosophy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden border-4 border-white shadow-elevation">
              <img
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop"
                alt="Preserved Varmala Artistry"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl border border-[#E8DCCB] shadow-elevation max-w-xs hidden sm:block">
              <p className="font-serif text-2xl font-bold text-[#A9823D]">48-Hour Cure</p>
              <p className="text-xs text-[#85796B] mt-1">Multi-stage vacuum degassing to achieve bubble-free liquid glass purity.</p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#A9823D]">
              Born From Passion
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#332820]">
              The Soul Behind ResinAura
            </h2>
            <p className="text-sm text-[#85796B] leading-relaxed">
              Founded as an intimate artisan workshop, ResinAura has grown into one of India&apos;s premier destinations for bespoke bridal preservation and handmade luxury resin design.
            </p>
            <p className="text-sm text-[#85796B] leading-relaxed">
              Unlike mass-manufactured plastics or acrylics, our epoxy formulas use high-grade UV stabilizers that prevent yellowing over time. Each letter keychain, wall clock, and ring platter is hand-poured in micro-batches with 24K imitation gold leafing and real botanicals hand-pressed in our studio.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E8DCCB]">
              <div className="space-y-1">
                <span className="font-serif text-3xl font-bold text-[#332820]">100%</span>
                <p className="text-xs text-[#85796B]">Handcrafted in India</p>
              </div>
              <div className="space-y-1">
                <span className="font-serif text-3xl font-bold text-[#332820]">5,000+</span>
                <p className="text-xs text-[#85796B]">Happy Patrons Worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Excellence */}
      <section className="bg-[#F5EBDD]/50 py-16 border-y border-[#E8DCCB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="font-serif text-3xl font-bold text-[#332820]">
              The ResinAura Standard
            </h3>
            <p className="text-xs text-[#85796B] mt-1">
              Every detail is considered—from organic preservation chemistry to velvet presentation boxes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E8DCCB] shadow-card space-y-3">
              <Flower2 className="w-8 h-8 text-[#C6A15B]" />
              <h4 className="font-serif text-base font-bold text-[#332820]">Silica Flower Preservation</h4>
              <p className="text-xs text-[#85796B] leading-relaxed">
                We dehydrate delicate rose petals and baby&apos;s breath in high-purity crystals to lock in raw vivid pigments.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8DCCB] shadow-card space-y-3">
              <Sparkles className="w-8 h-8 text-[#C6A15B]" />
              <h4 className="font-serif text-base font-bold text-[#332820]">Pure 24K Leaf Inlays</h4>
              <p className="text-xs text-[#85796B] leading-relaxed">
                Hand-floated metallic foils create multi-dimensional shimmer that dances under daylight and ambient chandeliers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8DCCB] shadow-card space-y-3">
              <ShieldCheck className="w-8 h-8 text-[#C6A15B]" />
              <h4 className="font-serif text-base font-bold text-[#332820]">UV Anti-Yellowing</h4>
              <p className="text-xs text-[#85796B] leading-relaxed">
                Our optical grade cast resin provides crystal clear transparency that stands the test of years.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E8DCCB] shadow-card space-y-3">
              <HeartHandshake className="w-8 h-8 text-[#C6A15B]" />
              <h4 className="font-serif text-base font-bold text-[#332820]">Artisan WhatsApp Care</h4>
              <p className="text-xs text-[#85796B] leading-relaxed">
                Receive live video previews of your floral arrangement in the mold before the final liquid pour.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h3 className="font-serif text-3xl font-bold text-[#332820]">
          Ready to Commission Your Heirloom?
        </h3>
        <p className="text-xs sm:text-sm text-[#85796B] max-w-md mx-auto">
          Explore ready-to-dispatch designs in our shop or begin a bespoke preservation consultation with our master artist.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#332820] hover:bg-[#A9823D] text-white px-8 py-3.5 rounded-full font-bold text-xs shadow-card transition-colors"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/custom-order"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C6A15B] hover:bg-[#A9823D] text-white px-8 py-3.5 rounded-full font-bold text-xs shadow-gold transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Customize on WhatsApp</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

