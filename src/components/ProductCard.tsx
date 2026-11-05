'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Star, Sparkles, MessageCircle } from 'lucide-react';
import { Product } from '@/lib/types';
import { useStore } from '@/context/StoreContext';
import { formatPrice, buildWhatsAppProductInquiryUrl } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const isWishlisted = isInWishlist(product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-[#E8DCCB] overflow-hidden shadow-card hover:shadow-elevation transition-all duration-300 flex flex-col justify-between">
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F5EBDD]/50">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="inline-flex items-center gap-1 bg-[#A9823D] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              <Sparkles className="w-3 h-3" />
              Bestseller
            </span>
          )}
          {product.isNewArrival && !product.isBestSeller && (
            <span className="inline-flex items-center bg-[#332820] text-[#FFF9F0] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              New Arrival
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-[#C6A15B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full w-fit">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 ${
            isWishlisted
              ? 'bg-[#C6A15B] text-white shadow-gold'
              : 'bg-white/80 backdrop-blur-sm text-[#332820] hover:bg-white hover:text-[#C6A15B]'
          }`}
          aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Stock warning pill */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-2.5 left-2.5 bg-amber-900/80 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
            Only {product.stock} left in stock
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-[#85796B] mb-1.5">
            <span className="uppercase tracking-wider font-medium text-[10px] text-[#A9823D]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-[#332820]">
              <Star className="w-3.5 h-3.5 fill-[#C6A15B] text-[#C6A15B]" />
              <span className="font-semibold text-xs">{product.rating.toFixed(1)}</span>
              <span className="text-[#85796B] text-[11px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug}`} className="block group-hover:text-[#A9823D] transition-colors">
            <h3 className="font-serif text-base font-semibold text-[#332820] line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-[#E8DCCB]/60">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-[#332820]">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-[#85796B] line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-5 gap-2">
            <button
              onClick={() => addToCart(product, 1)}
              disabled={product.stock === 0}
              className={`col-span-4 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                product.stock === 0
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-[#332820] text-white hover:bg-[#A9823D] shadow-sm active:scale-[0.98]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}</span>
            </button>

            <a
              href={buildWhatsAppProductInquiryUrl(product.name, product.price)}
              target="_blank"
              rel="noreferrer"
              className="col-span-1 flex items-center justify-center bg-[#F5EBDD] hover:bg-[#25D366]/15 hover:text-[#25D366] text-[#332820] rounded-xl border border-[#E8DCCB] transition-colors p-2"
              title="Chat on WhatsApp about this design"
              aria-label="Inquire on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

