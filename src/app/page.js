'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';
import Navigation from '../components/Navigation';
import { 
  AcademicCapIcon,
  ChartBarIcon,
  BookOpenIcon,
  UserGroupIcon,
  StarIcon,
  RocketLaunchIcon, // Fixed: was RocketIcon
  ShieldCheckIcon,
  LightBulbIcon,
  CogIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { getMotivationalQuote } from '@/lib/gemini';
import Link from 'next/link';

export default function HomePage() {
  const { user, userRole, userData, hasPermission, isRole, isAtLeastRole } = useAuth();
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [isClient, setIsClient] = useState(false); // Fix hydration mismatch

  useEffect(() => {
    setIsClient(true); // Fix hydration mismatch
    fetchMotivationalQuote();
  }, []);

  const fetchMotivationalQuote = async () => {
    try {
      setQuoteLoading(true);
      const quote = await getMotivationalQuote();
      setMotivationalQuote(quote);
    } catch (error) {
      setMotivationalQuote("Success is not final, failure is not fatal: it is the courage to continue that counts.");
    } finally {
      setQuoteLoading(false);
    }
  };

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return null;
  }

  // Guest Landing Page
  const GuestLanding = () => (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full">
            <AcademicCapIcon className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">SSC Exams</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Join thousands of students using our comprehensive platform to track progress, 
          access study resources, and get AI-powered motivation for your SSC exam success.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
          >
            Explore Features
          </button>
          <button
            onClick={() => document.getElementById('cta').scrollIntoView({ behavior: 'smooth' })}
            className="border-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
          >
            Learn More
          </button>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        id="features"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {[
          {
            icon: BookOpenIcon,
            title: "Smart Exam Tracking",
            description: "Organize your subjects, track progress, and never miss important deadlines."
          },
          {
            icon: LightBulbIcon,
            title: "AI Motivation",
            description: "Get personalized advice and motivation from our advanced AI system."
          },
          {
            icon: UserGroupIcon,
            title: "Community Support",
            description: "Connect with fellow students, share experiences, and learn together."
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg w-fit mb-4">
              <feature.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Section */}
      <motion.div
        id="cta"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-12 border border-blue-500/30"
      >
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Transform Your Study Experience?
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Join our platform today and start your journey towards SSC exam success. 
          It's completely free to get started!
        </p>
        <button
          onClick={() => document.getElementById('signup').scrollIntoView({ behavior: 'smooth' })}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
        >
          Get Started Now
        </button>
      </motion.div>

      {/* Sign Up Section */}
      <motion.div
        id="signup"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-4">
          Start Your Journey Today
        </h2>
        <p className="text-gray-300 mb-8">
          Sign up with Google and begin your SSC exam preparation journey
        </p>
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 max-w-md mx-auto">
          <p className="text-gray-400 mb-6">
            Quick and secure sign-up with your Google account
          </p>
          <button className="w-full bg-white hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>
        </div>
      </motion.div>
    </div>
  );

  // Student Landing Page
  const StudentLanding = () => (
    <div className="space-y-16">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-full">
            <StarIcon className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">{userData?.displayName}</span>!
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Continue your SSC exam preparation journey with personalized tools and resources.
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          {
            title: "Exam Dashboard",
            description: "Track your exam progress",
            icon: ChartBarIcon,
            href: "/exams",
            color: "from-blue-600 to-blue-700"
          },
          {
            title: "Study Resources",
            description: "Access books and materials",
            icon: BookOpenIcon,
            href: "/books",
            color: "from-green-600 to-green-700"
          },
          {
            title: "Community Blog",
            description: "Share and read experiences",
            icon: UserGroupIcon,
            href: "/blogs",
            color: "from-purple-600 to-purple-700"
          },
          {
            title: "Get Motivated",
            description: "AI-powered inspiration",
            icon: LightBulbIcon,
            href: "/motivational",
            color: "from-orange-600 to-orange-700"
          }
        ].map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            className="group"
          >
            <Link href={action.href}>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 group-hover:transform group-hover:scale-105 cursor-pointer">
                <div className={`bg-gradient-to-r ${action.color} p-3 rounded-lg w-fit mb-4`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
                <div className="mt-4 flex items-center text-blue-400 group-hover:text-blue-300 transition-colors duration-200">
                  <span className="text-sm font-medium">Get Started</span>
                  <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Progress Summary */}
      {userData && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gray-800 rounded-xl p-8 border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Progress Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">{userData.loginCount}</div>
              <div className="text-gray-400">Total Logins</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">{userData.examProgress?.totalExams || 0}</div>
              <div className="text-gray-400">Exams Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-2">{userData.studyStreak?.currentStreak || 0}</div>
              <div className="text-gray-400">Day Streak</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );

  // Advanced Learner Landing Page
  const AdvancedLanding = () => (
    <div className="space-y-16">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-full">
            <RocketLaunchIcon className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Advanced Learner</span>!
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          You've unlocked premium features and advanced tools to accelerate your SSC exam preparation.
        </p>
      </motion.div>

      {/* Premium Features */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-8 border border-purple-500/30">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
            <StarIcon className="h-6 w-6 mr-2 text-purple-400" />
            Premium Resources
          </h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
              Advanced study materials
            </li>
            <li className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
              Priority access to new features
            </li>
            <li className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
              Enhanced analytics and insights
            </li>
          </ul>
        </div>
        
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl p-8 border border-blue-500/30">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
            <CogIcon className="h-6 w-6 mr-2 text-blue-400" />
            Advanced Tools
          </h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
              Advanced exam analytics
            </li>
            <li className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
              Custom study schedules
            </li>
            <li className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
              Performance tracking
            </li>
          </ul>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          {
            title: "Advanced Dashboard",
            description: "Access premium features",
            icon: ChartBarIcon,
            href: "/advanced/dashboard",
            color: "from-purple-600 to-pink-600"
          },
          {
            title: "Study Resources",
            description: "Premium materials",
            icon: BookOpenIcon,
            href: "/books",
            color: "from-blue-600 to-cyan-600"
          },
          {
            title: "Community",
            description: "Connect with peers",
            icon: UserGroupIcon,
            href: "/blogs",
            color: "from-green-600 to-emerald-600"
          }
        ].map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            className="group"
          >
            <Link href={action.href}>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 group-hover:transform group-hover:scale-105 cursor-pointer">
                <div className={`bg-gradient-to-r ${action.color} p-3 rounded-lg w-fit mb-4`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
                <div className="mt-4 flex items-center text-purple-400 group-hover:text-purple-300 transition-colors duration-200">
                  <span className="text-sm font-medium">Access Now</span>
                  <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );

  // Admin Landing Page
  const AdminLanding = () => (
    <div className="space-y-16">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 p-4 rounded-full">
            <ShieldCheckIcon className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Administrator</span>!
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          You have full access to manage the platform, moderate content, and oversee user activities.
        </p>
      </motion.div>

      {/* Admin Controls */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          {
            title: "User Management",
            description: "Manage user roles and permissions",
            icon: UserGroupIcon,
            href: "/admin/users",
            color: "from-red-600 to-red-700"
          },
          {
            title: "Content Moderation",
            description: "Moderate blogs and comments",
            icon: ShieldCheckIcon,
            href: "/admin",
            color: "from-orange-600 to-orange-700"
          },
          {
            title: "Platform Analytics",
            description: "View platform statistics",
            icon: ChartBarIcon,
            href: "/admin/analytics",
            color: "from-blue-600 to-blue-700"
          },
          {
            title: "System Settings",
            description: "Configure platform settings",
            icon: CogIcon,
            href: "/admin/settings",
            color: "from-purple-600 to-purple-700"
          }
        ].map((control, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            className="group"
          >
            <Link href={control.href}>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 group-hover:transform group-hover:scale-105 cursor-pointer">
                <div className={`bg-gradient-to-r ${control.color} p-3 rounded-lg w-fit mb-4`}>
                  <control.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{control.title}</h3>
                <p className="text-gray-400 text-sm">{control.description}</p>
                <div className="mt-4 flex items-center text-red-400 group-hover:text-red-300 transition-colors duration-200">
                  <span className="text-sm font-medium">Manage</span>
                  <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-xl p-8 border border-red-500/30"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Platform Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">Admin</div>
            <div className="text-gray-400">Full Access</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400 mb-2">Content</div>
            <div className="text-gray-400">Moderation</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">Users</div>
            <div className="text-gray-400">Management</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">System</div>
            <div className="text-gray-400">Control</div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Render appropriate landing page based on user role
  const renderLandingPage = () => {
    if (!user) return <GuestLanding />;
    
    switch (userRole) {
      case 'student':
        return <StudentLanding />;
      case 'advanced':
        return <AdvancedLanding />;
      case 'admin':
        return <AdminLanding />;
      default:
        return <GuestLanding />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Motivational Quote Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-8 border border-blue-500/30 text-center">
            <SparklesIcon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            {quoteLoading ? (
              <div className="animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
              </div>
            ) : (
              <blockquote className="text-white text-lg md:text-xl font-medium">
                "{motivationalQuote}"
              </blockquote>
            )}
            <button
              onClick={fetchMotivationalQuote}
              className="mt-4 text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200"
            >
              Get New Quote
            </button>
          </div>
        </motion.div>

        {/* Role-Based Landing Page Content */}
        {renderLandingPage()}
      </main>
    </div>
  );
}