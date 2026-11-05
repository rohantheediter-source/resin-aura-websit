'use client';

import React, { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  AlertTriangle, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Settings as SettingsIcon, 
  Lock, 
  LogOut, 
  Check, 
  X, 
  Eye, 
  DollarSign, 
  Sparkles,
  Upload,
  Image as ImageIcon,
  Download,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Product, ProductCategory, OrderStatus, Order } from '@/lib/types';
import { CATEGORIES } from '@/lib/data';
import { formatPrice, formatDate, generateSlug } from '@/lib/utils';

export default function AdminPage() {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    toggleProductStatus,
    refreshProducts,
    orders, 
    updateOrderStatus, 
    settings, 
    updateSettings, 
    showToast 
  } = useStore();

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'analytics' | 'settings'>('products');

  // Product Add/Edit Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // Bulk Import / Export Modal
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkMode, setBulkMode] = useState<'append' | 'replace'>('append');
  const [bulkInputText, setBulkInputText] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // Form State
  const [prodForm, setProdForm] = useState({
    name: '',
    sku: '',
    category: 'Resin Alphabet Keychains' as ProductCategory,
    price: 399,
    originalPrice: 549,
    discount: 27,
    stock: 20,
    status: 'active' as 'active' | 'inactive',
    description: '',
    materials: 'Optical UV art resin, 24K gold leaf flakes, pressed florals',
    dimensions: 'Standard handcrafted dimensions',
    mainImage: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop',
    additionalImages: [] as string[],
    isBestSeller: false,
    isPopular: true,
    isNewArrival: true,
    isFeatured: true,
  });

  const mainFileInputRef = useRef<HTMLInputElement | null>(null);
  const galleryFileInputRef = useRef<HTMLInputElement | null>(null);
  const replaceGalleryIndexRef = useRef<number | null>(null);
  const replaceFileInputRef = useRef<HTMLInputElement | null>(null);

  // Order Details Modal
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Settings State
  const [settingsForm, setSettingsForm] = useState({
    whatsappNumber: settings.whatsappNumber,
    announcementText: settings.announcementText,
    freeShippingThreshold: settings.freeShippingThreshold,
    flatShippingRate: settings.flatShippingRate,
  });

  // Filters & Pagination
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 15;

  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');

  // Login handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode === 'admin123' || adminPasscode === 'resin2024' || adminPasscode === 'admin') {
      setIsAdminAuthenticated(true);
      setPasscodeError('');
      showToast('Admin Access Granted', 'Welcome to the ResinAura Control Center', 'success');
    } else {
      setPasscodeError('Invalid passcode. Default is admin123');
    }
  };

  // Price & discount calculation
  const handlePriceChange = (priceVal: number, origVal?: number) => {
    const orig = origVal !== undefined ? origVal : prodForm.originalPrice;
    let disc = 0;
    if (orig && orig > priceVal) {
      disc = Math.round(((orig - priceVal) / orig) * 100);
    }
    setProdForm((prev) => ({
      ...prev,
      price: priceVal,
      originalPrice: orig,
      discount: disc,
    }));
  };

  const handleOriginalPriceChange = (origVal: number) => {
    let disc = 0;
    if (origVal > prodForm.price) {
      disc = Math.round(((origVal - prodForm.price) / origVal) * 100);
    }
    setProdForm((prev) => ({
      ...prev,
      originalPrice: origVal,
      discount: disc,
    }));
  };

  // Image Upload handler
  const uploadFileToServer = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      return data.url;
    } catch (err: any) {
      console.error('Upload error:', err);
      showToast('Upload Error', err?.message || 'Failed to upload image', 'error');
      return null;
    }
  };

  const handleMainFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingMain(true);
    const url = await uploadFileToServer(file);
    setIsUploadingMain(false);
    if (url) {
      setProdForm((prev) => ({ ...prev, mainImage: url }));
      showToast('Image Uploaded', 'Main photo saved permanently', 'success');
    }
    if (e.target) e.target.value = '';
  };

  const handleGalleryFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingGallery(true);
    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const url = await uploadFileToServer(files[i]);
      if (url) uploadedUrls.push(url);
    }
    setIsUploadingGallery(false);
    if (uploadedUrls.length > 0) {
      setProdForm((prev) => ({
        ...prev,
        additionalImages: [...prev.additionalImages, ...uploadedUrls],
      }));
      showToast('Gallery Updated', `${uploadedUrls.length} image(s) uploaded`, 'success');
    }
    if (e.target) e.target.value = '';
  };

  const handleReplaceGalleryImage = (index: number) => {
    replaceGalleryIndexRef.current = index;
    replaceFileInputRef.current?.click();
  };

  const handleExecuteReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const index = replaceGalleryIndexRef.current;
    if (!file || index === null || index === undefined) return;
    const url = await uploadFileToServer(file);
    if (url) {
      setProdForm((prev) => {
        const next = [...prev.additionalImages];
        next[index] = url;
        return { ...prev, additionalImages: next };
      });
      showToast('Image Replaced', 'Gallery photo replaced successfully', 'success');
    }
    replaceGalleryIndexRef.current = null;
    if (e.target) e.target.value = '';
  };

  const handleDeleteGalleryImage = (index: number) => {
    setProdForm((prev) => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index),
    }));
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const query = productSearch.toLowerCase();
      const matchesSearch = 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.sku && p.sku.toLowerCase().includes(query));
      const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || (p.status || 'active') === statusFilter;
      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [products, productSearch, categoryFilter, statusFilter]);

  // Paginated slice
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Analytics Computations
  const totalSales = orders.reduce((sum, ord) => sum + (ord.paymentStatus === 'paid' ? ord.total : 0), 0);
  const totalOrdersCount = orders.length;
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setProdForm({
      name: '',
      sku: `RA-RESIN-${randomSuffix}`,
      category: 'Resin Alphabet Keychains',
      price: 399,
      originalPrice: 549,
      discount: 27,
      stock: 25,
      status: 'active',
      description: 'Handcrafted luxury resin piece poured with non-yellowing UV art resin and genuine 24K gold foil.',
      materials: 'Crystal UV art resin, 24K gold leaf flakes, pressed florals',
      dimensions: 'Standard handcrafted dimensions',
      mainImage: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop',
      additionalImages: [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop'
      ],
      isBestSeller: false,
      isPopular: true,
      isNewArrival: true,
      isFeatured: true,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    const mainImg = prod.images[0] || '';
    const otherImgs = prod.images.slice(1);
    const orig = prod.originalPrice || Math.round(prod.price * 1.3);
    const disc = prod.discount !== undefined ? prod.discount : Math.round(((orig - prod.price) / orig) * 100);

    setProdForm({
      name: prod.name,
      sku: prod.sku || `RA-${prod.id.slice(-6).toUpperCase()}`,
      category: prod.category,
      price: prod.price,
      originalPrice: orig,
      discount: Math.max(0, disc),
      stock: prod.stock,
      status: prod.status || 'active',
      description: prod.description,
      materials: prod.materials || '',
      dimensions: prod.dimensions || '',
      mainImage: mainImg,
      additionalImages: otherImgs,
      isBestSeller: prod.isBestSeller || false,
      isPopular: prod.isPopular || prod.isBestSeller || false,
      isNewArrival: prod.isNewArrival || false,
      isFeatured: prod.isFeatured || false,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name.trim()) {
      showToast('Validation Error', 'Product name is required', 'error');
      return;
    }

    const allImages = [prodForm.mainImage, ...prodForm.additionalImages].filter(Boolean);
    if (allImages.length === 0) {
      allImages.push('https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop');
    }

    if (editingProduct) {
      await updateProduct(editingProduct.id, {
        name: prodForm.name,
        sku: prodForm.sku,
        slug: generateSlug(prodForm.name),
        category: prodForm.category,
        price: Number(prodForm.price),
        originalPrice: Number(prodForm.originalPrice),
        discount: Number(prodForm.discount),
        stock: Number(prodForm.stock),
        status: prodForm.status,
        description: prodForm.description,
        materials: prodForm.materials,
        dimensions: prodForm.dimensions,
        images: allImages,
        isBestSeller: prodForm.isBestSeller,
        isPopular: prodForm.isPopular,
        isNewArrival: prodForm.isNewArrival,
        isFeatured: prodForm.isFeatured,
      });
    } else {
      await addProduct({
        name: prodForm.name,
        sku: prodForm.sku,
        slug: generateSlug(prodForm.name),
        category: prodForm.category,
        price: Number(prodForm.price),
        originalPrice: Number(prodForm.originalPrice),
        discount: Number(prodForm.discount),
        stock: Number(prodForm.stock),
        status: prodForm.status,
        description: prodForm.description,
        materials: prodForm.materials,
        dimensions: prodForm.dimensions,
        images: allImages,
        isBestSeller: prodForm.isBestSeller,
        isPopular: prodForm.isPopular,
        isNewArrival: prodForm.isNewArrival,
        isFeatured: prodForm.isFeatured,
      });
    }
    setIsProductModalOpen(false);
  };

  // Bulk Import
  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkInputText.trim()) {
      showToast('Empty Input', 'Please paste JSON product data or load a template', 'error');
      return;
    }

    try {
      setIsImporting(true);
      let parsed = JSON.parse(bulkInputText);
      if (!Array.isArray(parsed)) {
        if (parsed.products && Array.isArray(parsed.products)) {
          parsed = parsed.products;
        } else {
          parsed = [parsed];
        }
      }

      const res = await fetch('/api/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: parsed, mode: bulkMode }),
      });

      const data = await res.json();
      setIsImporting(false);

      if (res.ok) {
        showToast('Bulk Import Successful', data.message || `Imported ${data.importedCount} products`, 'success');
        setIsBulkModalOpen(false);
        setBulkInputText('');
        await refreshProducts();
      } else {
        throw new Error(data.error || 'Import failed');
      }
    } catch (err: any) {
      setIsImporting(false);
      showToast('Import Error', err?.message || 'Invalid JSON format', 'error');
    }
  };

  // Export full catalog as JSON
  const handleExportCatalog = () => {
    const jsonStr = JSON.stringify(products, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resinaura-catalog-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Catalog Exported', `Exported ${products.length} products to JSON`, 'success');
  };

  // Load sample template for bulk import
  const handleLoadSampleTemplate = () => {
    const sample = [
      {
        name: "Sample 24K Gold Flake Resin Bookmark",
        sku: "RA-HA-101",
        category: "Handmade Resin Accessories",
        price: 349,
        originalPrice: 499,
        stock: 30,
        status: "active",
        description: "Hand-poured crystal resin bookmark with floating gold leaf and silk tassel.",
        materials: "Art resin, 24K gold foil, silk tassel",
        images: ["https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop"],
        isFeatured: true
      },
      {
        name: "Sample Pressed Wildflower Teardrop Pendant",
        sku: "RA-RP-102",
        category: "Resin Pendants",
        price: 899,
        originalPrice: 1299,
        stock: 15,
        status: "active",
        description: "Organic dried wildflowers encapsulated in optical epoxy with 18K chain.",
        materials: "Preserved petals, UV resin, 18K gold chain",
        images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop"],
        isPopular: true
      }
    ];
    setBulkInputText(JSON.stringify(sample, null, 2));
  };

  const handleRemoveAllProducts = async () => {
    if (!confirm('Are you sure you want to remove ALL listed products from the store catalog? (Customer orders, accounts, and history will remain completely safe).')) {
      return;
    }
    try {
      const res = await fetch('/api/products?id=all', { method: 'DELETE' });
      if (res.ok) {
        showToast('All Products Removed', 'All catalog items have been cleared', 'info');
        await refreshProducts();
      } else {
        throw new Error('Failed to delete all products');
      }
    } catch (e: any) {
      showToast('Error', e?.message || 'Could not remove products', 'error');
    }
  };

  const handleRestoreSampleBackup = async () => {
    if (!confirm('Restore 126 sample handmade resin products from the backup?')) {
      return;
    }
    try {
      setIsImporting(true);
      const res = await fetch('/api/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restoreBackup: true }),
      });
      const data = await res.json();
      setIsImporting(false);
      if (res.ok) {
        showToast('Backup Restored', data.message || 'Restored 126 products', 'success');
        setIsBulkModalOpen(false);
        await refreshProducts();
      } else {
        throw new Error(data.error || 'Failed to restore backup');
      }
    } catch (e: any) {
      setIsImporting(false);
      showToast('Error', e?.message || 'Failed to restore backup', 'error');
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
  };

  // If not authenticated, show elegant admin login
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-24">
        <div className="bg-white rounded-3xl border border-[#E8DCCB] p-8 shadow-elevation space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-[#332820] text-[#C6A15B] flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#332820]">
              ResinAura Admin Portal
            </h1>
            <p className="text-xs text-[#85796B]">
              Authorized administrative access only
            </p>
          </div>

          {passcodeError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-center">
              {passcodeError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#332820] mb-1.5">
                Admin Master Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  placeholder="Enter passcode (Default: admin123)"
                  className="w-full bg-[#FFF9F0]/60 border border-[#E8DCCB] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B]"
                />
                <Lock className="w-4 h-4 text-[#85796B] absolute left-3 top-3" />
              </div>
              <p className="text-[10px] text-[#85796B] mt-1.5">
                Tip: Enter &apos;<strong>admin123</strong>&apos; to unlock dashboard
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#332820] hover:bg-[#A9823D] text-white py-3 rounded-xl font-bold text-xs shadow-card transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#C6A15B]" />
              <span>Unlock Admin Center</span>
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-[#85796B] hover:text-[#332820] underline">
              &larr; Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Hidden file inputs */}
      <input
        ref={mainFileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
        onChange={handleMainFileChange}
      />
      <input
        ref={galleryFileInputRef}
        type="file"
        multiple
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
        onChange={handleGalleryFilesChange}
      />
      <input
        ref={replaceFileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
        onChange={handleExecuteReplace}
      />

      {/* Admin Top Header */}
      <div className="bg-[#332820] text-white rounded-3xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#C6A15B] mb-1 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>ResinAura Command Studio</span>
          </div>
          <h1 className="font-serif text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-xs text-stone-300 mt-1">
            Managing {products.length} handmade resin products across 9 categories
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* THE WORKING BUTTON LABELED: ADD NEW PRODUCT */}
          <button
            onClick={handleOpenAddProduct}
            className="inline-flex items-center gap-2 bg-[#C6A15B] hover:bg-[#A9823D] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-gold transition-all transform hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>ADD NEW PRODUCT</span>
          </button>

          {/* BULK IMPORT / EXPORT BUTTON */}
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-[#FFF9F0] border border-white/20 px-4 py-2.5 rounded-full text-xs font-semibold transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>Bulk Import / Export</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-full transition-colors flex items-center gap-1.5 border border-white/10"
          >
            <span>Live Storefront</span>
            <Eye className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => setIsAdminAuthenticated(false)}
            className="text-xs font-semibold bg-rose-600/30 hover:bg-rose-600 text-rose-200 hover:text-white px-4 py-2.5 rounded-full transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8DCCB] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            activeTab === 'products'
              ? 'bg-[#332820] text-white'
              : 'text-[#85796B] hover:bg-[#F5EBDD] hover:text-[#332820]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-[#332820] text-white'
              : 'text-[#85796B] hover:bg-[#F5EBDD] hover:text-[#332820]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders Management ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            activeTab === 'analytics'
              ? 'bg-[#332820] text-white'
              : 'text-[#85796B] hover:bg-[#F5EBDD] hover:text-[#332820]'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Analytics &amp; Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            activeTab === 'settings'
              ? 'bg-[#332820] text-white'
              : 'text-[#85796B] hover:bg-[#F5EBDD] hover:text-[#332820]'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>Store Settings</span>
        </button>
      </div>

      {/* TAB 1: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#332820]">
                Resin Products Catalog
              </h3>
              <p className="text-xs text-[#85796B]">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {products.length > 0 && (
                <button
                  type="button"
                  onClick={handleRemoveAllProducts}
                  className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 px-3.5 py-2 rounded-full text-xs font-bold border border-rose-200 transition-colors"
                  title="Remove all products from store catalog"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove All Products</span>
                </button>
              )}

              <button
                onClick={() => setIsBulkModalOpen(true)}
                className="inline-flex items-center gap-2 bg-[#F5EBDD] hover:bg-[#E8DCCB] text-[#332820] px-4 py-2 rounded-full text-xs font-bold border border-[#E8DCCB] transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>Bulk Import / Export</span>
              </button>

              <button
                onClick={handleOpenAddProduct}
                className="inline-flex items-center gap-2 bg-[#C6A15B] hover:bg-[#A9823D] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-gold transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>ADD NEW PRODUCT</span>
              </button>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-[#E8DCCB]">
            <div className="relative">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search name, SKU, category..."
                className="w-full bg-[#FFF9F0]/60 border border-[#E8DCCB] rounded-xl pl-9 pr-3 py-2 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B]"
              />
              <Search className="w-3.5 h-3.5 text-[#85796B] absolute left-3 top-2.5" />
            </div>

            <div>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#FFF9F0]/60 border border-[#E8DCCB] rounded-xl px-3 py-2 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B]"
              >
                <option value="All">All 9 Resin Categories</option>
                {CATEGORIES.filter(c => c !== 'All Products').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#FFF9F0]/60 border border-[#E8DCCB] rounded-xl px-3 py-2 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B]"
              >
                <option value="All">All Statuses (Active &amp; Inactive)</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-3xl border border-[#E8DCCB] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5EBDD] text-[#332820] font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">SKU</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price / Discount</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DCCB]/60">
                  {paginatedProducts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-[#85796B]">
                        <div className="max-w-sm mx-auto space-y-3">
                          <Sparkles className="w-8 h-8 text-[#C6A15B] mx-auto opacity-70" />
                          <p className="font-serif text-base font-bold text-[#332820]">No Products Listed</p>
                          <p className="text-xs">All listed products have been removed. Click &quot;ADD NEW PRODUCT&quot; above to list your handcrafted items, or use Bulk Import.</p>
                          <button
                            onClick={handleOpenAddProduct}
                            className="inline-flex items-center gap-1.5 bg-[#C6A15B] hover:bg-[#A9823D] text-white px-4 py-2 rounded-full text-xs font-bold"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add First Product</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                  {paginatedProducts.map((p) => {
                    const isActive = p.status !== 'inactive';
                    return (
                      <tr key={p.id} className="hover:bg-[#FFF9F0]/60 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-12 h-12 rounded-lg object-cover border border-[#E8DCCB] shrink-0"
                            />
                            <div className="min-w-0 max-w-xs">
                              <p className="font-bold text-[#332820] truncate">{p.name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                {p.isFeatured && (
                                  <span className="bg-[#C6A15B] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Featured</span>
                                )}
                                {p.isNewArrival && (
                                  <span className="bg-[#332820] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">New</span>
                                )}
                                {p.isBestSeller && (
                                  <span className="bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Bestseller</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-[11px] text-[#85796B]">{p.sku || 'N/A'}</td>
                        <td className="p-4 font-medium text-[#85796B]">{p.category}</td>
                        <td className="p-4">
                          <span className="font-bold text-[#332820]">{formatPrice(p.price)}</span>
                          {p.originalPrice && (
                            <span className="text-[10px] text-[#85796B] line-through block">
                              {formatPrice(p.originalPrice)}
                            </span>
                          )}
                          {p.discount ? (
                            <span className="text-[10px] text-emerald-700 font-bold">{p.discount}% OFF</span>
                          ) : null}
                        </td>
                        <td className="p-4">
                          <span className={`font-bold ${p.stock <= 5 ? 'text-rose-600' : 'text-emerald-700'}`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => toggleProductStatus(p.id)}
                            className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-stone-100 text-stone-500 border-stone-300 hover:bg-stone-200'
                            }`}
                            title="Click to toggle active/inactive status"
                          >
                            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`}></span>
                            <span>{isActive ? 'Active' : 'Inactive'}</span>
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 rounded-lg text-[#85796B] hover:text-[#332820] hover:bg-[#F5EBDD]"
                              title="Edit Product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to permanently delete "${p.name}"?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-[#85796B] hover:text-red-600 hover:bg-rose-50"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 bg-white border-t border-[#E8DCCB] flex items-center justify-between text-xs">
                <span className="text-[#85796B]">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-[#E8DCCB] disabled:opacity-40 hover:bg-[#F5EBDD]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg font-bold ${
                          currentPage === pageNum
                            ? 'bg-[#332820] text-white'
                            : 'border border-[#E8DCCB] text-[#332820] hover:bg-[#F5EBDD]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-[#E8DCCB] disabled:opacity-40 hover:bg-[#F5EBDD]"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#332820]">
                Customer Orders &amp; Fulfillment
              </h3>
              <p className="text-xs text-[#85796B]">Update status, view customer information, and track delivery</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#85796B]">Filter Status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-white border border-[#E8DCCB] text-xs rounded-full px-3 py-1.5 text-[#332820] focus:outline-none focus:border-[#C6A15B]"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#E8DCCB] p-12 text-center text-xs text-[#85796B]">
                No customer orders placed yet.
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-3xl border border-[#E8DCCB] p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8DCCB]">
                    <div>
                      <span className="text-[10px] font-bold text-[#85796B] uppercase">Order ID</span>
                      <h4 className="font-serif text-lg font-bold text-[#332820]">#{ord.orderNumber}</h4>
                      <p className="text-[11px] text-[#85796B]">{formatDate(ord.createdAt)}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="bg-[#F5EBDD] border border-[#E8DCCB] text-xs font-bold rounded-xl px-3 py-1.5 text-[#332820] focus:outline-none focus:border-[#C6A15B] cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => setViewingOrder(ord)}
                        className="text-xs bg-[#332820] text-white px-3.5 py-1.5 rounded-xl font-bold hover:bg-[#A9823D] transition-colors"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="font-bold text-[#85796B] block">Recipient</span>
                      <p className="font-bold text-[#332820] mt-0.5">{ord.customer.fullName}</p>
                      <p className="text-[#85796B]">{ord.customer.phone}</p>
                      <p className="text-[#85796B]">{ord.customer.city}, {ord.customer.state}</p>
                    </div>

                    <div>
                      <span className="font-bold text-[#85796B] block">Items</span>
                      <p className="text-[#332820] mt-0.5">
                        {ord.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-[#85796B] block">Payment</span>
                      <p className="font-bold text-[#A9823D] mt-0.5">{formatPrice(ord.total)}</p>
                      <span className="text-[11px] uppercase text-[#85796B]">
                        {ord.paymentMethod} • Status: {ord.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ANALYTICS OVERVIEW */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl border border-[#E8DCCB] p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#85796B]">
                  Total Sales Revenue
                </span>
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <p className="font-serif text-3xl font-bold text-[#332820] mt-3">
                {formatPrice(totalSales)}
              </p>
              <p className="text-[11px] text-emerald-600 mt-1">Verified online &amp; prepaid revenue</p>
            </div>

            <div className="bg-white rounded-3xl border border-[#E8DCCB] p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#85796B]">
                  Total Orders
                </span>
                <div className="w-10 h-10 rounded-full bg-amber-50 text-[#C6A15B] flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <p className="font-serif text-3xl font-bold text-[#332820] mt-3">
                {totalOrdersCount}
              </p>
              <p className="text-[11px] text-[#85796B] mt-1">All handmade resin orders</p>
            </div>

            <div className="bg-white rounded-3xl border border-[#E8DCCB] p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#85796B]">
                  Active Products
                </span>
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <p className="font-serif text-3xl font-bold text-[#332820] mt-3">
                {products.filter(p => p.status !== 'inactive').length}
              </p>
              <p className="text-[11px] text-[#85796B] mt-1">Across 9 handmade categories</p>
            </div>

            <div className="bg-white rounded-3xl border border-[#E8DCCB] p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#85796B]">
                  Low-Stock Alerts
                </span>
                <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
              <p className="font-serif text-3xl font-bold text-[#332820] mt-3">
                {lowStockProducts.length}
              </p>
              <p className="text-[11px] text-rose-600 mt-1">Items with &le; 5 pieces in stock</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STORE SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-white rounded-3xl border border-[#E8DCCB] p-6 sm:p-8 shadow-card space-y-6">
          <div className="pb-4 border-b border-[#E8DCCB]">
            <h3 className="font-serif text-2xl font-bold text-[#332820]">
              Store &amp; WhatsApp Configuration
            </h3>
            <p className="text-xs text-[#85796B]">
              Configure WhatsApp phone number, banner announcement, and free shipping rates
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
            <div>
              <label className="block text-xs font-semibold text-[#332820] mb-1">
                Artisan WhatsApp Business Number (e.g. 919876543210)
              </label>
              <input
                type="text"
                value={settingsForm.whatsappNumber}
                onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                className="w-full bg-[#FFF9F0]/60 border border-[#E8DCCB] rounded-xl px-3.5 py-2.5 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#332820] mb-1">
                Top Announcement Bar Message
              </label>
              <input
                type="text"
                value={settingsForm.announcementText}
                onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                className="w-full bg-[#FFF9F0]/60 border border-[#E8DCCB] rounded-xl px-3.5 py-2.5 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#332820] mb-1">
                  Free Shipping Threshold (₹)
                </label>
                <input
                  type="number"
                  value={settingsForm.freeShippingThreshold}
                  onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                  className="w-full bg-[#FFF9F0]/60 border border-[#E8DCCB] rounded-xl px-3.5 py-2.5 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#332820] mb-1">
                  Flat Shipping Charge (₹)
                </label>
                <input
                  type="number"
                  value={settingsForm.flatShippingRate}
                  onChange={(e) => setSettingsForm({ ...settingsForm, flatShippingRate: Number(e.target.value) })}
                  className="w-full bg-[#FFF9F0]/60 border border-[#E8DCCB] rounded-xl px-3.5 py-2.5 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8DCCB]">
              <button
                type="submit"
                className="bg-[#332820] hover:bg-[#A9823D] text-white px-6 py-2.5 rounded-full font-bold text-xs shadow-card transition-colors"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: BULK IMPORT & EXPORT */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFF9F0] border border-[#E8DCCB] w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-elevation max-h-[92vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DCCB]">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-6 h-6 text-[#C6A15B]" />
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#332820]">
                    Bulk Product Import &amp; Export
                  </h3>
                  <p className="text-xs text-[#85796B]">Import multiple resin products at once or backup current catalog</p>
                </div>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="p-1.5 rounded-full text-[#85796B] hover:text-[#332820] hover:bg-[#F5EBDD]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 bg-white rounded-2xl border border-[#E8DCCB] flex flex-col justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-[#332820]">Restore 126 Sample Products</h4>
                  <p className="text-[11px] text-[#85796B]">Restore the sample catalog with 126 resin products across all 9 categories</p>
                </div>
                <button
                  type="button"
                  onClick={handleRestoreSampleBackup}
                  disabled={isImporting}
                  className="bg-[#C6A15B] hover:bg-[#A9823D] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Sample Catalog</span>
                </button>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#E8DCCB] flex flex-col justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-[#332820]">Export Existing Catalog</h4>
                  <p className="text-[11px] text-[#85796B]">Download all {products.length} current products as JSON backup</p>
                </div>
                <button
                  type="button"
                  onClick={handleExportCatalog}
                  className="bg-[#332820] hover:bg-[#A9823D] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON Catalog</span>
                </button>
              </div>
            </div>

            {/* Import Form */}
            <form onSubmit={handleBulkImport} className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[#332820]">
                  Paste JSON Products Array
                </label>
                <button
                  type="button"
                  onClick={handleLoadSampleTemplate}
                  className="text-xs font-bold text-[#A9823D] hover:underline"
                >
                  Load Sample Template
                </button>
              </div>

              <textarea
                rows={8}
                value={bulkInputText}
                onChange={(e) => setBulkInputText(e.target.value)}
                placeholder='[ { "name": "Resin Keychain", "sku": "RA-AK-001", "category": "Resin Alphabet Keychains", "price": 349, "stock": 20 } ]'
                className="w-full bg-white border border-[#E8DCCB] rounded-2xl p-3 font-mono text-[11px] text-[#332820] focus:outline-none focus:border-[#C6A15B]"
              />

              {/* Mode Selection */}
              <div className="flex items-center gap-6 p-3 bg-white rounded-xl border border-[#E8DCCB]">
                <span className="font-bold text-[#332820]">Import Mode:</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="bulkMode"
                    value="append"
                    checked={bulkMode === 'append'}
                    onChange={() => setBulkMode('append')}
                    className="accent-[#C6A15B]"
                  />
                  <span>Append to existing products</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="bulkMode"
                    value="replace"
                    checked={bulkMode === 'replace'}
                    onChange={() => setBulkMode('replace')}
                    className="accent-[#C6A15B]"
                  />
                  <span className="text-rose-600 font-medium">Replace entire catalog</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2 text-[#85796B] hover:text-[#332820]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isImporting}
                  className="bg-[#C6A15B] hover:bg-[#A9823D] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-gold disabled:opacity-50 transition-colors"
                >
                  {isImporting ? 'Importing Products...' : 'Import Products Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PRODUCT FORM */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFF9F0] border border-[#E8DCCB] w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-elevation max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DCCB]">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#332820]">
                  {editingProduct ? 'Edit Resin Product' : 'ADD NEW RESIN PRODUCT'}
                </h3>
                <p className="text-xs text-[#85796B]">
                  {editingProduct ? `Updating SKU: ${editingProduct.sku || editingProduct.id}` : 'Fill in details, SKU, and upload permanent product photography'}
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 rounded-full text-[#85796B] hover:text-[#332820] hover:bg-[#F5EBDD]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6 pt-4 text-xs">
              {/* Row 1: Name & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#332820] mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={prodForm.name}
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                    placeholder="e.g. 24K Gold Foil Initial Letter Keychain"
                    className="w-full bg-white border border-[#E8DCCB] rounded-xl px-3.5 py-2.5 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B] shadow-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#332820] mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={prodForm.sku}
                    onChange={(e) => setProdForm({ ...prodForm, sku: e.target.value.toUpperCase() })}
                    placeholder="e.g. RA-AK-001"
                    className="w-full bg-white border border-[#E8DCCB] rounded-xl px-3.5 py-2.5 text-xs text-[#332820] font-mono focus:outline-none focus:border-[#C6A15B] shadow-sm"
                  />
                </div>
              </div>

              {/* Row 2: Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#332820] mb-1">Category *</label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value as ProductCategory })}
                    className="w-full bg-white border border-[#E8DCCB] rounded-xl px-3.5 py-2.5 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B] shadow-sm font-medium"
                  >
                    {CATEGORIES.filter(c => c !== 'All Products').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#332820] mb-1">Product Status *</label>
                  <select
                    value={prodForm.status}
                    onChange={(e) => setProdForm({ ...prodForm, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full bg-white border border-[#E8DCCB] rounded-xl px-3.5 py-2.5 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B] shadow-sm font-semibold"
                  >
                    <option value="active">Active (Visible on Store)</option>
                    <option value="inactive">Inactive (Hidden from Customers)</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Pricing, Discount & Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-[#E8DCCB]">
                <div>
                  <label className="block font-bold text-[#332820] mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={prodForm.price}
                    onChange={(e) => handlePriceChange(Number(e.target.value))}
                    className="w-full bg-[#FFF9F0]/60 border border-[#E8DCCB] rounded-xl px-3 py-2 text-xs font-bold text-[#332820]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#332820] mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={prodForm.originalPrice}
                    onChange={(e) => handleOriginalPriceChange(Number(e.target.value))}
                    className="w-full bg-[#FFF9F0]/60 border border-[#E8DCCB] rounded-xl px-3 py-2 text-xs text-[#85796B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#332820] mb-1">Discount %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={prodForm.discount}
                    onChange={(e) => setProdForm({ ...prodForm, discount: Number(e.target.value) })}
                    className="w-full bg-[#FFF9F0]/60 border border-[#E8DCCB] rounded-xl px-3 py-2 text-xs text-emerald-700 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#332820] mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                    className="w-full bg-[#FFF9F0]/60 border border-[#E8DCCB] rounded-xl px-3 py-2 text-xs font-bold text-[#332820]"
                  />
                </div>
              </div>

              {/* Row 4: Main Product Image Upload */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DCCB] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#332820] flex items-center gap-1.5 text-xs">
                    <ImageIcon className="w-4 h-4 text-[#C6A15B]" />
                    <span>Main Product Image * (Permanent Server Upload)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => mainFileInputRef.current?.click()}
                    disabled={isUploadingMain}
                    className="inline-flex items-center gap-1 text-[11px] bg-[#332820] text-white px-3 py-1.5 rounded-lg hover:bg-[#A9823D] transition-colors disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingMain ? 'Uploading...' : 'Upload Image (JPG/PNG)'}</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-[#E8DCCB] bg-[#FFF9F0] shrink-0 group">
                    <img
                      src={prodForm.mainImage}
                      alt="Main Product Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => mainFileInputRef.current?.click()}
                        className="p-1.5 bg-white text-[#332820] rounded-md text-[10px] font-bold"
                        title="Replace Main Image"
                      >
                        Replace
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={prodForm.mainImage}
                        onChange={(e) => setProdForm({ ...prodForm, mainImage: e.target.value })}
                        placeholder="Image URL or upload via button above..."
                        className="w-full bg-[#FFF9F0]/60 border border-[#E8DCCB] rounded-xl px-3 py-2 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B]"
                      />
                    </div>
                    <p className="text-[11px] text-[#85796B]">
                      Uploads are stored permanently in the server storage. Supports JPG, PNG, and WebP.
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 5: Additional Images Gallery */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8DCCB] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#332820] flex items-center gap-1.5 text-xs">
                    <ImageIcon className="w-4 h-4 text-[#C6A15B]" />
                    <span>Additional Images Gallery ({prodForm.additionalImages.length})</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => galleryFileInputRef.current?.click()}
                    disabled={isUploadingGallery}
                    className="inline-flex items-center gap-1 text-[11px] bg-[#C6A15B] text-white px-3 py-1.5 rounded-lg hover:bg-[#A9823D] transition-colors disabled:opacity-50 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isUploadingGallery ? 'Uploading...' : 'Add More Photos'}</span>
                  </button>
                </div>

                {prodForm.additionalImages.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                    {prodForm.additionalImages.map((imgUrl, index) => (
                      <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-[#E8DCCB] group bg-stone-50">
                        <img src={imgUrl} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleReplaceGalleryImage(index)}
                            className="p-1 bg-white text-[#332820] rounded text-[10px] font-bold"
                            title="Replace"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteGalleryImage(index)}
                            className="p-1 bg-rose-600 text-white rounded text-[10px] font-bold"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-[#85796B] italic py-2">
                    No additional images uploaded yet. Click &quot;Add More Photos&quot; to upload multiple angles.
                  </p>
                )}
              </div>

              {/* Row 6: Description */}
              <div>
                <label className="block font-bold text-[#332820] mb-1">Product Description *</label>
                <textarea
                  rows={3}
                  required
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  placeholder="Detailed description of the resin art piece..."
                  className="w-full bg-white border border-[#E8DCCB] rounded-xl p-3 text-xs text-[#332820] focus:outline-none focus:border-[#C6A15B]"
                />
              </div>

              {/* Row 7: Materials & Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#332820] mb-1">Materials Used</label>
                  <input
                    type="text"
                    value={prodForm.materials}
                    onChange={(e) => setProdForm({ ...prodForm, materials: e.target.value })}
                    className="w-full bg-white border border-[#E8DCCB] rounded-xl px-3 py-2 text-xs text-[#332820]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#332820] mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={prodForm.dimensions}
                    onChange={(e) => setProdForm({ ...prodForm, dimensions: e.target.value })}
                    className="w-full bg-white border border-[#E8DCCB] rounded-xl px-3 py-2 text-xs text-[#332820]"
                  />
                </div>
              </div>

              {/* Row 8: Flags */}
              <div className="flex flex-wrap items-center gap-6 pt-2 bg-white p-4 rounded-xl border border-[#E8DCCB]">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#332820]">
                  <input
                    type="checkbox"
                    checked={prodForm.isFeatured}
                    onChange={(e) => setProdForm({ ...prodForm, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-[#C6A15B] rounded cursor-pointer"
                  />
                  <span>Show in Featured Section</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#332820]">
                  <input
                    type="checkbox"
                    checked={prodForm.isNewArrival}
                    onChange={(e) => setProdForm({ ...prodForm, isNewArrival: e.target.checked })}
                    className="w-4 h-4 accent-[#C6A15B] rounded cursor-pointer"
                  />
                  <span>Show in New Arrivals</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#332820]">
                  <input
                    type="checkbox"
                    checked={prodForm.isPopular}
                    onChange={(e) => setProdForm({ ...prodForm, isPopular: e.target.checked })}
                    className="w-4 h-4 accent-[#C6A15B] rounded cursor-pointer"
                  />
                  <span>Show in Popular / Bestsellers</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#E8DCCB] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-semibold text-[#85796B] hover:text-[#332820] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#C6A15B] hover:bg-[#A9823D] text-white px-7 py-2.5 rounded-xl font-bold text-xs shadow-gold transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProduct ? 'Update Product' : 'Save & Publish Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ORDER DETAILS INSPECTION */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFF9F0] border border-[#E8DCCB] w-full max-w-lg rounded-3xl p-6 shadow-elevation space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DCCB]">
              <h3 className="font-serif text-lg font-bold text-[#332820]">
                Order Details: #{viewingOrder.orderNumber}
              </h3>
              <button
                onClick={() => setViewingOrder(null)}
                className="p-1 rounded-full text-[#85796B] hover:text-[#332820]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#E8DCCB] space-y-1">
                <span className="font-bold text-[#A9823D] block uppercase tracking-wider text-[10px]">
                  Shipping Info
                </span>
                <p className="font-bold text-[#332820]">{viewingOrder.customer.fullName}</p>
                <p className="text-[#85796B]">{viewingOrder.customer.streetAddress}</p>
                <p className="text-[#85796B]">{viewingOrder.customer.city}, {viewingOrder.customer.state} - {viewingOrder.customer.pinCode}</p>
                <p className="text-[#332820] font-medium">Phone: {viewingOrder.customer.phone}</p>
                <p className="text-[#332820]">Email: {viewingOrder.customer.email}</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E8DCCB] space-y-2">
                <span className="font-bold text-[#A9823D] block uppercase tracking-wider text-[10px]">
                  Ordered Resin Products
                </span>
                {viewingOrder.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{i.productName} (x{i.quantity})</span>
                    <span className="font-bold">{formatPrice(i.price * i.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between font-bold text-sm text-[#332820] pt-2">
                <span>Total Amount:</span>
                <span className="text-[#A9823D]">{formatPrice(viewingOrder.total)}</span>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setViewingOrder(null)}
                className="bg-[#332820] text-white px-5 py-2 rounded-xl font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
