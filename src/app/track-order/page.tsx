'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  MessageCircle, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatPrice, formatDate, buildWhatsAppOrderSupportUrl } from '@/lib/utils';
import { Order } from '@/lib/types';

export default function TrackOrderPage() {
  const { orders } = useStore();
  const [query, setQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toLowerCase();
    const match = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === clean ||
        o.id.toLowerCase() === clean ||
        o.customer.phone.replace(/\D/g, '').includes(clean.replace(/\D/g, ''))
    );
    setSearchedOrder(match || null);
    setHasSearched(true);
  };

  const statusSteps = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
  const currentStepIndex = searchedOrder ? statusSteps.indexOf(searchedOrder.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#A9823D]">
          Order Fulfillment
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#332820]">
          Track Your Handcrafted Piece
        </h1>
        <p className="text-xs sm:text-sm text-[#85796B]">
          Enter your 6-digit Order ID (e.g. RA-123456) or the mobile phone number used during checkout.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="max-w-xl mx-auto bg-white p-4 sm:p-6 rounded-3xl border border-[#E8DCCB] shadow-card">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. RA-847291 or 9876543210"
              className="w-full bg-[#FFF9F0]/60 border border-[#E8DCCB] rounded-2xl pl-10 pr-4 py-3 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B]"
            />
            <Search className="w-4 h-4 text-[#85796B] absolute left-3.5 top-3.5" />
          </div>
          <button
            type="submit"
            className="bg-[#332820] hover:bg-[#A9823D] text-white px-7 py-3 rounded-2xl font-bold text-xs shadow-card transition-colors flex items-center justify-center gap-2"
          >
            <span>Track Order</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Results */}
      {hasSearched && (
        <div className="max-w-2xl mx-auto">
          {searchedOrder ? (
            <div className="bg-white rounded-3xl border border-[#E8DCCB] p-6 sm:p-8 shadow-card space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DCCB]">
                <div>
                  <span className="text-[10px] text-[#85796B] uppercase font-bold tracking-wider">
                    Order Found
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#332820]">
                    #{searchedOrder.orderNumber}
                  </h3>
                  <p className="text-xs text-[#85796B]">
                    Placed on {formatDate(searchedOrder.createdAt)}
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-block bg-[#F5EBDD] text-[#A9823D] text-xs font-bold px-3 py-1 rounded-full border border-[#E8DCCB]">
                    {searchedOrder.status}
                  </span>
                  <p className="text-xs font-bold text-[#332820] mt-1">
                    {formatPrice(searchedOrder.total)}
                  </p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="py-4">
                <div className="flex items-center justify-between relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#E8DCCB] w-full z-0" />
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#C6A15B] transition-all duration-500 z-0"
                    style={{
                      width: `${(Math.max(0, currentStepIndex) / (statusSteps.length - 1)) * 100}%`,
                    }}
                  />

                  {statusSteps.map((step, idx) => {
                    const isCompleted = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;

                    return (
                      <div key={step} className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isCompleted
                              ? 'bg-[#C6A15B] text-white shadow-gold'
                              : 'bg-white border-2 border-[#E8DCCB] text-[#85796B]'
                          } ${isCurrent ? 'ring-4 ring-[#C6A15B]/20 scale-110' : ''}`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span className={`text-[10px] mt-2 font-medium ${isCurrent ? 'font-bold text-[#332820]' : 'text-[#85796B]'}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items summary */}
              <div className="space-y-2 pt-2 border-t border-[#E8DCCB]/60 text-xs">
                <h4 className="font-bold text-[#332820]">Package Contents</h4>
                {searchedOrder.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between text-[#85796B]">
                    <span>{i.productName} × {i.quantity}</span>
                    <span className="font-semibold text-[#332820]">{formatPrice(i.price * i.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Destination */}
              <div className="p-4 rounded-2xl bg-[#FFF9F0] border border-[#E8DCCB] text-xs flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#332820]">
                  <MapPin className="w-4 h-4 text-[#C6A15B] shrink-0" />
                  <span>
                    Delivering to: <strong>{searchedOrder.customer.city}, {searchedOrder.customer.state}</strong>
                  </span>
                </div>
                <a
                  href={buildWhatsAppOrderSupportUrl(searchedOrder.orderNumber)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Live WhatsApp Support</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#E8DCCB] p-8 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <h4 className="font-serif text-lg font-bold text-[#332820]">Order Not Found</h4>
              <p className="text-xs text-[#85796B] max-w-sm mx-auto">
                We couldn&apos;t find an order matching &quot;{query}&quot;. Please double check your order number or phone number.
              </p>
              <a
                href={buildWhatsAppOrderSupportUrl(query)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full mt-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ask Support on WhatsApp</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

