'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../../components/Navigation';
import { 
  HeartIcon, 
  LightBulbIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  UserIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { getMotivationalAdvice } from '@/lib/gemini';

export default function MotivationalPage() {
  const { user } = useAuth();
  const [problem, setProblem] = useState('');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittedProblems, setSubmittedProblems] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!problem.trim()) return;

    setLoading(true);
    
    try {
      const motivationalAdvice = await getMotivationalAdvice(problem);
      setAdvice(motivationalAdvice);
      
      // Add to submitted problems
      const newProblem = {
        id: Date.now(),
        problem: problem,
        advice: motivationalAdvice,
        timestamp: new Date().toISOString()
      };
      
      setSubmittedProblems(prev => [newProblem, ...prev]);
      setProblem('');
    } catch (error) {
      console.error('Error getting advice:', error);
      setAdvice('Sorry, I encountered an error. Please try again with a different question.');
    } finally {
      setLoading(false);
    }
  };

  const motivationalQuotes = [
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "Education is the most powerful weapon which you can use to change the world. - Nelson Mandela",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
    "The journey of a thousand miles begins with one step. - Lao Tzu"
  ];

  const studyTips = [
    {
      title: "Create a Study Schedule",
      description: "Plan your study sessions in advance and stick to a consistent routine.",
      icon: "📅"
    },
    {
      title: "Use Active Learning",
      description: "Instead of just reading, try summarizing, teaching others, or creating mind maps.",
      icon: "🧠"
    },
    {
      title: "Take Regular Breaks",
      description: "Study in 25-minute focused sessions with 5-minute breaks in between.",
      icon: "⏰"
    },
    {
      title: "Practice Past Papers",
      description: "Familiarize yourself with exam patterns and question types.",
      icon: "📝"
    },
    {
      title: "Stay Organized",
      description: "Keep your notes, books, and study materials well-organized.",
      icon: "📚"
    },
    {
      title: "Get Enough Sleep",
      description: "A well-rested mind performs better than a tired one.",
      icon: "😴"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-full">
              <HeartIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Motivational Support
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Share your challenges and get AI-powered motivational advice to help you succeed in your SSC exams
          </p>
        </motion.div>

        {/* Daily Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 mb-12 text-center"
        >
          <SparklesIcon className="h-12 w-12 text-white mx-auto mb-4" />
          <blockquote className="text-white text-lg md:text-xl font-medium">
            "{motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}"
          </blockquote>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Problem Submission Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2 text-blue-500" />
              Share Your Challenge
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  What's troubling you?
                </label>
                <textarea
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  rows={6}
                  placeholder="Share your study challenges, exam anxiety, or any other concerns..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading || !problem.trim()}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Getting Advice...</span>
                  </>
                ) : (
                  <>
                    <LightBulbIcon className="h-5 w-5" />
                    <span>Get Motivational Advice</span>
                  </>
                )}
              </button>
            </form>

            {/* AI Response */}
            {advice && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg"
              >
                <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center">
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  AI Advice
                </h3>
                <p className="text-blue-200">{advice}</p>
              </motion.div>
            )}
          </motion.div>

          {/* Study Tips */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <LightBulbIcon className="h-6 w-6 mr-2 text-yellow-500" />
              Study Tips & Strategies
            </h2>
            
            <div className="space-y-4">
              {studyTips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg"
                >
                  <span className="text-2xl">{tip.icon}</span>
                  <div>
                    <h3 className="font-medium text-white mb-1">{tip.title}</h3>
                    <p className="text-sm text-gray-400">{tip.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Submitted Problems History */}
        {submittedProblems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <ClockIcon className="h-6 w-6 mr-2 text-green-500" />
              Your Previous Questions
            </h2>
            
            <div className="space-y-4">
              {submittedProblems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border border-gray-600 rounded-lg p-4"
                >
                  <div className="flex items-start space-x-3 mb-3">
                    <UserIcon className="h-5 w-5 text-blue-500 mt-1" />
                    <div className="flex-1">
                      <p className="text-white font-medium mb-2">Your Question:</p>
                      <p className="text-gray-300 mb-3">{item.problem}</p>
                      
                      <p className="text-blue-400 font-medium mb-2">AI Advice:</p>
                      <p className="text-gray-300">{item.advice}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-xs text-gray-500">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center mt-12"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Overcome Your Challenges?
          </h2>
          <p className="text-gray-300 mb-6">
            Remember, every successful student started with questions and concerns. 
            You're not alone in this journey!
          </p>
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-1 rounded-lg inline-block">
            <div className="bg-gray-900 rounded-lg px-8 py-3">
              <span className="text-white font-medium">
                Keep pushing forward! 💪
              </span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 