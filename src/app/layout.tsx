import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ToastContainer from '@/components/ToastContainer';

export const metadata: Metadata = {
  title: 'ResinAura | Luxury Handmade Resin Art & Bespoke Gifts',
  description: 'Handcrafted luxury resin keychains, bridal wedding garland preservation clocks, resin jewellery, customized name plates, and personalized gifts. Hand-poured with 24K gold foil and preserved florals.',
  keywords: 'resin art, wedding garland preservation, custom keychains, handmade resin jewellery, personalized gifts, resin name plates, ResinAura, @resinaura.store',
  openGraph: {
    title: 'ResinAura | Luxury Handmade Resin Art',
    description: 'Bespoke resin art, bridal floral preservation, and personalized gifts.',
    url: 'https://resinaura.store',
    siteName: 'ResinAura',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'ResinAura Handcrafted Art',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#FFF9F0] text-[#332820]">
        <StoreProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <WhatsAppButton />
          <ToastContainer />
        </StoreProvider>
      </body>
    </html>
  );
}

