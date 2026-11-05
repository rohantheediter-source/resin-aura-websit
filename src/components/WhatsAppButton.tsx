'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Sparkles, Send, HeartHandshake } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { getWhatsAppNumber } from '@/lib/utils';

export default function WhatsAppButton() {
  const { settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const phone = (settings.whatsappNumber || getWhatsAppNumber()).replace(/\D/g, '');

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
    <div className="fixed bottom-6 right-6 z-40">
      {/* Quick Menu Popover */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-[#FFF9F0] border border-[#E8DCCB] rounded-2xl shadow-elevation p-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
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

          <p className="text-xs text-[#85796B] my-3">
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

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-4 py-3 rounded-full shadow-elevation hover:shadow-2xl transition-all duration-300 active:scale-95"
        aria-label="Open WhatsApp Chat with ResinAura"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 fill-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#C6A15B] rounded-full ring-2 ring-white"></span>
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-100">
            Customize On WhatsApp
          </span>
          <span className="text-xs font-bold leading-tight flex items-center gap-1">
            Chat with Artisan <Sparkles className="w-3 h-3 text-amber-300" />
          </span>
        </div>
      </button>
    </div>
  );
}

