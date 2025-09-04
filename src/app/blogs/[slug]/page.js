'use client';
// app/blogs/[slug]/page.js

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Navigation from '../../../components/Navigation';
import { 
  HeartIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
  UserIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function BlogPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/blogs/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setBlog(data);
      } else {
        console.error('Failed to fetch blog:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/blogs/${slug}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.uid }),
      });

      if (response.ok) {
        fetchBlog();
      }
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    
    if (!user || !comment.trim()) return;

    try {
      const response = await fetch(`/api/blogs/${slug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          userDisplayName: user.displayName,
          userPhotoURL: user.photoURL,
          content: comment
        }),
      });

      if (response.ok) {
        setComment('');
        fetchBlog();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="h-96 bg-gray-700 rounded mb-8"></div>
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

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Blog Not Found</h1>
          <p className="text-gray-400 mb-6">The blog post you're looking for doesn't exist.</p>
          <Link
            href="/blogs"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            href="/blogs"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Blogs
          </Link>
        </motion.div>

        {/* Blog Header */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {blog.title}
          </h1>
          
          <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {blog.authorPhotoURL && (
                  <img
                    src={blog.authorPhotoURL}
                    alt={blog.authorName}
                    className="h-6 w-6 rounded-full"
                  />
                )}
                <UserIcon className="h-4 w-4" />
                <span>{blog.authorName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4" />
                <span>{new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                disabled={!user}
                className={`flex items-center space-x-1 transition-colors duration-200 ${
                  blog.likes.includes(user?.uid) 
                    ? 'text-red-500' 
                    : 'text-gray-400 hover:text-red-500'
                } ${!user ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <HeartIcon className="h-5 w-5" />
                <span>{blog.likes.length}</span>
              </button>
              
              <div className="flex items-center space-x-1 text-gray-400">
                <ChatBubbleLeftIcon className="h-5 w-5" />
                <span>{blog.comments.length}</span>
              </div>
            </div>
          </div>

          {/* Blog Image */}
          {blog.image && (
            <div className="mb-8">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Blog Content - Render HTML */}
          <div className="prose prose-invert prose-lg max-w-none">
            <div 
              className="text-gray-300 leading-relaxed blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </motion.article>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            Comments ({blog.comments.length})
          </h2>

          {/* Add Comment */}
          {user ? (
            <form onSubmit={handleComment} className="mb-8">
              <div className="flex items-start space-x-3">
                <img
                  src={user.photoURL || '/default-avatar.png'}
                  alt={user.displayName}
                  className="h-10 w-10 rounded-full"
                  onError={(e) => {
                    e.target.src = '/default-avatar.png';
                  }}
                />
                <div className="flex-1">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    placeholder="Write a comment..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    required
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="mb-8 text-center py-4 bg-gray-700 rounded-lg">
              <p className="text-gray-400 mb-2">Please log in to comment</p>
              <Link
                href="/login"
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Login here
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {blog.comments.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              blog.comments.map((comment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="border border-gray-600 rounded-lg p-4"
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={comment.userPhotoURL || '/default-avatar.png'}
                      alt={comment.userDisplayName}
                      className="h-8 w-8 rounded-full"
                      onError={(e) => {
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-white">
                          {comment.userDisplayName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-gray-300 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Google Ads Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <p className="text-gray-400 mb-4">Advertisement Space</p>
            <div className="bg-gray-700 h-32 rounded flex items-center justify-center">
              <span className="text-gray-500">Google AdSense</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Custom CSS for blog content styling */}
      <style jsx global>{`
        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4,
        .blog-content h5,
        .blog-content h6 {
          margin: 1.5rem 0 0.75rem 0;
          font-weight: bold;
          line-height: 1.3;
        }

        .blog-content h1 {
          font-size: 2rem;
          color: #f3f4f6;
        }

        .blog-content h2 {
          font-size: 1.75rem;
          color: #f3f4f6;
        }

        .blog-content h3 {
          font-size: 1.5rem;
          color: #e5e7eb;
        }

        .blog-content h4 {
          font-size: 1.25rem;
          color: #e5e7eb;
        }

        .blog-content h5 {
          font-size: 1.1rem;
          color: #e5e7eb;
        }

        .blog-content h6 {
          font-size: 1rem;
          color: #e5e7eb;
        }

        .blog-content p {
          margin: 1rem 0;
          line-height: 1.7;
          color: #d1d5db;
        }

        .blog-content ul,
        .blog-content ol {
          margin: 1rem 0;
          padding-left: 2rem;
          color: #d1d5db;
        }

        .blog-content li {
          margin: 0.5rem 0;
          line-height: 1.6;
        }

        .blog-content ul {
          list-style-type: disc;
        }

        .blog-content ol {
          list-style-type: decimal;
        }

        .blog-content blockquote {
          margin: 1.5rem 0;
          padding: 1rem 1.5rem;
          border-left: 4px solid #3b82f6;
          background: #1f2937;
          border-radius: 0.375rem;
          font-style: italic;
          color: #e5e7eb;
        }

        .blog-content strong {
          font-weight: 700;
          color: #f9fafb;
        }

        .blog-content em {
          font-style: italic;
          color: #f3f4f6;
        }

        .blog-content u {
          text-decoration: underline;
        }

        .blog-content s {
          text-decoration: line-through;
        }

        .blog-content a {
          color: #3b82f6;
          text-decoration: underline;
        }

        .blog-content a:hover {
          color: #60a5fa;
        }

        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }

        .blog-content code {
          background: #374151;
          color: #f9fafb;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }

        .blog-content pre {
          background: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }

        .blog-content pre code {
          background: none;
          padding: 0;
        }

        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }

        .blog-content th,
        .blog-content td {
          border: 1px solid #4b5563;
          padding: 0.75rem;
          text-align: left;
        }

        .blog-content th {
          background: #374151;
          font-weight: bold;
          color: #f9fafb;
        }

        .blog-content td {
          color: #d1d5db;
        }

        .blog-content hr {
          border: none;
          height: 2px;
          background: #4b5563;
          margin: 2rem 0;
          border-radius: 1px;
        }

        /* Custom colors for different text colors */
        .blog-content .ql-color-white { color: #ffffff !important; }
        .blog-content .ql-color-red { color: #ef4444 !important; }
        .blog-content .ql-color-orange { color: #f97316 !important; }
        .blog-content .ql-color-yellow { color: #eab308 !important; }
        .blog-content .ql-color-green { color: #22c55e !important; }
        .blog-content .ql-color-blue { color: #3b82f6 !important; }
        .blog-content .ql-color-purple { color: #a855f7 !important; }
        .blog-content .ql-color-pink { color: #ec4899 !important; }

        /* Background colors */
        .blog-content .ql-bg-red { background-color: #ef4444 !important; }
        .blog-content .ql-bg-orange { background-color: #f97316 !important; }
        .blog-content .ql-bg-yellow { background-color: #eab308 !important; }
        .blog-content .ql-bg-green { background-color: #22c55e !important; }
        .blog-content .ql-bg-blue { background-color: #3b82f6 !important; }
        .blog-content .ql-bg-purple { background-color: #a855f7 !important; }
        .blog-content .ql-bg-pink { background-color: #ec4899 !important; }

        /* Text alignment */
        .blog-content .ql-align-center {
          text-align: center;
        }

        .blog-content .ql-align-right {
          text-align: right;
        }

        .blog-content .ql-align-justify {
          text-align: justify;
        }

        /* Indentation */
        .blog-content .ql-indent-1 {
          padding-left: 3rem;
        }

        .blog-content .ql-indent-2 {
          padding-left: 6rem;
        }

        .blog-content .ql-indent-3 {
          padding-left: 9rem;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .blog-content h1 { font-size: 1.75rem; }
          .blog-content h2 { font-size: 1.5rem; }
          .blog-content h3 { font-size: 1.25rem; }
          
          .blog-content .ql-indent-1 { padding-left: 1.5rem; }
          .blog-content .ql-indent-2 { padding-left: 3rem; }
          .blog-content .ql-indent-3 { padding-left: 4.5rem; }
        }
      `}</style>
    </div>
  );
}