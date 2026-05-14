import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const smallPets = [
  { name: 'Hamster', img: 'https://images.pexels.com/photos/3362697/pexels-photo-3362697.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Low-maintenance, small space requirements. Great for beginners and children.', traits: ['Low-Maintenance', 'Small', 'Beginner-Friendly'] },
  { name: 'Rabbit', img: 'https://images.pexels.com/photos/6845638/pexels-photo-6845638.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Quiet, gentle pets that can be litter-trained. Need moderate space to exercise.', traits: ['Quiet', 'Gentle', 'Trainable'] },
  { name: 'Bird / Parrot', img: 'https://images.pexels.com/photos/349758/hummingbird-bird-birds-349758.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Social, interactive pets with personality. Some species can learn to talk!', traits: ['Talkative', 'Colorful', 'Social'] },
  { name: 'Fish', img: 'https://images.pexels.com/photos/2156311/pexels-photo-2156311.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Peaceful, calming pets. Perfect for those with limited space or allergies.', traits: ['Peaceful', 'Low-Effort', 'Elegant'] },
  { name: 'Sugar Glider', img: 'https://images.pexels.com/photos/9516935/pexels-photo-9516935.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Exotic, social pets that bond closely with owners. Require specialized care.', traits: ['Exotic', 'Bonding', 'Unique'] },
  { name: 'Turtle', img: 'https://images.pexels.com/photos/789141/pexels-photo-789141.jpeg?auto=compress&cs=tinysrgb&w=800', desc: 'Long-lived, low-maintenance pets. Perfect for those seeking a long-term companion.', traits: ['Long-Lived', 'Calm', 'Unique'] },
];

export default function SmallPets() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div
        className="h-80 bg-cover bg-center relative"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/1093126/pexels-photo-1093126.jpeg?auto=compress&cs=tinysrgb&w=1260')" }}
      >
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-black text-white text-center drop-shadow-lg"
          >
            🐹 Small Pets
          </motion.h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {smallPets.map((pet, i) => (
          <motion.div
            key={pet.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className="bg-white rounded-2xl shadow-md overflow-hidden group"
          >
            <div className="h-56 overflow-hidden">
              <img src={pet.img} alt={pet.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{pet.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{pet.desc}</p>
              <div className="flex flex-wrap gap-2">
                {pet.traits.map(t => (
                  <span key={t} className="bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">{t}</span>
                ))}
              </div>
              <Link to="/adoption">
                <button className="mt-4 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors shadow-sm cursor-pointer">
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
