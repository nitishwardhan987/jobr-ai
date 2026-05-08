// ─────────────────────────────────────────────────────────────────────────────
// src/lib/merch-products.ts
// Jobr Merch — product catalogue data
//
// HOW TO ADD YOUR OWN IMAGES:
//   1. Drop any .png / .jpg into /public/merch/
//   2. Set image: '/merch/your-file.png'
//   3. If you have no image yet, leave the field empty → fallback emoji shows
// ─────────────────────────────────────────────────────────────────────────────

export type ProductCategory =
  | 'apparel'
  | 'jackets'
  | 'accessories'
  | 'misc';

export interface MerchProduct {
  id: string;
  name: string;
  subtitle: string;           // short descriptor shown in studio
  category: ProductCategory;
  price: number;              // base price (₹), before qty discount
  image: string;              // path starting with '/' — uses /public folder
  fallbackEmoji: string;      // shown if image fails to load
  colors: ColorOption[];
  sizes: string[];            // leave empty [] for non-sized items (mugs, etc.)
  isNew?: boolean;
  isBestSeller?: boolean;
  canCustomize: boolean;      // whether design studio is available
  whatsappText?: string;      // pre-filled WA message (auto-generated if blank)
}

export interface ColorOption {
  name: string;
  hex: string;
}

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

