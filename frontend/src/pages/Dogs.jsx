import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const dogs = [
  { name: 'German Shepherd', img: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=800', desc: 'Loyal, intelligent, and versatile. Great for active families and experienced owners.', traits: ['Loyal', 'Active', 'Intelligent'] },
  { name: 'Golden Retriever', img: 'https://images.pexels.com/photos/2123773/pexels-photo-2123773.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Friendly, reliable, and great with children. Perfect for active households.', traits: ['Friendly', 'Gentle', 'Playful'] },
  { name: 'Bulldog', img: 'https://images.pexels.com/photos/164446/pexels-photo-164446.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Docile and great for apartments. Low exercise needs.', traits: ['Calm', 'Easygoing', 'Sturdy'] },
  { name: 'Shih Tzu', img: 'https://images.pexels.com/photos/130770/pexels-photo-130770.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Affectionate companion dog. Great for families and apartment living.', traits: ['Affectionate', 'Compact', 'Playful'] },
  { name: 'Poodle', img: 'https://images.pexels.com/photos/1057044/pexels-photo-1057044.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Highly intelligent and trainable. Low-shedding and great for allergy sufferers.', traits: ['Smart', 'Low-Shed', 'Elegant'] },
  { name: 'Dalmatian', img: 'https://images.pexels.com/photos/27175380/pexels-photo-27175380/free-photo-of-dalmatian-puppy-dogs-in-a-tin-bathtub.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Energetic and striking. Loves play and exercise.', traits: ['Energetic', 'Striking', 'Alert'] },
];

export default function Dogs() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div
        className="h-80 bg-cover bg-center relative"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/27175380/pexels-photo-27175380/free-photo-of-dalmatian-puppy-dogs-in-a-tin-bathtub.jpeg?auto=compress&cs=tinysrgb&w=1260')" }}
      >
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-black text-white text-center drop-shadow-lg"
          >
            🐶 Our Dogs
          </motion.h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {dogs.map((dog, i) => (
          <motion.div
            key={dog.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className="bg-white rounded-2xl shadow-md overflow-hidden group"
          >
            <div className="h-56 overflow-hidden">
              <img src={dog.img} alt={dog.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{dog.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{dog.desc}</p>
              <div className="flex flex-wrap gap-2">
                {dog.traits.map(t => (
                  <span key={t} className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">{t}</span>
                ))}
              </div>
              <Link to="/adoption">
                <button className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm cursor-pointer">
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
