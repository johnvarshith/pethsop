import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-br from-purple-50 via-white to-teal-50 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.pexels.com/photos/29838644/pexels-photo-29838644/free-photo-of-cozy-cat-sunbathing-outside-a-shop.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
          alt="Pets background" 
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      
      <div className="relative z-10 max-w-4xl text-center px-4">
        <motion.h1 
          className="text-6xl font-bold text-gray-900 mb-6 drop-shadow-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Welcome to <span className="text-purple-600 font-['Pacifico',_cursive] block mt-2 text-7xl">PawPal React!</span>
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          Your one-stop destination for completely personalized pet care. Quality products, expert recommendations, and our new cutting-edge AI Matchmaker.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
        >
          <Link to="/matchmaker">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
              Try the AI Matchmaker
            </button>
          </Link>

        </motion.div>
      </div>
    </div>
  );
}
