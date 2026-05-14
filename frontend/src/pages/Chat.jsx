import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, RefreshCw, ChevronRight } from 'lucide-react';
import { aiAPI } from '../services/api';

const QUICK_PROMPTS = [
  'My dog is limping, what should I do?',
  'What food is best for a 3-month kitten?',
  'How often should I bathe my dog?',
  'Signs of a healthy rabbit?',
  'How to socialize a new puppy?',
  'My cat is not eating, should I worry?',
];

const WELCOME_MSG = {
  id: 'welcome',
  role: 'bot',
  text: "Hi! I'm PawPal's AI vet assistant 🐾 I can help with pet care, diet, symptoms, and more. What's on your mind?",
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

function ChatBubble({ msg }) {
  const isBot = msg.role === 'bot';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-end gap-2.5 ${isBot ? '' : 'flex-row-reverse'}`}
    >
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm font-bold ${isBot ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'}`}>
        {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      <div className={`max-w-[75%] ${isBot ? '' : 'items-end'} flex flex-col gap-1`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isBot
            ? 'bg-white border border-gray-100 shadow-sm text-gray-800 rounded-bl-none'
            : 'bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-br-none'
        }`}>
          {msg.loading ? (
            <span className="flex gap-1 items-center">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          ) : msg.text}
        </div>
        <span className="text-xs text-gray-400 px-1">{msg.time}</span>
      </div>
    </motion.div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput('');

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', text: userText, time }]);

    // Add typing indicator
    const thinkingId = Date.now() + 1;
    setMessages((prev) => [...prev, { id: thinkingId, role: 'bot', loading: true, time: '' }]);
    setLoading(true);

    try {
      const res = await aiAPI.chat({ message: userText });
      const reply = res.data.reply || "I'm having trouble responding right now. Please try again!";
      setMessages((prev) =>
        prev.map((m) => (m.id === thinkingId ? { ...m, loading: false, text: reply, time } : m))
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === thinkingId
            ? { ...m, loading: false, text: "Sorry, I'm offline right now. Please check back later! 🐾", time }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([WELCOME_MSG]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-black text-gray-900">PawPal AI Assistant</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-gray-500">Online · Powered by Gemini AI</span>
              </div>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-purple-600 transition bg-gray-50 hover:bg-purple-50 px-3 py-2 rounded-xl"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      </div>

      {/* Quick prompts */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-sm px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Quick Questions</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                disabled={loading}
                className="shrink-0 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-full transition disabled:opacity-50 whitespace-nowrap"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <ChatBubble key={msg.id} msg={msg} />
            ))}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-4 py-4 shadow-up">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="flex gap-3 items-end"
          >
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
                }}
                placeholder="Ask about your pet's health, diet, or behavior…"
                rows={1}
                className="w-full resize-none border border-gray-200 rounded-2xl px-4 py-3.5 pr-12 text-sm focus:outline-none focus:border-purple-400 transition bg-gray-50 focus:bg-white max-h-32 overflow-auto"
                style={{ fieldSizing: 'content' }}
              />
            </div>
            <motion.button
              type="submit"
              disabled={!input.trim() || loading}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-2xl flex items-center justify-center shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </form>
          <p className="text-xs text-center text-gray-400 mt-2">PawPal AI may make mistakes. Always consult a vet for medical issues.</p>
        </div>
      </div>
    </div>
  );
}
