'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Sparkles, Send, ArrowRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { getWhatsAppNumber } from '@/lib/utils';

export function TelegramIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.832.946z" />
    </svg>
  );
}

export default function WhatsAppButton() {
  const { settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const phone = (settings.whatsappNumber || getWhatsAppNumber()).replace(/\D/g, '');
  const telegramUrl = 'https://t.me/+jIIGcRbh3Hc3MmU1';

  const quickOptions = [
    {
      label: '🌸 Preserve Wedding Garland / Flowers',
      text: 'Hello ResinAura! I would like to inquire about preserving my wedding garland / flowers into a custom resin clock or frame. Please share details and pricing!',
    },
    {
      label: '✨ Custom Initial Keychain / Jewellery',
      text: 'Hello! I want to order a customized initial resin keychain / jewellery with gold foil. What options are available?',
    },
    {
      label: '🏡 Custom House Name Plate',
      text: 'Hi ResinAura, I am looking for a customized ocean wave resin name plate for my home. Can you share samples and dimensions?',
    },
    {
      label: '📦 Track My Order Status',
      text: 'Hello! I would like an update on my ResinAura order. Here are my details:',
    },
  ];

  const handleSend = (text: string) => {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
      {/* Quick Menu Popover */}
      {isOpen && (
        <div className="mb-2 w-80 sm:w-96 bg-[#FFF9F0] border border-[#E8DCCB] rounded-2xl shadow-elevation p-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8DCCB]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                RA
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#332820]">ResinAura Artisan Support</h4>
                <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Replies within minutes on WhatsApp
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#85796B] hover:text-[#332820] p-1 rounded-full hover:bg-[#F5EBDD]"
              aria-label="Close chat menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Telegram Channel Highlight Inside Popover */}
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="my-3 bg-gradient-to-r from-[#229ED9]/15 to-[#2AABEE]/10 hover:from-[#229ED9]/25 hover:to-[#2AABEE]/20 border border-[#229ED9]/30 hover:border-[#229ED9] p-2.5 rounded-xl transition-all flex items-center justify-between group block"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#229ED9] text-white flex items-center justify-center shrink-0 shadow-sm">
                <TelegramIcon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#332820] flex items-center gap-1.5">
                  Join Telegram Community
                  <span className="text-[9px] bg-[#229ED9] text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Official
                  </span>
                </p>
                <p className="text-[10px] text-[#85796B]">Exclusive resin previews, video updates &amp; drops</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#229ED9] group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
          </a>

          <p className="text-xs text-[#85796B] mb-2 font-medium">
            Choose an inquiry topic below or send your custom request:
          </p>

          {/* Quick Click Options */}
          <div className="space-y-2 mb-3">
            {quickOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSend(opt.text)}
                className="w-full text-left text-xs bg-white hover:bg-[#F5EBDD] text-[#332820] p-2.5 rounded-xl border border-[#E8DCCB] transition-colors flex items-center justify-between group"
              >
                <span className="font-medium truncate">{opt.label}</span>
                <Send className="w-3 h-3 text-[#C6A15B] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
              </button>
            ))}
          </div>

          {/* Custom Message Input */}
          <div className="flex gap-2 pt-2 border-t border-[#E8DCCB]">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="Type your custom request..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customMsg.trim()) {
                  handleSend(customMsg);
                }
              }}
              className="flex-1 bg-white border border-[#E8DCCB] rounded-xl px-3 py-1.5 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B]"
            />
            <button
              onClick={() => {
                if (customMsg.trim()) {
                  handleSend(customMsg);
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl transition-colors shrink-0"
              aria-label="Send via WhatsApp"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Buttons Bar */}
      <div className="flex items-center gap-2.5">
        {/* Floating Telegram Button */}
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-2 bg-gradient-to-r from-[#2AABEE] to-[#229ED9] hover:from-[#229ED9] hover:to-[#1B8CC4] text-white px-3.5 py-3 rounded-full shadow-elevation hover:shadow-2xl transition-all duration-300 active:scale-95 border border-white/20"
          aria-label="Join ResinAura Telegram Channel"
          title="Join ResinAura Telegram Channel"
        >
          <div className="relative">
            <TelegramIcon className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-white animate-pulse"></span>
          </div>
          <div className="hidden sm:flex flex-col text-left pr-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-sky-100 leading-none">
              Join Telegram
            </span>
            <span className="text-xs font-bold leading-tight flex items-center gap-1 mt-0.5">
              Exclusive Drops <Sparkles className="w-3 h-3 text-amber-300" />
            </span>
          </div>
        </a>

        {/* Floating WhatsApp Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-4 py-3 rounded-full shadow-elevation hover:shadow-2xl transition-all duration-300 active:scale-95 border border-white/20"
          aria-label="Open WhatsApp Chat with ResinAura"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6 fill-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#C6A15B] rounded-full ring-2 ring-white"></span>
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-100 leading-none">
              Chat On WhatsApp
            </span>
            <span className="text-xs font-bold leading-tight flex items-center gap-1 mt-0.5">
              Artisan Support <Sparkles className="w-3 h-3 text-amber-300" />
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
