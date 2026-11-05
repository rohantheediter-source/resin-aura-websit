'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Sparkles, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Share2, 
  MessageCircle, 
  Check, 
  ArrowRight,
  Flower2,
  PackageCheck
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';
import { formatPrice, buildWhatsAppProductInquiryUrl } from '@/lib/utils';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { getProductBySlug, addToCart, toggleWishlist, isInWishlist, products, showToast } = useStore();

  const product = getProductBySlug(params.slug);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customNote, setCustomNote] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'care'>('details');

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-3xl font-bold text-[#332820]">Artisan Piece Not Found</h2>
        <p className="text-sm text-[#85796B] mt-2 mb-6">
          The requested resin design might have been archived or moved.
        </p>
        <Link
          href="/products"
          className="bg-[#332820] text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-[#A9823D]"
        >
          Return to Collections
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, customNote);
  };

  const handleBuyNow = () => {
    const success = addToCart(product, quantity, customNote);
    if (success) {
      router.push('/checkout');
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied', 'Product link copied to your clipboard', 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#85796B]">
        <Link href="/" className="hover:text-[#332820]">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[#332820]">Collections</Link>
        <span>/</span>
        <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-[#332820]">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-[#332820] font-semibold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Multi-Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-[#E8DCCB] shadow-card group">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-zoom-in"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {product.isBestSeller && (
                <span className="inline-flex items-center gap-1 bg-[#A9823D] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  Bestseller
                </span>
              )}
              {discountPercent > 0 && (
                <span className="bg-[#C6A15B] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Top action buttons */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-full backdrop-blur-md shadow-md transition-all ${
                  isWishlisted
                    ? 'bg-[#C6A15B] text-white shadow-gold'
                    : 'bg-white/80 text-[#332820] hover:bg-white hover:text-[#C6A15B]'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-3 rounded-full bg-white/80 backdrop-blur-md text-[#332820] hover:bg-white hover:text-[#C6A15B] shadow-md transition-all"
                aria-label="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-white ${
                    selectedImageIndex === idx
                      ? 'border-[#C6A15B] ring-2 ring-[#C6A15B]/30'
                      : 'border-[#E8DCCB] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Ordering */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#A9823D]">
              {product.category}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#332820] mt-1 leading-snug">
              {product.name}
            </h1>

            {/* Rating & Stock Indicator */}
            <div className="flex items-center justify-between mt-3 pb-4 border-b border-[#E8DCCB]">
              <div className="flex items-center gap-2">
                <div className="flex items-center text-[#C6A15B]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-[#C6A15B]'
                          : 'fill-stone-200 text-stone-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#332820]">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-[#85796B]">({product.reviewCount} reviews)</span>
              </div>

              <div>
                {product.stock > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    {product.stock <= 5 ? `Only ${product.stock} Left` : 'In Stock'}
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                    Sold Out
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-[#F5EBDD]/60 p-4 rounded-2xl border border-[#E8DCCB] space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-[#332820]">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-[#85796B] line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-bold text-[#A9823D] bg-white px-2 py-0.5 rounded-full border border-[#E8DCCB]">
                  Save {discountPercent}%
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#85796B]">
              Inclusive of all taxes. Free all-India shipping on orders over ₹999.
            </p>
          </div>

          {/* Description */}
          <p className="text-sm text-[#332820] leading-relaxed">
            {product.description}
          </p>

          {/* Optional Personalization Note */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#332820]">
              Personalization / Initial / Name Note (Optional):
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="e.g. Initial 'R', Name 'Ananya', or preferred gold foil density"
              className="w-full bg-white border border-[#E8DCCB] rounded-xl px-3.5 py-2.5 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B] shadow-sm"
            />
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-[#332820]">Quantity:</span>
              <div className="flex items-center border border-[#E8DCCB] rounded-xl bg-white shadow-sm">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-[#332820] hover:text-[#C6A15B]"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-[#332820]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="p-2 text-[#332820] hover:text-[#C6A15B] disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[11px] text-[#85796B]">
                Max available: {product.stock}
              </span>
            </div>

            {/* Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full flex items-center justify-center gap-2 bg-[#332820] hover:bg-[#A9823D] text-white py-3.5 px-6 rounded-2xl font-bold text-sm shadow-card transition-all disabled:opacity-40"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="w-full flex items-center justify-center gap-2 bg-[#C6A15B] hover:bg-[#A9823D] text-white py-3.5 px-6 rounded-2xl font-bold text-sm shadow-gold transition-all disabled:opacity-40"
              >
                <Sparkles className="w-4 h-4" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* WhatsApp Custom Inquiry Link */}
            <a
              href={buildWhatsAppProductInquiryUrl(product.name, product.price)}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 py-3 rounded-2xl text-xs font-semibold transition-colors mt-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Inquire / Request Custom Flower Layout on WhatsApp</span>
            </a>
          </div>

          {/* Guarantees List */}
          <div className="pt-4 border-t border-[#E8DCCB] grid grid-cols-2 gap-3 text-xs text-[#85796B]">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#C6A15B] shrink-0" />
              <span>4-6 Days Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C6A15B] shrink-0" />
              <span>Non-Yellowing UV Resin</span>
            </div>
            <div className="flex items-center gap-2">
              <Flower2 className="w-4 h-4 text-[#C6A15B] shrink-0" />
              <span>Genuine Dried Botanicals</span>
            </div>
            <div className="flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-[#C6A15B] shrink-0" />
              <span>Velvet Boutique Gift Box</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications, Materials, Care Instructions */}
      <div className="bg-white rounded-3xl border border-[#E8DCCB] p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex border-b border-[#E8DCCB] gap-6 text-sm">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 font-bold transition-colors ${
              activeTab === 'details'
                ? 'border-b-2 border-[#C6A15B] text-[#A9823D]'
                : 'text-[#85796B] hover:text-[#332820]'
            }`}
          >
            Handcrafted Features
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`pb-3 font-bold transition-colors ${
              activeTab === 'materials'
                ? 'border-b-2 border-[#C6A15B] text-[#A9823D]'
                : 'text-[#85796B] hover:text-[#332820]'
            }`}
          >
            Materials & Dimensions
          </button>
          <button
            onClick={() => setActiveTab('care')}
            className={`pb-3 font-bold transition-colors ${
              activeTab === 'care'
                ? 'border-b-2 border-[#C6A15B] text-[#A9823D]'
                : 'text-[#85796B] hover:text-[#332820]'
            }`}
          >
            Resin Care Guide
          </button>
        </div>

        <div>
          {activeTab === 'details' && (
            <div className="space-y-3">
              <p className="text-xs text-[#85796B]">
                Every single piece from ResinAura is individually poured by artisan hands. No two pours are ever identical, guaranteeing a truly one-of-a-kind treasure.
              </p>
              {product.details && product.details.length > 0 && (
                <ul className="space-y-2 pt-2">
                  {product.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-[#332820]">
                      <Check className="w-3.5 h-3.5 text-[#C6A15B] shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab === 'materials' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#F5EBDD]/40 rounded-xl border border-[#E8DCCB]">
                <span className="font-bold text-[#332820] block mb-1">Materials:</span>
                <p className="text-[#85796B]">{product.materials || 'Artisan crystal epoxy resin, 24K gold foil leaf, metallic mica'}</p>
              </div>
              <div className="p-4 bg-[#F5EBDD]/40 rounded-xl border border-[#E8DCCB]">
                <span className="font-bold text-[#332820] block mb-1">Dimensions:</span>
                <p className="text-[#85796B]">{product.dimensions || 'Standard handcrafted dimensions'}</p>
              </div>
            </div>
          )}

          {activeTab === 'care' && (
            <div className="space-y-2 text-xs text-[#85796B] leading-relaxed">
              <p>• Clean gently with a soft micro-fiber cloth and lukewarm water if needed.</p>
              <p>• Avoid harsh chemical solvents, alcohol cleaners, or abrasive scrubbing sponges.</p>
              <p>• While our art resin has UV-inhibitors, keep away from prolonged direct harsh sunlight to retain optical purity.</p>
              <p>• Handle with love as you would with fine crystal glass jewelry.</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#A9823D]">
                Complete Your Set
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#332820]">
                Related Handcrafted Pieces
              </h2>
            </div>
            <Link
              href={`/products?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-bold text-[#A9823D] hover:underline flex items-center gap-1"
            >
              <span>View All {product.category}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

