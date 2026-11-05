'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  MessageCircle, 
  Send, 
  Image as ImageIcon, 
  Check, 
  Flower2, 
  Heart, 
  ShieldCheck, 
  Clock, 
  HelpCircle 
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { getWhatsAppNumber } from '@/lib/utils';

export default function CustomOrderPage() {
  const { settings } = useStore();

  const [productType, setProductType] = useState('Wedding Garland Preservation Clock');
  const [preferredDesign, setPreferredDesign] = useState('Ocean Turquoise Waves with 24K Gold Flakes');
  const [inclusions, setInclusions] = useState<string[]>(['24K Gold Leaf Flakes', 'Real Preserved Dried Flowers']);
  const [customizationDetails, setCustomizationDetails] = useState('');
  const [namesOrDates, setNamesOrDates] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const productTypes = [
    { name: 'Wedding Garland Preservation Clock', desc: '12" or 14" clock with Roman gold numerals' },
    { name: 'Custom Couple Name Plate', desc: 'Ocean wave or marble agate wall plaque' },
    { name: 'Bridal Bouquet Floral Preservation Block', desc: 'Deep faceted cube / hex displaying bridal petals' },
    { name: 'Personalized 24K Initial Keychain', desc: 'Alphabet A-Z with gold leaf & tassel' },
    { name: 'Luxury Resin Ring Platter', desc: 'Geode crystal engagement display' },
    { name: 'Set of 4 / 6 Geode Coasters', desc: 'Hand-painted gilded rims with non-slip feet' },
    { name: 'Other Custom Concept', desc: 'Custom resin furniture inlay, tray, or sculpture' },
  ];

  const designThemes = [
    'Ocean Turquoise Waves with 24K Gold Flakes',
    'Calacatta White & Pearl Marble with Gold Veining',
    'Royal Emerald Green & Champagne Sparkle',
    'Blush Pink Petals & Floating Silver Leaf',
    'Midnight Black & Heavy 24K Gold Leaf',
    'Clear Minimalist Botanical (Natural Preserved Flowers)',
  ];

  const inclusionOptions = [
    '24K Gold Leaf Flakes',
    'Real Preserved Dried Flowers',
    'Client Wedding Varmala Petals',
    'Raw Quartz Crystals',
    'Silver / Holographic Flakes',
    'Subsurface Photo Print',
    'Sand & Micro-Shells',
  ];

  const toggleInclusion = (item: string) => {
    setInclusions((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleOpenWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    const phone = (settings.whatsappNumber || getWhatsAppNumber()).replace(/\D/g, '');

    const combinedDetails = [
      customizationDetails.trim() ? customizationDetails.trim() : 'Bespoke artisan specifications',
      namesOrDates ? `Inscribed Name/Date: ${namesOrDates}` : null,
      inclusions.length > 0 ? `Inclusions: ${inclusions.join(', ')}` : null,
    ].filter(Boolean).join(' | ');

    const message = `Hello ResinAura!
I want to order a customized resin product.

*Customer Name:* ${customerName || 'Valued Customer'}
*Phone:* ${customerPhone || 'Not provided'}
*Product Type:* ${productType}
*Customization Details:* ${combinedDetails}
*Preferred Design:* ${preferredDesign}
*Quantity:* ${quantity}

Please share the pricing and delivery details. I have reference photos ready to share!`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#F5EBDD] border border-[#E8DCCB] px-4 py-1.5 rounded-full text-xs font-bold text-[#A9823D] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
          Bespoke Customizer Studio
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#332820]">
          Create Your Own Design
        </h1>
        <p className="text-sm sm:text-base text-[#85796B] leading-relaxed">
          Whether you want to preserve your wedding garlands, encapsulate raw crystal stones, or customize initial keychains for your guests, our master artists bring your vision to life.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Form Interactive Configuration */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8DCCB] p-6 sm:p-8 shadow-card space-y-8">
          <form onSubmit={handleOpenWhatsApp} className="space-y-8">
            {/* Step 1: Select Product Type */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-[#332820] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#C6A15B] text-white flex items-center justify-center text-xs">1</span>
                  Select Product Type
                </label>
                <span className="text-[11px] text-[#85796B]">Required</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {productTypes.map((pt) => {
                  const isSelected = productType === pt.name;
                  return (
                    <button
                      key={pt.name}
                      type="button"
                      onClick={() => setProductType(pt.name)}
                      className={`text-left p-3.5 rounded-2xl border transition-all ${
                        isSelected
                          ? 'border-[#C6A15B] bg-[#FFF9F0] ring-1 ring-[#C6A15B]'
                          : 'border-[#E8DCCB] hover:border-[#C6A15B]/60 hover:bg-[#F5EBDD]/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-xs font-bold text-[#332820]">{pt.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#C6A15B] shrink-0" />}
                      </div>
                      <p className="text-[10px] text-[#85796B] mt-1">{pt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Preferred Design Theme */}
            <div>
              <label className="text-sm font-bold text-[#332820] flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-[#C6A15B] text-white flex items-center justify-center text-xs">2</span>
                Preferred Color Palette / Design
              </label>
              <div className="space-y-2">
                {designThemes.map((theme) => {
                  const isSelected = preferredDesign === theme;
                  return (
                    <button
                      key={theme}
                      type="button"
                      onClick={() => setPreferredDesign(theme)}
                      className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-[#C6A15B] bg-[#FFF9F0] font-bold text-[#A9823D]'
                          : 'border-[#E8DCCB] text-[#332820] hover:bg-[#F5EBDD]/40'
                      }`}
                    >
                      <span>{theme}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#C6A15B]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Botanical & Foil Inclusions */}
            <div>
              <label className="text-sm font-bold text-[#332820] flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-[#C6A15B] text-white flex items-center justify-center text-xs">3</span>
                Select Inclusions & Elements
              </label>
              <p className="text-xs text-[#85796B] mb-3">
                Choose what you want embedded inside the crystal clear resin:
              </p>
              <div className="flex flex-wrap gap-2">
                {inclusionOptions.map((inc) => {
                  const isChecked = inclusions.includes(inc);
                  return (
                    <button
                      key={inc}
                      type="button"
                      onClick={() => toggleInclusion(inc)}
                      className={`text-xs px-3.5 py-2 rounded-full border transition-all flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-[#332820] text-white border-[#332820] font-semibold'
                          : 'bg-white text-[#85796B] border-[#E8DCCB] hover:border-[#332820]'
                      }`}
                    >
                      <span>{inc}</span>
                      {isChecked && <Check className="w-3 h-3 text-[#C6A15B]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Personalization & Details */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-[#332820] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#C6A15B] text-white flex items-center justify-center text-xs">4</span>
                Personalization Names, Dates & Notes
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#85796B] mb-1">
                    Names / Initials / Date to Inscribe:
                  </label>
                  <input
                    type="text"
                    value={namesOrDates}
                    onChange={(e) => setNamesOrDates(e.target.value)}
                    placeholder="e.g. 'Rahul & Simran • 14.02.2024'"
                    className="w-full bg-[#FFF9F0]/60 border border-[#E8DCCB] rounded-xl px-3.5 py-2.5 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#85796B] mb-1">
                    Quantity:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-[#FFF9F0]/60 border border-[#E8DCCB] rounded-xl px-3.5 py-2.5 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#85796B] mb-1">
                  Specific Customization Details / Size requests:
                </label>
                <textarea
                  rows={3}
                  value={customizationDetails}
                  onChange={(e) => setCustomizationDetails(e.target.value)}
                  placeholder="Describe your vision (e.g. 'I want to preserve our marriage varmala roses around a 12 inch clock with golden hands and heavy gold leaf in the center')."
                  className="w-full bg-[#FFF9F0]/60 border border-[#E8DCCB] rounded-xl p-3 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B]"
                />
              </div>
            </div>

            {/* Step 5: Contact Info */}
            <div className="space-y-3 pt-2 border-t border-[#E8DCCB]">
              <label className="text-sm font-bold text-[#332820] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#C6A15B] text-white flex items-center justify-center text-xs">5</span>
                Your Contact Information
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#85796B] mb-1">
                    Your Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-[#FFF9F0]/60 border border-[#E8DCCB] rounded-xl px-3.5 py-2.5 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#85796B] mb-1">
                    WhatsApp Number:
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full bg-[#FFF9F0]/60 border border-[#E8DCCB] rounded-xl px-3.5 py-2.5 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>
              </div>
            </div>

            {/* Main Action Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#C6A15B] hover:bg-[#A9823D] text-white py-4 px-6 rounded-2xl font-bold text-base shadow-gold transition-all duration-300 active:scale-98"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Customize Your Order on WhatsApp</span>
              </button>
              <p className="text-[11px] text-center text-[#85796B] mt-2">
                You will be connected directly with our senior artisan on WhatsApp. You can send reference photos immediately!
              </p>
            </div>
          </form>
        </div>

        {/* Live Preview & Instructions Card */}
        <div className="lg:col-span-5 space-y-6">
          {/* Summary Preview Box */}
          <div className="bg-[#FFF9F0] border-2 border-[#C6A15B]/40 rounded-3xl p-6 shadow-elevation space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DCCB]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A9823D]">
                Order Preview
              </span>
              <span className="text-[10px] bg-white border border-[#E8DCCB] px-2 py-0.5 rounded-full text-[#85796B]">
                WhatsApp Direct Sync
              </span>
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-[#332820]">
                {productType}
              </h3>
              <p className="text-xs text-[#A9823D] font-medium mt-0.5">
                Theme: {preferredDesign}
              </p>
            </div>

            <div className="space-y-2 text-xs bg-white p-4 rounded-2xl border border-[#E8DCCB]">
              <div className="flex justify-between">
                <span className="text-[#85796B]">Quantity:</span>
                <span className="font-bold text-[#332820]">{quantity}</span>
              </div>
              {namesOrDates && (
                <div className="flex justify-between">
                  <span className="text-[#85796B]">Inscription:</span>
                  <span className="font-bold text-[#332820]">{namesOrDates}</span>
                </div>
              )}
              {inclusions.length > 0 && (
                <div>
                  <span className="text-[#85796B] block mb-1">Inclusions:</span>
                  <div className="flex flex-wrap gap-1">
                    {inclusions.map((inc) => (
                      <span key={inc} className="bg-[#F5EBDD] text-[#332820] text-[10px] px-2 py-0.5 rounded-md font-medium">
                        {inc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-[#F5EBDD]/60 border border-[#E8DCCB] text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#332820]">
                <ImageIcon className="w-4 h-4 text-[#C6A15B]" />
                <span>Reference Photos & Garlands</span>
              </div>
              <p className="text-[11px] text-[#85796B] leading-relaxed">
                After clicking the button, WhatsApp will open. Simply attach any photos, color palettes, or sketches you like. If sending real wedding garlands, we provide pickup packaging instructions.
              </p>
            </div>
          </div>

          {/* How Custom Orders Work */}
          <div className="bg-white rounded-3xl border border-[#E8DCCB] p-6 shadow-card space-y-4">
            <h4 className="font-serif text-base font-bold text-[#332820]">
              The Bespoke Process
            </h4>
            <div className="space-y-3 text-xs text-[#85796B]">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#F5EBDD] text-[#A9823D] flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </div>
                <div>
                  <h5 className="font-bold text-[#332820]">One-on-One Consultation</h5>
                  <p className="text-[11px] mt-0.5">We discuss your flower condition, sizes, and send a quotation.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#F5EBDD] text-[#A9823D] flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </div>
                <div>
                  <h5 className="font-bold text-[#332820]">Dehydration & Preparation</h5>
                  <p className="text-[11px] mt-0.5">Flowers are dried in silica gel to lock in vibrant petal shades.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#F5EBDD] text-[#A9823D] flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </div>
                <div>
                  <h5 className="font-bold text-[#332820]">Artisan Pouring & Curing</h5>
                  <p className="text-[11px] mt-0.5">Cast in multi-stage layers over 48 hours to eliminate air bubbles.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#F5EBDD] text-[#A9823D] flex items-center justify-center font-bold text-xs shrink-0">
                  4
                </div>
                <div>
                  <h5 className="font-bold text-[#332820]">Video Approval & Express Shipping</h5>
                  <p className="text-[11px] mt-0.5">We send a high-res video for your final blessing before dispatch.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