export const MERCH_PRODUCTS: MerchProduct[] = [
  // ── APPAREL ──────────────────────────────────────────────────────────────
  {
    id: 'oversize-tee',
    name: 'Oversize Tee',
    subtitle: 'Pure Cotton 220gsm',
    category: 'apparel',
    price: 479,
    image: '/16639907304364plus-size-tee_website-final.png',
    fallbackEmoji: '👕',
    colors: [
      { name: 'Jet Black',   hex: '#0a0a0a' },
      { name: 'Cloud White', hex: '#f0ede8' },
      { name: 'Slate Blue',  hex: '#3a4f6e' },
      { name: 'Dusty Rose',  hex: '#8a5a5a' },
      { name: 'Forest',      hex: '#3a5a4a' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    isNew: true,
    canCustomize: true,
  },
  {
    id: 'v-neck-tee',
    name: 'V-Neck Tee',
    subtitle: 'Pure Cotton 180gsm',
    category: 'apparel',
    price: 259,
    image: '',
    fallbackEmoji: '👕',
    colors: [
      { name: 'Jet Black',   hex: '#0a0a0a' },
      { name: 'Cloud White', hex: '#f0ede8' },
      { name: 'Lavender',    hex: '#c0a0e0' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    canCustomize: true,
  },
  {
    id: 'long-sleeve-tee',
    name: 'Long Sleeve Tee',
    subtitle: 'Pure Cotton 200gsm',
    category: 'apparel',
    price: 327,
    image: '',
    fallbackEmoji: '👕',
    colors: [
      { name: 'Jet Black',   hex: '#0a0a0a' },
      { name: 'Navy',        hex: '#1a2a4a' },
      { name: 'Cloud White', hex: '#f0ede8' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    isNew: true,
    canCustomize: true,
  },
  {
    id: 'polo-tshirt',
    name: 'Polo T-Shirt',
    subtitle: 'Pure Cotton Collared',
    category: 'apparel',
    price: 419,
    image: '',
    fallbackEmoji: '👔',
    colors: [
      { name: 'Jet Black',   hex: '#0a0a0a' },
      { name: 'Cloud White', hex: '#f0ede8' },
      { name: 'Bottle Green',hex: '#2a5a3a' },
      { name: 'Maroon',      hex: '#5a2a2a' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    canCustomize: true,
  },
  {
    id: 'activewear-jersey',
    name: 'Activewear Jersey',
    subtitle: 'Polyester Dri-Fit',
    category: 'apparel',
    price: 189,
    image: '',
    fallbackEmoji: '🎽',
    colors: [
      { name: 'Electric Blue', hex: '#1a4a8a' },
      { name: 'Jet Black',     hex: '#0a0a0a' },
      { name: 'Racing Red',    hex: '#8a1a1a' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    canCustomize: true,
  },
  {
    id: 'joggers',
    name: 'Pure Cotton Joggers',
    subtitle: 'Relaxed Fit Fleece',
    category: 'apparel',
    price: 699,
    image: '/16556998541354Jogger.png',
    fallbackEmoji: '👖',
    colors: [
      { name: 'Jet Black',   hex: '#0a0a0a' },
      { name: 'Charcoal',    hex: '#3a3a3a' },
      { name: 'Cloud White', hex: '#f0ede8' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    isBestSeller: true,
    canCustomize: true,
  },

  // ── JACKETS & HOODIES ────────────────────────────────────────────────────
  {
    id: 'pure-cotton-hoodie',
    name: 'Pure Cotton Hoodie',
    subtitle: '380gsm Heavyweight',
    category: 'jackets',
    price: 639,
    image: '/16327587616151ebe9ad1a0jackets-and-pullovers.svg',
    fallbackEmoji: '🧥',
    colors: [
      { name: 'Jet Black',   hex: '#0a0a0a' },
      { name: 'Cloud White', hex: '#f0ede8' },
      { name: 'Midnight',    hex: '#1a1a3a' },
      { name: 'Forest',      hex: '#1a3a2a' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    isNew: true,
    canCustomize: true,
  },
  {
    id: 'zipper-hoodie',
    name: 'Zipper Hoodie',
    subtitle: 'High-Neck Full Zip',
    category: 'jackets',
    price: 729,
    image: '',
    fallbackEmoji: '🧥',
    colors: [
      { name: 'Jet Black',   hex: '#0a0a0a' },
      { name: 'Cloud White', hex: '#f0ede8' },
      { name: 'Khaki',       hex: '#5a4a3a' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    canCustomize: true,
  },
  {
    id: 'crewneck-sweatshirt',
    name: 'Crew Neck Sweatshirt',
    subtitle: 'Brushed Fleece 320gsm',
    category: 'jackets',
    price: 599,
    image: '',
    fallbackEmoji: '🧥',
    colors: [
      { name: 'Jet Black',   hex: '#0a0a0a' },
      { name: 'Cloud White', hex: '#f0ede8' },
      { name: 'Steel',       hex: '#3a4a5a' },
      { name: 'Plum',        hex: '#4a3a5a' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    isBestSeller: true,
    canCustomize: true,
  },
  {
    id: 'varsity-jacket',
    name: 'Varsity Jacket',
    subtitle: 'Cotton Twill + Rib',
    category: 'jackets',
    price: 799,
    image: '',
    fallbackEmoji: '🧥',
    colors: [
      { name: 'Black / White', hex: '#0a0a0a' },
      { name: 'Maroon / Cream',hex: '#5a1a1a' },
      { name: 'Navy / Gold',   hex: '#1a2a5a' },
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    isNew: true,
    canCustomize: true,
  },

  // ── ACCESSORIES ──────────────────────────────────────────────────────────
  {
    id: 'trucker-cap',
    name: 'Trucker Cap',
    subtitle: 'Mesh Back, Snapback',
    category: 'accessories',
    price: 345,
    image: '/1633358660615b13444dfd21630042360612878f8986d016297183166123.jpg',
    fallbackEmoji: '🧢',
    colors: [
      { name: 'Jet Black',   hex: '#0a0a0a' },
      { name: 'Cloud White', hex: '#f0ede8' },
      { name: 'Tan',         hex: '#8a6a3a' },
    ],
    sizes: [],
    isBestSeller: true,
    canCustomize: true,
  },
  {
    id: 'baseball-cap',
    name: 'Baseball Cap',
    subtitle: 'Structured 6-panel',
    category: 'accessories',
    price: 315,
    image: '',
    fallbackEmoji: '🧢',
    colors: [
      { name: 'Jet Black',   hex: '#0a0a0a' },
      { name: 'Navy',        hex: '#1a2a5a' },
      { name: 'Cloud White', hex: '#f0ede8' },
    ],
    sizes: [],
    canCustomize: true,
  },
  {
    id: 'bucket-hat',
    name: 'Bucket Hat',
    subtitle: 'Cotton Twill',
    category: 'accessories',
    price: 449,
    image: '',
    fallbackEmoji: '👒',
    colors: [
      { name: 'Jet Black',   hex: '#0a0a0a' },
      { name: 'Sage',        hex: '#8a9a7a' },
      { name: 'Sand',        hex: '#c0a87a' },
    ],
    sizes: ['S/M', 'L/XL'],
    canCustomize: true,
  },
  {
    id: 'tote-bag',
    name: 'Tote Bag',
    subtitle: 'Canvas 12oz',
    category: 'accessories',
    price: 299,
    image: '',
    fallbackEmoji: '👜',
    colors: [
      { name: 'Natural',     hex: '#d4c4a0' },
      { name: 'Jet Black',   hex: '#0a0a0a' },
    ],
    sizes: [],
    isNew: true,
    canCustomize: true,
  },

  // ── MUGS & MORE ──────────────────────────────────────────────────────────
  {
    id: 'ceramic-mug',
    name: 'Ceramic Mug',
    subtitle: '325ml, Dishwasher Safe',
    category: 'misc',
    price: 195,
    image: '/16327587376151ebd1a7a43coffee-mug-black.svg',
    fallbackEmoji: '☕',
    colors: [
      { name: 'Cloud White', hex: '#f0ede8' },
      { name: 'Jet Black',   hex: '#0a0a0a' },
      { name: 'Navy',        hex: '#1a2a5a' },
    ],
    sizes: [],
    isBestSeller: true,
    canCustomize: true,
  },
  {
    id: 'enamel-mug',
    name: 'Enamel Mug',
    subtitle: '400ml, Camp-style',
    category: 'misc',
    price: 299,
    image: '',
    fallbackEmoji: '☕',
    colors: [
      { name: 'Jet Black',   hex: '#0a0a0a' },
      { name: 'Racing Red',  hex: '#8a1a1a' },
      { name: 'Navy',        hex: '#1a2a5a' },
    ],
    sizes: [],
    canCustomize: true,
  },
  {
    id: 'mouse-pad',
    name: 'Mouse Pad',
    subtitle: 'XL Desk Mat 900×400mm',
    category: 'misc',
    price: 149,
    image: '',
    fallbackEmoji: '🖱️',
    colors: [
      { name: 'Jet Black',   hex: '#0a0a0a' },
      { name: 'Charcoal',    hex: '#2a2a2a' },
    ],
    sizes: [],
    isNew: true,
    canCustomize: true,
  },
  {
    id: 'poster',
    name: 'Art Poster',
    subtitle: 'A3 Matte Print',
    category: 'misc',
    price: 135,
    image: '/16327587236151ebc3d5961stationery.svg',
    fallbackEmoji: '🖼️',
    colors: [
      { name: 'White BG',    hex: '#f0ede8' },
      { name: 'Black BG',    hex: '#0a0a0a' },
    ],
    sizes: [],
    canCustomize: true,
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  apparel:     'Apparel',
  jackets:     'Jackets & Hoodies',
  accessories: 'Accessories',
  misc:        'Mugs & More',
};

export function getProductsByCategory(cat: ProductCategory | 'all'): MerchProduct[] {
  if (cat === 'all') return MERCH_PRODUCTS;
  return MERCH_PRODUCTS.filter((p) => p.category === cat);
}

// Bulk discount: 10+ units → 10% off
export function getUnitPrice(product: MerchProduct, qty: number): number {
  if (qty >= 10) return Math.round(product.price * 0.9);
  return product.price;
}

export function buildWhatsAppUrl(
  product: MerchProduct,
  color: ColorOption,
  size: string,
  qty: number,
  designText: string,
  placement: string
): string {
  const phone = '919436781545'; // your number here
  const total = getUnitPrice(product, qty) * qty;
  const msg = encodeURIComponent(
    `Hi! I want to order Jobr merch:\n\n` +
    `Product: ${product.name}\n` +
    `Color: ${color.name}\n` +
    `${size ? `Size: ${size}\n` : ''}` +
    `Qty: ${qty}\n` +
    `${designText ? `Design text: "${designText}"\n` : ''}` +
    `${placement ? `Placement: ${placement}\n` : ''}` +
    `\nTotal: ₹${total.toLocaleString('en-IN')}\n\nPlease confirm availability!`
  );
  return `https://wa.me/${phone}?text=${msg}`;
}