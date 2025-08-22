import mongoose from 'mongoose';

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
    enum: ['guest', 'student', 'advanced', 'admin'],
    default: 'student',
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
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
    averageScore: { type: Number, default: 0 }
  },
  studyStreak: {
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastStudyDate: { type: Date, default: Date.now }
  },
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

// Index for role-based queries
userSchema.index({ role: 1 });
userSchema.index({ email: 1 });
userSchema.index({ createdAt: 1 });

// Virtual for role-based permissions
userSchema.virtual('permissions').get(function() {
  const permissions = {
    canAccessStudent: ['student', 'advanced', 'admin'],
    canAccessAdvanced: ['advanced', 'admin'],
    canAccessAdmin: ['admin'],
    canManageUsers: ['admin'],
    canModerateContent: ['admin'],
    canAccessPremium: ['advanced', 'admin']
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
    '/student': ['student', 'advanced', 'admin'],
    '/advanced': ['advanced', 'admin'],
    '/admin': ['admin']
  };
  
  return routePermissions[route] ? routePermissions[route].includes(this.role) : true;
};

// Method to upgrade user role based on activity
userSchema.methods.checkForUpgrade = function() {
  if (this.role === 'student' && this.loginCount >= 10 && this.examProgress.totalExams >= 5) {
    this.role = 'advanced';
    this.updatedAt = new Date();
    return true;
  }
  return false;
};

// Pre-save middleware to update isAdmin based on role
userSchema.pre('save', function(next) {
  this.isAdmin = this.role === 'admin';
  this.updatedAt = new Date();
  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User; 