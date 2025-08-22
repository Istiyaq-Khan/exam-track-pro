'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../../components/Navigation';
import { 
  BookOpenIcon, 
  DownloadIcon,
  EyeIcon,
  AcademicCapIcon,
  FilterIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function BooksPage() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Mathematics', 'Science', 'English', 'Bengali', 'History', 'Geography', 'Other'];
  const grades = ['All', '9th', '10th', 'SSC'];

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [books, selectedCategory, selectedGrade, searchTerm]);

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
      const response = await fetch(`/api/books/${bookId}/download`, {
        method: 'POST',
      });
      
      if (response.ok) {
        // Trigger download
        const book = books.find(b => b._id === bookId);
        const link = document.createElement('a');
        link.href = book.pdfUrl;
        link.download = book.title;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error downloading book:', error);
    }
  };

  const handleView = (book) => {
    window.open(book.pdfUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Study Resources</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Access comprehensive study materials, textbooks, and reference books for your SSC exam preparation
          </p>
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
                    <div className="text-center text-white">
                      <BookOpenIcon className="h-16 w-8 mx-auto mb-2" />
                      <span className="text-sm font-medium">{book.title}</span>
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
                    {book.description}
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
                      <DownloadIcon className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  </div>
                  
                  {/* Download Count */}
                  <div className="text-center mt-3">
                    <span className="text-xs text-gray-500">
                      {book.downloads} downloads
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Admin Upload Section */}
        {user && (
          <div className="mt-12 text-center">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-2">Admin Access</h3>
              <p className="text-gray-400 mb-4">
                {user.isAdmin 
                  ? 'You have admin privileges to upload and manage books.'
                  : 'Contact an administrator to upload new study materials.'
                }
              </p>
              {user.isAdmin && (
                <Link
                  href="/admin"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Manage Books
                </Link>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 