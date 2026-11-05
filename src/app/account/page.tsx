'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  LogOut, 
  Clock, 
  Truck, 
  CheckCircle2, 
  ShoppingBag, 
  ExternalLink,
  Phone,
  Mail,
  Sparkles,
  Edit,
  Plus
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatPrice, formatDate, buildWhatsAppOrderSupportUrl } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';

export default function AccountPage() {
  const { orders, wishlist, products, showToast } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'wishlist' | 'addresses'>('orders');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Mock user profile details
  const [profile, setProfile] = useState({
    name: 'Pooja Sharma',
    email: 'pooja.sharma@example.com',
    phone: '+91 98765 43210',
    joinedDate: 'Jan 2024',
  });

  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      title: 'Home',
      name: 'Pooja Sharma',
      phone: '+91 98765 43210',
      address: 'Flat 402, Lotus Orchid, Palm Beach Road, Vashi, Navi Mumbai, Maharashtra - 400703',
      isDefault: true,
    },
  ]);

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Confirmed':
        return 'bg-[#FFF9F0] text-[#A9823D] border-[#C6A15B]';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-stone-50 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Account Hero Bar */}
      <div className="bg-[#332820] text-white rounded-3xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#C6A15B] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md">
            {profile.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold">{profile.name}</h1>
            <p className="text-xs text-stone-300 mt-0.5">{profile.email} • {profile.phone}</p>
            <span className="inline-block mt-2 text-[10px] bg-white/10 px-2.5 py-0.5 rounded-full text-[#C6A15B] font-medium">
              ResinAura Patron since {profile.joinedDate}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/custom-order"
            className="text-xs font-semibold bg-[#C6A15B] hover:bg-[#A9823D] text-white px-4 py-2.5 rounded-full transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create Custom Design</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Navigation Sidebar */}
        <aside className="lg:col-span-3 bg-white rounded-2xl border border-[#E8DCCB] p-4 shadow-sm space-y-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-[#332820] text-white'
                : 'text-[#85796B] hover:bg-[#F5EBDD] hover:text-[#332820]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'wishlist'
                ? 'bg-[#332820] text-white'
                : 'text-[#85796B] hover:bg-[#F5EBDD] hover:text-[#332820]'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>My Wishlist ({wishlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'addresses'
                ? 'bg-[#332820] text-white'
                : 'text-[#85796B] hover:bg-[#F5EBDD] hover:text-[#332820]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-[#332820] text-white'
                : 'text-[#85796B] hover:bg-[#F5EBDD] hover:text-[#332820]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Settings</span>
          </button>

          <div className="pt-4 border-t border-[#E8DCCB] mt-2">
            <button
              onClick={() => {
                showToast('Logged Out', 'You have been logged out of your session', 'info');
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="lg:col-span-9 space-y-6">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl font-bold text-[#332820]">
                  Order History &amp; Tracking
                </h3>
                <span className="text-xs text-[#85796B]">{orders.length} orders total</span>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white rounded-3xl border border-[#E8DCCB] p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#F5EBDD] flex items-center justify-center mx-auto text-[#A9823D]">
                    <Package className="w-8 h-8 opacity-60" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#332820]">No Orders Placed Yet</h4>
                  <p className="text-xs text-[#85796B] max-w-sm mx-auto">
                    When you order handcrafted resin keychains or wedding keepsakes, your status and tracking updates will appear here.
                  </p>
                  <Link
                    href="/products"
                    className="inline-block bg-[#332820] text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-[#A9823D] transition-colors"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white rounded-3xl border border-[#E8DCCB] p-6 shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E8DCCB]">
                        <div>
                          <span className="text-[10px] text-[#85796B] uppercase font-bold tracking-wider">
                            Order #{ord.orderNumber}
                          </span>
                          <p className="text-xs text-[#332820] font-medium">
                            Placed on {formatDate(ord.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusBadge(ord.status)}`}>
                            {ord.status}
                          </span>
                          <span className="text-sm font-bold text-[#A9823D]">
                            {formatPrice(ord.total)}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-xs">
                            {item.productImage && (
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-12 h-12 rounded-lg object-cover border border-[#E8DCCB]"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-[#332820] truncate">{item.productName}</p>
                              <p className="text-[11px] text-[#85796B]">
                                Qty: {item.quantity} × {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-[#E8DCCB]/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <span className="text-[#85796B]">
                          Destination: {ord.customer.city}, {ord.customer.state}
                        </span>
                        <div className="flex items-center gap-3">
                          <a
                            href={buildWhatsAppOrderSupportUrl(ord.orderNumber)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#25D366] hover:underline flex items-center gap-1 font-semibold"
                          >
                            Track on WhatsApp
                          </a>
                          <Link
                            href={`/order-success/${ord.id}`}
                            className="text-[#A9823D] hover:underline font-semibold"
                          >
                            View Receipt &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl font-bold text-[#332820]">
                  Saved Pieces ({wishlistedProducts.length})
                </h3>
              </div>

              {wishlistedProducts.length === 0 ? (
                <div className="bg-white rounded-3xl border border-[#E8DCCB] p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#F5EBDD] flex items-center justify-center mx-auto text-[#A9823D]">
                    <Heart className="w-8 h-8 opacity-60" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#332820]">Your Wishlist is Empty</h4>
                  <p className="text-xs text-[#85796B] max-w-sm mx-auto">
                    Click the heart icon on any product to save it to your personal wishlist for later.
                  </p>
                  <Link
                    href="/products"
                    className="inline-block bg-[#332820] text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-[#A9823D] transition-colors"
                  >
                    Browse Collections
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistedProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl font-bold text-[#332820]">
                  Saved Addresses
                </h3>
                <button
                  onClick={() => showToast('Feature Active', 'Address saved for future express checkout', 'info')}
                  className="text-xs font-bold bg-[#C6A15B] text-white px-3.5 py-2 rounded-full hover:bg-[#A9823D] flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="bg-white rounded-2xl border border-[#E8DCCB] p-5 shadow-sm space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#A9823D] bg-[#F5EBDD] px-2 py-0.5 rounded-md">
                        {addr.title}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                          Default Address
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-[#332820]">{addr.name}</p>
                    <p className="text-xs text-[#85796B] leading-relaxed">{addr.address}</p>
                    <p className="text-xs text-[#332820] font-medium">{addr.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl border border-[#E8DCCB] p-6 sm:p-8 shadow-card space-y-6">
              <h3 className="font-serif text-2xl font-bold text-[#332820]">
                Personal Profile Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-[#85796B] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-[#FFF9F0]/60 border border-[#E8DCCB] rounded-xl px-3.5 py-2.5 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#85796B] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full bg-[#FFF9F0]/60 border border-[#E8DCCB] rounded-xl px-3.5 py-2.5 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#85796B] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full bg-[#FFF9F0]/60 border border-[#E8DCCB] rounded-xl px-3.5 py-2.5 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8DCCB]">
                <button
                  onClick={() => showToast('Saved', 'Profile information updated successfully', 'success')}
                  className="bg-[#332820] text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-[#A9823D] transition-colors"
                >
                  Save Profile Changes
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

