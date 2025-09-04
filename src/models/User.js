import mongoose from 'mongoose';
// src/models/User.js - Updated with teacher functionality

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  photoURL: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['guest', 'student', 'advanced', 'teacher', 'admin'],
    default: 'student',
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  // Teacher-specific fields
  teacherCode: {
    type: String,
    sparse: true, // Allow null values but ensure uniqueness when present
    unique: true
  },
  connectedStudents: [{
    studentUid: {
      type: String,
      ref: 'User',
      required: true
    },
    connectedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'blocked'],
      default: 'active'
    }
  }],
  // Student-specific fields
  studentId: {
    type: String,
    sparse: true
  },
  connectedTeachers: [{
    teacherUid: {
      type: String,
      ref: 'User',
      required: true
    },
    connectedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'blocked'],
      default: 'active'
    }
  }],
  schoolName: {
    type: String,
    default: ''
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  loginCount: {
    type: Number,
    default: 1
  },
  examProgress: {
    totalExams: { type: Number, default: 0 },
    completedExams: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    upcomingExams: { type: Number, default: 0 },
    lastExamDate: { type: Date }
  },
  studyStreak: {
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastStudyDate: { type: Date, default: Date.now }
  },
  // Messaging and notifications
  messages: [{
    fromId: {
      type: String,
      required: true
    },
    fromName: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['teacher_to_student', 'student_to_teacher', 'admin_to_user'],
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    read: {
      type: Boolean,
      default: false
    }
  }],
  // User preferences and settings
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      examReminders: { type: Boolean, default: true },
      teacherMessages: { type: Boolean, default: true }
    },
    privacy: {
      showProfile: { type: Boolean, default: true },
      allowTeacherConnect: { type: Boolean, default: true }
    },
    theme: {
      type: String,
      enum: ['dark', 'light', 'auto'],
      default: 'dark'
    }
  },
  // Activity tracking
  activityLog: [{
    action: {
      type: String,
      required: true
    },
    details: {
      type: String
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
userSchema.index({ role: 1 });
userSchema.index({ email: 1 });
userSchema.index({ createdAt: 1 });
userSchema.index({ 'connectedStudents.studentUid': 1 });
userSchema.index({ 'connectedTeachers.teacherUid': 1 });

// Virtual for role-based permissions
userSchema.virtual('permissions').get(function() {
  const permissions = {
    canAccessStudent: ['student', 'advanced', 'teacher', 'admin'],
    canAccessAdvanced: ['advanced', 'teacher', 'admin'],
    canAccessTeacher: ['teacher', 'admin'],
    canAccessAdmin: ['admin'],
    canManageUsers: ['admin'],
    canModerateContent: ['teacher', 'admin'],
    canAccessPremium: ['advanced', 'teacher', 'admin'],
    canConnectStudents: ['teacher', 'admin'],
    canSendMessages: ['teacher', 'admin']
  };
  
  return Object.keys(permissions).reduce((acc, permission) => {
    acc[permission] = permissions[permission].includes(this.role);
    return acc;
  }, {});
});

// Method to check if user has specific permission
userSchema.methods.hasPermission = function(permission) {
  return this.permissions[permission] || false;
};

// Method to check if user can access specific route
userSchema.methods.canAccessRoute = function(route) {
  const routePermissions = {
    '/student': ['student', 'advanced', 'teacher', 'admin'],
    '/advanced': ['advanced', 'teacher', 'admin'],
    '/teacher': ['teacher', 'admin'],
    '/admin': ['admin']
  };
  
  return routePermissions[route] ? routePermissions[route].includes(this.role) : true;
};

// Method to upgrade user role based on activity
userSchema.methods.checkForUpgrade = function() {
  if (this.role === 'student' && this.loginCount >= 10 && this.examProgress.totalExams >= 5) {
    this.role = 'advanced';
    this.updatedAt = new Date();
    this.activityLog.push({
      action: 'role_upgrade',
      details: 'Automatically upgraded to advanced user'
    });
    return true;
  }
  return false;
};

// Method to connect a student to teacher
userSchema.methods.connectStudent = function(studentUid) {
  // Check if already connected
  const existingConnection = this.connectedStudents.find(
    conn => conn.studentUid === studentUid
  );
  
  if (!existingConnection) {
    this.connectedStudents.push({
      studentUid: studentUid,
      connectedAt: new Date(),
      status: 'active'
    });
    
    this.activityLog.push({
      action: 'student_connected',
      details: `Connected with student ${studentUid}`
    });
    
    return true;
  }
  return false;
};

// Method to connect a teacher to student
userSchema.methods.connectTeacher = function(teacherUid) {
  // Check if already connected
  const existingConnection = this.connectedTeachers.find(
    conn => conn.teacherUid === teacherUid
  );
  
  if (!existingConnection) {
    this.connectedTeachers.push({
      teacherUid: teacherUid,
      connectedAt: new Date(),
      status: 'active'
    });
    
    this.activityLog.push({
      action: 'teacher_connected',
      details: `Connected with teacher ${teacherUid}`
    });
    
    return true;
  }
  return false;
};

// Method to send message
userSchema.methods.sendMessage = function(fromId, fromName, message, type) {
  this.messages.push({
    fromId: fromId,
    fromName: fromName,
    message: message,
    type: type,
    createdAt: new Date(),
    read: false
  });
  
  this.activityLog.push({
    action: 'message_received',
    details: `Message from ${fromName}`
  });
  
  return true;
};

// Method to mark messages as read
userSchema.methods.markMessagesAsRead = function(fromId) {
  this.messages.forEach(msg => {
    if (msg.fromId === fromId && !msg.read) {
      msg.read = true;
    }
  });
  
  return true;
};

// Method to get unread message count
userSchema.methods.getUnreadMessageCount = function() {
  return this.messages.filter(msg => !msg.read).length;
};

// Method to update study streak
userSchema.methods.updateStudyStreak = function() {
  const today = new Date();
  const lastStudy = this.studyStreak.lastStudyDate;
  const daysDiff = Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 1) {
    // Consecutive day
    this.studyStreak.currentStreak += 1;
    if (this.studyStreak.currentStreak > this.studyStreak.longestStreak) {
      this.studyStreak.longestStreak = this.studyStreak.currentStreak;
    }
  } else if (daysDiff > 1) {
    // Streak broken
    this.studyStreak.currentStreak = 1;
  }
  // daysDiff === 0 means same day, no change needed
  
  this.studyStreak.lastStudyDate = today;
  
  this.activityLog.push({
    action: 'study_streak_updated',
    details: `Current streak: ${this.studyStreak.currentStreak} days`
  });
  
  return this.studyStreak.currentStreak;
};

// Pre-save middleware to update isAdmin based on role
userSchema.pre('save', function(next) {
  this.isAdmin = this.role === 'admin';
  this.updatedAt = new Date();
  
  // Generate teacher code for new teachers
  if (this.role === 'teacher' && !this.teacherCode) {
    this.teacherCode = 'T' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  
  next();
});

// Method to get student statistics for teachers
userSchema.methods.getStudentStats = async function() {
  if (this.role !== 'teacher') return null;
  
  const User = mongoose.model('User');
  const Blog = mongoose.model('Blog');
  const Exam = mongoose.model('Exam');
  
  const studentStats = [];
  
  for (const connection of this.connectedStudents) {
    if (connection.status === 'active') {
      const student = await User.findOne({ uid: connection.studentUid });
      if (student) {
        const blogCount = await Blog.countDocuments({ authorUid: student.uid });
        const examCount = await Exam.countDocuments({ userId: student.uid });
        
        studentStats.push({
          ...student.toObject(),
          blogCount,
          examCount,
          connectionDate: connection.connectedAt
        });
      }
    }
  }
  
  return studentStats;
};

// Static method to find users by role
userSchema.statics.findByRole = function(role) {
  return this.find({ role: role });
};

// Static method to get user statistics
userSchema.statics.getStatistics = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 }
      }
    }
  ]);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;