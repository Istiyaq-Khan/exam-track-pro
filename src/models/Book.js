import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  category: {
    type: String,
    required: true,
    enum: ['Mathematics', 'Science', 'English', 'Bengali', 'History', 'Geography', 'Other']
  },
  grade: {
    type: String,
    required: true,
    enum: ['9th', '10th', 'SSC']
  },
  pdfUrl: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    default: null
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  downloads: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  fileSize: {
    type: Number,
    default: 0
  },
  fileName: {
    type: String,
    default: ''
  },
  uploadedBy: {
    type: String,
    default: 'admin'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isbn: {
    type: String,
    trim: true,
    default: ''
  },
  publisher: {
    type: String,
    trim: true,
    default: ''
  },
  publishYear: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
});

// Create indexes for better performance
BookSchema.index({ title: 'text', author: 'text', description: 'text' });
BookSchema.index({ category: 1 });
BookSchema.index({ grade: 1 });
BookSchema.index({ uploadDate: -1 });
BookSchema.index({ downloads: -1 });

const Book = mongoose.models.Book || mongoose.model('Book', BookSchema);

export default Book;