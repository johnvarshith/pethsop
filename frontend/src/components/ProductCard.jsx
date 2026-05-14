import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';

/**
 * Reusable product card used across Products page and Admin.
 * Renders star rating, price, add-to-cart, and wishlist.
 */

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`text-sm ${s <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
      ))}
      <span className="text-xs text-gray-400 ml-1">({rating})</span>
    </div>
  );
}

export default function ProductCard({ product, onAddToCart, index = 0 }) {
  const [added, setAdded] = React.useState(false);
  const [qty, setQty] = React.useState(1);

  const handleAdd = () => {
    onAddToCart?.(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col"
    >
      {/* Image */}
      <div className="h-52 overflow-hidden relative">
        <img
          src={product.img || product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {product.badge}
          </span>
        )}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50">
          <Heart className="w-4 h-4 text-red-400" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {product.category && (
          <span className="text-xs font-semibold text-purple-500 uppercase tracking-wider mb-1">
            {product.category}
          </span>
        )}
        <h3 className="font-bold text-gray-800 mb-1.5 leading-tight line-clamp-2">{product.name}</h3>
        <StarRating rating={product.rating || 4.5} />
        <p className="text-2xl font-black text-purple-600 mt-2">
          ₹{typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
        </p>

        <div className="mt-auto pt-4 flex items-center gap-2">
          {/* Qty control */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-7 h-7 rounded-lg bg-white shadow-sm text-gray-600 hover:text-purple-600 font-bold transition text-sm flex items-center justify-center"
            >−</button>
            <span className="w-7 text-center text-sm font-bold">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-7 h-7 rounded-lg bg-white shadow-sm text-gray-600 hover:text-purple-600 font-bold transition text-sm flex items-center justify-center"
            >+</button>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className={`flex-1 text-sm font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-md'
            }`}
          >
            {added ? '✓ Added!' : <><ShoppingCart className="w-4 h-4" /> Add</>}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
