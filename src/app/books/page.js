'use client'; 
//books/page.js
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../../components/Navigation';
import { 
  BookOpenIcon, 
  ArrowDownTrayIcon, // Fixed: was DownloadIcon
  EyeIcon,
  AcademicCapIcon,
  FilterIcon,
  PlusIcon,
  DocumentArrowUpIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function BooksPage() {
  const { user, userRole, isRole, isAtLeastRole } = useAuth();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [isClient, setIsClient] = useState(false); // Fix hydration mismatch

  const categories = ['All', 'Mathematics', 'Science', 'English', 'Bengali', 'History', 'Geography', 'Other'];
  const grades = ['All', '9th', '10th', 'SSC'];

  useEffect(() => {
    setIsClient(true); // Fix hydration mismatch
    fetchBooks();
  }, []);

  useEffect(() => {
    if (isClient) {
      filterBooks();
    }
  }, [books, selectedCategory, selectedGrade, searchTerm, isClient]);

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books');
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const filterBooks = () => {
    let filtered = books;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    if (selectedGrade !== 'All') {
      filtered = filtered.filter(book => book.grade === selectedGrade);
    }

    if (searchTerm) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBooks(filtered);
  };

  const handleDownload = async (bookId) => {
    try {
      // Record the download in the database
      const response = await fetch(`/api/books/${bookId}/download`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Find the book and create download link
        const book = books.find(b => b._id === bookId);
        if (book && book.pdfUrl) {
          // Create a temporary link to trigger download
          const link = document.createElement('a');
          link.href = book.pdfUrl;
          link.download = book.title;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Update local books state with new download count
          setBooks(prevBooks => 
            prevBooks.map(b => 
              b._id === bookId ? { ...b, downloads: data.downloads } : b
            )
          );
        }
      }
    } catch (error) {
      console.error('Error downloading book:', error);
      alert('Error downloading book. Please try again.');
    }
  };

  const handleView = (book) => {
    // Increment view count (optional)
    fetch(`/api/books/${book._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ views: (book.views || 0) + 1 }),
    }).catch(console.error);

    // Open PDF in new tab
    window.open(book.pdfUrl, '_blank');
  };

  const handleUpload = async (formData) => {
    try {
      setUploadLoading(true);
      const response = await fetch('/api/books/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        await fetchBooks(); // Refresh books list
        setShowUploadModal(false);
        alert('Book uploaded successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error uploading book: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error uploading book:', error);
      alert('Error uploading book. Please try again.');
    } finally {
      setUploadLoading(false);
    }
  };

  const UploadModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      author: '',
      description: '',
      category: 'Mathematics',
      grade: '9th',
    });
    const [pdfFile, setPdfFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!pdfFile) {
        alert('Please select a PDF file');
        return;
      }

      if (pdfFile.type !== 'application/pdf') {
        alert('Please select a valid PDF file');
        return;
      }

      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('author', formData.author);
      uploadData.append('description', formData.description);
      uploadData.append('category', formData.category);
      uploadData.append('grade', formData.grade);
      uploadData.append('pdfFile', pdfFile);
      
      if (coverFile) {
        if (!coverFile.type.startsWith('image/')) {
          alert('Please select a valid image file for cover');
          return;
        }
        uploadData.append('coverFile', coverFile);
      }

      await handleUpload(uploadData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Upload New Book</h2>
            <button
              onClick={() => setShowUploadModal(false)}
              className="text-gray-400 hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter book title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Author *
              </label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter author name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Brief description of the book"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Grade
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {grades.slice(1).map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                PDF File * (Max 50MB)
              </label>
              <input
                type="file"
                accept=".pdf"
                required
                onChange={(e) => setPdfFile(e.target.files[0])}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {pdfFile && (
                <p className="text-sm text-gray-400 mt-1">
                  Selected: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cover Image (Optional, Max 5MB)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files[0])}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {coverFile && (
                <p className="text-sm text-gray-400 mt-1">
                  Selected: {coverFile.name} ({(coverFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                disabled={uploadLoading}
                className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploadLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {uploadLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <DocumentArrowUpIcon className="h-4 w-4" />
                    <span>Upload</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-4">Study Resources</h1>
            <p className="text-gray-300 max-w-2xl">
              Access comprehensive study materials, textbooks, and reference books for your SSC exam preparation
            </p>
          </div>

          {/* Admin Upload Button */}
          {isRole('admin') && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Book</span>
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Total Books</h3>
            <p className="text-3xl font-bold text-blue-500">{books.length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Total Downloads</h3>
            <p className="text-3xl font-bold text-green-500">
              {books.reduce((sum, book) => sum + (book.downloads || 0), 0)}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Categories</h3>
            <p className="text-3xl font-bold text-purple-500">
              {new Set(books.map(book => book.category)).size}
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search Books
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, author, or description..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Grade
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {grades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedGrade('All');
                  setSearchTerm('');
                }}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <BookOpenIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-400 mb-2">No books found</h3>
              <p className="text-gray-500">
                {books.length === 0 
                  ? 'No books have been uploaded yet.' 
                  : 'Try adjusting your filters or search terms.'
                }
              </p>
              {isRole('admin') && books.length === 0 && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Upload First Book
                </button>
              )}
            </div>
          ) : (
            filteredBooks.map((book) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-200"
              >
                {/* Book Cover */}
                <div className="relative h-48 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-white p-4">
                      <BookOpenIcon className="h-16 w-16 mx-auto mb-2" />
                      <span className="text-sm font-medium line-clamp-2">{book.title}</span>
                    </div>
                  )}
                  
                  {/* Grade Badge */}
                  <div className="absolute top-2 right-2">
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {book.grade}
                    </span>
                  </div>
                </div>
                
                {/* Book Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    {book.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {book.description || 'No description available'}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <AcademicCapIcon className="h-4 w-4 mr-1" />
                      {book.author}
                    </span>
                    <span className="bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs">
                      {book.category}
                    </span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleView(book)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span>View</span>
                    </button>
                    
                    <button
                      onClick={() => handleDownload(book._id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  </div>
                  
                  {/* Download Count */}
                  <div className="text-center mt-3">
                    <span className="text-xs text-gray-500">
                      {book.downloads || 0} downloads
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Admin Info Section */}
        {isRole('admin') && (
          <div className="mt-12 text-center">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-2">Admin Access</h3>
              <p className="text-gray-400 mb-4">
                You have admin privileges to upload and manage books.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  <DocumentArrowUpIcon className="h-5 w-5" />
                  <span>Upload Book</span>
                </button>
                <Link
                  href="/admin"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Manage Books
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Upload Modal */}
      {showUploadModal && <UploadModal />}
    </div>
  );
}