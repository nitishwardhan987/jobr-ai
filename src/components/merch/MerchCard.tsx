'use client';

import Image from 'next/image';
import { MerchProduct } from '@/lib/merch-products';

interface MerchCardProps {
  product: MerchProduct;
  isSelected: boolean;
  onSelect: (product: MerchProduct) => void;
  onCustomize: (product: MerchProduct) => void;
}

export default function MerchCard({ product, isSelected, onSelect, onCustomize }: MerchCardProps) {
  return (
    <div
      onClick={() => onSelect(product)}
      className="relative flex flex-col cursor-pointer rounded-xl overflow-hidden group transition-transform duration-200 hover:-translate-y-0.5"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: isSelected ? '1px solid var(--accent, #e8ff47)' : '1px solid rgba(255,255,255,0.08)',
        boxShadow: isSelected ? '0 0 0 1px var(--accent, #e8ff47)' : 'none',
      }}
    >
      {(product.isNew || product.isBestSeller) && (
        <div className="absolute top-2 left-2 z-10">
          <span
            className="text-[9px] font-bold tracking-[0.1em] px-1.5 py-0.5 rounded font-mono"
            style={{ background: 'var(--accent, #e8ff47)', color: '#000' }}
          >
            {product.isBestSeller ? 'TOP' : 'NEW'}
          </span>
        </div>
      )}

      <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
        {product.image ? (
          <>
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                img.style.display = 'none';
                const fb = img.nextElementSibling as HTMLElement;
                if (fb) fb.style.display = 'flex';
              }}
            />
            <div className="absolute inset-0 items-center justify-center text-5xl" style={{ display: 'none' }} aria-hidden="true">
              {product.fallbackEmoji}
            </div>
          </>
        ) : (
          <div className="text-5xl" aria-hidden="true">{product.fallbackEmoji}</div>
        )}
      </div>

      <div className="p-3 flex flex-col gap-1 flex-1">
        <div className="text-[13px] font-medium leading-tight" style={{ color: 'rgba(255,255,255,0.9)' }}>
          {product.name}
        </div>
        <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {product.subtitle}
        </div>
        <div className="text-[12px] font-mono mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
          ₹{product.price}
        </div>

        <div className="flex gap-1 mt-1 flex-wrap">
          {product.colors.slice(0, 5).map((c) => (
            <div key={c.hex} title={c.name} className="w-3 h-3 rounded-full" style={{ background: c.hex, border: '1px solid rgba(255,255,255,0.15)' }} />
          ))}
          {product.colors.length > 5 && (
            <span className="text-[10px] self-center" style={{ color: 'rgba(255,255,255,0.25)' }}>+{product.colors.length - 5}</span>
          )}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onCustomize(product); }}
          className="mt-2 w-full py-1.5 rounded-md text-[11px] font-mono tracking-wider transition-all duration-150"
          style={isSelected
            ? { background: 'var(--accent, #e8ff47)', border: '1px solid var(--accent, #e8ff47)', color: '#000', fontWeight: 700 }
            : { background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)' }}
        >
          {isSelected ? 'CUSTOMIZING ✓' : 'CUSTOMIZE →'}
        </button>
      </div>
    </div>
  );
}