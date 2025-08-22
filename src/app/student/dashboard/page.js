'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Navigation from '../../../components/Navigation';
import { 
  ChartBarIcon,
  BookOpenIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  TrophyIcon,
  TrendingUpIcon,
  TargetIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function StudentDashboard() {
  const { user, userData, isRole, canAccessRoute } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchExams();
    }
  }, [user]);

  const fetchExams = async () => {
    try {
      const response = await fetch('/api/exams');
      if (response.ok) {
        const data = await response.json();
        setExams(data);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if user can access this route
  if (!canAccessRoute('/student')) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">
            You don't have permission to access the student dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const calculateProgress = (exam) => {
    if (!exam.subjects || exam.subjects.length === 0) return 0;
    const totalTodos = exam.subjects.reduce((sum, subject) => sum + (subject.todos?.length || 0), 0);
    const completedTodos = exam.subjects.reduce((sum, subject) => 
      sum + (subject.todos?.filter(todo => todo.isCompleted)?.length || 0), 0
    );
    return totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;
  };

  const getUpcomingExams = () => {
    const now = new Date();
    return exams
      .filter(exam => new Date(exam.endDate) > now)
      .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
      .slice(0, 3);
  };

  const getDaysUntil = (date) => {
    const now = new Date();
    const examDate = new Date(date);
    const diffTime = examDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Student Dashboard</h1>
          <p className="text-gray-400">
            Welcome back, {userData?.displayName}! Track your progress and manage your exams.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center">
              <BookOpenIcon className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-gray-400 text-sm">Total Exams</p>
                <p className="text-2xl font-bold text-white">{exams.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-2xl font-bold text-white">
                  {exams.filter(exam => new Date(exam.endDate) < new Date()).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-gray-400 text-sm">Active</p>
                <p className="text-2xl font-bold text-white">
                  {exams.filter(exam => new Date(exam.endDate) > new Date()).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center">
              <TrendingUpIcon className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-gray-400 text-sm">Avg Progress</p>
                <p className="text-2xl font-bold text-white">
                  {exams.length > 0 
                    ? Math.round(exams.reduce((sum, exam) => sum + calculateProgress(exam), 0) / exams.length)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Exams */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Upcoming Exams</h2>
              <Link 
                href="/exams"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            {getUpcomingExams().length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No upcoming exams</p>
                <Link 
                  href="/exams"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium mt-2 inline-block"
                >
                  Create your first exam
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {getUpcomingExams().map((exam) => (
                  <div key={exam._id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-white">{exam.name}</h3>
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        {exam.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        {getDaysUntil(exam.endDate)} days left
                      </span>
                      <span className="text-gray-300">
                        {calculateProgress(exam)}% complete
                      </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${calculateProgress(exam)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Study Streak & Goals */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Study Streak</h2>
            
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-green-500 mb-2">
                {userData?.studyStreak?.currentStreak || 0}
              </div>
              <div className="text-gray-400">Current Streak (days)</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500 mb-1">
                  {userData?.studyStreak?.longestStreak || 0}
                </div>
                <div className="text-gray-400 text-sm">Longest Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500 mb-1">
                  {userData?.loginCount || 0}
                </div>
                <div className="text-gray-400 text-sm">Total Logins</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg p-4 border border-green-500/30">
              <h3 className="font-medium text-white mb-2">Today's Goal</h3>
              <p className="text-gray-300 text-sm">
                Complete at least one subject's to-do list to maintain your streak!
              </p>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/exams">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 cursor-pointer group">
                <div className="bg-blue-600 p-3 rounded-lg w-fit mb-4">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Manage Exams</h3>
                <p className="text-gray-400 text-sm">Create, edit, and track your exam progress</p>
              </div>
            </Link>
            
            <Link href="/books">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 cursor-pointer group">
                <div className="bg-green-600 p-3 rounded-lg w-fit mb-4">
                  <BookOpenIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Study Resources</h3>
                <p className="text-gray-400 text-sm">Access books and study materials</p>
              </div>
            </Link>
            
            <Link href="/motivational">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 cursor-pointer group">
                <div className="bg-purple-600 p-3 rounded-lg w-fit mb-4">
                  <TrophyIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Get Motivated</h3>
                <p className="text-gray-400 text-sm">Receive AI-powered motivation and tips</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 