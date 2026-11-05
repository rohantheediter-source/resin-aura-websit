'use client';

import React from 'react';
import Link from 'next/link';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateQuantity, 
    cartSubtotal, 
    cartTotal, 
    shippingFee, 
    settings 
  } = useStore();

  if (!isCartOpen) return null;

  const freeShippingThreshold = settings.freeShippingThreshold;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFF9F0] shadow-elevation flex flex-col justify-between border-l border-[#E8DCCB] animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-[#E8DCCB] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C6A15B]" />
              <h2 className="font-serif text-lg font-bold text-[#332820]">Your Shopping Bag</h2>
              <span className="text-xs font-semibold bg-[#F5EBDD] text-[#85796B] px-2 py-0.5 rounded-full">
                {cart.reduce((total, i) => total + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-[#85796B] hover:text-[#332820] hover:bg-[#F5EBDD] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#F5EBDD]/70 px-5 py-3 border-b border-[#E8DCCB] text-xs">
            {amountNeededForFreeShipping > 0 ? (
              <div className="space-y-1.5">
                <p className="text-[#332820] flex items-center gap-1.5 font-medium">
                  <Truck className="w-3.5 h-3.5 text-[#A9823D]" />
                  Add <span className="font-bold text-[#A9823D]">{formatPrice(amountNeededForFreeShipping)}</span> more for <span className="font-bold">FREE Delivery</span>!
                </p>
                <div className="w-full bg-[#E8DCCB] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#C6A15B] h-full rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Unlocked! You qualify for FREE Nationwide Delivery
              </p>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F5EBDD] flex items-center justify-center mx-auto text-[#A9823D]">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#332820]">Your bag is empty</h3>
                <p className="text-xs text-[#85796B] max-w-xs mx-auto">
                  Explore our handcrafted resin keychains, luxury floral jewellery, and bespoke keepsake frames.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 inline-flex items-center gap-2 bg-[#332820] text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-[#A9823D] transition-colors"
                >
                  <Link href="/products">Explore Collections</Link>
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3 rounded-2xl bg-white border border-[#E8DCCB] shadow-sm"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-xl border border-[#E8DCCB] shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.product.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-serif text-sm font-semibold text-[#332820] hover:text-[#A9823D] line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[#85796B] hover:text-red-500 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#85796B]">{item.product.category}</p>
                      {item.customNote && (
                        <p className="text-[11px] text-[#A9823D] italic mt-0.5">
                          Note: {item.customNote}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E8DCCB]/50">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-[#E8DCCB] rounded-lg bg-[#F5EBDD]/40">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-[#332820] hover:text-[#C6A15B] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-[#332820]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 text-[#332820] hover:text-[#C6A15B] disabled:opacity-30 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-[#332820]">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with totals & checkout */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-[#E8DCCB] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#85796B]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#332820]">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-[#85796B]">
                  <span>Shipping Charges</span>
                  <span className="font-semibold text-[#332820]">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#332820] pt-2 border-t border-[#E8DCCB]">
                  <span>Estimated Total</span>
                  <span className="text-[#A9823D]">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-[#C6A15B] hover:bg-[#A9823D] text-white py-3 px-4 rounded-xl font-bold text-sm shadow-gold transition-all duration-200"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-between text-xs pt-1">
                  <Link
                    href="/cart"
                    onClick={() => setIsCartOpen(false)}
                    className="text-[#85796B] hover:text-[#332820] underline text-center w-full"
                  >
                    View & Edit Cart Details
                  </Link>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#85796B] pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Secure SSL Checkout with Razorpay & COD</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

