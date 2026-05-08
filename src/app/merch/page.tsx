'use client';

import { useState } from 'react';
import MerchCard from '@/components/merch/MerchCard';
import DesignStudio from '@/components/merch/DesignStudio';
import {
  MERCH_PRODUCTS,
  MerchProduct,
  ProductCategory,
  getProductsByCategory,
} from '@/lib/merch-products';

type View = 'catalogue' | 'studio';
type CatFilter = ProductCategory | 'all';

const TABS: { key: CatFilter; label: string }[] = [
  { key: 'all',         label: 'All Products' },
  { key: 'apparel',     label: 'Apparel' },
  { key: 'jackets',     label: 'Jackets & Hoodies' },
  { key: 'accessories', label: 'Accessories' },
  { key: 'misc',        label: 'Mugs & More' },
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
    <div className="w-full">
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-[11px] font-mono tracking-[0.15em] mb-2 uppercase" style={{ color: 'var(--accent, #e8ff47)' }}>
              Merch Ecosystem v1.0
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {view === 'catalogue' ? 'Product Catalogue' : 'Design Studio'}
            </h1>
            {view === 'catalogue' && (
              <p className="text-sm mt-2 opacity-40">
                {MERCH_PRODUCTS.length} products · Custom prints · Bulk from 10 units
              </p>
            )}
          </div>

          <div className="flex rounded-xl overflow-hidden self-start md:self-auto" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              onClick={() => setView('catalogue')}
              className="px-4 py-2 text-[13px] font-mono tracking-wider transition-all"
              style={view === 'catalogue'
                ? { background: 'var(--accent, #e8ff47)', color: '#000', fontWeight: 700 }
                : { background: 'transparent', color: 'rgba(255,255,255,0.4)' }}
            >
              Catalogue
            </button>
            <button
              onClick={() => { if (selectedProduct) setView('studio'); }}
              disabled={!selectedProduct}
              className="px-4 py-2 text-[13px] font-mono tracking-wider transition-all disabled:opacity-25 disabled:cursor-not-allowed"
              style={view === 'studio'
                ? { background: 'var(--accent, #e8ff47)', color: '#000', fontWeight: 700 }
                : { background: 'transparent', color: 'rgba(255,255,255,0.4)' }}
              title={!selectedProduct ? 'Select a product first' : 'Open Design Studio'}
            >
              Design Studio
            </button>
          </div>
        </div>

        {view === 'catalogue' && (
          <div
            className="flex mt-6 overflow-x-auto"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', scrollbarWidth: 'none' }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveCategory(tab.key)}
                className="px-4 py-2.5 text-[13px] whitespace-nowrap transition-all"
                style={{
                  borderBottom: activeCategory === tab.key ? '2px solid var(--accent, #e8ff47)' : '2px solid transparent',
                  color: activeCategory === tab.key ? 'var(--accent, #e8ff47)' : 'rgba(255,255,255,0.4)',
                }}
              >
                {tab.label}
                {tab.key !== 'all' && (
                  <span className="ml-1.5 text-[10px] font-mono opacity-40">
                    {getProductsByCategory(tab.key).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-20">
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

        {view === 'studio' && selectedProduct && (
          <div className="mt-5 rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
            <DesignStudio product={selectedProduct} onBack={handleBackToCatalogue} />
          </div>
        )}
      </div>
    </div>
  );
}