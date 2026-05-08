'use client';

// ─────────────────────────────────────────────────────────────────────────────
// src/components/merch/MerchCard.tsx
// ─────────────────────────────────────────────────────────────────────────────

import Image from 'next/image';
import { MerchProduct } from '@/lib/merch-products';

interface MerchCardProps {
  product: MerchProduct;
  isSelected: boolean;
  onSelect: (product: MerchProduct) => void;
  onCustomize: (product: MerchProduct) => void;
}

export default function MerchCard({
  product,
  isSelected,
  onSelect,
  onCustomize,
}: MerchCardProps) {
  return (
    <div
      onClick={() => onSelect(product)}
      className={`
        relative flex flex-col cursor-pointer rounded-xl border transition-all duration-200
        bg-[#161616] overflow-hidden group
        ${isSelected
          ? 'border-[#e8ff47] shadow-[0_0_0_1px_#e8ff47]'
          : 'border-white/[0.08] hover:border-white/[0.18] hover:-translate-y-0.5'
        }
      `}
    >
      {/* Badge */}
      {(product.isNew || product.isBestSeller) && (
        <div className="absolute top-2 left-2 z-10">
          <span
            className="text-[9px] font-bold tracking-[0.1em] px-1.5 py-0.5 rounded font-mono"
            style={{
              background: product.isBestSeller ? '#ffffff' : '#e8ff47',
              color: '#000',
            }}
          >
            {product.isBestSeller ? 'TOP' : 'NEW'}
          </span>
        </div>
      )}

      {/* Image area */}
      <div className="relative w-full aspect-square bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              // fallback to emoji if image fails
              const target = e.currentTarget as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : null}
        {/* Emoji fallback — always rendered, hidden when image works */}
        <div
          className="absolute inset-0 items-center justify-center text-6xl"
          style={{ display: product.image ? 'none' : 'flex' }}
          aria-hidden="true"
        >
          {product.fallbackEmoji}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <div className="text-[13px] font-medium text-white/90 leading-tight">
          {product.name}
        </div>
        <div className="text-[11px] text-white/40">{product.subtitle}</div>
        <div className="text-[12px] font-mono text-white/60 mt-0.5">
          ₹{product.price}
        </div>

        {/* Color dots */}
        <div className="flex gap-1 mt-1">
          {product.colors.slice(0, 5).map((c) => (
            <div
              key={c.hex}
              title={c.name}
              className="w-3 h-3 rounded-full border border-white/10"
              style={{ background: c.hex }}
            />
          ))}
          {product.colors.length > 5 && (
            <span className="text-[10px] text-white/30 self-center">
              +{product.colors.length - 5}
            </span>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCustomize(product);
          }}
          className={`
            mt-2 w-full py-1.5 rounded-md text-[11px] font-mono tracking-wider
            border transition-all duration-150
            ${isSelected
              ? 'bg-[#e8ff47] border-[#e8ff47] text-black font-bold'
              : 'bg-transparent border-white/10 text-white/40 hover:border-[#e8ff47] hover:text-[#e8ff47] hover:bg-[#e8ff47]/10'
            }
          `}
        >
          {isSelected ? 'CUSTOMIZING ✓' : 'CUSTOMIZE →'}
        </button>
      </div>
    </div>
  );
}