'use client';

import { useState, useEffect } from 'react';
import { Product, CartItem, Order, OrderStatus } from './types';
import { INITIAL_PRODUCTS } from './data';

const CART_STORAGE_KEY = 'resinaura_cart_v1';
const WISHLIST_STORAGE_KEY = 'resinaura_wishlist_v1';
const ORDERS_STORAGE_KEY = 'resinaura_orders_v1';
const PRODUCTS_STORAGE_KEY = 'resinaura_products_v4';
const SETTINGS_STORAGE_KEY = 'resinaura_settings_v1';

export interface StoreSettings {
  adminName?: string;
  adminPhone?: string;
  whatsappNumber: string;
  announcementText: string;
  freeShippingThreshold: number;
  flatShippingRate: number;
}

const DEFAULT_SETTINGS: StoreSettings = {
  adminName: 'Rohan Ahirwar',
  adminPhone: '7223008721',
  whatsappNumber: '917223008721',
  announcementText: '✨ Free Nationwide Delivery on orders above ₹999 | Handcrafted with 24K Gold Flakes & Real Botanicals',
  freeShippingThreshold: 999,
  flatShippingRate: 79,
};

// Safe localStorage getters
export function getStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('resinaura_cart_updated'));
  } catch (e) {
    console.error('Failed to save cart to localStorage', e);
  }
}

export function getStoredWishlist(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredWishlist(wishlist: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    window.dispatchEvent(new Event('resinaura_wishlist_updated'));
  } catch (e) {
    console.error('Failed to save wishlist', e);
  }
}

export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return [];
  try {
    // Purge legacy storage keys so old products never linger
    ['resinaura_products_v1', 'resinaura_products_v2', 'resinaura_products_v3', 'resinaura_products'].forEach((k) => {
      try { localStorage.removeItem(k); } catch {}
    });

    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredProducts(products: Product[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event('resinaura_products_updated'));
  } catch (e) {
    console.error('Failed to save products', e);
  }
}

export function getStoredOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredOrders(orders: Order[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event('resinaura_orders_updated'));
  } catch (e) {
    console.error('Failed to save orders', e);
  }
}

export function getStoredSettings(): StoreSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: StoreSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('resinaura_settings_updated'));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

