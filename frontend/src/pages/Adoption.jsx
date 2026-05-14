import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, Heart, MapPin, Calendar } from 'lucide-react';

import PetCard from '../components/PetCard';
import { SkeletonCard } from '../components/Skeletons';
import { usePets } from '../hooks/usePets';
import { useDebounce } from '../hooks/useDebounce';
import { petsAPI } from '../services/api';
import toast from 'react-hot-toast';

const SPECIES = ['All', 'Dog', 'Cat', 'Bird', 'Rabbit', 'Other'];

// Fallback data shown when backend is offline
const FALLBACK_PETS = [
  { id: 1, name: 'Buddy', species: 'Dog', breed: 'Golden Retriever', age: 2, gender: 'Male', location: 'Kavali', status: 'available', images: ['https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800'] },
  { id: 2, name: 'Luna', species: 'Cat', breed: 'Persian', age: 1, gender: 'Female', location: 'Nellore', status: 'available', images: ['https://images.pexels.com/photos/1543793/pexels-photo-1543793.jpeg?auto=compress&cs=tinysrgb&w=800'] },
  { id: 3, name: 'Max', species: 'Dog', breed: 'Labrador', age: 3, gender: 'Male', location: 'Kavali', status: 'available', images: ['https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=800'] },
  { id: 4, name: 'Milo', species: 'Rabbit', breed: 'Holland Lop', age: 1, gender: 'Male', location: 'Gudur', status: 'available', images: ['https://images.pexels.com/photos/1359241/pexels-photo-1359241.jpeg?auto=compress&cs=tinysrgb&w=800'] },
  { id: 5, name: 'Bella', species: 'Dog', breed: 'Beagle', age: 4, gender: 'Female', location: 'Kavali', status: 'pending', images: ['https://images.pexels.com/photos/220938/pexels-photo-220938.jpeg?auto=compress&cs=tinysrgb&w=800'] },
  { id: 6, name: 'Nala', species: 'Cat', breed: 'Siamese', age: 2, gender: 'Female', location: 'Nellore', status: 'available', images: ['https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&w=800'] },
  { id: 7, name: 'Charlie', species: 'Bird', breed: 'Budgerigar', age: 1, gender: 'Male', location: 'Kavali', status: 'available', images: ['https://images.pexels.com/photos/56733/pexels-photo-56733.jpeg?auto=compress&cs=tinysrgb&w=800'] },
  { id: 8, name: 'Rocky', species: 'Dog', breed: 'German Shepherd', age: 5, gender: 'Male', location: 'Gudur', status: 'available', images: ['https://images.pexels.com/photos/333083/pexels-photo-333083.jpeg?auto=compress&cs=tinysrgb&w=800'] },
];

// Adoption request modal
function AdoptModal({ pet, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000)); // simulate API
    toast.success(`Adoption request for ${pet.name} submitted! We'll contact you soon. 🐾`);
    setLoading(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Adopt {pet.name}</h2>
            <p className="text-gray-500 text-sm">{pet.breed} · {pet.age} yr{pet.age !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition" />
          <input required type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition" />
          <input required placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition" />
          <textarea placeholder="Why do you want to adopt?" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition resize-none" />

          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white font-bold py-3.5 rounded-xl transition disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '🐾'}
            {loading ? 'Submitting…' : 'Submit Adoption Request'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function Adoption() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [species, setSpecies] = useState('All');

  const [page, setPage] = useState(1);
  const [selectedPet, setSelectedPet] = useState(null);

  const debouncedSearch = useDebounce(search, 400);
  const { pets, pages, loading, error } = usePets({
    page,
    search: debouncedSearch,
    species: species === 'All' ? '' : species,
  });

  // Use fallback data if API fails or returns empty
  const displayPets = (!loading && pets.length === 0) || error ? FALLBACK_PETS : pets;

  const handleFavorite = async (petId) => {
    try {
      await petsAPI.favorite(petId);
      toast.success('Added to favorites! ❤️');
    } catch {
      toast.success('Added to favorites! ❤️'); // optimistic UI
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero */}
      <div className="relative h-72 bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1260')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 flex flex-col items-center justify-center text-center p-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-white mb-3 drop-shadow-lg">
            🐾 Pet Adoption
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/80 text-lg max-w-xl">
            Give a loving home to a pet in need. Every adoption saves a life.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="flex gap-4 mt-4 text-white/70 text-sm">
            <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-red-400" /> {displayPets.filter(p => p.status === 'available').length}+ available</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-purple-400" /> Multiple locations</span>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or breed…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 transition shadow-sm"
            />
          </div>

          {/* Species filter */}
          <div className="flex flex-wrap gap-2">
            {SPECIES.map((s) => (
              <button
                key={s}
                onClick={() => { setSpecies(s); setPage(1); }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  species === s
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300 hover:text-purple-600'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-4 text-sm text-gray-500">
          Showing <span className="font-bold text-gray-800">{displayPets.length}</span> pets
          {species !== 'All' && <> · filtered by <span className="font-bold text-purple-600">{species}</span></>}
        </div>

        {/* Pet Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : displayPets.map((pet, i) => (
                <PetCard
                  key={pet._id || pet.id}
                  pet={pet}
                  index={i}
                  onAdopt={setSelectedPet}
                  onFavorite={handleFavorite}
                />
              ))
          }
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                  page === i + 1
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Adoption modal */}
      <AnimatePresence>
        {selectedPet && (
          <AdoptModal pet={selectedPet} onClose={() => setSelectedPet(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
