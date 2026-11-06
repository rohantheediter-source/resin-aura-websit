import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export function getWhatsAppNumber(): string {
  // Configurable via env var, fallback to ResinAura business WhatsApp
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917223008721';
}

export function buildWhatsAppCustomOrderUrl(details: {
  productType: string;
  customizationDetails: string;
  preferredDesign: string;
  quantity: number | string;
  name?: string;
}): string {
  const phone = getWhatsAppNumber().replace(/\D/g, '');
  const message = `Hello ResinAura!
I want to order a customized resin product.

*Customer Name:* ${details.name || 'Not provided'}
*Product Type:* ${details.productType}
*Customization Details:* ${details.customizationDetails}
*Preferred Design / Colors:* ${details.preferredDesign}
*Quantity:* ${details.quantity}

Please share the pricing and delivery details. I have reference photos ready to share!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppProductInquiryUrl(productName: string, price: number, productUrl?: string): string {
  const phone = getWhatsAppNumber().replace(/\D/g, '');
  const message = `Hello ResinAura!
I am interested in ordering:
*${productName}* (${formatPrice(price)})
${productUrl ? `Link: ${productUrl}\n` : ''}
Could you please confirm availability and customization options?`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppOrderSupportUrl(orderNumber: string): string {
  const phone = getWhatsAppNumber().replace(/\D/g, '');
  const message = `Hello ResinAura!
I have a question regarding my Order *#${orderNumber}*.
Could you please help me with the status update?`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

