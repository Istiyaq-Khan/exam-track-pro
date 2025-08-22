import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userDisplayName: {
    type: String,
    required: true
  },
  userPhotoURL: {
    type: String
  },
  content: {
    type: String,
    required: true
  },
  likes: [{
    type: String // userId
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  authorId: {
    type: String,
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  authorPhotoURL: {
    type: String
  },
  image: {
    type: String
  },
  likes: [{
    type: String // userId
  }],
  comments: [commentSchema],
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema); 