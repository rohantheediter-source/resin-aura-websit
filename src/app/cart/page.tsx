'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Tag, 
  Truck,
  ArrowLeft
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    cartSubtotal, 
    shippingFee, 
    settings,
    showToast 
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'RESINAURA10') {
      setDiscountPercent(10);
      setCouponApplied(true);
      showToast('Coupon Applied!', '10% discount applied to your order', 'success');
    } else if (code === 'AURA5') {
      setDiscountPercent(5);
      setCouponApplied(true);
      showToast('Coupon Applied!', '5% discount applied to your order', 'success');
    } else {
      showToast('Invalid Coupon', 'Try using code "RESINAURA10"', 'error');
    }
  };

  const discountAmount = Math.round((cartSubtotal * discountPercent) / 100);
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + (cartSubtotal > 0 ? shippingFee : 0));

  const amountNeededForFreeShipping = Math.max(0, settings.freeShippingThreshold - cartSubtotal);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-[#F5EBDD] flex items-center justify-center mx-auto text-[#A9823D] mb-4">
          <ShoppingBag className="w-10 h-10 opacity-70" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#332820]">Your Cart is Currently Empty</h1>
        <p className="text-sm text-[#85796B] mt-2 mb-8 max-w-md mx-auto">
          You haven&apos;t added any handcrafted resin pieces to your shopping bag yet. Explore our bestsellers and handmade gifts!
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-[#332820] hover:bg-[#A9823D] text-white px-8 py-3.5 rounded-full font-semibold text-sm shadow-card transition-colors"
        >
          <span>Explore Handmade Collections</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DCCB]">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#332820]">
            Shopping Bag
          </h1>
          <p className="text-xs text-[#85796B] mt-1">
            Review your items and proceed to secure checkout
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={clearCart}
            className="text-xs text-[#85796B] hover:text-red-600 transition-colors"
          >
            Clear Entire Bag
          </button>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A9823D] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Alert Bar */}
          <div className="p-4 rounded-2xl bg-[#F5EBDD]/70 border border-[#E8DCCB] text-xs">
            {amountNeededForFreeShipping > 0 ? (
              <div className="flex items-center gap-2 text-[#332820] font-medium">
                <Truck className="w-4 h-4 text-[#A9823D] shrink-0" />
                <span>
                  Add <strong className="text-[#A9823D]">{formatPrice(amountNeededForFreeShipping)}</strong> more to your order for <strong className="underline">FREE Nationwide Shipping</strong>!
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Congratulations! Your order qualifies for FREE Nationwide Express Shipping.</span>
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-2xl border border-[#E8DCCB] p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row gap-4 sm:items-center justify-between"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-[#E8DCCB] shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#A9823D]">
                      {item.product.category}
                    </span>
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-serif text-base font-bold text-[#332820] hover:text-[#A9823D] block truncate"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-[#85796B] mt-0.5">
                      Unit Price: {formatPrice(item.product.price)}
                    </p>
                    {item.customNote && (
                      <p className="text-xs text-[#A9823D] italic mt-1">
                        Personalization: &quot;{item.customNote}&quot;
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E8DCCB]/60">
                  {/* Quantity */}
                  <div className="flex items-center border border-[#E8DCCB] rounded-xl bg-[#F5EBDD]/30">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-2 text-[#332820] hover:text-[#C6A15B]"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-[#332820]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="p-2 text-[#332820] hover:text-[#C6A15B] disabled:opacity-30"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="text-base font-bold text-[#332820]">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-[#85796B] hover:text-red-600 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-[#E8DCCB] p-6 shadow-card space-y-6 sticky top-28">
            <h3 className="font-serif text-xl font-bold text-[#332820] pb-3 border-b border-[#E8DCCB]">
              Order Summary
            </h3>

            {/* Coupon Code Input */}
            <div>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code (RESINAURA10)"
                    disabled={couponApplied}
                    className="w-full bg-[#FFF9F0]/60 border border-[#E8DCCB] rounded-xl pl-8 pr-3 py-2 text-xs text-[#332820] uppercase placeholder-stone-400 focus:outline-none focus:border-[#C6A15B]"
                  />
                  <Tag className="w-3.5 h-3.5 text-[#85796B] absolute left-2.5 top-2.5" />
                </div>
                <button
                  type="submit"
                  disabled={couponApplied || !couponCode.trim()}
                  className="bg-[#332820] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#A9823D] disabled:opacity-40 transition-colors"
                >
                  {couponApplied ? 'Applied' : 'Apply'}
                </button>
              </form>
              {couponApplied && (
                <p className="text-[11px] text-emerald-600 font-semibold mt-1.5">
                  ✓ {discountPercent}% discount code active
                </p>
              )}
            </div>

            {/* Breakdown */}
            <div className="space-y-3 text-xs border-t border-[#E8DCCB] pt-4">
              <div className="flex justify-between text-[#85796B]">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#332820]">{formatPrice(cartSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount ({discountPercent}%)</span>
                  <span className="font-bold">-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#85796B]">
                <span>Nationwide Shipping</span>
                <span className="font-semibold text-[#332820]">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-lg font-bold text-[#332820] pt-3 border-t border-[#E8DCCB]">
                <span>Grand Total</span>
                <span className="text-[#A9823D]">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <div className="pt-2 space-y-3">
              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-[#C6A15B] hover:bg-[#A9823D] text-white py-3.5 px-6 rounded-2xl font-bold text-sm shadow-gold transition-all duration-200"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#85796B]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Encrypted &amp; Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

