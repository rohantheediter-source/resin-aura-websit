'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Filter, 
  Sparkles, 
  SlidersHorizontal, 
  RotateCcw, 
  Search,
  Grid,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';
import { ProductCategory } from '@/lib/types';
import { CATEGORIES } from '@/lib/data';
import { formatPrice } from '@/lib/utils';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All Products';
  const initialSearch = searchParams.get('search') || '';

  const { products } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Sync category if query param changes
  React.useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category') as string);
    }
  }, [searchParams]);

  // Reset to page 1 whenever filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortBy, maxPrice, onlyInStock]);

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Hide inactive products from public catalog
      if (product.status === 'inactive') {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'All Products' && product.category !== selectedCategory) {
        return false;
      }
      // Price filter
      if (product.price > maxPrice) {
        return false;
      }
      // In-stock filter
      if (onlyInStock && product.stock <= 0) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      // Default: featured first, then bestsellers
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }, [products, selectedCategory, maxPrice, onlyInStock, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All Products');
    setSearchQuery('');
    setMaxPrice(5000);
    setOnlyInStock(false);
    setSortBy('featured');
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 150, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header & Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-[#85796B] mb-2">
          <span>Home</span>
          <span>/</span>
          <span className="text-[#332820] font-semibold">Collections</span>
          {selectedCategory !== 'All Products' && (
            <>
              <span>/</span>
              <span className="text-[#A9823D] font-semibold">{selectedCategory}</span>
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#332820]">
              {selectedCategory === 'All Products' ? 'Artisan Resin Creations' : selectedCategory}
            </h1>
            <p className="text-sm text-[#85796B] mt-1">
              Showing {filteredProducts.length} handcrafted {filteredProducts.length === 1 ? 'masterpiece' : 'masterpieces'}
            </p>
          </div>

          {/* Quick Search & Sort on Desktop */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collection..."
                className="bg-white border border-[#E8DCCB] text-xs rounded-full pl-8 pr-4 py-2 text-[#332820] placeholder-[#85796B] focus:outline-none focus:border-[#C6A15B] w-48 sm:w-60 shadow-sm"
              />
              <Search className="w-3.5 h-3.5 text-[#85796B] absolute left-3 top-2.5" />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#E8DCCB] text-xs rounded-full px-4 py-2 text-[#332820] focus:outline-none focus:border-[#C6A15B] shadow-sm font-medium cursor-pointer"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest First</option>
            </select>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 bg-[#F5EBDD] border border-[#E8DCCB] px-3.5 py-2 rounded-full text-xs font-semibold text-[#332820]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C6A15B]" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-[#332820] text-white shadow-sm font-semibold'
                : 'bg-white text-[#332820] border border-[#E8DCCB] hover:bg-[#F5EBDD]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6 bg-white p-6 rounded-2xl border border-[#E8DCCB] shadow-card h-fit sticky top-28">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8DCCB]">
            <div className="flex items-center gap-2 font-serif text-lg font-bold text-[#332820]">
              <Filter className="w-4 h-4 text-[#C6A15B]" />
              Filter By
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-[#85796B] hover:text-[#A9823D] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Categories Filter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#332820] mb-3">
              Categories
            </h4>
            <div className="space-y-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between ${
                    selectedCategory === cat
                      ? 'bg-[#F5EBDD] font-bold text-[#A9823D]'
                      : 'text-[#85796B] hover:bg-stone-50 hover:text-[#332820]'
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="pt-4 border-t border-[#E8DCCB]">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#332820]">
                Max Price
              </h4>
              <span className="text-xs font-bold text-[#A9823D]">{formatPrice(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="300"
              max="5000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#C6A15B] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#85796B] mt-1">
              <span>₹300</span>
              <span>₹5,000+</span>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="pt-4 border-t border-[#E8DCCB]">
            <label className="flex items-center gap-2.5 text-xs text-[#332820] font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 accent-[#C6A15B] rounded cursor-pointer"
              />
              <span>In Stock Ready to Ship</span>
            </label>
          </div>

          {/* Bespoke Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#F5EBDD] to-[#FFF9F0] border border-[#E8DCCB] text-center">
            <Sparkles className="w-5 h-5 text-[#C6A15B] mx-auto mb-1.5" />
            <h5 className="text-xs font-bold text-[#332820]">Looking for something custom?</h5>
            <p className="text-[11px] text-[#85796B] mt-1">
              Have specific flowers or initials in mind? Talk with us directly.
            </p>
            <a
              href="/custom-order"
              className="inline-block mt-3 text-xs font-bold text-[#A9823D] hover:underline"
            >
              Create Your Design &rarr;
            </a>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E8DCCB] p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F5EBDD] flex items-center justify-center mx-auto text-[#A9823D]">
                <Sparkles className="w-8 h-8 opacity-70" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#332820]">Catalog Ready for New Products</h3>
              <p className="text-xs text-[#85796B] max-w-sm mx-auto">
                All products have been cleared. You can add your handcrafted pieces from the Admin Dashboard, or commission a bespoke design on WhatsApp.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="/custom-order"
                  className="bg-[#332820] text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-[#A9823D] transition-colors"
                >
                  Create Custom Design
                </a>
                <a
                  href="/admin"
                  className="bg-[#F5EBDD] border border-[#E8DCCB] text-[#332820] text-xs font-semibold px-5 py-2.5 rounded-full hover:border-[#C6A15B] transition-colors"
                >
                  Open Admin Dashboard
                </a>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E8DCCB] p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F5EBDD] flex items-center justify-center mx-auto text-[#A9823D]">
                <Filter className="w-6 h-6 opacity-60" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#332820]">No pieces match your criteria</h3>
              <p className="text-xs text-[#85796B] max-w-sm mx-auto">
                Try widening your price range, clearing your search, or asking our artisan for a custom creation.
              </p>
              <button
                onClick={resetFilters}
                className="bg-[#332820] text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-[#A9823D] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Luxury Pagination Controls */}
              {totalPages > 1 && (
                <div className="pt-6 border-t border-[#E8DCCB] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-[#85796B]">
                    Showing <span className="font-semibold text-[#332820]">{(currentPage - 1) * itemsPerPage + 1}</span>–
                    <span className="font-semibold text-[#332820]">
                      {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
                    </span> of <span className="font-semibold text-[#332820]">{filteredProducts.length}</span> pieces
                  </p>

                  <div className="flex items-center gap-1.5">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg border border-[#E8DCCB] bg-white text-[#332820] hover:bg-[#F5EBDD] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      aria-label="Previous Page"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Prev</span>
                    </button>

                    {/* Numeric Pages */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                          if (totalPages <= 7) return true;
                          if (page === 1 || page === totalPages) return true;
                          if (Math.abs(page - currentPage) <= 1) return true;
                          return false;
                        })
                        .reduce<(number | string)[]>((acc, page, idx, arr) => {
                          if (idx > 0 && typeof arr[idx - 1] === 'number') {
                            const prev = arr[idx - 1] as number;
                            if (page - prev > 1) {
                              acc.push('...');
                            }
                          }
                          acc.push(page);
                          return acc;
                        }, [])
                        .map((page, index) => {
                          if (page === '...') {
                            return (
                              <span key={`ellipsis-${index}`} className="px-2 text-xs text-[#85796B]">
                                ...
                              </span>
                            );
                          }
                          const pageNum = Number(page);
                          const isActive = currentPage === pageNum;
                          return (
                            <button
                              key={`page-${pageNum}`}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                                isActive
                                  ? 'bg-[#332820] text-white shadow-sm'
                                  : 'bg-white text-[#332820] border border-[#E8DCCB] hover:bg-[#F5EBDD]'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg border border-[#E8DCCB] bg-white text-[#332820] hover:bg-[#F5EBDD] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      aria-label="Next Page"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/50 backdrop-blur-sm">
          <div className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-[#FFF9F0] p-6 shadow-elevation overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DCCB]">
                <h3 className="font-serif text-lg font-bold text-[#332820]">Filter & Sort</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="text-xs font-bold text-[#85796B] hover:text-[#332820]"
                >
                  Close
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#332820] mb-3">
                  Categories
                </h4>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left text-xs py-2 px-3 rounded-lg flex items-center justify-between ${
                        selectedCategory === cat
                          ? 'bg-[#F5EBDD] font-bold text-[#A9823D]'
                          : 'text-[#85796B]'
                      }`}
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="pt-4 border-t border-[#E8DCCB]">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span>Max Price:</span>
                  <span className="text-[#A9823D]">{formatPrice(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="5000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#C6A15B]"
                />
              </div>

              {/* In stock */}
              <label className="flex items-center gap-2 text-xs font-medium text-[#332820]">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="w-4 h-4 accent-[#C6A15B]"
                />
                <span>Ready to Ship in Stock Only</span>
              </label>
            </div>

            <div className="pt-6 border-t border-[#E8DCCB] space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-[#332820] text-white py-3 rounded-xl text-xs font-bold hover:bg-[#A9823D]"
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
              <button
                onClick={() => {
                  resetFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="w-full text-xs text-[#85796B] py-2 hover:underline"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Sparkles className="w-8 h-8 text-[#C6A15B] animate-spin mx-auto mb-4" />
        <p className="text-sm font-medium text-[#85796B]">Loading handcrafted collection...</p>
      </div>
    }>
      <ProductsCatalogContent />
    </Suspense>
  );
}

