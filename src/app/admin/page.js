'use client';
{/**app/adimn/page.js */}
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../../components/Navigation';
import { 
  TrashIcon,
  EyeIcon,
  UserIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function AdminPage() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [books, setBooks] = useState([]);
  const [activeTab, setActiveTab] = useState('blogs');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [blogsRes, booksRes] = await Promise.all([
        fetch('/api/blogs'),
        fetch('/api/books')
      ]);
      
      if (blogsRes.ok) {
        const blogsData = await blogsRes.json();
        setBlogs(blogsData);
      }
      
      if (booksRes.ok) {
        const booksData = await booksRes.json();
        setBooks(booksData);
      }
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

  const handleDeleteComment = async (blogSlug, commentIndex) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const blog = blogs.find(b => b.slug === blogSlug);
      const updatedComments = blog.comments.filter((_, index) => index !== commentIndex);
      
      const response = await fetch(`/api/blogs/${blogSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...blog,
          comments: updatedComments
        }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
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

  // Check if user is admin
  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">
            You don't have permission to access the admin panel.
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
            <div className="space-y-4">
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-700 rounded w-4/6"></div>
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
            <ShieldCheckIcon className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          </div>
          <p className="text-gray-300">
            Manage blogs, comments, and study resources. Use this panel responsibly.
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
                { id: 'blogs', name: 'Blogs', count: blogs.length },
                { id: 'books', name: 'Books', count: books.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  {tab.name} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Blogs Tab */}
        {activeTab === 'blogs' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Blog Management</h2>
            
            {blogs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No blogs found.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {blogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {blog.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                          <span className="flex items-center">
                            <UserIcon className="h-4 w-4 mr-1" />
                            {blog.authorName}
                          </span>
                          <span className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-300 line-clamp-2">
                          {blog.content.substring(0, 200)}...
                        </p>
                      </div> 
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleDeleteBlog(blog.slug)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors duration-200"
                          title="Delete Blog"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Comments */}
                    {blog.comments.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-lg font-medium text-white mb-3">
                          Comments ({blog.comments.length})
                        </h4>
                        <div className="space-y-3">
                          {blog.comments.map((comment, index) => (
                            <div
                              key={index}
                              className="bg-gray-700 rounded-lg p-3 border border-gray-600"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-white text-sm">
                                      {comment.userDisplayName}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-gray-300 text-sm">{comment.content}</p>
                                </div>
                                
                                <button
                                  onClick={() => handleDeleteComment(blog.slug, index)}
                                  className="bg-red-600 hover:bg-red-700 text-white p-1 rounded ml-2 transition-colors duration-200"
                                  title="Delete Comment"
                                >
                                  <TrashIcon className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Books Tab */}
        {activeTab === 'books' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Book Management</h2>
            
            {books.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No books found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                  <div
                    key={book._id}
                    className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-white line-clamp-2">
                        {book.title}
                      </h3>
                      <button
                        onClick={() => handleDeleteBook(book._id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors duration-200"
                        title="Delete Book"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {book.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>By {book.author}</span>
                      <span>{book.downloads} downloads</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-3">
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        {book.grade}
                      </span>
                      <span className="bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded">
                        {book.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Platform Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">{blogs.length}</div>
                <div className="text-gray-400">Total Blogs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">
                  {blogs.reduce((total, blog) => total + blog.comments.length, 0)}
                </div>
                <div className="text-gray-400">Total Comments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500">{books.length}</div>
                <div className="text-gray-400">Total Books</div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 