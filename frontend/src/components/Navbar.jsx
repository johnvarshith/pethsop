import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartDrawer from './CartDrawer';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Dogs', to: '/dogs' },
  { label: 'Cats', to: '/cats' },
  { label: 'Small Pets', to: '/small-pets' },
  { label: 'Products', to: '/products' },
  { label: 'Adoption', to: '/adoption' },
  { label: 'Care', to: '/care' },
  { label: '✨ AI Matchmaker', to: '/matchmaker' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { totalCount, setOpen } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
    setUserMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl text-purple-600 font-black shrink-0"
            style={{ fontFamily: 'Pacifico, cursive' }}
          >
            PawPal
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-4 flex-1 justify-center">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm font-semibold transition-colors whitespace-nowrap ${
                  location.pathname === l.to
                    ? 'text-purple-600'
                    : 'text-gray-600 hover:text-purple-500'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Global Search Bar */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const query = e.target.search.value;
                if (query) navigate(`/products?search=${encodeURIComponent(query)}`);
              }}
              className="hidden sm:flex relative group"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
              <input
                name="search"
                type="text"
                placeholder="Search PawPal..."
                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:border-purple-300 focus:bg-white w-40 focus:w-64 transition-all duration-300"
              />
            </form>

            {/* Cart */}
            <button
              id="cart-btn"
              onClick={() => setOpen(true)}
              aria-label={`Open shopping cart. ${totalCount} items`}
              className="relative text-gray-500 hover:text-purple-600 transition p-2 rounded-xl hover:bg-purple-50"
              title="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
                  {totalCount}
                </span>
              )}
            </button>



            {/* User menu */}
            {user ? (
              <div className="relative">
                <button
                  id="user-menu-btn"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen}
                  aria-label="User account menu"
                  className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl px-3 py-2 transition font-semibold text-sm"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:block">{user.first_name}</span>
                </button>


                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-100 mb-1">
                        <p className="font-bold text-gray-900 text-sm">{user.first_name} {user.second_name}</p>
                        <p className="text-xs text-gray-400">@{user.username}</p>
                        {isAdmin && (
                          <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full mt-1 inline-block">Admin</span>
                        )}
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition"
                      >
                        <User className="w-4 h-4" /> My Profile
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/appointment"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition"
                      >
                        📅 My Appointments
                      </Link>

                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                id="login-btn"
                className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition shadow-sm"
              >
                <User className="w-4 h-4" /> Login
              </Link>
            )}

            {/* Mobile toggle */}
            <button
              className="lg:hidden text-gray-500 hover:text-purple-600 p-2 rounded-xl hover:bg-purple-50 transition"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {navLinks.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className={`block py-2.5 px-4 rounded-xl text-sm font-semibold transition ${
                      location.pathname === l.to
                        ? 'bg-purple-50 text-purple-700'
                        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
                {user && (
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="flex items-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <CartDrawer />
    </>
  );
}
