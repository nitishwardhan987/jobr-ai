'use client';

// src/app/merch/page.tsx — warm light mode, auto-selects first product for Design Studio

import { useState } from 'react';
import {
  MERCH_PRODUCTS,
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

const PLACEMENTS = ['Front Centre', 'Front Left', 'Back Centre', 'Left Sleeve', 'Right Sleeve', 'Collar'];
const FONTS = [
  { label: 'MONO',   value: "'Space Mono', monospace" },
  { label: 'Sans',   value: "'DM Sans', sans-serif" },
  { label: 'Serif',  value: 'Georgia, serif' },
  { label: 'Script', value: 'cursive' },
];

export default function MerchPage() {
  const [view,           setView]           = useState<View>('catalogue');
  const [activeCategory, setActiveCategory] = useState<CatFilter>('all');
  // Auto-select first product so Design Studio is never disabled
  const [selectedProduct, setSelectedProduct] = useState<MerchProduct>(MERCH_PRODUCTS[0]);
  const visibleProducts = getProductsByCategory(activeCategory);

  function goToStudio(product: MerchProduct) {
    setSelectedProduct(product);
    setView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>

      {/* Header */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end',
        justifyContent: 'space-between', gap: 16,
        paddingTop: 40, paddingBottom: 8,
      }}>
        <div>
          <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', color: 'var(--text-3)', marginBottom: 6, textTransform: 'uppercase' }}>
            Merch Ecosystem v1.0
          </p>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 4 }}>
            {view === 'catalogue' ? 'Product Catalogue' : 'Design Studio'}
          </h1>
          {view === 'catalogue' && (
            <p style={{ fontSize: 14, color: 'var(--text-2)' }}>
              {MERCH_PRODUCTS.length} products · Custom prints · Bulk discount from 10 units
            </p>
          )}
        </div>

        {/* View toggle */}
        <div style={{
          display: 'flex', borderRadius: 'var(--radius-md)', overflow: 'hidden',
          border: '1.5px solid var(--border)', background: 'var(--bg-card)',
        }}>
          {(['catalogue', 'studio'] as View[]).map(v => (
            <button key={v} onClick={() => {
              if (v === 'studio') goToStudio(selectedProduct);
              else setView('catalogue');
            }} style={{
              padding: '8px 18px', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer',
              background: view === v ? 'var(--accent)' : 'transparent',
              color: view === v ? '#fff' : 'var(--text-2)',
              transition: 'all 0.15s', textTransform: 'capitalize',
            }}>
              {v === 'catalogue' ? 'Catalogue' : 'Design Studio'}
            </button>
          ))}
        </div>
      </div>

      {/* Category tabs */}
      {view === 'catalogue' && (
        <div style={{
          display: 'flex', gap: 0,
          borderBottom: '1.5px solid var(--border)',
          marginBottom: 24, overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveCategory(tab.key)} style={{
              padding: '10px 16px', fontSize: 13, fontWeight: 500,
              border: 'none', background: 'transparent', cursor: 'pointer',
              whiteSpace: 'nowrap',
              borderBottom: activeCategory === tab.key ? '2px solid var(--accent)' : '2px solid transparent',
              color: activeCategory === tab.key ? 'var(--accent)' : 'var(--text-2)',
              marginBottom: '-1.5px',
            }}>
              {tab.label}
              {tab.key !== 'all' && (
                <span style={{ marginLeft: 5, fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>
                  {getProductsByCategory(tab.key).length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Catalogue grid */}
      {view === 'catalogue' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
          gap: 16, paddingBottom: 60,
        }}>
          {visibleProducts.map(product => (
            <MerchCard
              key={product.id}
              product={product}
              isSelected={selectedProduct.id === product.id}
              onSelect={setSelectedProduct}
              onCustomize={goToStudio}
            />
          ))}
        </div>
      )}

      {/* Design Studio */}
      {view === 'studio' && (
        <div style={{ paddingBottom: 60 }}>
          <DesignStudio product={selectedProduct} onBack={() => setView('catalogue')} />
        </div>
      )}
    </div>
  );
}

/* ── MerchCard ──────────────────────────────────────────────────────────────── */
function MerchCard({ product, isSelected, onSelect, onCustomize }: {
  product: MerchProduct; isSelected: boolean;
  onSelect: (p: MerchProduct) => void; onCustomize: (p: MerchProduct) => void;
}) {
  return (
    <div
      onClick={() => onSelect(product)}
      style={{
        background: 'var(--bg-card)',
        border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden', cursor: 'pointer',
        boxShadow: isSelected ? '0 0 0 3px var(--accent-dim)' : 'var(--shadow-sm)',
        transition: 'transform 0.15s, box-shadow 0.15s',
        position: 'relative',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
    >
      {/* Badge */}
      {(product.isNew || product.isBestSeller) && (
        <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
          <span className={`badge ${product.isBestSeller ? 'badge-amber' : 'badge-purple'}`}>
            {product.isBestSeller ? 'Top' : 'New'}
          </span>
        </div>
      )}

      {/* Image */}
      <div style={{
        width: '100%', aspectRatio: '1',
        background: 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 56, overflow: 'hidden', position: 'relative',
      }}>
        {product.image ? (
          <img
            src={product.image} alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 16 }}
            onError={e => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
              const fb = (e.currentTarget as HTMLImageElement).nextElementSibling as HTMLElement;
              if (fb) fb.style.display = 'flex';
            }}
          />
        ) : null}
        <div style={{ display: product.image ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: 56 }}>
          {product.fallbackEmoji}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', marginBottom: 2 }}>
          {product.name}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 6 }}>{product.subtitle}</div>
        <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-1)', marginBottom: 8 }}>
          ₹{product.price}
        </div>

        {/* Colour dots */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
          {product.colors.slice(0, 5).map(c => (
            <div key={c.hex} title={c.name} style={{
              width: 12, height: 12, borderRadius: '50%',
              background: c.hex, border: '1px solid var(--border)',
            }} />
          ))}
        </div>

        <button
          onClick={e => { e.stopPropagation(); onCustomize(product); }}
          style={{
            width: '100%', padding: '7px',
            fontSize: 11, fontFamily: 'var(--font-mono)',
            letterSpacing: '0.06em', fontWeight: 700,
            borderRadius: 'var(--radius-sm)',
            border: isSelected ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
            background: isSelected ? 'var(--accent)' : 'transparent',
            color: isSelected ? '#fff' : 'var(--text-2)',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          {isSelected ? 'CUSTOMIZING ✓' : 'CUSTOMIZE →'}
        </button>
      </div>
    </div>
  );
}

/* ── Design Studio ──────────────────────────────────────────────────────────── */
function DesignStudio({ product, onBack }: { product: MerchProduct; onBack: () => void }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize,  setSelectedSize]  = useState(product.sizes[0] ?? '');
  const [selectedFont,  setSelectedFont]  = useState(FONTS[0].value);
  const [placement,     setPlacement]     = useState(PLACEMENTS[0]);
  const [designText,    setDesignText]    = useState('');
  const [qty,           setQty]           = useState(1);
  const [ordered,       setOrdered]       = useState(false);

  const unitPrice  = qty >= 10 ? Math.round(product.price * 0.9) : product.price;
  const totalPrice = unitPrice * qty;

  function handleOrder() {
    const phone = '919436781545'; // Jobr WhatsApp number
    const msg = encodeURIComponent(
      `Hi! I want to order Jobr merch:\n\nProduct: ${product.name}\nColour: ${selectedColor.name}\n${selectedSize ? `Size: ${selectedSize}\n` : ''}Qty: ${qty}\n${designText ? `Design text: "${designText}"\n` : ''}Placement: ${placement}\n\nTotal: ₹${totalPrice.toLocaleString('en-IN')}\n\nPlease confirm!`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    setOrdered(true);
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: 13, fontWeight: 500, padding: 0 }}>
          ← Catalogue
        </button>
        <span style={{ color: 'var(--text-3)' }}>/</span>
        <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Design Studio</span>
        <span style={{ color: 'var(--text-3)' }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{product.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Preview */}
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: '100%', maxWidth: 300, aspectRatio: '1',
            background: selectedColor.hex,
            borderRadius: 'var(--radius-lg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 72, position: 'relative', overflow: 'hidden',
          }}>
            {product.image ? (
              <img src={product.image} alt={product.name} style={{ width: '75%', height: '75%', objectFit: 'contain' }} />
            ) : (
              <span style={{ opacity: 0.3 }}>{product.fallbackEmoji}</span>
            )}
            {designText && (
              <div style={{
                position: 'absolute', bottom: 24, left: 0, right: 0,
                textAlign: 'center', fontSize: 14, fontWeight: 700,
                fontFamily: selectedFont,
                color: ['#f0ede8','#d4c4a0','#8a9a7a','#c0d0a0'].includes(selectedColor.hex)
                  ? '#0D0D0D' : '#FFFFFF',
                padding: '0 16px',
              }}>
                {designText}
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{product.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{product.subtitle}</div>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent)', marginTop: 8 }}>
              ₹{unitPrice.toLocaleString('en-IN')}
              <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-3)', marginLeft: 4 }}>per unit</span>
            </div>
            {qty >= 10 && <div style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600, marginTop: 4 }}>10% bulk discount applied ✓</div>}
          </div>

          {/* Colour swatches */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {product.colors.map(c => (
              <button key={c.hex} title={c.name} onClick={() => setSelectedColor(c)} style={{
                width: 26, height: 26, borderRadius: '50%', background: c.hex,
                border: '2px solid transparent',
                outline: selectedColor.hex === c.hex ? `2px solid var(--accent)` : 'none',
                outlineOffset: 2, cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
              }} />
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{selectedColor.name}</div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          <StudioCard label="Design Text">
            <input type="text" value={designText} onChange={e => setDesignText(e.target.value)}
              placeholder="e.g. Jobr Bangalore 2026" maxLength={40} className="input" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginTop: 8 }}>
              {FONTS.map(f => (
                <button key={f.value} onClick={() => setSelectedFont(f.value)} style={{
                  padding: '7px 4px', borderRadius: 'var(--radius-sm)',
                  border: `1.5px solid ${selectedFont === f.value ? 'var(--accent)' : 'var(--border)'}`,
                  background: selectedFont === f.value ? 'var(--accent-light)' : 'transparent',
                  color: selectedFont === f.value ? 'var(--accent)' : 'var(--text-2)',
                  fontFamily: f.value, fontSize: 12, cursor: 'pointer',
                }}>
                  {f.label}
                </button>
              ))}
            </div>
          </StudioCard>

          <StudioCard label="Print Placement">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
              {PLACEMENTS.map(p => (
                <button key={p} onClick={() => setPlacement(p)} style={{
                  padding: '7px 4px', borderRadius: 'var(--radius-sm)', fontSize: 11,
                  border: `1.5px solid ${placement === p ? 'var(--accent)' : 'var(--border)'}`,
                  background: placement === p ? 'var(--accent-light)' : 'transparent',
                  color: placement === p ? 'var(--accent)' : 'var(--text-2)',
                  cursor: 'pointer', textAlign: 'center',
                }}>
                  {p}
                </button>
              ))}
            </div>
          </StudioCard>

          {product.sizes.length > 0 && (
            <StudioCard label="Size">
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)} style={{
                    padding: '6px 14px', borderRadius: 'var(--radius-sm)',
                    fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
                    border: `1.5px solid ${selectedSize === s ? 'var(--accent)' : 'var(--border)'}`,
                    background: selectedSize === s ? 'var(--accent)' : 'transparent',
                    color: selectedSize === s ? '#fff' : 'var(--text-2)',
                    cursor: 'pointer',
                  }}>
                    {s}
                  </button>
                ))}
              </div>
            </StudioCard>
          )}

          <StudioCard label="Quantity">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{
                width: 32, height: 32, borderRadius: 'var(--radius-sm)', fontSize: 18,
                border: '1.5px solid var(--border)', background: 'transparent',
                color: 'var(--text-1)', cursor: 'pointer',
              }}>−</button>
              <span style={{ fontSize: 18, fontFamily: 'var(--font-mono)', fontWeight: 700, minWidth: 32, textAlign: 'center' }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} style={{
                width: 32, height: 32, borderRadius: 'var(--radius-sm)', fontSize: 18,
                border: '1.5px solid var(--border)', background: 'transparent',
                color: 'var(--text-1)', cursor: 'pointer',
              }}>+</button>
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                {qty >= 10 ? '🎉 Bulk rate!' : `Add ${10 - qty} more for 10% off`}
              </span>
            </div>
          </StudioCard>

          {/* Order summary */}
          <div className="card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Total ({qty} unit{qty > 1 ? 's' : ''})</span>
              <span style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <button onClick={handleOrder} style={{
              width: '100%', padding: '12px',
              background: '#25D366', color: '#000', border: 'none',
              borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 700,
              fontFamily: 'var(--font-mono)', letterSpacing: '0.08em',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.117 1.534 5.847L0 24l6.335-1.511A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.875 9.875 0 01-5.022-1.366l-.36-.214-3.742.892.934-3.654-.235-.374A9.857 9.857 0 012.118 12C2.118 6.53 6.53 2.118 12 2.118S21.882 6.53 21.882 12 17.47 21.882 12 21.882z"/>
              </svg>
              ORDER VIA WHATSAPP
            </button>
            {ordered && (
              <p style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: 'var(--success)', fontWeight: 600 }}>
                ✓ WhatsApp opened — confirm your order there!
              </p>
            )}
            <p style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: 'var(--text-3)', lineHeight: 1.5 }}>
              Production 5–7 days · Free delivery above ₹999
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudioCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="card" style={{ padding: '14px 16px' }}>
      <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 10 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

// Re-export the type so this file is self-contained
type MerchProduct = import('@/lib/merch-products').MerchProduct;