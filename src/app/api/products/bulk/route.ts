import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getFileProducts, saveFileProducts } from '@/lib/server-products';
import { Product } from '@/lib/types';
import { generateSlug } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Check if restoring from sample backup
    if (body.restoreBackup) {
      const backupPath = path.join(process.cwd(), 'data', 'products.backup.json');
      if (fs.existsSync(backupPath)) {
        const backupData = fs.readFileSync(backupPath, 'utf-8');
        const backupProducts = JSON.parse(backupData);
        saveFileProducts(backupProducts);
        return NextResponse.json({
          success: true,
          importedCount: backupProducts.length,
          totalCount: backupProducts.length,
          message: `Restored ${backupProducts.length} sample products from backup`,
        });
      }
    }

    const { products: incomingProducts, mode = 'append' } = body;

    if (!Array.isArray(incomingProducts)) {
      return NextResponse.json({ error: 'No products provided for import' }, { status: 400 });
    }

    if (incomingProducts.length === 0 && mode === 'replace') {
      saveFileProducts([]);
      return NextResponse.json({
        success: true,
        importedCount: 0,
        totalCount: 0,
        message: 'All products removed successfully',
      });
    }

    if (incomingProducts.length === 0) {
      return NextResponse.json({ error: 'No products provided for import' }, { status: 400 });
    }

    const currentProducts = getFileProducts();

    const sanitized: Product[] = incomingProducts.map((item: any, index: number) => {
      const name = item.name || `Resin Piece ${Date.now()}-${index}`;
      const price = Number(item.price) || 499;
      const originalPrice = item.originalPrice ? Number(item.originalPrice) : Math.round(price * 1.3);
      const discount = item.discount !== undefined ? Number(item.discount) : Math.round(((originalPrice - price) / originalPrice) * 100);

      return {
        id: item.id || `prod-import-${Date.now()}-${index}`,
        sku: item.sku || `RA-IMP-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        name,
        slug: item.slug || generateSlug(name),
        price,
        originalPrice,
        discount: Math.max(0, discount),
        category: item.category || 'Handmade Resin Accessories',
        description: item.description || 'Artisan handcrafted optical resin piece.',
        details: Array.isArray(item.details) ? item.details : [
          'Hand-poured with UV non-yellowing epoxy resin',
          'Crafted in small artisan batches in India',
        ],
        materials: item.materials || 'Epoxy resin, 24K gold foil, botanicals',
        dimensions: item.dimensions || 'Standard handcrafted dimensions',
        images: Array.isArray(item.images) && item.images.length > 0 
          ? item.images 
          : ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop'],
        stock: Number(item.stock || 20),
        status: item.status || 'active',
        isBestSeller: Boolean(item.isBestSeller),
        isPopular: Boolean(item.isPopular || item.isBestSeller),
        isNewArrival: Boolean(item.isNewArrival),
        isFeatured: Boolean(item.isFeatured),
        rating: item.rating ? Number(item.rating) : 4.9,
        reviewCount: item.reviewCount ? Number(item.reviewCount) : Math.floor(10 + Math.random() * 50),
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    let finalProducts: Product[];
    if (mode === 'replace') {
      finalProducts = sanitized;
    } else {
      // Append mode: update by SKU or ID if exists, otherwise prepend
      const existingIds = new Set(sanitized.map(p => p.id));
      const existingSkus = new Set(sanitized.map(p => p.sku).filter(Boolean));
      const retained = currentProducts.filter(p => !existingIds.has(p.id) && !existingSkus.has(p.sku));
      finalProducts = [...sanitized, ...retained];
    }

    saveFileProducts(finalProducts);

    return NextResponse.json({
      success: true,
      importedCount: sanitized.length,
      totalCount: finalProducts.length,
      message: `Successfully ${mode === 'replace' ? 'replaced catalog with' : 'imported'} ${sanitized.length} products.`,
    });
  } catch (error: any) {
    console.error('Bulk import error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to bulk import products' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const products = getFileProducts();
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to export products' }, { status: 500 });
  }
}

