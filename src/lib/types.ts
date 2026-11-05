export type ProductCategory = 
  | 'All Products'
  | 'Resin Alphabet Keychains'
  | 'Custom Name Keychains'
  | 'Resin Earrings'
  | 'Resin Pendants'
  | 'Resin Necklaces'
  | 'Pressed Flower Resin Jewellery'
  | 'Gold Flake Resin Jewellery'
  | 'Custom Resin Gifts'
  | 'Handmade Resin Accessories'
  | 'Wedding Gifts'
  | 'Name Plates';

export interface Product {
  id: string;
  sku?: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: ProductCategory;
  description: string;
  details?: string[];
  materials?: string;
  dimensions?: string;
  images: string[];
  stock: number;
  status?: 'active' | 'inactive';
  isBestSeller?: boolean;
  isPopular?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customNote?: string;
}

export interface Address {
  fullName: string;
  phone: string;
  email: string;
  streetAddress: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
}

export type OrderStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Processing' 
  | 'Shipped' 
  | 'Delivered' 
  | 'Cancelled';

export type PaymentMethod = 'razorpay' | 'cod' | 'whatsapp';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  category: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: Address;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId?: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  productName?: string;
  image?: string;
}

export interface CustomOrderRequest {
  productType: string;
  shapeSize: string;
  inclusions: string[];
  colorTheme: string;
  personalizationName: string;
  notes: string;
  customerName: string;
  phone: string;
}
