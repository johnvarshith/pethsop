import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/4967723/pexels-photo-4967723.jpeg?auto=compress&cs=tinysrgb&w=1260"
          className="w-full h-full object-cover object-top"
          alt="Happy pets"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-white/40 flex items-center">
          <div className="max-w-3xl px-12">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold text-gray-900 mb-4"
            >
              Caring for Your Pets Like Family
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-700"
            >
              Where every tail wag and purr matters.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://public.readdy.ai/ai/img_res/6518b3a77971d8e5dcf9cec3419d242a.jpg"
              className="rounded-2xl shadow-lg w-full"
              alt="Our shop"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-700 mb-6">
              Founded with love and dedication, PawPal began as a passion project driven by our deep love for
              pets. What started as a simple idea soon grew into a trusted destination where pet owners find
              quality care, products, and a community that truly understands their furry companions.
            </p>
            <div className="grid grid-cols-3 gap-6 text-center mt-8">
              {[['3+', 'Years Experience'], ['5000+', 'Happy Pets'], ['98%', 'Satisfaction Rate']].map(([val, label]) => (
                <motion.div key={label} whileHover={{ scale: 1.05 }} className="bg-white p-4 rounded-2xl shadow-sm">
                  <p className="text-3xl font-black text-purple-600">{val}</p>
                  <p className="text-gray-500 text-sm mt-1">{label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Meet Our Team</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { name: 'Sree Varsha', role: 'Pet Enthusiast', img: 'https://public.readdy.ai/ai/img_res/29f253d14b9e57261779d649b525b971.jpg', desc: 'A passionate animal lover dedicated to the well-being of every pet that walks through our door.' },
            { name: 'John Varshith', role: 'Animal Lover', img: 'https://public.readdy.ai/ai/img_res/bbcb042126d1e49f0c3e8ea72cac9659.jpg', desc: 'Passionate and committed to enriching the lives of pets with innovative care and devotion.' }
          ].map(m => (
            <motion.div key={m.name} whileHover={{ y: -4 }} className="bg-white p-6 rounded-2xl shadow-lg flex items-start gap-6">
              <img src={m.img} className="w-24 h-24 rounded-full object-cover shrink-0" alt={m.name} />
              <div>
                <h3 className="text-xl font-bold text-gray-900">{m.name}</h3>
                <p className="text-purple-600 font-medium mb-2">{m.role}</p>
                <p className="text-gray-600 text-sm">{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '❤️', title: 'Expert Care', desc: 'Certified team with the latest techniques and equipment.' },
              { icon: '🛡️', title: 'Premium Products', desc: 'Only the highest quality pet supplies and nutrition products.' },
              { icon: '📞', title: '24/7 Support', desc: 'Emergency support available around the clock.' }
            ].map(item => (
              <motion.div key={item.title} whileHover={{ y: -4 }} className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
