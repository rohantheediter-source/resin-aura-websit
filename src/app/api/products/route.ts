import { NextResponse } from 'next/server';
import { getFileProducts, saveFileProducts } from '@/lib/server-products';
import { Product } from '@/lib/types';
import { generateSlug } from '@/lib/utils';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get('all') === 'true';

    const products = getFileProducts();

    const responseHeaders = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };

    if (includeInactive) {
      return NextResponse.json(products, { headers: responseHeaders });
    }

    // By default for customer storefront, show active products (or undefined status defaults to active)
    const activeProducts = products.filter((p) => p.status !== 'inactive');
    return NextResponse.json(activeProducts, { headers: responseHeaders });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const products = getFileProducts();

    const newProduct: Product = {
      id: body.id || `prod-${Date.now()}`,
      sku: body.sku || `RA-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      name: body.name,
      slug: body.slug || generateSlug(body.name),
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      discount: body.discount !== undefined ? Number(body.discount) : undefined,
      category: body.category,
      description: body.description || '',
      details: body.details || [],
      materials: body.materials || '',
      dimensions: body.dimensions || '',
      images: Array.isArray(body.images) && body.images.length > 0 
        ? body.images 
        : ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop'],
      stock: Number(body.stock || 0),
      status: body.status || 'active',
      isBestSeller: Boolean(body.isBestSeller),
      isPopular: Boolean(body.isPopular || body.isBestSeller),
      isNewArrival: Boolean(body.isNewArrival),
      isFeatured: Boolean(body.isFeatured),
      rating: body.rating || 5.0,
      reviewCount: body.reviewCount || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newProduct, ...products];
    saveFileProducts(updated);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error?.message || 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const products = getFileProducts();
    const existingIndex = products.findIndex((p) => p.id === id);

    if (existingIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updatedProduct: Product = {
      ...products[existingIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    products[existingIndex] = updatedProduct;
    saveFileProducts(products);

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    if (id === 'all') {
      saveFileProducts([]);
      return NextResponse.json({ success: true, message: 'All products deleted successfully' });
    }

    const products = getFileProducts();
    const filtered = products.filter((p) => p.id !== id);
    saveFileProducts(filtered);

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete product' }, { status: 500 });
  }
}

