'use client';
// app/blogs/page.js

// Make sure to import useRef
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../../components/Navigation';
import NoSSR from '../../components/NoSSR';
import { 
  PlusIcon, 
  HeartIcon,
  ChatBubbleLeftIcon,
  EyeIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';

// Simple Rich Text Editor Component
const RichTextEditor = ({ value, onChange, placeholder = "Start writing..." }) => {
  const [mounted, setMounted] = useState(false);
  // Create a ref to hold a reference to the editable div
  const editorRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // This new useEffect hook is the core of the fix.
  // It synchronizes the editor's content with the 'value' prop
  // ONLY when the content is different. This prevents the cursor jump.
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]); // This hook runs only when the 'value' prop changes.


  const handleInput = (e) => {
    onChange(e.target.innerHTML);
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    // After executing a command, we focus the editor to maintain context
    editorRef.current.focus();
  };

  const formatBlock = (tag) => {
    document.execCommand('formatBlock', false, tag);
    editorRef.current.focus();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      document.execCommand('createLink', false, url);
    }
    editorRef.current.focus();
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      document.execCommand('insertImage', false, url);
    }
    editorRef.current.focus();
  };

  if (!mounted) {
    return (
      <div className="bg-gray-900 rounded-lg border border-gray-600">
        <div className="border-b border-gray-600 p-2">
          <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="p-4">
          <div className="h-48 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-600">
      {/* Toolbar */}
      <div className="border-b border-gray-600 p-2 flex flex-wrap gap-1">
        <select
          onChange={(e) => formatBlock(e.target.value)}
          className="px-2 py-1 text-sm bg-gray-800 text-white border border-gray-600 rounded"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="h5">Heading 5</option>
          <option value="h6">Heading 6</option>
        </select>

        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="px-3 py-1 text-sm font-bold bg-gray-800 text-white border border-gray-600 rounded hover:bg-gray-700"
        >
          B
        </button>
        
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="px-3 py-1 text-sm italic bg-gray-800 text-white border border-gray-600 rounded hover:bg-gray-700"
        >
          I
        </button>
        
        <button
          type="button"
          onClick={() => execCommand('underline')}
          className="px-3 py-1 text-sm underline bg-gray-800 text-white border border-gray-600 rounded hover:bg-gray-700"
        >
          U
        </button>
        
        <button
          type="button"
          onClick={() => execCommand('strikeThrough')}
          className="px-3 py-1 text-sm line-through bg-gray-800 text-white border border-gray-600 rounded hover:bg-gray-700"
        >
          S
        </button>

        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="px-3 py-1 text-sm bg-gray-800 text-white border border-gray-600 rounded hover:bg-gray-700"
        >
          • List
        </button>
        
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="px-3 py-1 text-sm bg-gray-800 text-white border border-gray-600 rounded hover:bg-gray-700"
        >
          1. List
        </button>

        <button
          type="button"
          onClick={() => execCommand('justifyLeft')}
          className="px-3 py-1 text-sm bg-gray-800 text-white border border-gray-600 rounded hover:bg-gray-700"
        >
          ⬅
        </button>
        
        <button
          type="button"
          onClick={() => execCommand('justifyCenter')}
          className="px-3 py-1 text-sm bg-gray-800 text-white border border-gray-600 rounded hover:bg-gray-700"
        >
          ↔
        </button>
        
        <button
          type="button"
          onClick={() => execCommand('justifyRight')}
          className="px-3 py-1 text-sm bg-gray-800 text-white border border-gray-600 rounded hover:bg-gray-700"
        >
          ➡
        </button>

        <button
          type="button"
          onClick={() => execCommand('indent')}
          className="px-3 py-1 text-sm bg-gray-800 text-white border border-gray-600 rounded hover:bg-gray-700"
        >
          Indent
        </button>
        
        <button
          type="button"
          onClick={() => execCommand('outdent')}
          className="px-3 py-1 text-sm bg-gray-800 text-white border border-gray-600 rounded hover:bg-gray-700"
        >
          Outdent
        </button>

        <button
          type="button"
          onClick={insertLink}
          className="px-3 py-1 text-sm bg-gray-800 text-white border border-gray-600 rounded hover:bg-gray-700"
        >
          Link
        </button>
        
        <button
          type="button"
          onClick={insertImage}
          className="px-3 py-1 text-sm bg-gray-800 text-white border border-gray-600 rounded hover:bg-gray-700"
        >
          Image
        </button>

        <input
          type="color"
          onChange={(e) => execCommand('foreColor', e.target.value)}
          className="w-8 h-8 border border-gray-600 rounded cursor-pointer"
          title="Text Color"
        />

        <input
          type="color"
          onChange={(e) => execCommand('backColor', e.target.value)}
          className="w-8 h-8 border border-gray-600 rounded cursor-pointer"
          title="Background Color"
        />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[300px] p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-b-lg"
        style={{ 
          wordBreak: 'break-word',
          overflowWrap: 'break-word'
        }}
      />
    </div>
  );
};

