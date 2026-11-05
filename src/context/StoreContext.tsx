'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Product, CartItem, Order, OrderStatus } from '@/lib/types';
import { INITIAL_PRODUCTS } from '@/lib/data';
import {
  getStoredCart,
  saveStoredCart,
  getStoredWishlist,
  saveStoredWishlist,
  getStoredProducts,
  saveStoredProducts,
  getStoredOrders,
  saveStoredOrders,
  getStoredSettings,
  saveStoredSettings,
  StoreSettings,
} from '@/lib/store';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  message?: string;
}

interface StoreContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, customNote?: string) => boolean;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  shippingFee: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductStatus: (id: string) => Promise<void>;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  refreshProducts: () => Promise<void>;

  // Orders
  orders: Order[];
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;
  getOrderById: (id: string) => Order | undefined;

  // Store Settings
  settings: StoreSettings;
  updateSettings: (updates: Partial<StoreSettings>) => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (title: string, message?: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<StoreSettings>({
    whatsappNumber: '919876543210',
    announcementText: '✨ Free Nationwide Delivery on orders above ₹999 | Handcrafted with 24K Gold Flakes & Real Botanicals',
    freeShippingThreshold: 999,
    flatShippingRate: 79,
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Function to fetch products from backend server
  const refreshProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products?all=true', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
          saveStoredProducts(data);
          return;
        }
      }
    } catch (e) {
      console.warn('Backend products fetch failed', e);
    }
    // Fallback: empty products catalog
    const stored = getStoredProducts();
    setProducts(stored);
  }, []);

  // Initialize on mount
  useEffect(() => {
    // Purge legacy storage keys from user browser
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('resinaura_products_v1');
        localStorage.removeItem('resinaura_products_v2');
        localStorage.removeItem('resinaura_products_v3');
        localStorage.removeItem('resinaura_products');
      } catch {}
    }

    setCart(getStoredCart());
    setWishlist(getStoredWishlist());
    setOrders(getStoredOrders());
    setSettings(getStoredSettings());

    refreshProducts();

    const handleCartSync = () => setCart(getStoredCart());
    const handleWishlistSync = () => setWishlist(getStoredWishlist());
    const handleProductsSync = () => setProducts(getStoredProducts());
    const handleOrdersSync = () => setOrders(getStoredOrders());
    const handleSettingsSync = () => setSettings(getStoredSettings());

    window.addEventListener('resinaura_cart_updated', handleCartSync);
    window.addEventListener('resinaura_wishlist_updated', handleWishlistSync);
    window.addEventListener('resinaura_products_updated', handleProductsSync);
    window.addEventListener('resinaura_orders_updated', handleOrdersSync);
    window.addEventListener('resinaura_settings_updated', handleSettingsSync);

    return () => {
      window.removeEventListener('resinaura_cart_updated', handleCartSync);
      window.removeEventListener('resinaura_wishlist_updated', handleWishlistSync);
      window.removeEventListener('resinaura_products_updated', handleProductsSync);
      window.removeEventListener('resinaura_orders_updated', handleOrdersSync);
      window.removeEventListener('resinaura_settings_updated', handleSettingsSync);
    };
  }, [refreshProducts]);

  const showToast = useCallback((title: string, message?: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Cart operations
  const addToCart = useCallback((product: Product, quantity = 1, customNote?: string): boolean => {
    let success = true;
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      const currentQty = existing ? existing.quantity : 0;
      const newQty = currentQty + quantity;

      if (newQty > product.stock) {
        showToast('Stock Limit Reached', `Only ${product.stock} items available in stock.`, 'error');
        success = false;
        return prevCart;
      }

      let updatedCart: CartItem[];
      if (existing) {
        updatedCart = prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: newQty, customNote: customNote || item.customNote }
            : item
        );
      } else {
        updatedCart = [...prevCart, { product, quantity, customNote }];
      }

      saveStoredCart(updatedCart);
      showToast('Added to Cart', `${product.name} added to your bag`, 'success');
      return updatedCart;
    });
    return success;
  }, [showToast]);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => {
      const updated = prevCart.filter((item) => item.product.id !== productId);
      saveStoredCart(updated);
      showToast('Removed', 'Item removed from your cart', 'info');
      return updated;
    });
  }, [showToast]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) => {
      const item = prevCart.find((i) => i.product.id === productId);
      if (!item) return prevCart;

      if (quantity > item.product.stock) {
        showToast('Stock Limit Reached', `Only ${item.product.stock} items are in stock.`, 'error');
        return prevCart;
      }

      const updated = prevCart.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      );
      saveStoredCart(updated);
      return updated;
    });
  }, [removeFromCart, showToast]);

  const clearCart = useCallback(() => {
    setCart([]);
    saveStoredCart([]);
  }, []);

  // Wishlist operations
  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      saveStoredWishlist(updated);
      if (exists) {
        showToast('Removed from Wishlist', undefined, 'info');
      } else {
        showToast('Saved to Wishlist', 'View your saved items anytime', 'success');
      }
      return updated;
    });
  }, [showToast]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.includes(productId);
  }, [wishlist]);

  // Product CRUD with Server-side sync
  const addProduct = useCallback(async (newProdData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>): Promise<Product> => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProdData),
      });

      if (res.ok) {
        const created: Product = await res.json();
        const updated = [created, ...products.filter(p => p.id !== created.id)];
        setProducts(updated);
        saveStoredProducts(updated);
        showToast('Product Created', `${created.name} added to catalog & database.`, 'success');
        return created;
      }
    } catch (e) {
      console.warn('API add product failed, saving to local store', e);
    }

    // Fallback
    const fallbackProduct: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };
    const updated = [fallbackProduct, ...products];
    setProducts(updated);
    saveStoredProducts(updated);
    showToast('Product Created', `${fallbackProduct.name} saved.`, 'success');
    return fallbackProduct;
  }, [products, showToast]);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    try {
      await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
    } catch (e) {
      console.warn('API update product failed', e);
    }

    const updated = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setProducts(updated);
    saveStoredProducts(updated);
    showToast('Product Updated', 'Product details saved to database.', 'success');
  }, [products, showToast]);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('API delete product failed', e);
    }

    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    saveStoredProducts(updated);
    showToast('Product Deleted', 'Product removed from catalog.', 'info');
  }, [products, showToast]);

  const toggleProductStatus = useCallback(async (id: string) => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    const newStatus = prod.status === 'inactive' ? 'active' : 'inactive';
    await updateProduct(id, { status: newStatus });
    showToast(
      newStatus === 'active' ? 'Product Activated' : 'Product Deactivated',
      newStatus === 'active' ? 'Product is now visible on the store' : 'Product is hidden from customers',
      'info'
    );
  }, [products, updateProduct, showToast]);

  const getProductBySlug = useCallback((slug: string) => {
    return products.find((p) => p.slug === slug);
  }, [products]);

  const getProductById = useCallback((id: string) => {
    return products.find((p) => p.id === id);
  }, [products]);

  // Orders
  const createOrder = useCallback((orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    saveStoredOrders(updatedOrders);

    // Deduct stock for ordered products
    setProducts((prevProds) => {
      const updatedProds = prevProds.map((prod) => {
        const orderedItem = orderData.items.find((item) => item.productId === prod.id);
        if (orderedItem) {
          const remainingStock = Math.max(0, prod.stock - orderedItem.quantity);
          return { ...prod, stock: remainingStock };
        }
        return prod;
      });
      saveStoredProducts(updatedProds);
      return updatedProds;
    });

    clearCart();
    return newOrder;
  }, [orders, clearCart]);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus, trackingNumber?: string) => {
    const updated = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            status,
            trackingNumber: trackingNumber || o.trackingNumber,
            updatedAt: new Date().toISOString(),
          }
        : o
    );
    setOrders(updated);
    saveStoredOrders(updated);
    showToast('Order Updated', `Order status changed to ${status}`, 'success');
  }, [orders, showToast]);

  const getOrderById = useCallback((id: string) => {
    return orders.find((o) => o.id === id || o.orderNumber === id);
  }, [orders]);

  // Settings
  const updateSettings = useCallback((updates: Partial<StoreSettings>) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    saveStoredSettings(updated);
    showToast('Settings Saved', 'Store configuration updated.', 'success');
  }, [settings, showToast]);

  // Calculated totals
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingFee = cartSubtotal >= settings.freeShippingThreshold || cartSubtotal === 0 ? 0 : settings.flatShippingRate;
  const cartTotal = cartSubtotal + shippingFee;

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        shippingFee,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlist.length,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStatus,
        getProductBySlug,
        getProductById,
        refreshProducts,
        orders,
        createOrder,
        updateOrderStatus,
        getOrderById,
        settings,
        updateSettings,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
