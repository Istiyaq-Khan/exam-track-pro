'use client';

import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../../components/Navigation';
import { 
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function UnauthorizedPage() {
  const { user, userRole } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 p-4 rounded-full">
              <ExclamationTriangleIcon className="h-16 w-16 text-white" />
            </div>
          </div>

          {/* Main Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Access Denied
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            You don't have permission to access this page. This area is restricted based on your current role.
          </p>

          {/* Current Status */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8 max-w-md mx-auto">
            <h2 className="text-lg font-semibold text-white mb-4">Your Current Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Authentication:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  {user ? 'Signed In' : 'Not Signed In'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Current Role:</span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-600 text-white">
                  {userRole || 'Guest'}
                </span>
              </div>
            </div>
          </div>

          {/* Role Information */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Role-Based Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <h3 className="font-medium text-white mb-2">Student Role</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Access to exam tracking</li>
                  <li>• Study resources</li>
                  <li>• Community blog</li>
                  <li>• Basic motivational features</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-white mb-2">Advanced Role</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• All student features</li>
                  <li>• Premium study materials</li>
                  <li>• Advanced analytics</li>
                  <li>• Priority support</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-white mb-2">Admin Role</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• All advanced features</li>
                  <li>• User management</li>
                  <li>• Content moderation</li>
                  <li>• Platform analytics</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-white mb-2">Guest Access</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Browse public content</li>
                  <li>• Read blogs</li>
                  <li>• Access study resources</li>
                  <li>• View about page</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2">
                <HomeIcon className="h-5 w-5" />
                <span>Go to Home</span>
              </button>
            </Link>
            
            {!user && (
              <Link href="/">
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2">
                  <ShieldCheckIcon className="h-5 w-5" />
                  <span>Sign In</span>
                </button>
              </Link>
            )}
            
            {user && (
              <Link href="/exams">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2">
                  <ArrowLeftIcon className="h-5 w-5" />
                  <span>Go to Dashboard</span>
                </button>
              </Link>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              If you believe you should have access to this page, please contact an administrator.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 