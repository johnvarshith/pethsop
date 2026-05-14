import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { cart, removeFromCart, clearCart, addOrder, totalPrice, open, setOpen } = useCart();


  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-96 max-w-full bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">🛒 Your Cart</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-700 transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-400 py-20">
                  <p className="text-5xl mb-4">🐾</p>
                  <p className="font-medium">Your cart is empty!</p>
                </div>
              ) : (
                cart.map(item => {
                  const itemId = item.id || item._id;
                  const itemImg = item.img || item.image;
                  return (
                    <div key={itemId} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                      <img src={itemImg} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 truncate">{item.name}</p>
                        <p className="text-purple-600 font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-xs text-gray-400">qty: {item.quantity}</p>
                      </div>
                      <button onClick={() => removeFromCart(itemId)} className="text-gray-300 hover:text-red-400 transition">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })

              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-gray-700">Total</span>
                  <span className="text-2xl font-black text-purple-600">${totalPrice.toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => {
                    addOrder(cart, totalPrice);
                    toast.success(`Successfully checked out ₹${totalPrice.toFixed(2)}! Your order is being processed.`);
                    clearCart();
                    setOpen(false);
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-2xl transition shadow-md hover:shadow-lg mb-3"
                >
                  Checkout
                </button>


                <button onClick={clearCart} className="w-full text-center text-gray-400 hover:text-red-400 text-sm transition">
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
