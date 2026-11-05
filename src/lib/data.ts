import { Product, ProductCategory, Review } from './types';

export const CATEGORIES: ProductCategory[] = [
  'All Products',
  'Resin Alphabet Keychains',
  'Custom Name Keychains',
  'Resin Earrings',
  'Resin Pendants',
  'Resin Necklaces',
  'Pressed Flower Resin Jewellery',
  'Gold Flake Resin Jewellery',
  'Custom Resin Gifts',
  'Handmade Resin Accessories',
  'Wedding Gifts',
  'Name Plates',
];

// Clean empty products array - all products are dynamically managed via Admin Dashboard & data/products.json
export const INITIAL_PRODUCTS: Product[] = [];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    customerName: 'Pooja Sharma',
    rating: 5,
    comment: 'The bridal varmala preservation exceeded all my expectations! Our marriage flowers look so vibrant and the finish is like diamond glass. Thank you ResinAura!',
    date: '14 Oct 2024',
    verified: true,
  },
  {
    id: 'rev-2',
    customerName: 'Rohan Mehra',
    rating: 5,
    comment: 'The handcrafted gold leaf piece was delivered quickly and beautifully packed. The finish is crystal clear without a single bubble. Feels truly luxury in hand.',
    date: '28 Oct 2024',
    verified: true,
  },
  {
    id: 'rev-3',
    customerName: 'Ananya Deshmukh',
    rating: 5,
    comment: 'Got our custom artwork made with turquoise ocean waves. Every guest entering our home compliments it! The WhatsApp coordination was smooth and responsive.',
    date: '02 Nov 2024',
    verified: true,
  },
  {
    id: 'rev-4',
    customerName: 'Kavita Sundaram',
    rating: 5,
    comment: 'Even more stunning in person than the photos! The high-gloss finish is breathtaking and the gold accents shine brilliantly in natural light. Authentic studio craft.',
    date: '08 Nov 2024',
    verified: true,
  },
];

export const INSTAGRAM_POSTS = [
  {
    id: 'ig-1',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600&auto=format&fit=crop',
    likes: '1.2k',
    title: 'Custom alphabet letters fresh out of the silicone molds ✨',
  },
  {
    id: 'ig-2',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop',
    likes: '2.8k',
    title: 'Preserving raw love: Jaimala garland cast into a 12" heirloom clock 🌸',
  },
  {
    id: 'ig-3',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
    likes: '950',
    title: 'Emerald green hues and shimmering 24K gold foil drops 💫',
  },
  {
    id: 'ig-4',
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=600&auto=format&fit=crop',
    likes: '3.4k',
    title: 'Engagement ring platter with genuine raw quartz crystals 💍',
  },
  {
    id: 'ig-5',
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=600&auto=format&fit=crop',
    likes: '1.5k',
    title: 'Geode coasters with hand-painted molten gold rims ☕✨',
  },
  {
    id: 'ig-6',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop',
    likes: '4.1k',
    title: 'Custom luxury nameplates ready to dispatch across India 🏡',
  },
];
