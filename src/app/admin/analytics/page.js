'use client';
// app/admin/analytics/page.js
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Navigation from '../../../components/Navigation';
import { 
  ChartBarIcon,
  UsersIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  TrendingUpIcon,
  ExclamationTriangleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

export default function AdminAnalyticsPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    users: {
      total: 0,
      student: 0,
      advanced: 0,
      admin: 0,
      online: 0,
      newToday: 0
    },
    content: {
      totalBlogs: 0,
      totalComments: 0,
      totalBooks: 0,
      totalDownloads: 0
    },
    activity: {
      pageViews: 0,
      uniqueVisitors: 0,
      averageSessionTime: 0,
      bounceRate: 0
    }
  });
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration - replace with real API calls
  const chartData = {
    userGrowth: [
      { date: '2025-01-01', users: 120 },
      { date: '2025-01-02', users: 135 },
      { date: '2025-01-03', users: 148 },
      { date: '2025-01-04', users: 162 },
      { date: '2025-01-05', users: 180 },
      { date: '2025-01-06', users: 195 },
      { date: '2025-01-07', users: 210 }
    ],
    roleDistribution: [
      { role: 'Student', count: 150, percentage: 75 },
      { role: 'Advanced', count: 35, percentage: 17.5 },
      { role: 'Admin', count: 15, percentage: 7.5 }
    ],
    topBooks: [
      { title: 'SSC Mathematics Guide', downloads: 245, author: 'Dr. Rahman' },
      { title: 'English Grammar Book', downloads: 198, author: 'Prof. Ahmed' },
      { title: 'Physics Solutions', downloads: 167, author: 'M.A. Khan' },
      { title: 'Chemistry Handbook', downloads: 134, author: 'S.R. Das' }
    ]
  };

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user, timeRange]);

  const fetchAnalytics = async () => {
    try {
      // Fetch real analytics data
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        // Mock data for demonstration
        setAnalytics({
          users: {
            total: 248,
            student: 186,
            advanced: 43,
            admin: 19,
            online: 34,
            newToday: 12
          },
          content: {
            totalBlogs: 89,
            totalComments: 342,
            totalBooks: 156,
            totalDownloads: 2847
          },
          activity: {
            pageViews: 12450,
            uniqueVisitors: 3240,
            averageSessionTime: 285,
            bounceRate: 24.6
          }
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Check if user is admin
  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">You don't have permission to access analytics.</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-32 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ChartBarIcon className="h-8 w-8 text-blue-500" />
              <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="1d">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 3 Months</option>
              </select>
            </div>
          </div>
          <p className="text-gray-300 mt-2">
            Monitor platform performance, user engagement, and system metrics.
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Users</p>
                <p className="text-3xl font-bold text-white">{analytics.users.total}</p>
                <p className="text-sm text-green-400">+{analytics.users.newToday} today</p>
              </div>
              <UsersIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Online Users</p>
                <p className="text-3xl font-bold text-white">{analytics.users.online}</p>
                <p className="text-sm text-blue-400">Currently active</p>
              </div>
              <EyeIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Books</p>
                <p className="text-3xl font-bold text-white">{analytics.content.totalBooks}</p>
                <p className="text-sm text-purple-400">{analytics.content.totalDownloads} downloads</p>
              </div>
              <BookOpenIcon className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Blogs</p>
                <p className="text-3xl font-bold text-white">{analytics.content.totalBlogs}</p>
                <p className="text-sm text-yellow-400">{analytics.content.totalComments} comments</p>
              </div>
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </motion.div>

        {/* User Role Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <UsersIcon className="h-6 w-6 mr-2 text-blue-500" />
              User Role Distribution
            </h3>
            
            <div className="space-y-4">
              {chartData.roleDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      item.role === 'Student' ? 'bg-blue-500' :
                      item.role === 'Advanced' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-gray-300">{item.role}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-white font-medium">{item.count}</span>
                    <span className="text-gray-400 text-sm">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Visual representation */}
            <div className="mt-6">
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-500 via-green-500 to-red-500 h-3 rounded-full" 
                     style={{width: '100%'}}></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>Students (75%)</span>
                <span>Advanced (17.5%)</span>
                <span>Admins (7.5%)</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <TrendingUpIcon className="h-6 w-6 mr-2 text-green-500" />
              Engagement Metrics
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Page Views</span>
                  <span className="text-white font-medium">{analytics.activity.pageViews.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '78%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Unique Visitors</span>
                  <span className="text-white font-medium">{analytics.activity.uniqueVisitors.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '65%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Avg. Session Time</span>
                  <span className="text-white font-medium">{formatTime(analytics.activity.averageSessionTime)}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{width: '42%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Bounce Rate</span>
                  <span className="text-white font-medium">{analytics.activity.bounceRate}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{width: '25%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Top Performing Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <BookOpenIcon className="h-6 w-6 mr-2 text-purple-500" />
              Top Downloaded Books
            </h3>
            
            <div className="space-y-4">
              {chartData.topBooks.map((book, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm">{book.title}</h4>
                    <p className="text-gray-400 text-xs">By {book.author}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{book.downloads}</p>
                    <p className="text-gray-400 text-xs">downloads</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <CalendarIcon className="h-6 w-6 mr-2 text-blue-500" />
              User Growth (Last 7 Days)
            </h3>
            
            <div className="space-y-3">
              {chartData.userGrowth.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <div className="flex items-center space-x-3 flex-1 ml-4">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{width: `${(day.users / 250) * 100}%`}}
                      ></div>
                    </div>
                    <span className="text-white font-medium text-sm w-12 text-right">{day.users}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Detailed Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Detailed Platform Statistics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500 mb-2">{analytics.users.student}</div>
              <div className="text-gray-300 font-medium">Student Users</div>
              <div className="text-gray-500 text-sm">Basic access level</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">{analytics.users.advanced}</div>
              <div className="text-gray-300 font-medium">Advanced Users</div>
              <div className="text-gray-500 text-sm">Premium features</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500 mb-2">{analytics.users.admin}</div>
              <div className="text-gray-300 font-medium">Admin Users</div>
              <div className="text-gray-500 text-sm">Full system access</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-500 mb-2">{analytics.content.totalDownloads}</div>
              <div className="text-gray-300 font-medium">Total Downloads</div>
              <div className="text-gray-500 text-sm">All-time count</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-500 mb-2">{analytics.content.totalComments}</div>
              <div className="text-gray-300 font-medium">Total Comments</div>
              <div className="text-gray-500 text-sm">Community engagement</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-500 mb-2">{analytics.activity.uniqueVisitors}</div>
              <div className="text-gray-300 font-medium">Unique Visitors</div>
              <div className="text-gray-500 text-sm">This period</div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}