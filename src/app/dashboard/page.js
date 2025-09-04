'use client';
// app/dashboard/page.js
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../../components/Navigation';
import { 
  UserIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  AcademicCapIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon,
  UsersIcon,
  EnvelopeIcon,
  LinkIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';

export default function UserDashboard() {
  const { user, userData } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [userBlogs, setUserBlogs] = useState([]);
  const [userExams, setUserExams] = useState([]);
  const [connectedStudents, setConnectedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [studentUid, setStudentUid] = useState('');
  const [message, setMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    if (user && userData) {
      fetchUserData();
    }
  }, [user, userData]);

  const fetchUserData = async () => {
    try {
      const [blogsRes, examsRes, studentsRes] = await Promise.all([
        fetch(`/api/blogs?author=${user.uid}`),
        fetch(`/api/exams?userId=${user.uid}`),
        userData.role === 'teacher' ? fetch(`/api/users/connected/${user.uid}`) : Promise.resolve({ ok: false })
      ]);
      
      if (blogsRes.ok) {
        const blogs = await blogsRes.json();
        setUserBlogs(blogs);
      }
      
      if (examsRes.ok) {
        const exams = await examsRes.json();
        setUserExams(exams);
      }
      
      if (studentsRes.ok) {
        const students = await studentsRes.json();
        setConnectedStudents(students);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (blogSlug) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      const response = await fetch(`/api/blogs/${blogSlug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUserBlogs(userBlogs.filter(blog => blog.slug !== blogSlug));
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleConnectStudent = async (e) => {
    e.preventDefault();
    if (!studentUid.trim()) return;

    try {
      const response = await fetch('/api/users/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacherId: user.uid,
          studentUid: studentUid.trim()
        }),
      });

      if (response.ok) {
        const connectedStudent = await response.json();
        setConnectedStudents([...connectedStudents, connectedStudent]);
        setStudentUid('');
        setShowConnectModal(false);
        alert('Student connected successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to connect student');
      }
    } catch (error) {
      console.error('Error connecting student:', error);
      alert('Error connecting student');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedStudent) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromId: user.uid,
          toId: selectedStudent.uid,
          message: message.trim(),
          type: 'teacher_to_student'
        }),
      });

      if (response.ok) {
        setMessage('');
        setShowMessageModal(false);
        alert('Message sent successfully!');
      } else {
        alert('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message');
    }
  };

  const copyStudentUid = () => {
    navigator.clipboard.writeText(user.uid);
    alert('Your Student UID copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1,2,3].map(i => (
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
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full overflow-hidden">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {user.displayName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Welcome, {user.displayName}</h1>
                <div className="flex items-center space-x-3 mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    userData.role === 'admin' ? 'bg-red-600 text-white' :
                    userData.role === 'advanced' ? 'bg-green-600 text-white' :
                    userData.role === 'teacher' ? 'bg-purple-600 text-white' :
                    'bg-blue-600 text-white'
                  }`}>
                    {userData.role?.charAt(0).toUpperCase() + userData.role?.slice(1)}
                  </span>
                  {(userData.role === 'student' || userData.role === 'advanced') && (
                    <button
                      onClick={copyStudentUid}
                      className="text-gray-400 hover:text-white text-sm flex items-center space-x-1"
                      title="Copy your Student UID"
                    >
                      <ClipboardDocumentIcon className="h-4 w-4" />
                      <span>UID: {user.uid.substring(0, 8)}...</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {userData.role === 'teacher' && (
              <button
                onClick={() => setShowConnectModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <LinkIcon className="h-5 w-5" />
                <span>Connect Student</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">My Blogs</p>
                <p className="text-3xl font-bold text-white">{userBlogs.length}</p>
              </div>
              <BookOpenIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">My Exams</p>
                <p className="text-3xl font-bold text-white">{userExams.length}</p>
              </div>
              <AcademicCapIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  {userData.role === 'teacher' ? 'Connected Students' : 'Comments'}
                </p>
                <p className="text-3xl font-bold text-white">
                  {userData.role === 'teacher' ? connectedStudents.length : 
                   userBlogs.reduce((total, blog) => total + (blog.comments?.length || 0), 0)}
                </p>
              </div>
              {userData.role === 'teacher' ? (
                <UsersIcon className="h-8 w-8 text-purple-500" />
              ) : (
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-yellow-500" />
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Study Streak</p>
                <p className="text-3xl font-bold text-white">{userData.studyStreak?.currentStreak || 0}</p>
                <p className="text-sm text-orange-400">days</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: UserIcon },
                { id: 'blogs', name: 'My Blogs', icon: BookOpenIcon },
                { id: 'exams', name: 'My Exams', icon: AcademicCapIcon },
                ...(userData.role === 'teacher' ? [{ id: 'students', name: 'My Students', icon: UsersIcon }] : [])
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {userBlogs.slice(0, 3).map((blog) => (
                    <div key={blog._id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-white text-sm">{blog.title}</p>
                        <p className="text-gray-400 text-xs">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {userBlogs.length === 0 && (
                    <p className="text-gray-400 text-sm">No recent activity</p>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <PlusIcon className="h-5 w-5 text-blue-500" />
                      <span className="text-white">Create New Blog</span>
                    </div>
                  </button>
                  <button className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <CalendarIcon className="h-5 w-5 text-green-500" />
                      <span className="text-white">Schedule Exam</span>
                    </div>
                  </button>
                  <button className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <BookOpenIcon className="h-5 w-5 text-purple-500" />
                      <span className="text-white">Browse Study Materials</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* My Blogs Tab */}
        {activeTab === 'blogs' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">My Blogs</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2">
                <PlusIcon className="h-5 w-5" />
                <span>New Blog</span>
              </button>
            </div>

            {userBlogs.length === 0 ? (
              <div className="text-center py-12">
                <BookOpenIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">You haven't written any blogs yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userBlogs.map((blog) => (
                  <div key={blog._id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{blog.title}</h3>
                        <p className="text-gray-300 mb-4">
                          {blog.content.substring(0, 150)}...
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                            {blog.comments?.length || 0} comments
                          </span>
                          <span className="flex items-center">
                            <EyeIcon className="h-4 w-4 mr-1" />
                            {blog.views || 0} views
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => window.open(`/blogs/${blog.slug}`, '_blank')}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors duration-200"
                          title="View Blog"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog.slug)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors duration-200"
                          title="Delete Blog"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* My Exams Tab */}
        {activeTab === 'exams' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">My Exams</h2>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2">
                <PlusIcon className="h-5 w-5" />
                <span>Add Exam</span>
              </button>
            </div>

            {userExams.length === 0 ? (
              <div className="text-center py-12">
                <AcademicCapIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No exams scheduled yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userExams.map((exam) => (
                  <div key={exam._id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-2">{exam.name}</h3>
                    <div className="space-y-2 text-sm text-gray-400">
                      <p>Date: {new Date(exam.date).toLocaleDateString()}</p>
                      <p>Subject: {exam.subject}</p>
                      <p>Status: <span className={`font-medium ${
                        exam.status === 'completed' ? 'text-green-400' :
                        exam.status === 'upcoming' ? 'text-blue-400' : 'text-yellow-400'
                      }`}>{exam.status}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Teacher's Students Tab */}
        {activeTab === 'students' && userData.role === 'teacher' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">My Students</h2>
              <span className="text-gray-400">{connectedStudents.length} connected</span>
            </div>

            {connectedStudents.length === 0 ? (
              <div className="text-center py-12">
                <UsersIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No students connected yet.</p>
                <p className="text-sm text-gray-500">
                  Ask students to share their Student UID with you to connect.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {connectedStudents.map((student) => (
                  <div key={student.uid} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        {student.photoURL ? (
                          <img src={student.photoURL} alt="Student" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-purple-600 flex items-center justify-center">
                            <span className="text-white font-bold">
                              {student.displayName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{student.displayName}</h3>
                        <p className="text-sm text-gray-400">{student.role}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-400 mb-4">
                      <p>Blogs: {student.blogCount || 0}</p>
                      <p>Exams: {student.examCount || 0}</p>
                      <p>Study Streak: {student.studyStreak?.currentStreak || 0} days</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setSelectedStudent(student);
                        setShowMessageModal(true);
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <EnvelopeIcon className="h-4 w-4" />
                      <span>Send Message</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Connect Student Modal */}
        {showConnectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">Connect with Student</h3>
              
              <form onSubmit={handleConnectStudent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Student UID</label>
                  <input
                    type="text"
                    value={studentUid}
                    onChange={(e) => setStudentUid(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter student's unique ID"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Ask the student to share their Student UID from their dashboard.
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowConnectModal(false)}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Connect Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Send Message Modal */}
        {showMessageModal && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">
                Send Message to {selectedStudent.displayName}
              </h3>
              
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <textarea
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Type your message here..."
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMessageModal(false);
                      setSelectedStudent(null);
                      setMessage('');
                    }}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                  >
                    <EnvelopeIcon className="h-4 w-4" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}