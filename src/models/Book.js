import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    required: true
  },
  pdfUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Mathematics', 'Science', 'English', 'Bengali', 'History', 'Geography', 'Other'],
    default: 'Other'
  },
  grade: {
    type: String,
    enum: ['9th', '10th', 'SSC'],
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  downloads: {
    type: Number,
    default: 0
  }
});

export default mongoose.models.Book || mongoose.model('Book', bookSchema); 