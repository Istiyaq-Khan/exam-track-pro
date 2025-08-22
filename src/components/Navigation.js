'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../app/contexts/AuthContext';
import { 
  Bars3Icon, 
  XMarkIcon,
  AcademicCapIcon,
  BookOpenIcon,
  UserGroupIcon,
  HeartIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
  RocketIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline';

export default function Navigation() {
  const { user, userRole, userData, signInWithGoogle, logout, hasPermission, isRole, isAtLeastRole } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navigationItems = [
    { name: 'Home', href: '/', icon: AcademicCapIcon, public: true },
    { name: 'Exams', href: '/exams', icon: ChartBarIcon, public: false, roles: ['student', 'advanced', 'admin'] },
    { name: 'Blogs', href: '/blogs', icon: UserGroupIcon, public: true },
    { name: 'Books', href: '/books', icon: BookOpenIcon, public: true },
    { name: 'Motivational', href: '/motivational', icon: HeartIcon, public: true },
    { name: 'About', href: '/about', icon: InformationCircleIcon, public: true },
  ];

  // Add role-specific navigation items
  if (isAtLeastRole('advanced')) {
    navigationItems.push(
      { name: 'Advanced', href: '/advanced/dashboard', icon: RocketIcon, public: false, roles: ['advanced', 'admin'] }
    );
  }

  if (isRole('admin')) {
    navigationItems.push(
      { name: 'Admin', href: '/admin', icon: ShieldCheckIcon, public: false, roles: ['admin'] }
    );
  }

  const canAccessItem = (item) => {
    if (item.public) return true;
    if (!user) return false;
    if (!item.roles) return true;
    return item.roles.includes(userRole);
  };

  const filteredNavigationItems = navigationItems.filter(canAccessItem);

  return (
    <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">SSC Exam Pro</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {filteredNavigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Role Badge */}
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    userRole === 'admin' ? 'bg-red-600 text-white' :
                    userRole === 'advanced' ? 'bg-purple-600 text-white' :
                    userRole === 'student' ? 'bg-green-600 text-white' :
                    'bg-gray-600 text-white'
                  }`}>
                    {userRole?.charAt(0).toUpperCase() + userRole?.slice(1) || 'Guest'}
                  </span>
                </div>

                {/* User Profile */}
                <div className="flex items-center space-x-3">
                  {user.photoURL && (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.photoURL}
                      alt={user.displayName}
                    />
                  )}
                  <span className="text-gray-300 text-sm font-medium">
                    {user.displayName}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <ShieldCheckIcon className="h-4 w-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white p-2 rounded-md"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-800 border-t border-gray-700"
          >
            <div className="px-4 py-4 space-y-2">
              {/* Navigation Items */}
              {filteredNavigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center space-x-3"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}

              {/* Divider */}
              <div className="border-t border-gray-700 my-4"></div>

              {/* User Section */}
              {user ? (
                <div className="space-y-3">
                  {/* User Info */}
                  <div className="px-3 py-2">
                    <div className="flex items-center space-x-3 mb-2">
                      {user.photoURL && (
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.photoURL}
                          alt={user.displayName}
                        />
                      )}
                      <div>
                        <p className="text-white font-medium">{user.displayName}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          userRole === 'admin' ? 'bg-red-600 text-white' :
                          userRole === 'advanced' ? 'bg-purple-600 text-white' :
                          userRole === 'student' ? 'bg-green-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {userRole?.charAt(0).toUpperCase() + userRole?.slice(1) || 'Guest'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    signInWithGoogle();
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <ShieldCheckIcon className="h-4 w-4" />
                  <span>Sign In with Google</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
} 