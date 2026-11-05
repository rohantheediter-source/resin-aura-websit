# ✨ ResinAura — Luxury Handcrafted Resin Art & Bespoke E-Commerce

**ResinAura** (`@resinaura.store`) is a premier, luxury, mobile-first e-commerce web platform engineered for handmade resin art, wedding floral preservation heirlooms, 24K gold flake alphabet keychains, resin jewellery, customized name plates, and personalized gifts.

---

## 🎨 Luxury Brand Identity & Color Palette

- **Primary Background:** `#FFF9F0` (Artisan Ivory Cream)
- **Secondary Background:** `#F5EBDD` (Warm Sand)
- **Gold Accent:** `#C6A15B` (Molten 24K Gold)
- **Dark Gold:** `#A9823D` (Antique Bronze Gold)
- **Primary Text:** `#332820` (Deep Espresso Wood)
- **Secondary Text:** `#85796B` (Muted Cocoa)
- **Cards & Surfaces:** `#FFFFFF` (Pristine White)
- **Borders & Dividers:** `#E8DCCB` (Soft Linen)
- **Typography:** Cormorant Garamond (Editorial Serif) & Outfit (Modern Clean Sans)

---

## 🚀 Key Features

### 1. Storefront & Collections
- **Explore Categories:**
  1. *All Products*
  2. *Resin Keychains* (Alphabet initial charms, gold leaf, botanical petals)
  3. *Resin Jewellery* (Emerald teardrop pendants, celestial opal earrings, rose petal rings)
  4. *Personalized Gifts* (Illuminated couple photo resin frames, Spotify plaques)
  5. *Wedding Gifts* (Bridal varmala / jaimala garland preservation clocks, ring platters)
  6. *Name Plates* (3D ocean waves, Calacatta gold-veined marble)
  7. *Customized Resin Art* (Gilded geode agate coasters, wood & resin serving trays)
- **Product Filtering & Sorting:** Instant live search, category tabs, price range slider, stock availability toggle, sorting by price/rating/newest.
- **Product Showcase Gallery:** High-resolution zoomable image carousel, stock counter, handcrafted materials breakdown, resin care guide, related products recommendation.

### 2. "Create Your Own Design" — Bespoke Customizer Studio
- **Dedicated Interactive Customizer:**
  - Multi-step builder for selecting item types, shapes, dimensions.
  - Inclusions selector: 24K gold foil, wedding garland petals, quartz crystals, photos, seashells.
  - Color palettes: Ocean waves, Calacatta marble, Emerald green, Blush pink.
  - Custom names, wedding dates, and inscriptions.
- **WhatsApp Integration:** Automatically pre-fills a rich structured message and opens WhatsApp directly to connect the customer with the artisan to exchange photos.

### 3. Shopping Cart & Secure Checkout
- **Smart Shopping Bag:** Quantity selector with real-time stock limits, coupon discounts (`RESINAURA10`), free shipping progress bar.
- **Checkout Process:**
  - Full shipping address form (Name, WhatsApp phone, address, PIN code, state).
  - Multi-Payment Support:
    - **Razorpay Online Payments:** Cards, UPI (GPay, PhonePe, Paytm), NetBanking with backend HMAC-SHA256 signature verification.
    - **Cash on Delivery (COD).**
    - **WhatsApp Direct Order.**
- **Celebratory Order Confirmation:** Gold confetti animation, printable receipt, itemized breakdown, and live WhatsApp tracking link.

### 4. Customer Account Portal
- Order history with live status timeline (`Pending` ➔ `Confirmed` ➔ `Processing` ➔ `Shipped` ➔ `Delivered`).
- Personal Wishlist.
- Saved addresses management.
- Quick order tracking tool at `/track-order`.

### 5. Secure Admin Dashboard (`/admin`)
- **Protected by passcode** (Default: `admin123`).
- **Real-time Analytics:** Sales revenue, total orders, product count, low-stock warning triggers.
- **Product Management:** Add new designs, edit prices, upload images, update stock, toggle Bestseller / New Arrival badges.
- **Order Management:** Filter orders by status, change status, inspect customer addresses and order items.
- **Settings:** Configure WhatsApp business number, announcement bar text, free shipping threshold.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14+ (App Router) with TypeScript
- **Styling:** Tailwind CSS with custom luxury color palette and soft elevation shadows
- **Icons:** Lucide React
- **Payments:** Razorpay API (`razorpay` npm package + client checkout SDK)
- **Celebrations:** Canvas Confetti
- **Database Architecture:** Supabase PostgreSQL with full DDL and RLS policies (`supabase_schema.sql`) + resilient client-side reactive store

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your credentials:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
ADMIN_PASSCODE=admin123
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🗄️ Database Setup (Supabase)

To link a live Supabase database:
1. Create a new Supabase project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** tab in your Supabase dashboard.
3. Paste and run the entire SQL script from [`supabase_schema.sql`](./supabase_schema.sql).
4. Copy the Supabase URL and keys to `.env.local`.

---

© 2024 ResinAura (@resinaura.store). Handcrafted with Love & 24K Gold in India.

