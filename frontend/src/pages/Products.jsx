import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, ArrowRight, Filter } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import { useDebounce } from '../hooks/useDebounce';
import ProductCard from '../components/ProductCard';
import { SkeletonCard } from '../components/Skeletons';

const CATEGORIES = ['All', 'Food', 'Toys', 'Accessories', 'Grooming', 'Health'];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, setOpen } = useCart();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);

  
  const debouncedSearch = useDebounce(search, 400);
  const { products, pages, loading, error } = useProducts({
    page,
    search: debouncedSearch,
    category: category === 'All' ? '' : category,
  });

  const handleAdd = (product, quantity) => {
    addToCart(product, quantity);
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="relative h-80 bg-slate-900 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-40 bg-cover bg-center transition-transform duration-[10s] hover:scale-110"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/1543793/pexels-photo-1543793.jpeg?auto=compress&cs=tinysrgb&w=1260')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-white/90 text-sm font-bold mb-4 border border-white/20">
              <ShoppingBag className="w-4 h-4 text-purple-400" />
              Premium Pet Store
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
              Best Care for Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-400">Fur-ever Friends</span>
            </h1>
            <p className="text-white/70 text-lg mb-8 max-w-lg">
              Explore our curated collection of premium pet food, durable toys, and luxury accessories.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-4 md:p-6 mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search premium products..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-purple-400 transition"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setPage(1); }}
                  className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all ${
                    category === cat
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            Featured Items
            {!loading && <span className="text-sm font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-lg">{products.length} found</span>}
          </h2>
          <button 
            onClick={() => setSearch('Deal!')}
            className="flex items-center gap-2 text-sm font-bold text-purple-600 cursor-pointer hover:underline bg-transparent border-none"
          >
            View All Deals <ArrowRight className="w-4 h-4" />
          </button>

        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-red-500 font-bold mb-2">Oops! {error}</p>
            <button onClick={() => window.location.reload()} className="text-purple-600 underline">Try again</button>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SkeletonCard />
                </motion.div>
              ))
            ) : products.length > 0 ? (
              products.map((p, i) => (
                <ProductCard
                  key={p.id || p._id}
                  product={p}
                  index={i}
                  onAddToCart={handleAdd}
                />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-900">No products found</h3>
                <p className="text-gray-500">Try adjusting your search or category filters</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center gap-3 mt-16">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => { setPage(i + 1); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                className={`w-12 h-12 rounded-2xl font-black text-sm transition-all ${
                  page === i + 1
                    ? 'bg-purple-600 text-white shadow-xl shadow-purple-200'
                    : 'bg-white text-gray-600 border border-gray-100 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

