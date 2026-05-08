'use client';

// ─────────────────────────────────────────────────────────────────────────────
// src/app/merch/page.tsx
//
// Jobr Merch Store — full catalogue + design studio
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import MerchCard from '@/components/merch/MerchCard';
import DesignStudio from '@/components/merch/DesignStudio';
import {
  MERCH_PRODUCTS,
  MerchProduct,
  ProductCategory,
  CATEGORY_LABELS,
  getProductsByCategory,
} from '@/lib/merch-products';

type View = 'catalogue' | 'studio';
type CatFilter = ProductCategory | 'all';

const TABS: { key: CatFilter; label: string }[] = [
  { key: 'all',        label: 'All Products' },
  { key: 'apparel',    label: 'Apparel' },
  { key: 'jackets',    label: 'Jackets & Hoodies' },
  { key: 'accessories',label: 'Accessories' },
  { key: 'misc',       label: 'Mugs & More' },
];

export default function MerchPage() {
  const [view,            setView]            = useState<View>('catalogue');
  const [activeCategory,  setActiveCategory]  = useState<CatFilter>('all');
  const [selectedProduct, setSelectedProduct] = useState<MerchProduct | null>(null);

  const visibleProducts = getProductsByCategory(activeCategory);

  function handleCustomize(product: MerchProduct) {
    setSelectedProduct(product);
    setView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleBackToCatalogue() {
    setView('catalogue');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── NAV — matches your existing site nav ── */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between h-14">
          <a href="/" className="flex items-center gap-2 text-[15px] font-bold tracking-tight">
            <span className="w-7 h-7 rounded-md bg-[#e8ff47] text-black flex items-center justify-center text-xs font-black">
              J
            </span>
            <span className="text-white/90">Jobr.co.in</span>
          </a>
          <div className="flex items-center gap-4">
            <a
              href="/merch"
              className="text-[13px] text-[#e8ff47] font-mono tracking-wider"
            >
              Merch Store
            </a>
            <a
              href="/auth"
              className="text-[13px] text-white/50 hover:text-white/80 transition-colors font-mono tracking-wider"
            >
              Start Optimizing
            </a>
          </div>
        </div>
      </nav>

      {/* ── PAGE HEADER ── */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-[11px] font-mono tracking-[0.15em] text-[#e8ff47] mb-2">
              MERCH ECOSYSTEM v1.0
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white/95 tracking-tight">
              {view === 'catalogue' ? 'Product Catalogue' : 'Design Studio'}
            </h1>
            {view === 'catalogue' && (
              <p className="text-[14px] text-white/40 mt-2">
                {MERCH_PRODUCTS.length} products · Custom prints · Bulk from 10 units
              </p>
            )}
          </div>
          {/* View switch pills */}
          <div className="flex rounded-xl border border-white/[0.08] overflow-hidden self-start md:self-auto">
            <button
              onClick={() => setView('catalogue')}
              className={`px-4 py-2 text-[13px] font-mono tracking-wider transition-all ${
                view === 'catalogue'
                  ? 'bg-[#e8ff47] text-black font-bold'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              Catalogue
            </button>
            <button
              onClick={() => {
                if (selectedProduct) setView('studio');
              }}
              disabled={!selectedProduct}
              className={`px-4 py-2 text-[13px] font-mono tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                view === 'studio'
                  ? 'bg-[#e8ff47] text-black font-bold'
                  : 'text-white/40 hover:text-white/70'
              }`}
              title={!selectedProduct ? 'Select a product first' : 'Open Design Studio'}
            >
              Design Studio
            </button>
          </div>
        </div>

        {/* ── Category tabs — only in catalogue view ── */}
        {view === 'catalogue' && (
          <div className="flex gap-0 mt-6 border-b border-white/[0.07] overflow-x-auto scrollbar-none">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveCategory(tab.key)}
                className={`
                  px-4 py-2.5 text-[13px] whitespace-nowrap border-b-2 transition-all
                  ${activeCategory === tab.key
                    ? 'border-[#e8ff47] text-[#e8ff47]'
                    : 'border-transparent text-white/40 hover:text-white/70'
                  }
                `}
              >
                {tab.label}
                {tab.key !== 'all' && (
                  <span className="ml-1.5 text-[10px] font-mono text-white/20">
                    {getProductsByCategory(tab.key).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-20">

        {/* Catalogue grid */}
        {view === 'catalogue' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mt-5">
            {visibleProducts.map((product) => (
              <MerchCard
                key={product.id}
                product={product}
                isSelected={selectedProduct?.id === product.id}
                onSelect={setSelectedProduct}
                onCustomize={handleCustomize}
              />
            ))}
          </div>
        )}

        {/* Design Studio */}
        {view === 'studio' && selectedProduct && (
          <div className="mt-5 rounded-2xl border border-white/[0.07] bg-[#111111] overflow-hidden">
            <DesignStudio
              product={selectedProduct}
              onBack={handleBackToCatalogue}
            />
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.06] py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[12px] font-mono text-white/30 tracking-wider">
            JOBR.CO.IN — BUILT FOR THE BANGALORE TECH ELITE
          </div>
          <div className="flex gap-6 text-[11px] text-white/20 font-mono">
            <span>Privacy First</span>
            <span>Google XYZ Powered</span>
            <span>2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}