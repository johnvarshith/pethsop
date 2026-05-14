import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Calendar } from 'lucide-react';

/**
 * Reusable PetCard for the adoption listing page.
 * Shows pet image, name, breed, age, and adoption CTA.
 */
export default function PetCard({ pet, onAdopt, onFavorite, index = 0 }) {
  const [liked, setLiked] = React.useState(pet.isFavorited || false);

  const speciesColor = {
    Dog: 'bg-orange-100 text-orange-700',
    Cat: 'bg-teal-100 text-teal-700',
    Bird: 'bg-blue-100 text-blue-700',
    Rabbit: 'bg-pink-100 text-pink-700',
  };

  const badgeClass = speciesColor[pet.species] || 'bg-purple-100 text-purple-700';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={pet.images?.[0] || pet.image || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800'}
          alt={pet.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Status badge */}
        <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${
          pet.status === 'available' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
        }`}>
          {pet.status === 'available' ? '● Available' : 'Pending'}
        </span>
        {/* Favorite button */}
        <button
          onClick={() => { setLiked((l) => !l); onFavorite?.(pet._id || pet.id); }}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110"
        >
          <Heart className={`w-5 h-5 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-black text-gray-900">{pet.name}</h3>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeClass}`}>
            {pet.species}
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-3">{pet.breed}</p>

        <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {pet.age} {pet.age === 1 ? 'yr' : 'yrs'}
          </span>
          {pet.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {pet.location}
            </span>
          )}
          <span className="capitalize">{pet.gender || 'Unknown'}</span>
        </div>

        <button
          onClick={() => onAdopt?.(pet)}
          disabled={pet.status !== 'available'}
          className="w-full bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 disabled:from-gray-300 disabled:to-gray-300 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md disabled:cursor-not-allowed"
        >
          {pet.status === 'available' ? '🐾 Adopt Me' : 'Unavailable'}
        </button>
      </div>
    </motion.div>
  );
}
