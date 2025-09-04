'use client';
// app/login/page.js
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

export default function LoginPage() {
  const { signInWithGoogle } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    userType: 'student'
  });

  const [signupForm, setSignupForm] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'student',
    studentId: '', // For students/advanced users
    teacherCode: '', // For teachers
    schoolName: ''
  });

  const userTypes = [
    {
      id: 'student',
      name: 'Student',
      icon: UserIcon,
      description: 'Access study materials and track your exam progress',
      color: 'blue'
    },
    {
      id: 'advanced',
      name: 'Advanced Student',
      icon: AcademicCapIcon,
      description: 'Premium features and advanced study tools',
      color: 'green'
    },
    {
      id: 'teacher',
      name: 'Teacher',
      icon: ShieldCheckIcon,
      description: 'Monitor students and provide guidance',
      color: 'purple'
    }
  ];

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithGoogle();
      if (result) {
        router.push('/');
      }
    } catch (error) {
      console.error('Google sign in failed:', error);
      alert('Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Add your email login logic here
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(data.redirectUrl || '/');
      } else {
        const error = await response.json();
        alert(error.message || 'Login failed');
      }
    } catch (error) {
      console.error('Email login failed:', error);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    
    if (signupForm.password !== signupForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (signupForm.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupForm),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Account created successfully! Please check your email for verification.');
        setIsLogin(true);
      } else {
        const error = await response.json();
        alert(error.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Email signup failed:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type, shade = '500') => {
    const colors = {
      student: `text-blue-${shade}`,
      advanced: `text-green-${shade}`,
      teacher: `text-purple-${shade}`
    };
    return colors[type] || `text-blue-${shade}`;
  };

  const getTypeBgColor = (type, selected = false) => {
    const colors = {
      student: selected ? 'bg-blue-600' : 'bg-blue-600/20 hover:bg-blue-600/30',
      advanced: selected ? 'bg-green-600' : 'bg-green-600/20 hover:bg-green-600/30',
      teacher: selected ? 'bg-purple-600' : 'bg-purple-600/20 hover:bg-purple-600/30'
    };
    return colors[type] || (selected ? 'bg-blue-600' : 'bg-blue-600/20 hover:bg-blue-600/30');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Welcome Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <div className="mb-8">
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                Welcome to
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  {' '}SSC Tracker
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Your comprehensive platform for SSC exam preparation and academic excellence
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-300">Track your exam progress</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-300">Access study materials</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-300">Connect with teachers</span>
              </div>
            </div>

            <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
              ← Back to Home
            </Link>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl"
          >
            {/* Login/Signup Toggle */}
            <div className="flex rounded-lg bg-gray-700 p-1 mb-8">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  isLogin ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  !isLogin ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* User Type Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Select Your Role</h3>
              <div className="grid grid-cols-1 gap-3">
                {userTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = activeTab === type.id;
                  
                  return (
                    <button
                      key={type.id}
                      onClick={() => {
                        setActiveTab(type.id);
                        if (isLogin) {
                          setLoginForm({...loginForm, userType: type.id});
                        } else {
                          setSignupForm({...signupForm, userType: type.id});
                        }
                      }}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        isSelected 
                          ? `border-${type.color}-500 ${getTypeBgColor(type.id, true)}` 
                          : `border-gray-600 ${getTypeBgColor(type.id, false)}`
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-6 w-6 ${getTypeColor(type.id)}`} />
                        <div className="flex-1">
                          <h4 className={`font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                            {type.name}
                          </h4>
                          <p className={`text-sm ${isSelected ? 'text-gray-200' : 'text-gray-400'}`}>
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-3 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>{loading ? 'Signing in...' : `Continue with Google as ${userTypes.find(t => t.id === activeTab)?.name}`}</span>
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">Or continue with email</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={isLogin ? handleEmailLogin : handleEmailSignup} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={signupForm.displayName}
                    onChange={(e) => setSignupForm({...signupForm, displayName: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <EnvelopeIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={isLogin ? loginForm.email : signupForm.email}
                    onChange={(e) => {
                      if (isLogin) {
                        setLoginForm({...loginForm, email: e.target.value});
                      } else {
                        setSignupForm({...signupForm, email: e.target.value});
                      }
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <LockClosedIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={isLogin ? loginForm.password : signupForm.password}
                    onChange={(e) => {
                      if (isLogin) {
                        setLoginForm({...loginForm, password: e.target.value});
                      } else {
                        setSignupForm({...signupForm, password: e.target.value});
                      }
                    }}
                    className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                  <div className="relative">
                    <LockClosedIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
              )}

              {/* Additional Fields for Signup */}
              {!isLogin && (
                <>
                  {activeTab === 'teacher' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Teacher Code</label>
                      <input
                        type="text"
                        value={signupForm.teacherCode}
                        onChange={(e) => setSignupForm({...signupForm, teacherCode: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter teacher verification code"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Student ID</label>
                      <input
                        type="text"
                        value={signupForm.studentId}
                        onChange={(e) => setSignupForm({...signupForm, studentId: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your student ID (optional)"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">School/Institution</label>
                    <input
                      type="text"
                      value={signupForm.schoolName}
                      onChange={(e) => setSignupForm({...signupForm, schoolName: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your school name (optional)"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  getTypeBgColor(activeTab, true)
                } text-white hover:opacity-90`}
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                  </span>
                ) : (
                  `${isLogin ? 'Sign In' : 'Create Account'} as ${userTypes.find(t => t.id === activeTab)?.name}`
                )}
              </button>
            </form>

            {isLogin && (
              <div className="mt-4 text-center">
                <Link href="/forgot-password" className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200">
                  Forgot your password?
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}