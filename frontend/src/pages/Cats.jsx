import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const cats = [
  { name: 'American Shorthair', img: 'https://images.pexels.com/photos/479009/pexels-photo-479009.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Easy-going, adaptable, and low-maintenance. Great for first-time cat owners.', traits: ['Adaptable', 'Easygoing', 'Hardy'] },
  { name: 'Birman', img: 'https://images.pexels.com/photos/2064780/pexels-photo-2064780.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Gentle, affectionate, and moderately active. Beautiful blue eyes.', traits: ['Gentle', 'Affectionate', 'Beautiful'] },
  { name: 'Siamese', img: 'https://images.pexels.com/photos/171227/pexels-photo-171227.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Vocal, intelligent, and very social. Requires lots of interaction.', traits: ['Talkative', 'Social', 'Playful'] },
  { name: 'Persian', img: 'https://images.pexels.com/photos/1644767/pexels-photo-1644767.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Sweet, gentle, and quiet. Requires daily grooming for their long coat.', traits: ['Calm', 'Fluffy', 'Regal'] },
  { name: 'Tabby', img: 'https://images.pexels.com/photos/15803558/pexels-photo-15803558/free-photo-of-kittens-in-a-basket.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Friendly, curious, and great hunters. Ideal for families.', traits: ['Friendly', 'Curious', 'Resilient'] },
];

export default function Cats() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div
        className="h-80 bg-cover bg-center relative"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/15803558/pexels-photo-15803558/free-photo-of-kittens-in-a-basket.jpeg?auto=compress&cs=tinysrgb&w=1260')" }}
      >
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-black text-white text-center drop-shadow-lg"
          >
            🐱 Our Cats
          </motion.h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cats.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className="bg-white rounded-2xl shadow-md overflow-hidden group"
          >
            <div className="h-56 overflow-hidden">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{cat.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{cat.desc}</p>
              <div className="flex flex-wrap gap-2">
                {cat.traits.map(t => (
                  <span key={t} className="bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full">{t}</span>
                ))}
              </div>
              <Link to="/adoption">
                <button className="mt-4 w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-xl transition-colors shadow-sm cursor-pointer">
                  Learn More
                </button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
