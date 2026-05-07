'use client';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Box, Zap, Upload } from "lucide-react";

// ──────────────────────────────────────────────
// UPDATED PRODUCT DATA
// ──────────────────────────────────────────────
const PRODUCTS = [
  {
    id: "classic-tee",
    name: "Classic Crew Tee",
    category: "Apparel",
    description: "100% combed ring-spun cotton, 180gsm. Perfect for cohort welcome kits.",
    colors: ["#1e293b", "#f8fafc", "#3730a3", "#064e3b"],
    colorNames: ["Slate Black", "Off White", "Deep Indigo", "Forest"],
    tiers: [{ min: 100, price: 260 }],
    type: 'tee'
  },
  {
    id: "premium-hoodie",
    name: "Premium Pullover Hoodie",
    category: "Apparel",
    description: "320gsm fleece blend. Flagship item for EdTech cohorts.",
    colors: ["#312e81", "#1e293b", "#7f1d1d", "#064e3b"],
    colorNames: ["Indigo", "Slate Black", "Crimson", "Forest"],
    tiers: [{ min: 100, price: 525 }],
    type: 'hoodie'
  },
  {
    id: "steel-bottle",
    name: "Insulated Steel Bottle",
    category: "Drinkware",
    description: "750ml, 18/8 stainless steel. Laser-etched logo precision.",
    colors: ["#374151", "#f8fafc", "#1e3a8a"],
    colorNames: ["Matte Black", "White", "Blue"],
    tiers: [{ min: 100, price: 345 }],
    type: 'bottle'
  },
];

export default function ProductCatalog() {
  return (
    <section className="bg-[#05070a] min-h-screen py-20 px-10">
      <header className="mb-16">
        <h1 className="text-4xl font-black italic tracking-tighter text-white mb-2">Product Catalog</h1>
        <p className="text-slate-500 text-sm font-medium">Tiered bulk pricing for EdTech cohorts and tech startups.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PRODUCTS.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────
// INTERACTIVE PRODUCT CARD
// ──────────────────────────────────────────────
function ProductCard({ product }: any) {
  const [activeColor, setActiveColor] = useState(0);

  return (
    <div className="bg-slate-900/30 border border-white/5 rounded-[40px] overflow-hidden group hover:border-blue-500/40 transition-all duration-500">
      {/* Dynamic Image Area */}
      <div 
        className="aspect-[4/5] flex items-center justify-center relative transition-colors duration-700"
        style={{ backgroundColor: product.colors[activeColor] }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
        
        {/* SVG Mockup Shapes */}
        <div className="relative z-10 w-48 h-48 drop-shadow-2xl">
           <ProductSVG type={product.type} />
        </div>

        <span className="absolute top-6 left-6 px-3 py-1 bg-black/40 backdrop-blur-xl rounded-full text-[9px] font-black text-blue-400 uppercase tracking-widest border border-white/10">
          {product.category}
        </span>
      </div>

      {/* Content Area */}
      <div className="p-8 space-y-6">
        <div>
          <h3 className="text-xl font-black text-white mb-2">{product.name}</h3>
          <p className="text-slate-500 text-xs leading-relaxed font-medium h-8 line-clamp-2 italic">
            {product.description}
          </p>
        </div>

        {/* Color Selection */}
        <div className="flex gap-2 items-center">
          {product.colors.map((color: string, i: number) => (
            <button
              key={i}
              onClick={() => setActiveColor(i)}
              className={`w-6 h-6 rounded-full border-2 transition-all ${activeColor === i ? 'border-blue-500 scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
              style={{ backgroundColor: color }}
              title={product.colorNames[i]}
            />
          ))}
          <span className="ml-2 text-[10px] font-black text-slate-600 uppercase tracking-tighter">
            {product.colorNames[activeColor]}
          </span>
        </div>

        <div className="flex justify-between items-end pt-4 border-t border-white/5">
          <div>
            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Starting at</p>
            <p className="text-2xl font-black text-white">₹{product.tiers[0].price}</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-full text-[10px] font-black text-white uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95">
            Customize
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// SVG MOCKUP SHAPES
// ──────────────────────────────────────────────
function ProductSVG({ type }: { type: string }) {
  if (type === 'tee') return (
    <svg viewBox="0 0 100 100" className="w-full h-full fill-white/10 stroke-white/20" strokeWidth="2">
      <path d="M20 20 L35 20 L40 30 L60 30 L65 20 L80 20 L95 40 L80 45 L80 90 L20 90 L20 45 L5 40 Z" />
    </svg>
  );
  if (type === 'hoodie') return (
    <svg viewBox="0 0 100 100" className="w-full h-full fill-white/10 stroke-white/20" strokeWidth="2">
      <path d="M30 30 Q50 10 70 30 L85 35 L75 85 L25 85 L15 35 Z" />
      <rect x="40" y="65" width="20" height="10" rx="2" className="fill-white/5" />
    </svg>
  );
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full fill-white/10 stroke-white/20" strokeWidth="2">
      <path d="M35 15 L65 15 L70 85 Q70 90 65 90 L35 90 Q30 90 30 85 Z" />
      <rect x="42" y="10" width="16" height="5" rx="1" className="fill-white/20" />
    </svg>
  );
}