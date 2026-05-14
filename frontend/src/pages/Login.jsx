import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Navigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Login() {
  const { user, loading, login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ firstName: '', secondName: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // If already logged in, redirect to home
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = isLogin 
        ? await authAPI.login({ username: form.username, password: form.password })
        : await authAPI.signup(form);

      if (res.data.success) {
        toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
        // Update context immediately
        login(res.data.user);
        navigate('/');
      } else {
        setError(res.data.message || 'Something went wrong');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-teal-600 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-teal-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl w-full max-w-md p-10 text-white"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black font-['Pacifico',_cursive]">PawPal</h1>
          <p className="text-white/80 mt-2 text-sm">Your pet's best companion</p>
        </div>

        {/* Toggle */}
        <div className="flex bg-white/10 rounded-2xl p-1 mb-8">
          {['Login', 'Sign Up'].map((tab, i) => (
            <button
              key={tab}
              type="button"
              onClick={() => { setIsLogin(i === 0); setError(''); }}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${(isLogin && i === 0) || (!isLogin && i === 1) ? 'bg-white text-purple-700' : 'text-white/70 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 placeholder-white/50 text-white outline-none focus:border-white/60 transition"
              />
              <input name="secondName" placeholder="Last Name" value={form.secondName} onChange={handleChange} required
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 placeholder-white/50 text-white outline-none focus:border-white/60 transition"
              />
            </>
          )}
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 placeholder-white/50 text-white outline-none focus:border-white/60 transition"
          />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 placeholder-white/50 text-white outline-none focus:border-white/60 transition"
          />

          {error && <p className="text-red-300 text-sm font-medium text-center">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-white text-purple-700 font-black py-4 rounded-xl hover:bg-purple-50 disabled:opacity-60 transition-all shadow-lg hover:shadow-xl mt-2 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-purple-700 border-t-transparent rounded-full animate-spin" />
            ) : (
              isLogin ? 'Login' : 'Create Account'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