export default function BlogsPage() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: ''
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs');
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          authorId: user.uid,
          authorName: user.displayName,
          authorPhotoURL: user.photoURL
        }),
      });

      if (response.ok) {
        setShowForm(false);
        setFormData({ title: '', content: '', image: '' });
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  const handleLike = async (blogSlug) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/blogs/${blogSlug}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.uid }),
      });

      if (response.ok) {
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  // Function to strip HTML tags for preview
  const stripHtml = (html) => {
    if (!mounted || typeof window === 'undefined') return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-6">
                  <div className="h-48 bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                </div>
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Community Blog</h1>
          {user && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Write Blog</span>
            </button>
          )}
        </div>

        {/* Blog Creation Form */}
        <NoSSR>
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                onClick={() => setShowForm(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Write a New Blog</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Featured Image URL (optional)
                      </label>
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Content
                      </label>
                      <RichTextEditor
                        value={formData.content}
                        onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                        placeholder="Write your blog content with rich formatting..."
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setFormData({ title: '', content: '', image: '' });
                        }}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                      >
                        Publish Blog
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </NoSSR>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <ChatBubbleLeftIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-400 mb-2">No blogs yet</h3>
              <p className="text-gray-500">Be the first to share your SSC exam experience!</p>
            </div>
          ) : (
            blogs.map((blog) => (
              <motion.article
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-200"
              >
                {blog.image && (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                    <Link href={`/blogs/${blog.slug}`} className="hover:text-blue-400 transition-colors duration-200">
                      {blog.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-400 mb-4 line-clamp-3">
                    {stripHtml(blog.content).substring(0, 150)}...
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-4 w-4" />
                      <span>{blog.authorName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleLike(blog.slug)}
                        className={`flex items-center space-x-1 transition-colors duration-200 ${
                          blog.likes.includes(user?.uid) 
                            ? 'text-red-500' 
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <HeartIcon className="h-5 w-5" />
                        <span>{blog.likes.length}</span>
                      </button>
                      
                      <Link
                        href={`/blogs/${blog.slug}`}
                        className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                      >
                        <ChatBubbleLeftIcon className="h-5 w-5" />
                        <span>{blog.comments.length}</span>
                      </Link>
                    </div>
                    
                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-colors duration-200"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </div>
      </main>

      {/* Custom CSS for Rich Text Editor */}
      <style jsx global>{`
        [contenteditable] h1,
        [contenteditable] h2,
        [contenteditable] h3,
        [contenteditable] h4,
        [contenteditable] h5,
        [contenteditable] h6 {
          font-weight: bold;
          margin: 1rem 0 0.5rem 0;
        }

        [contenteditable] h1 { font-size: 2rem; }
        [contenteditable] h2 { font-size: 1.75rem; }
        [contenteditable] h3 { font-size: 1.5rem; }
        [contenteditable] h4 { font-size: 1.25rem; }
        [contenteditable] h5 { font-size: 1.1rem; }
        [contenteditable] h6 { font-size: 1rem; }

        [contenteditable] p {
          margin: 0.75rem 0;
        }

        [contenteditable] ul,
        [contenteditable] ol {
          padding-left: 2rem;
          margin: 1rem 0;
        }

        [contenteditable] li {
          margin: 0.25rem 0;
        }

        [contenteditable] blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          background: rgba(59, 130, 246, 0.1);
        }

        [contenteditable] strong {
          font-weight: bold;
        }

        [contenteditable] em {
          font-style: italic;
        }

        [contenteditable] u {
          text-decoration: underline;
        }

        [contenteditable] s {
          text-decoration: line-through;
        }

        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }

        [contenteditable] img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }
      `}</style>
    </div>
  );
}