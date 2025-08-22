import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  todos: [todoSchema],
  progress: {
    type: Number,
    default: 0
  }
});

const examSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['SSC Final Exam', 'Half Yearly', '9th Annual', '10th Progress Assessment', 'SSC Pre-Test', 'Custom'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  subjects: [subjectSchema],
  overallProgress: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Exam || mongoose.model('Exam', examSchema); 