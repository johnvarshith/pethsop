import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ChatWidget from './components/ChatWidget';

// Eagerly load critical pages
import Home from './pages/Home';
import Login from './pages/Login';

// Lazy load the rest — improves initial bundle size (code splitting)
const About = lazy(() => import('./pages/About'));
const Dogs = lazy(() => import('./pages/Dogs'));
const Cats = lazy(() => import('./pages/Cats'));
const SmallPets = lazy(() => import('./pages/SmallPets'));
const Products = lazy(() => import('./pages/Products'));
const Care = lazy(() => import('./pages/Care'));
const Matchmaker = lazy(() => import('./pages/Matchmaker'));
const Adoption = lazy(() => import('./pages/Adoption'));
const Chat = lazy(() => import('./pages/Chat'));
const Appointment = lazy(() => import('./pages/Appointment'));
const Profile = lazy(() => import('./pages/Profile'));
const Admin = lazy(() => import('./pages/Admin'));

// Page-level loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-sans text-gray-900">
        <Navbar />
        <main className="pt-16">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/dogs" element={<Dogs />} />
              <Route path="/cats" element={<Cats />} />
              <Route path="/small-pets" element={<SmallPets />} />
              <Route path="/products" element={<Products />} />
              <Route path="/care" element={<Care />} />
              <Route path="/matchmaker" element={<Matchmaker />} />
              <Route path="/adoption" element={<Adoption />} />
              <Route path="/chat" element={<Chat />} />

              {/* Protected routes — require login */}
              <Route
                path="/appointment"
                element={
                  <ProtectedRoute>
                    <Appointment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Admin only */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <Admin />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16 mt-8">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-black mb-4" style={{ fontFamily: 'Pacifico, cursive' }}>PawPal</h3>
              <p className="text-gray-400 text-sm">Your trusted partner in premium pet care since 2023.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                {[
                  { label: 'About Us', path: '/about' },
                  { label: 'Dogs', path: '/dogs' },
                  { label: 'Cats', path: '/cats' },
                  { label: 'Products', path: '/products' },
                  { label: 'Adoption', path: '/adoption' },
                  { label: 'Care', path: '/care' }
                ].map((l) => (
                  <li key={l.label}>
                    <Link to={l.path} className="hover:text-white transition">{l.label}</Link>
                  </li>
                ))}
              </ul>

            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>123 Kavali</li>
                <li>📞 +91 2273A31033</li>
                <li>📧 pawpal@pets.com</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Newsletter</h4>
              <form className="flex" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-l-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 outline-none focus:border-purple-500 transition text-sm"
                />
                <button className="bg-purple-600 px-4 py-2 rounded-r-xl hover:bg-purple-700 transition text-sm font-bold">
                  Go
                </button>
              </form>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
            © 2025 PawPal. All rights reserved. Built with ❤️ for pets.
          </div>
        </footer>
        <ChatWidget />
      </div>
    </Router>

  );
}
