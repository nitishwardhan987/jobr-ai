'use client';

import { useEffect, useRef, useState } from 'react';
import { MerchProduct, ColorOption, getUnitPrice, buildWhatsAppUrl } from '@/lib/merch-products';

const PLACEMENTS = ['Front Centre', 'Front Left', 'Back Centre', 'Left Sleeve', 'Right Sleeve', 'Collar'];
const FONTS = [
  { label: 'MONO',   value: "'Space Mono', monospace" },
  { label: 'Sans',   value: "'DM Sans', sans-serif" },
  { label: 'Serif',  value: 'Georgia, serif' },
  { label: 'Script', value: 'cursive' },
];

interface Props { product: MerchProduct; onBack: () => void; }

export default function DesignStudio({ product, onBack }: Props) {
  const [selectedColor, setSelectedColor] = useState<ColorOption>(product.colors[0]);
  const [selectedSize,  setSelectedSize]  = useState<string>(product.sizes[0] ?? '');
  const [selectedFont,  setSelectedFont]  = useState(FONTS[0].value);
  const [placement,     setPlacement]     = useState(PLACEMENTS[0]);
  const [designText,    setDesignText]    = useState('');
  const [qty,           setQty]           = useState(1);
  const [ordered,       setOrdered]       = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const unitPrice    = getUnitPrice(product, qty);
  const totalPrice   = unitPrice * qty;
  const bulkDiscount = qty >= 10;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = selectedColor.hex;
    ctx.fillRect(0, 0, W, H);

    const r = parseInt(selectedColor.hex.slice(1,3),16);
    const g = parseInt(selectedColor.hex.slice(3,5),16);
    const b = parseInt(selectedColor.hex.slice(5,7),16);
    const isDark = r + g + b < 380;

    const drawText = () => {
      if (!designText.trim()) return;
      ctx.save();
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.85)';
      ctx.font = `700 17px ${selectedFont}`;
      ctx.textAlign = 'center';
      const xMap: Record<string,number> = { 'Front Centre': W/2, 'Front Left': W*0.28, 'Back Centre': W/2, 'Left Sleeve': W*0.22, 'Right Sleeve': W*0.78, 'Collar': W/2 };
      const yMap: Record<string,number> = { 'Front Centre': H*0.74, 'Front Left': H*0.74, 'Back Centre': H*0.74, 'Left Sleeve': H*0.56, 'Right Sleeve': H*0.56, 'Collar': H*0.26 };
      ctx.fillText(designText, xMap[placement]??W/2, yMap[placement]??H*0.74, W-32);
      ctx.restore();
    };

    const drawEmoji = () => {
      ctx.font = `${W*0.42}px serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.11)' : 'rgba(0,0,0,0.09)';
      ctx.fillText(product.fallbackEmoji, W/2, H*0.58);
      drawText();
    };

    if (product.image && (product.image.endsWith('.png') || product.image.endsWith('.jpg') || product.image.endsWith('.svg'))) {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.src = product.image;
      img.onload = () => {
        const aspect = img.width / img.height;
        let dW = W-48, dH = dW/aspect;
        if (dH > H-48) { dH = H-48; dW = dH*aspect; }
        ctx.drawImage(img, (W-dW)/2, (H-dH)/2, dW, dH);
        drawText();
      };
      img.onerror = drawEmoji;
    } else {
      drawEmoji();
    }
  }, [selectedColor, designText, selectedFont, placement, product]);

  function handleOrder() {
    window.open(buildWhatsAppUrl(product, selectedColor, selectedSize, qty, designText, placement), '_blank');
    setOrdered(true);
  }

  return (
    <div className="flex flex-col gap-5 p-5 md:p-6">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="text-[11px] font-mono tracking-wider transition-colors" style={{ color: 'rgba(255,255,255,0.3)' }}>← CATALOGUE</button>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px' }}>/</span>
        <span className="text-[11px] font-mono tracking-wider" style={{ color: 'var(--accent, #e8ff47)' }}>DESIGN STUDIO</span>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px' }}>/</span>
        <span className="text-[11px] font-mono tracking-wider uppercase" style={{ color: 'rgba(255,255,255,0.45)' }}>{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Preview */}
        <div className="rounded-xl p-5 flex flex-col items-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <canvas ref={canvasRef} width={320} height={320} className="rounded-xl w-full max-w-[320px]" />
          <div className="mt-4 text-center">
            <div className="text-[15px] font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>{product.name}</div>
            <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{product.subtitle}</div>
            <div className="mt-2 flex items-baseline gap-1 justify-center">
              <span className="text-[22px] font-mono" style={{ color: 'var(--accent, #e8ff47)' }}>₹{unitPrice.toLocaleString('en-IN')}</span>
              <span className="text-[12px] font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>per unit</span>
            </div>
            {bulkDiscount && <div className="mt-1 text-[11px] font-mono" style={{ color: 'var(--accent, #e8ff47)', opacity: 0.75 }}>10% bulk discount applied ✓</div>}
          </div>
          <div className="mt-4 flex gap-2 flex-wrap justify-center">
            {product.colors.map((c) => (
              <button key={c.hex} title={c.name} onClick={() => setSelectedColor(c)} className="w-6 h-6 rounded-full transition-transform duration-150 hover:scale-110"
                style={{ background: c.hex, outline: selectedColor.hex===c.hex ? '2px solid var(--accent, #e8ff47)' : '2px solid transparent', outlineOffset: '2px' }} />
            ))}
          </div>
          <div className="mt-1 text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{selectedColor.name}</div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3">
          <CtrlCard label="Design Text">
            <input type="text" value={designText} onChange={(e) => setDesignText(e.target.value)}
              placeholder="e.g. Jobr Bangalore 2026" maxLength={40}
              className="w-full rounded-lg px-3 py-2 text-[13px] outline-none transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)' }}
              onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--accent, #e8ff47)'; }}
              onBlur={(e)  => { (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
            />
            <div className="grid grid-cols-4 gap-1.5 mt-2">
              {FONTS.map((f) => (
                <button key={f.value} onClick={() => setSelectedFont(f.value)}
                  className="py-1.5 rounded-md text-[12px] transition-all"
                  style={{ fontFamily: f.value,
                    background: selectedFont===f.value ? 'rgba(232,255,71,0.1)' : 'rgba(255,255,255,0.04)',
                    border:     selectedFont===f.value ? '1px solid var(--accent, #e8ff47)' : '1px solid rgba(255,255,255,0.08)',
                    color:      selectedFont===f.value ? 'var(--accent, #e8ff47)' : 'rgba(255,255,255,0.4)' }}>
                  {f.label}
                </button>
              ))}
            </div>
          </CtrlCard>

          <CtrlCard label="Print Placement">
            <div className="grid grid-cols-3 gap-1.5">
              {PLACEMENTS.map((p) => (
                <button key={p} onClick={() => setPlacement(p)} className="py-1.5 px-1 rounded-md text-[11px] transition-all text-center"
                  style={{ background: placement===p ? 'rgba(232,255,71,0.1)' : 'rgba(255,255,255,0.04)',
                    border: placement===p ? '1px solid var(--accent, #e8ff47)' : '1px solid rgba(255,255,255,0.08)',
                    color:  placement===p ? 'var(--accent, #e8ff47)' : 'rgba(255,255,255,0.4)' }}>
                  {p}
                </button>
              ))}
            </div>
          </CtrlCard>

          {product.sizes.length > 0 && (
            <CtrlCard label="Size">
              <div className="flex gap-1.5 flex-wrap">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => setSelectedSize(s)} className="px-3 py-1.5 rounded-md text-[12px] font-mono transition-all"
                    style={selectedSize===s
                      ? { background: 'var(--accent, #e8ff47)', border: '1px solid var(--accent, #e8ff47)', color: '#000', fontWeight: 700 }
                      : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
                    {s}
                  </button>
                ))}
              </div>
            </CtrlCard>
          )}

          <CtrlCard label="Quantity">
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(q => Math.max(1,q-1))} className="w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}>−</button>
              <span className="font-mono text-[18px] min-w-[32px] text-center" style={{ color: 'rgba(255,255,255,0.9)' }}>{qty}</span>
              <button onClick={() => setQty(q => q+1)} className="w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}>+</button>
              <span className="text-[11px] font-mono ml-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {qty >= 10 ? '🎉 Bulk rate!' : `${10-qty} more for bulk`}
              </span>
            </div>
          </CtrlCard>

          <div className="rounded-xl p-4 flex flex-col gap-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>TOTAL</span>
              <span className="text-[20px] font-mono" style={{ color: 'rgba(255,255,255,0.9)' }}>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
            {bulkDiscount && (
              <div className="text-[11px] font-mono" style={{ color: 'var(--accent, #e8ff47)', opacity: 0.75 }}>
                You save ₹{(product.price * qty - totalPrice).toLocaleString('en-IN')} with bulk pricing
              </div>
            )}
            <button onClick={handleOrder}
              className="w-full py-3 rounded-xl font-mono text-[12px] tracking-widest font-bold flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ background: '#25D366', color: '#000' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.117 1.534 5.847L0 24l6.335-1.511A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.875 9.875 0 01-5.022-1.366l-.36-.214-3.742.892.934-3.654-.235-.374A9.857 9.857 0 012.118 12C2.118 6.53 6.53 2.118 12 2.118S21.882 6.53 21.882 12 17.47 21.882 12 21.882z"/>
              </svg>
              ORDER VIA WHATSAPP
            </button>
            {ordered && <div className="text-[11px] font-mono text-center" style={{ color: 'var(--accent, #e8ff47)' }}>✓ WhatsApp opened — confirm your order there!</div>}
            <p className="text-[10px] text-center leading-relaxed" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Production 5–7 days · Free delivery above ₹999 · Bulk orders negotiable
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CtrlCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="text-[10px] font-mono tracking-[0.12em] uppercase mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</div>
      {children}
    </div>
  );
}