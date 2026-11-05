'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  Sparkles, 
  User, 
  ShieldCheck, 
  ChevronRight,
  Phone
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/lib/utils';
import { CATEGORIES } from '@/lib/data';

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount, wishlistCount, setIsCartOpen, products, settings } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  const activeProducts = products.filter((p) => p.status !== 'inactive');

  const searchResults = searchQuery.trim()
    ? activeProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop All', href: '/products' },
    { label: 'Alphabet Keychains', href: '/products?category=Resin+Alphabet+Keychains' },
    { label: 'Custom Keychains', href: '/products?category=Custom+Name+Keychains' },
    { label: 'Resin Jewellery', href: '/products?category=Pressed+Flower+Resin+Jewellery' },
    { label: 'Custom Gifts', href: '/products?category=Custom+Resin+Gifts' },
    { label: 'Accessories', href: '/products?category=Handmade+Resin+Accessories' },
    { label: 'Create Your Design', href: '/custom-order', highlight: true },
  ];

  return (
    <>
      {/* Top Luxury Announcement Bar */}
      <div className="bg-[#332820] text-[#FFF9F0] text-xs py-2 px-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-2 text-[#C6A15B]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span className="tracking-wide">Bespoke Handcrafted Resin Luxury</span>
          </div>
          <div className="mx-auto md:mx-0 text-center font-medium tracking-wide">
            {settings.announcementText}
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs text-[#E8DCCB]">
            <Link href="/track-order" className="hover:text-[#C6A15B] transition-colors">
              Track Order
            </Link>
            <span className="text-stone-600">|</span>
            <Link href="/admin" className="flex items-center gap-1 hover:text-[#C6A15B] transition-colors">
              <ShieldCheck className="w-3 h-3 text-[#C6A15B]" />
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FFF9F0]/95 backdrop-blur-md shadow-soft border-b border-[#E8DCCB]'
            : 'bg-[#FFF9F0] border-b border-[#E8DCCB]/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu trigger */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-[#332820] hover:text-[#C6A15B] transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[#332820] hover:text-[#C6A15B] transition-colors ml-1"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-1 md:flex-initial text-center md:text-left">
              <Link href="/" className="inline-flex flex-col items-center md:items-start group">
                <span className="font-serif text-2xl sm:text-3xl tracking-wider text-[#332820] font-bold group-hover:text-[#A9823D] transition-colors">
                  Resin<span className="text-[#C6A15B]">Aura</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#85796B] font-medium -mt-1">
                  Handmade Resin Artistry
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-xs xl:text-sm font-medium transition-all px-2 xl:px-2.5 py-1.5 rounded-full ${
                      link.highlight
                        ? 'bg-[#C6A15B] text-white hover:bg-[#A9823D] shadow-sm flex items-center gap-1 font-semibold px-3'
                        : isActive
                        ? 'text-[#A9823D] font-semibold'
                        : 'text-[#332820] hover:text-[#C6A15B]'
                    }`}
                  >
                    {link.highlight && <Sparkles className="w-3 h-3" />}
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Action Icons */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              {/* Desktop Search trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex items-center gap-2 text-xs bg-[#F5EBDD] text-[#85796B] hover:text-[#332820] px-3 py-1.5 rounded-full border border-[#E8DCCB] transition-all hover:border-[#C6A15B]"
              >
                <Search className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>Search resin art...</span>
              </button>

              {/* Wishlist */}
              <Link
                href="/account?tab=wishlist"
                className="relative p-2 text-[#332820] hover:text-[#C6A15B] transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#C6A15B] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              <Link
                href="/account"
                className="p-2 text-[#332820] hover:text-[#C6A15B] transition-colors"
                aria-label="My Account"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 bg-[#F5EBDD] hover:bg-[#E8DCCB] text-[#332820] rounded-full transition-colors flex items-center justify-center"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 text-[#332820]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#A9823D] text-white text-[11px] font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center border-2 border-[#FFF9F0]">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="bg-[#FFF9F0] border border-[#E8DCCB] w-full max-w-2xl rounded-2xl shadow-elevation overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-[#E8DCCB] flex items-center gap-3">
              <Search className="w-5 h-5 text-[#C6A15B]" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search alphabet keychains, resin earrings, pendants, varmala clocks..."
                className="w-full bg-transparent text-[#332820] placeholder-[#85796B] text-base focus:outline-none"
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="p-1 rounded-full text-[#85796B] hover:text-[#332820] hover:bg-[#F5EBDD]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto p-4">
              {searchQuery.trim() === '' ? (
                <div className="text-center py-8 text-[#85796B]">
                  <p className="text-sm">Popular resin searches:</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {['Initial Keychain', 'Custom Name', 'Varmala Clock', 'Emerald Pendant', 'Opal Earrings', 'Geode Coasters'].map(
                      (tag) => (
                        <button
                          key={tag}
                          onClick={() => setSearchQuery(tag)}
                          className="text-xs bg-[#F5EBDD] hover:bg-[#E8DCCB] text-[#332820] px-3 py-1.5 rounded-full transition-colors"
                        >
                          {tag}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-[#85796B] uppercase tracking-wider">Handmade Resin Products</p>
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-[#F5EBDD] transition-colors group"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-lg border border-[#E8DCCB]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#332820] group-hover:text-[#A9823D] truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-[#85796B]">{product.category}</p>
                        <p className="text-sm font-bold text-[#C6A15B] mt-0.5">{formatPrice(product.price)}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#85796B] group-hover:text-[#C6A15B]" />
                    </Link>
                  ))}
                  <div className="pt-2 text-center">
                    <Link
                      href={`/products?search=${encodeURIComponent(searchQuery)}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="text-xs font-semibold text-[#A9823D] hover:underline"
                    >
                      View all resin results for &quot;{searchQuery}&quot; &rarr;
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-[#85796B]">
                  <p>No handmade resin items found matching &quot;{searchQuery}&quot;</p>
                  <p className="text-xs mt-1">Try searching for keychains, jewellery, or custom gifts.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/50 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-[#FFF9F0] shadow-elevation flex flex-col justify-between p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DCCB]">
                <div>
                  <span className="font-serif text-2xl font-bold text-[#332820]">
                    Resin<span className="text-[#C6A15B]">Aura</span>
                  </span>
                  <p className="text-[10px] tracking-wider text-[#85796B] uppercase">Luxury Handcrafted Art</p>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-[#332820] hover:text-[#C6A15B]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Nav links */}
              <div className="py-6 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors ${
                      link.highlight
                        ? 'bg-[#C6A15B] text-white shadow-gold'
                        : 'text-[#332820] hover:bg-[#F5EBDD]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {link.highlight && <Sparkles className="w-4 h-4" />}
                      {link.label}
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-70" />
                  </Link>
                ))}
              </div>

              {/* Custom Order Callout */}
              <div className="p-4 rounded-2xl bg-[#F5EBDD] border border-[#E8DCCB] mt-2">
                <p className="text-xs font-semibold text-[#A9823D] uppercase tracking-wider">Have a bespoke resin idea?</p>
                <p className="text-xs text-[#332820] mt-1 font-medium">
                  We preserve wedding garlands, bridal bouquets, and create personalized keychains on WhatsApp.
                </p>
                <Link
                  href="/custom-order"
                  className="mt-3 block text-center text-xs font-bold bg-[#332820] text-white py-2 rounded-lg hover:bg-[#A9823D] transition-colors"
                >
                  Start Custom Order
                </Link>
              </div>
            </div>

            {/* Footer in drawer */}
            <div className="pt-6 border-t border-[#E8DCCB] text-xs text-[#85796B] space-y-3">
              <div className="flex items-center justify-between">
                <Link href="/account" className="flex items-center gap-2 text-[#332820] font-medium">
                  <User className="w-4 h-4 text-[#C6A15B]" />
                  My Account / Orders
                </Link>
                <Link href="/admin" className="text-[#A9823D] font-medium">
                  Admin Portal
                </Link>
              </div>
              <div className="flex items-center gap-2 text-[#85796B]">
                <Phone className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>WhatsApp: +{settings.whatsappNumber}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
