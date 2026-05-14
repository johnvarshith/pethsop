import React from 'react';
import { motion } from 'framer-motion';

const careGuides = [
  { emoji: '🍖', title: 'Nutrition & Diet', desc: 'A balanced diet is the foundation of your pet\'s health. Feed species-appropriate food, avoid harmful human foods, and always provide fresh water. Consult your vet to pick the right diet plan.' },
  { emoji: '🏃', title: 'Exercise & Play', desc: 'Regular play and exercise keep pets physically fit and mentally stimulated. Dogs need daily walks, cats benefit from interactive toys, and small pets need safe space to roam and romp.' },
  { emoji: '💉', title: 'Vaccinations', desc: 'Stay current on core vaccines to protect your pet from diseases. Annual vet checkups help catch health issues early before they become serious, costly problems.' },
  { emoji: '✂️', title: 'Grooming', desc: 'Regular grooming is more than aesthetics — it prevents matting, skin issues, and dental disease. Brush often, check ears weekly, and trim nails every 3–4 weeks.' },
  { emoji: '🧠', title: 'Mental Stimulation', desc: 'Boredom is a leading cause of destructive behavior. Puzzle feeders, training sessions, new toys, and social interaction keep your pet\'s brain sharp and mood bright.' },
  { emoji: '🏠', title: 'A Safe Environment', desc: 'Pet-proof your home by securing toxic plants, chemicals, and small objects they can swallow. A dedicated cozy resting spot gives them security and reduces anxiety.' },
];

export default function Care() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gradient-to-r from-purple-700 to-teal-600 text-white py-20 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-black mb-4"
        >
          🌿 Pet Care Guide
        </motion.h1>
        <p className="text-xl opacity-90 max-w-2xl mx-auto">
          Everything you need to give your furry friend a long, happy, and healthy life.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {careGuides.map((g, i) => (
          <motion.div
            key={g.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 cursor-default"
          >
            <div className="text-5xl mb-4">{g.emoji}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{g.title}</h3>
            <p className="text-gray-600 leading-relaxed text-sm">{g.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <div className="bg-purple-50 inline-flex items-center gap-4 px-8 py-6 rounded-3xl shadow-sm">
          <span className="text-4xl">🩺</span>
          <div className="text-left">
            <h4 className="font-black text-gray-800 text-lg">Need Professional Advice?</h4>
            <p className="text-gray-500 text-sm">Our PawPal AI chatbot and expert team are always ready to help.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
