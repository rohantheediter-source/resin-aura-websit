'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MessageCircle, 
  Instagram, 
  Mail, 
  MapPin, 
  Phone, 
  Clock, 
  Send, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { getWhatsAppNumber } from '@/lib/utils';

export default function ContactPage() {
  const { settings, showToast } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Custom Order Inquiry',
    message: '',
  });
  const [isSent, setIsSent] = useState(false);

  const phone = (settings.whatsappNumber || getWhatsAppNumber()).replace(/\D/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    showToast('Message Sent', 'Thank you! We will reply on email or WhatsApp shortly.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#A9823D]">
          Artisan Atelier
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#332820]">
          Connect With ResinAura
        </h1>
        <p className="text-xs sm:text-sm text-[#85796B]">
          Have questions regarding flower delivery for wedding varmala preservation, bulk gifting, or order status? We are always happy to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Direct Channels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#332820] text-white p-8 rounded-3xl shadow-card space-y-6">
            <h3 className="font-serif text-2xl font-bold">Studio Headquarters</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Our master pouring atelier is located in India, where each piece is handcrafted, cured, and hand-polished before shipping nationwide.
            </p>

            <div className="space-y-4 text-xs">
              <a
                href={`https://wa.me/${phone}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 hover:bg-[#25D366]/20 transition-colors border border-white/10"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-emerald-300 font-bold uppercase">Fastest Response</span>
                  <p className="font-bold text-white text-sm">+{settings.whatsappNumber}</p>
                </div>
              </a>

              <a
                href="https://instagram.com/resinaura.store"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 hover:bg-white/15 transition-colors border border-white/10"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shrink-0">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-[#C6A15B] font-bold uppercase">Instagram DM &amp; Reels</span>
                  <p className="font-bold text-white text-sm">@resinaura.store</p>
                </div>
              </a>

              <div className="flex items-center gap-3 p-3 text-stone-300">
                <Clock className="w-5 h-5 text-[#C6A15B] shrink-0" />
                <div>
                  <p className="font-bold text-white">Studio Hours</p>
                  <p className="text-[11px]">Monday – Saturday: 10:00 AM – 8:00 PM IST</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#F5EBDD] p-6 rounded-3xl border border-[#E8DCCB] space-y-2">
            <span className="text-xs font-bold text-[#A9823D] uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
              Wedding Flower Delivery
            </span>
            <p className="text-xs text-[#332820] leading-relaxed">
              For wedding flower preservation, please WhatsApp us within 2-4 days following your wedding ceremony. We provide instructions on how to wrap florals safely for courier dispatch to our studio.
            </p>
          </div>
        </div>

        {/* Right Column: Inquiry Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8DCCB] p-6 sm:p-8 shadow-card">
          <h3 className="font-serif text-2xl font-bold text-[#332820] mb-2">
            Send an Atelier Inquiry
          </h3>
          <p className="text-xs text-[#85796B] mb-6">
            Fill in the details below and our team will get in touch via email or WhatsApp.
          </p>

          {isSent ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-serif text-xl font-bold text-emerald-900">Inquiry Received</h4>
              <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                Thank you, {formData.name}! Our senior artisan has been notified and will reply shortly.
              </p>
              <button
                onClick={() => setIsSent(false)}
                className="mt-4 text-xs font-bold text-[#332820] underline"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#332820] mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full bg-[#FFF9F0]/60 border border-[#E8DCCB] rounded-xl px-3.5 py-2.5 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#332820] mb-1">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Mobile number"
                    className="w-full bg-[#FFF9F0]/60 border border-[#E8DCCB] rounded-xl px-3.5 py-2.5 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#332820] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full bg-[#FFF9F0]/60 border border-[#E8DCCB] rounded-xl px-3.5 py-2.5 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#332820] mb-1">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-[#FFF9F0]/60 border border-[#E8DCCB] rounded-xl px-3.5 py-2.5 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B]"
                >
                  <option value="Wedding Garland Preservation">Wedding Garland Preservation</option>
                  <option value="Custom Initial Keychain Order">Custom Initial Keychain Order</option>
                  <option value="House Name Plate Inquiry">House Name Plate Inquiry</option>
                  <option value="Corporate / Bulk Festive Gifting">Corporate / Bulk Festive Gifting</option>
                  <option value="Order Tracking & Support">Order Tracking &amp; Support</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#332820] mb-1">Message Details *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details regarding your design, date requirements, or flower type..."
                  className="w-full bg-[#FFF9F0]/60 border border-[#E8DCCB] rounded-xl p-3 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-[#332820] hover:bg-[#A9823D] text-white px-8 py-3.5 rounded-2xl font-bold text-xs shadow-card transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#C6A15B]" />
                  <span>Send Studio Inquiry</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

