import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

const petTypeQuestions = [
  { text: "What type of pet are you interested in?", options: ["Dog", "Cat", "Small Animal"] }
];

const dogQuestions = [
  { text: "What size dog would you prefer?", options: ["Small", "Medium", "Large"] },
  { text: "How much exercise can you provide daily?", options: ["Short walks", "1-2 hour walks/play", "Very active, 2+ hours"] },
  { text: "What's your grooming commitment level?", options: ["Minimal grooming", "Regular brushing", "Daily grooming okay"] }
];

const catQuestions = [
  { text: "Do you prefer an indoor or outdoor cat?", options: ["Strictly indoor", "Indoor with outdoor access", "Mainly outdoor"] },
  { text: "What type of cat personality do you prefer?", options: ["Independent", "Moderately social", "Very affectionate"] },
  { text: "How do you feel about cat hair?", options: ["Prefer minimal shedding", "Don't mind some shedding", "Hair doesn't bother me"] }
];

const smallPetQuestions = [
  { text: "How much space can you dedicate to a habitat?", options: ["Small cage", "Medium enclosure", "Large habitat"] },
  { text: "What's your preferred pet lifespan?", options: ["2-3 years", "5-10 years", "10+ years"] },
  { text: "What's your cleaning commitment level?", options: ["Weekly cleaning", "Every few days", "Daily maintenance"] }
];

export default function Matchmaker() {
  const [currentStep, setCurrentStep] = useState(0);
  const [petType, setPetType] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const activeQuestions = petType === null ? petTypeQuestions 
    : petType === 'Dog' ? dogQuestions 
    : petType === 'Cat' ? catQuestions 
    : smallPetQuestions;

  const handleSelect = (questionText, optionText) => {
    if (questionText === "What type of pet are you interested in?") {
      setPetType(optionText);
    }
    setAnswers(prev => ({ ...prev, [questionText]: optionText }));
  };

  const currentQ = activeQuestions[currentStep];

  const handleSubmit = async () => {
    if (currentStep < activeQuestions.length - 1) {
      setCurrentStep(s => s + 1);
      return;
    }

    setLoading(true);
    try {
      const answerStrings = Object.entries(answers).map(([q, a]) => `${q}: ${a}`);
      const res = await axios.post('/api/matchmaker', { answers: answerStrings.join(', ') });
      if (res.data.success) {
        setResult(res.data.data);
      } else {
        setResult({ recommendation: "Server Error", description: res.data.message || "Could not process." });
      }
    } catch (err) {
      setResult({ recommendation: "AI Fallback", description: "Our AI brain is currently resting. Please try again soon!" });
    }
    setLoading(false);
  };

  const reset = () => {
    setCurrentStep(0);
    setPetType(null);
    setAnswers({});
    setResult(null);
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl shadow-xl p-10 max-w-2xl text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 font-['Pacifico',_cursive] text-purple-600">Your Perfect Match!</h2>
          <h3 className="text-3xl font-black mb-4">{result.recommendation}</h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">{result.description}</p>
          <button onClick={reset} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition">
            Take Quiz Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex items-center justify-center py-20 px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 font-['Pacifico',_cursive] inline-block bg-gradient-to-r from-purple-600 to-teal-400 bg-clip-text text-transparent">
            AI Pet Matchmaker
          </h1>
          <p className="text-lg text-gray-600">Answer a few questions and our AI will find your perfect companion.</p>
        </div>

        <motion.div 
          key={currentStep}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          className="bg-white rounded-3xl shadow-lg p-8 sm:p-12 mb-8 border border-purple-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-8">{currentQ.text}</h2>
          <div className="space-y-4">
            {currentQ.options.map(opt => {
              const isSelected = answers[currentQ.text] === opt;
              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(currentQ.text, opt)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all font-medium text-lg
                    ${isSelected ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-100 hover:border-purple-200 hover:bg-gray-50'}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="mt-10 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!answers[currentQ.text] || loading}
              className="bg-purple-600 disabled:bg-gray-300 hover:bg-purple-700 text-white px-8 py-4 rounded-full font-bold shadow-md hover:shadow-xl transition-all flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : null}
              {currentStep < activeQuestions.length - 1 ? 'Next Question' : 'Ask PawPal AI'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
