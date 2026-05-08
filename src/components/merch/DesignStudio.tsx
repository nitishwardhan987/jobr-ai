'use client';

// ─────────────────────────────────────────────────────────────────────────────
// src/components/merch/DesignStudio.tsx
//
// Full design studio: live preview, text, font, placement, colour, size, qty
// Order flow → WhatsApp deep-link
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  MerchProduct,
  ColorOption,
  getUnitPrice,
  buildWhatsAppUrl,
} from '@/lib/merch-products';

const PLACEMENTS = [
  'Front Centre',
  'Front Left',
  'Back Centre',
  'Left Sleeve',
  'Right Sleeve',
  'Collar',
];

const FONTS = [
  { label: 'MONO',   value: "'Space Mono', monospace" },
  { label: 'Sans',   value: "'DM Sans', sans-serif" },
  { label: 'Serif',  value: 'Georgia, serif' },
  { label: 'Script', value: 'cursive' },
];

interface Props {
  product: MerchProduct;
  onBack: () => void;
}

export default function DesignStudio({ product, onBack }: Props) {
  const [selectedColor, setSelectedColor] = useState<ColorOption>(product.colors[0]);
  const [selectedSize,  setSelectedSize]  = useState<string>(product.sizes[0] ?? '');
  const [selectedFont,  setSelectedFont]  = useState(FONTS[0].value);
  const [placement,     setPlacement]     = useState(PLACEMENTS[0]);
  const [designText,    setDesignText]    = useState('');
  const [qty,           setQty]           = useState(1);
  const [ordered,       setOrdered]       = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef    = useRef<HTMLImageElement | null>(null);

  const unitPrice = getUnitPrice(product, qty);
  const totalPrice = unitPrice * qty;
  const bulkDiscount = qty >= 10;

  // ── Draw preview canvas ──────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // Background — selected colour
    ctx.fillStyle = selectedColor.hex;
    ctx.roundRect(0, 0, W, H, 16);
    ctx.fill();

    // Draw product image if available
    const drawText = () => {
      if (!designText) return;
      ctx.save();
      const isDark =
        parseInt(selectedColor.hex.slice(1, 3), 16) +
        parseInt(selectedColor.hex.slice(3, 5), 16) +
        parseInt(selectedColor.hex.slice(5, 7), 16) < 380;
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.85)';
      ctx.font = `700 18px ${selectedFont}`;
      ctx.textAlign = 'center';

      // Placement Y offset
      const yMap: Record<string, number> = {
        'Front Centre': H * 0.72,
        'Front Left':   H * 0.72,
        'Back Centre':  H * 0.72,
        'Left Sleeve':  H * 0.55,
        'Right Sleeve': H * 0.55,
        'Collar':       H * 0.28,
      };
      const xMap: Record<string, number> = {
        'Front Centre': W / 2,
        'Front Left':   W * 0.3,
        'Back Centre':  W / 2,
        'Left Sleeve':  W * 0.25,
        'Right Sleeve': W * 0.75,
        'Collar':       W / 2,
      };
      ctx.fillText(designText, xMap[placement] ?? W / 2, yMap[placement] ?? H * 0.72, W - 32);
      ctx.restore();
    };

    if (product.image && product.image.endsWith('.png') || product.image?.endsWith('.jpg')) {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.src = product.image;
      img.onload = () => {
        // Draw image centered, object-contain style
        const aspect = img.width / img.height;
        let drawW = W - 40;
        let drawH = drawW / aspect;
        if (drawH > H - 40) { drawH = H - 40; drawW = drawH * aspect; }
        const drawX = (W - drawW) / 2;
        const drawY = (H - drawH) / 2;
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        drawText();
      };
      img.onerror = () => {
        // fallback: draw emoji
        ctx.font = `${W * 0.4}px serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillText(product.fallbackEmoji, W / 2, H * 0.55);
        drawText();
      };
    } else {
      // No image — big faint emoji
      ctx.font = `${W * 0.42}px serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle =
        parseInt(selectedColor.hex.slice(1, 3), 16) +
        parseInt(selectedColor.hex.slice(3, 5), 16) +
        parseInt(selectedColor.hex.slice(5, 7), 16) < 380
          ? 'rgba(255,255,255,0.12)'
          : 'rgba(0,0,0,0.1)';
      ctx.fillText(product.fallbackEmoji, W / 2, H * 0.58);
      drawText();
    }
  }, [selectedColor, designText, selectedFont, placement, product]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  function handleOrder() {
    const url = buildWhatsAppUrl(product, selectedColor, selectedSize, qty, designText, placement);
    window.open(url, '_blank');
    setOrdered(true);
  }

  function changeQty(delta: number) {
    setQty((q) => Math.max(1, q + delta));
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-5 p-5 md:p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="text-[11px] font-mono tracking-wider text-white/30 hover:text-white/70 transition-colors"
        >
          ← CATALOGUE
        </button>
        <span className="text-white/20 text-[11px]">/</span>
        <span className="text-[11px] font-mono tracking-wider text-[#e8ff47]">
          DESIGN STUDIO
        </span>
        <span className="text-white/20 text-[11px]">/</span>
        <span className="text-[11px] font-mono tracking-wider text-white/50 uppercase">
          {product.name}
        </span>
      </div>

      {/* Main split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* ── LEFT: Preview ── */}
        <div className="flex flex-col gap-3">
          <div
            className="rounded-xl border border-white/[0.07] bg-[#161616] p-5 flex flex-col items-center"
          >
            <canvas
              ref={canvasRef}
              width={320}
              height={320}
              className="rounded-xl w-full max-w-[320px]"
              style={{ imageRendering: 'crisp-edges' }}
            />
            <div className="mt-4 text-center">
              <div className="text-[15px] font-medium text-white/90">{product.name}</div>
              <div className="text-[11px] text-white/40 mt-0.5">{product.subtitle}</div>
              <div className="mt-2 flex items-baseline gap-1 justify-center">
                <span className="text-[22px] font-mono text-[#e8ff47]">
                  ₹{unitPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-[12px] text-white/30 font-mono">per unit</span>
              </div>
              {bulkDiscount && (
                <div className="mt-1 text-[11px] font-mono text-[#e8ff47]/70">
                  10% bulk discount applied ✓
                </div>
              )}
            </div>

            {/* Color swatches */}
            <div className="mt-4 flex gap-2 flex-wrap justify-center">
              {product.colors.map((c) => (
                <button
                  key={c.hex}
                  title={c.name}
                  onClick={() => setSelectedColor(c)}
                  className="w-6 h-6 rounded-full transition-transform duration-150 hover:scale-110"
                  style={{
                    background: c.hex,
                    outline:
                      selectedColor.hex === c.hex
                        ? '2px solid #e8ff47'
                        : '2px solid transparent',
                    outlineOffset: '2px',
                  }}
                />
              ))}
            </div>
            <div className="mt-1 text-[11px] text-white/30">{selectedColor.name}</div>
          </div>
        </div>

        {/* ── RIGHT: Controls ── */}
        <div className="flex flex-col gap-3">

          {/* Design text */}
          <ControlCard label="Design Text">
            <input
              type="text"
              value={designText}
              onChange={(e) => setDesignText(e.target.value)}
              placeholder="e.g. Jobr Bangalore 2026"
              maxLength={40}
              className="
                w-full bg-[#1f1f1f] border border-white/[0.08] rounded-lg
                px-3 py-2 text-[13px] text-white/90 placeholder-white/20
                focus:outline-none focus:border-[#e8ff47] transition-colors
              "
            />
            {/* Font picker */}
            <div className="grid grid-cols-4 gap-1.5 mt-2">
              {FONTS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setSelectedFont(f.value)}
                  className={`
                    py-1.5 rounded-md text-[12px] border transition-all
                    ${selectedFont === f.value
                      ? 'border-[#e8ff47] text-[#e8ff47] bg-[#e8ff47]/10'
                      : 'border-white/[0.08] text-white/40 hover:border-white/20'
                    }
                  `}
                  style={{ fontFamily: f.value }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </ControlCard>

          {/* Placement */}
          <ControlCard label="Print Placement">
            <div className="grid grid-cols-3 gap-1.5">
              {PLACEMENTS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPlacement(p)}
                  className={`
                    py-1.5 px-1 rounded-md text-[11px] border transition-all text-center
                    ${placement === p
                      ? 'border-[#e8ff47] text-[#e8ff47] bg-[#e8ff47]/10'
                      : 'border-white/[0.08] text-white/40 hover:border-white/20'
                    }
                  `}
                >
                  {p}
                </button>
              ))}
            </div>
          </ControlCard>

          {/* Size — only show if product has sizes */}
          {product.sizes.length > 0 && (
            <ControlCard label="Size">
              <div className="flex gap-1.5 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`
                      px-3 py-1.5 rounded-md text-[12px] font-mono border transition-all
                      ${selectedSize === s
                        ? 'bg-[#e8ff47] border-[#e8ff47] text-black font-bold'
                        : 'border-white/[0.08] text-white/40 hover:border-white/20'
                      }
                    `}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </ControlCard>
          )}

          {/* Quantity */}
          <ControlCard label="Quantity">
            <div className="flex items-center gap-3">
              <button
                onClick={() => changeQty(-1)}
                className="w-8 h-8 rounded-lg bg-[#1f1f1f] border border-white/[0.08] text-white/70 text-lg flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                −
              </button>
              <span className="font-mono text-[18px] text-white/90 min-w-[32px] text-center">
                {qty}
              </span>
              <button
                onClick={() => changeQty(1)}
                className="w-8 h-8 rounded-lg bg-[#1f1f1f] border border-white/[0.08] text-white/70 text-lg flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                +
              </button>
              <span className="text-[11px] text-white/30 font-mono ml-1">
                {qty >= 10 ? '🎉 Bulk rate!' : `${10 - qty} more for bulk`}
              </span>
            </div>
          </ControlCard>

          {/* Order summary */}
          <div className="rounded-xl border border-white/[0.07] bg-[#161616] p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white/40 font-mono">TOTAL</span>
              <span className="text-[20px] font-mono text-white/90">
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            {bulkDiscount && (
              <div className="text-[11px] text-[#e8ff47]/70 font-mono">
                You save ₹{(product.price * qty - totalPrice).toLocaleString('en-IN')} with bulk pricing
              </div>
            )}

            {/* WhatsApp order button */}
            <button
              onClick={handleOrder}
              className="
                w-full py-3 rounded-xl font-mono text-[12px] tracking-widest font-bold
                bg-[#25D366] text-black hover:opacity-90 active:scale-[0.98]
                transition-all flex items-center justify-center gap-2
              "
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.117 1.534 5.847L0 24l6.335-1.511A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.875 9.875 0 01-5.022-1.366l-.36-.214-3.742.892.934-3.654-.235-.374A9.857 9.857 0 012.118 12C2.118 6.53 6.53 2.118 12 2.118S21.882 6.53 21.882 12 17.47 21.882 12 21.882z"/>
              </svg>
              ORDER VIA WHATSAPP
            </button>

            {ordered && (
              <div className="text-[11px] text-[#e8ff47] font-mono text-center">
                ✓ WhatsApp opened — confirm your order there!
              </div>
            )}

            <p className="text-[10px] text-white/20 text-center leading-relaxed">
              Production 5–7 days · Free delivery above ₹999 · Bulk orders negotiable
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Small helper ─────────────────────────────────────────────────────────────
function ControlCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#161616] p-4">
      <div className="text-[10px] font-mono tracking-[0.12em] text-white/30 uppercase mb-3">
        {label}
      </div>
      {children}
    </div>
  );
}