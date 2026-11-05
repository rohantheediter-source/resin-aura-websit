'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  MessageCircle, 
  Printer, 
  ArrowRight, 
  Sparkles,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatPrice, formatDate, buildWhatsAppOrderSupportUrl } from '@/lib/utils';

export default function OrderSuccessPage({ params }: { params: { orderId: string } }) {
  const { getOrderById } = useStore();
  const order = getOrderById(params.orderId);

  useEffect(() => {
    // Launch celebratory gold and cream confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C6A15B', '#DFBF7F', '#332820', '#A9823D'],
      });
    } catch {}
  }, []);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10">
      {/* Top Success Badge */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A9823D] bg-[#F5EBDD] px-3.5 py-1 rounded-full uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
          Thank You For Supporting Artisan Craft
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#332820]">
          Your Order Has Been Confirmed!
        </h1>
        <p className="text-sm text-[#85796B] max-w-md mx-auto">
          We have received your order. Our resin artisans are preparing your handmade pieces with precision and care.
        </p>
      </div>

      {/* Main Order Receipt Card */}
      <div className="bg-white rounded-3xl border border-[#E8DCCB] p-6 sm:p-10 shadow-card space-y-8 print:border-none print:shadow-none">
        {/* Receipt Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DCCB]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#85796B]">
              Order Number
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#332820]">
              #{order?.orderNumber || params.orderId}
            </h3>
            <p className="text-xs text-[#85796B] mt-0.5">
              Placed on {formatDate(order?.createdAt || new Date().toISOString())}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Status: {order?.status || 'Confirmed'}
            </span>
            <button
              onClick={handlePrint}
              className="p-2 text-[#85796B] hover:text-[#332820] rounded-xl hover:bg-[#F5EBDD] transition-colors print:hidden"
              title="Print Receipt"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Estimated Delivery Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#FFF9F0] border border-[#E8DCCB] text-xs">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#C6A15B] shrink-0" />
            <div>
              <p className="font-bold text-[#332820]">Artisan Curing Time</p>
              <p className="text-[11px] text-[#85796B]">24 - 48 Hours</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-[#C6A15B] shrink-0" />
            <div>
              <p className="font-bold text-[#332820]">Express Courier</p>
              <p className="text-[11px] text-[#85796B]">Bluedart / Delhivery</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#C6A15B] shrink-0" />
            <div>
              <p className="font-bold text-[#332820]">Est. Delivery By</p>
              <p className="text-[11px] text-[#85796B]">{formatDate(estimatedDelivery.toISOString())}</p>
            </div>
          </div>
        </div>

        {/* Ordered Items Table */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#332820] mb-4">
            Items in this Order
          </h4>
          <div className="divide-y divide-[#E8DCCB]/60">
            {order?.items && order.items.length > 0 ? (
              order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {item.productImage && (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-12 h-12 rounded-lg object-cover border border-[#E8DCCB]"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-[#332820]">{item.productName}</p>
                      <p className="text-[11px] text-[#85796B]">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-[#332820]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#85796B] py-2">Handcrafted items confirmed.</p>
            )}
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="pt-4 border-t border-[#E8DCCB] space-y-2 text-xs">
          <div className="flex justify-between text-[#85796B]">
            <span>Items Subtotal</span>
            <span className="font-semibold text-[#332820]">
              {formatPrice(order?.subtotal || 0)}
            </span>
          </div>
          <div className="flex justify-between text-[#85796B]">
            <span>Shipping</span>
            <span className="font-semibold text-[#332820]">
              {order?.shipping === 0 ? 'FREE' : formatPrice(order?.shipping || 0)}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold text-[#332820] pt-2 border-t border-[#E8DCCB]">
            <span>Total Paid</span>
            <span className="text-[#A9823D]">{formatPrice(order?.total || 0)}</span>
          </div>
          <div className="flex justify-between text-[11px] text-[#85796B]">
            <span>Payment Method</span>
            <span className="uppercase font-medium">
              {order?.paymentMethod === 'razorpay'
                ? 'Razorpay Online'
                : order?.paymentMethod === 'cod'
                ? 'Cash on Delivery'
                : 'WhatsApp'}
            </span>
          </div>
        </div>

        {/* Shipping Address Summary */}
        {order?.customer && (
          <div className="pt-4 border-t border-[#E8DCCB]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#332820] mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C6A15B]" />
              Shipping Destination
            </h4>
            <p className="text-xs font-semibold text-[#332820]">{order.customer.fullName}</p>
            <p className="text-xs text-[#85796B]">{order.customer.streetAddress}</p>
            {order.customer.landmark && (
              <p className="text-xs text-[#85796B]">Landmark: {order.customer.landmark}</p>
            )}
            <p className="text-xs text-[#85796B]">
              {order.customer.city}, {order.customer.state} - {order.customer.pinCode}
            </p>
            <p className="text-xs text-[#85796B] mt-1">Phone: {order.customer.phone}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 print:hidden">
        <a
          href={buildWhatsAppOrderSupportUrl(order?.orderNumber || params.orderId)}
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-emerald-600 text-white px-7 py-3.5 rounded-full font-bold text-xs shadow-md transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Track via WhatsApp with Artisan</span>
        </a>

        <Link
          href="/account"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#332820] hover:bg-[#A9823D] text-white px-7 py-3.5 rounded-full font-bold text-xs shadow-card transition-colors"
        >
          <Package className="w-4 h-4" />
          <span>View in My Orders</span>
        </Link>

        <Link
          href="/products"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F5EBDD] text-[#332820] border border-[#E8DCCB] px-6 py-3.5 rounded-full font-semibold text-xs transition-colors"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

