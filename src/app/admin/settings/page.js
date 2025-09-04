'use client';
// app/admin/settings/page.js
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Navigation from '../../../components/Navigation';
import { 
  TrashIcon,
  CloudArrowUpIcon,
  Cog6ToothIcon,
  BookOpenIcon,
  UserIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeSection, setActiveSection] = useState('site');
  const [loading, setLoading] = useState(true);
  const [uploadingBook, setUploadingBook] = useState(false);
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'SSC Exam Tracker',
    maintenanceMode: false,
    registrationEnabled: true,
    maxUploadSize: 10,
    allowedFileTypes: ['pdf', 'doc', 'docx']
  });

  // New book form state
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    grade: '',
    category: '',
    file: null
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [blogsRes, booksRes, usersRes] = await Promise.all([
        fetch('/api/blogs'),
        fetch('/api/books'),
        fetch('/api/users')
      ]);
      
      if (blogsRes.ok) setBlogs(await blogsRes.json());
      if (booksRes.ok) setBooks(await booksRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
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
        setBlogs(blogs.filter(blog => blog.slug !== blogSlug));
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBooks(books.filter(book => book._id !== bookId));
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleBookUpload = async (e) => {
    e.preventDefault();
    if (!newBook.file || !newBook.title || !newBook.author) {
      alert('Please fill all required fields and select a file');
      return;
    }

    setUploadingBook(true);
    try {
      const formData = new FormData();
      formData.append('file', newBook.file);
      formData.append('title', newBook.title);
      formData.append('author', newBook.author);
      formData.append('description', newBook.description);
      formData.append('grade', newBook.grade);
      formData.append('category', newBook.category);

      const response = await fetch('/api/books/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const uploadedBook = await response.json();
        setBooks([...books, uploadedBook]);
        setNewBook({
          title: '',
          author: '',
          description: '',
          grade: '',
          category: '',
          file: null
        });
        alert('Book uploaded successfully!');
      } else {
        alert('Failed to upload book');
      }
    } catch (error) {
      console.error('Error uploading book:', error);
      alert('Error uploading book');
    } finally {
      setUploadingBook(false);
    }
  };

  const handleSiteSettingsUpdate = async () => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(siteSettings),
      });

      if (response.ok) {
        alert('Settings updated successfully!');
      } else {
        alert('Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Error updating settings');
    }
  };

  // Check if user is admin
  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">You don't have permission to access admin settings.</p>
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
            <div className="space-y-4">
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
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
          <div className="flex items-center space-x-3 mb-4">
            <Cog6ToothIcon className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-white">Admin Settings</h1>
          </div>
          <p className="text-gray-300">
            Manage site settings, content, and system configurations.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'site', name: 'Site Settings', icon: Cog6ToothIcon },
                { id: 'content', name: 'Content Management', icon: BookOpenIcon },
                { id: 'upload', name: 'Upload Books', icon: CloudArrowUpIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeSection === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Site Settings Tab */}
        {activeSection === 'site' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Site Configuration</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={siteSettings.siteName}
                    onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Max Upload Size (MB)
                  </label>
                  <input
                    type="number"
                    value={siteSettings.maxUploadSize}
                    onChange={(e) => setSiteSettings({...siteSettings, maxUploadSize: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={siteSettings.maintenanceMode}
                      onChange={(e) => setSiteSettings({...siteSettings, maintenanceMode: e.target.checked})}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-300">Maintenance Mode</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={siteSettings.registrationEnabled}
                      onChange={(e) => setSiteSettings({...siteSettings, registrationEnabled: e.target.checked})}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-300">Registration Enabled</span>
                  </label>
                </div>

                <button
                  onClick={handleSiteSettingsUpdate}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Update Settings
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Content Management Tab */}
        {activeSection === 'content' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Blog Management */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Blog Management</h2>
              
              {blogs.length === 0 ? (
                <p className="text-gray-400">No blogs found.</p>
              ) : (
                <div className="space-y-4">
                  {blogs.map((blog) => (
                    <div key={blog._id} className="bg-gray-700 rounded-lg p-4 flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{blog.title}</h3>
                        <p className="text-gray-300 text-sm mb-2">By {blog.authorName}</p>
                        <p className="text-gray-400 text-sm">{blog.comments?.length || 0} comments</p>
                      </div>
                      <button
                        onClick={() => handleDeleteBlog(blog.slug)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors duration-200"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Book Management */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Book Management</h2>
              
              {books.length === 0 ? (
                <p className="text-gray-400">No books found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {books.map((book) => (
                    <div key={book._id} className="bg-gray-700 rounded-lg p-4 flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">{book.title}</h3>
                        <p className="text-gray-300 text-sm mb-1">By {book.author}</p>
                        <p className="text-gray-400 text-sm">{book.downloads} downloads</p>
                      </div>
                      <button
                        onClick={() => handleDeleteBook(book._id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors duration-200"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Upload Books Tab */}
        {activeSection === 'upload' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Upload New Book</h2>
              
              <form onSubmit={handleBookUpload} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Book Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newBook.title}
                      onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Author *
                    </label>
                    <input
                      type="text"
                      required
                      value={newBook.author}
                      onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Grade
                    </label>
                    <select
                      value={newBook.grade}
                      onChange={(e) => setNewBook({...newBook, grade: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Grade</option>
                      <option value="Class 9">Class 9</option>
                      <option value="Class 10">Class 10</option>
                      <option value="SSC">SSC</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={newBook.category}
                      onChange={(e) => setNewBook({...newBook, category: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      <option value="Textbook">Textbook</option>
                      <option value="Reference">Reference</option>
                      <option value="Question Bank">Question Bank</option>
                      <option value="Guide">Guide</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    rows="4"
                    value={newBook.description}
                    onChange={(e) => setNewBook({...newBook, description: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Book File (PDF) *
                  </label>
                  <input
                    type="file"
                    required
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setNewBook({...newBook, file: e.target.files[0]})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploadingBook}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  <CloudArrowUpIcon className="h-5 w-5" />
                  <span>{uploadingBook ? 'Uploading...' : 'Upload Book'}</span>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}