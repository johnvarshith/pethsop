import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import axios from 'axios';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hi! I'm PawPal AI. How can I help you today?", isBot: true }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/api/chat', { message: userMsg });
      setMessages(prev => [...prev, { text: res.data.reply || "Sorry, I couldn't understand that.", isBot: true }]);
    } catch (err) {
      // Fallback answers based on keywords
      const lowerInput = userMsg.toLowerCase();
      let fallbackReply = "Network error. Please try again later.";
      
      if (lowerInput.includes('product') || lowerInput.includes('sell')) {
        fallbackReply = "We sell a wide variety of premium pet products, including Food, Toys, Accessories, Grooming kits, and Health supplements!";
      } else if (lowerInput.includes('adopt') || lowerInput.includes('pet')) {
        fallbackReply = "You can adopt Dogs, Cats, Birds, and Small Pets. Visit our Adoption page to see available companions!";
      } else if (lowerInput.includes('appointment') || lowerInput.includes('book')) {
        fallbackReply = "You can book an appointment for Grooming, Vet Checkups, or Training directly from the Care page.";
      }
      
      setMessages(prev => [...prev, { text: fallbackReply, isBot: true }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
    // Use a small timeout to let state update before submitting
    setTimeout(() => {
      document.getElementById('chat-submit-btn').click();
    }, 50);
  };

  const QUICK_QUESTIONS = [
    "What products do you sell?",
    "How can I adopt a pet?",
    "Can I book a grooming appointment?"
  ];


  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 ${isOpen ? 'hidden' : ''}`}
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-100"
          >
            {/* Header */}
            <div className="bg-purple-600 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6" />
                <span className="font-bold">PawPal Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.isBot ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm' : 'bg-purple-600 text-white rounded-tr-none shadow-md'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            <div className="px-3 pb-2 bg-gray-50 flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map((q, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleQuickQuestion(q)}
                  className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1.5 rounded-full transition whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about pets..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-400 transition"
              />
              <button
                id="chat-submit-btn"
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white p-2 rounded-xl transition flex items-center justify-center shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
