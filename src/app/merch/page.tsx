'use client';
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Zap, Palette, ChevronLeft, Upload, Move, Box } from "lucide-react";

// ──────────────────────────────────────────────
// EXACT FILENAME MAPPING
// ──────────────────────────────────────────────
const CATEGORIES = ["All", "Apparel", "Bottoms", "Accessories", "Stationery"];

const PRODUCTS = [
  {
    id: "optic-wash-tee",
    name: "Optic Wash Oversize Tee",
    category: "Apparel",
    price: 479,
    // UPDATED to .png per your correction
    image: "/16639907304364plus-size-tee_website-final.png", 
  },
  {
    id: "premium-hoodie",
    name: "Classic Pullover Hoodie",
    category: "Apparel",
    price: 999,
    image: "/16327587616151ebe9ad1a0jackets-and-pullovers.svg", 
  },
  {
    id: "tech-joggers",
    name: "Tech Fleece Joggers",
    category: "Bottoms",
    price: 899,
    image: "/16556998541354Jogger.png",
  },
  {
    id: "cohort-cap",
    name: "Premium Snapback Cap",
    category: "Accessories",
    price: 345,
    image: "/1633358660615b13444dfd21630042360612878f8986d016297183166123.jpg",
  },
  {
    id: "neural-mug",
    name: "Ceramic Coffee Mug",
    category: "Accessories",
    price: 249,
    image: "/16327587376151ebd1a7a43coffee-mug-black.svg",
  },
  {
    id: "stationery-kit",
    name: "Cohort Stationery Set",
    category: "Stationery",
    price: 159,
    image: "/16327587236151ebc3d5961stationery.svg",
  }
];

export default function JobrMerchStore() {
  const [view, setView] = useState<'catalog' | 'studio'>('catalog');
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const filteredProducts = PRODUCTS.filter(p => activeCategory === "All" || p.category === activeCategory);

  return (
    <div className="bg-[#0a0f1e] min-h-screen text-slate-200 selection:bg-cyan-500/30">
      <AnimatePresence mode="wait">
        {view === 'catalog' ? (
          <motion.div key="catalog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto py-20 px-8">
            <header className="mb-16">
              <span className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block underline underline-offset-8 decoration-cyan-500/30">Merch Ecosystem v1.0</span>
              <h1 className="text-6xl font-black italic text-white tracking-tighter mb-10">Product Catalog</h1>
              
              <div className="flex flex-wrap gap-4">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat} onClick={() => setActiveCategory(cat)}
                    className={`px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${activeCategory === cat ? 'bg-white text-black border-white shadow-xl shadow-white/10' : 'bg-white/5 text-slate-500 border-white/5 hover:text-slate-300'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {filteredProducts.map(p => (
                <div key={p.id} className="bg-slate-900/40 border border-white/5 rounded-[56px] p-10 hover:border-cyan-500/30 transition-all group shadow-2xl">
                  <div className="aspect-square mb-8 overflow-hidden rounded-[40px] bg-slate-950 flex items-center justify-center relative">
                    <img src={p.image} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-1000" alt={p.name} />
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-black text-white italic tracking-tighter leading-tight max-w-[180px]">{p.name}</h3>
                      <p className="text-2xl font-black text-white italic">₹{p.price}</p>
                    </div>
                    <button 
                      onClick={() => { setSelectedProduct(p); setView('studio'); }}
                      className="w-full bg-cyan-600 text-white py-5 rounded-3xl text-[11px] font-black uppercase tracking-widest hover:bg-cyan-500 transition-all shadow-xl shadow-cyan-900/20"
                    >
                      CUSTOMIZE DESIGN
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <DesignStudio product={selectedProduct} onBack={() => setView('catalog')} />
        )}
      </AnimatePresence>
    </div>
  );
}

function DesignStudio({ product, onBack }: any) {
  const [logo, setLogo] = useState<string | null>(null);
  const [logoScale, setLogoScale] = useState(30);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogo(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div key="studio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col lg:flex-row h-screen bg-[#05070a]">
      {/* 1. DESIGN CANVAS (CENTER) */}
      <div className="flex-1 flex items-center justify-center p-16 relative overflow-hidden bg-slate-950">
        <button onClick={onBack} className="absolute top-12 left-12 text-slate-600 hover:text-white font-black uppercase tracking-widest text-[10px] z-[100]">← BACK TO HUB</button>
        
        <div className="relative w-full max-w-2xl aspect-square bg-[#0d1324] rounded-[80px] border border-white/5 overflow-hidden flex items-center justify-center shadow-2xl">
          {/* BASE PRODUCT - High Priority Visibility */}
          <img src={product.image} className="w-full h-full object-contain relative z-10 pointer-events-none" alt="base" />
          
          {/* THE LOGO - Forced Z-Index [999] ensuring visibility */}
          <AnimatePresence>
            {logo && (
              <motion.div 
                drag 
                dragMomentum={false}
                className="absolute z-[999] cursor-grab active:cursor-grabbing pointer-events-auto" 
                style={{ width: `${logoScale}%`, top: '40%', left: '35%' }}
              >
                <img src={logo} alt="Branding" className="w-full h-auto drop-shadow-[0_20px_60px_rgba(0,0,0,0.9)]" />
                <div className="absolute -inset-4 border-2 border-cyan-500 border-dashed rounded-2xl opacity-40 pointer-events-none" />
              </motion.div>
            )}
          </AnimatePresence>

          {!logo && <div className="absolute z-0 font-black text-white/5 text-[120px] uppercase tracking-tighter leading-none select-none italic">JOBR</div>}
        </div>
      </div>

      {/* 2. STUDIO CONTROLS (SIDEBAR) */}
      <div className="w-full lg:w-[480px] bg-[#070b14] border-l border-white/5 p-16 flex flex-col gap-12 z-[1000]">
        <div>
          <h2 className="text-4xl font-black text-white italic mb-3 tracking-tighter">{product.name}</h2>
          <p className="text-cyan-500 text-[10px] font-black uppercase tracking-[0.4em]">Design Studio v1.02</p>
        </div>

        <div className="space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-600">1. Upload Asset</h3>
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="w-full py-20 border-2 border-dashed border-white/5 rounded-[48px] hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all group flex flex-col items-center gap-5"
          >
            <div className="p-5 bg-white/5 rounded-full group-hover:scale-110 transition-transform">
              <Upload className="text-slate-400 group-hover:text-cyan-400" size={28} />
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase group-hover:text-slate-200">
               {logo ? "Replace branding asset" : "Choose Image (PNG/JPG/SVG)"}
            </span>
            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleUpload} />
          </button>
        </div>

        {logo && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
              <span>2. Asset Dimensions</span>
              <span className="text-white font-mono">{logoScale}%</span>
            </div>
            <input 
               type="range" min="10" max="85" value={logoScale} 
               onChange={(e) => setLogoScale(Number(e.target.value))} 
               className="w-full accent-cyan-500 cursor-pointer h-1.5 rounded-full" 
            />
          </motion.div>
        )}

        <div className="mt-auto pt-10 border-t border-white/5">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-600 mb-2">Est. Unit Price</p>
              <p className="text-4xl font-black text-white italic tracking-tighter">₹{product.price}</p>
            </div>
          </div>
          <button className="w-full py-6 bg-white text-black font-black rounded-3xl text-[12px] uppercase tracking-[0.2em] shadow-2xl hover:bg-cyan-500 hover:text-white transition-all">
            GENERATE MANUFACTURING QUOTE
          </button>
        </div>
      </div>
    </motion.div>
  );
}