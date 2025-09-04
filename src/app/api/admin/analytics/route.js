// app/api/admin/analytics/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Blog from '@/models/Blog';
import Book from '@/models/Book';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (range) {
      case '1d':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default: // 7d
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
    
    // Get user statistics
    const [totalUsers, usersByRole, newUsersToday] = await Promise.all([
      User.countDocuments(),
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]),
      User.countDocuments({ 
        createdAt: { $gte: new Date(now.setHours(0, 0, 0, 0)) }
      })
    ]);
    
    // Get content statistics
    const [totalBlogs, totalBooks, totalComments] = await Promise.all([
      Blog.countDocuments(),
      Book.countDocuments(),
      Blog.aggregate([
        { $unwind: '$comments' },
        { $count: 'total' }
      ]).then(result => result[0]?.total || 0)
    ]);
    
    // Get download statistics
    const totalDownloads = await Book.aggregate([
      { $group: { _id: null, total: { $sum: '$downloads' } } }
    ]).then(result => result[0]?.total || 0);
    
    // Process user role data
    const roleStats = {
      student: 0,
      advanced: 0,
      teacher: 0,
      admin: 0
    };
    
    usersByRole.forEach(role => {
      roleStats[role._id] = role.count;
    });
    
    // Mock online users (in production, use Redis or similar)
    const onlineUsers = Math.floor(totalUsers * 0.15); // Assume 15% online
    
    const analytics = {
      users: {
        total: totalUsers,
        student: roleStats.student,
        advanced: roleStats.advanced,
        teacher: roleStats.teacher,
        admin: roleStats.admin,
        online: onlineUsers,
        newToday: newUsersToday
      },
      content: {
        totalBlogs,
        totalComments,
        totalBooks,
        totalDownloads
      },
      activity: {
        pageViews: Math.floor(totalUsers * 8.5), // Mock data
        uniqueVisitors: Math.floor(totalUsers * 0.8),
        averageSessionTime: 285,
        bounceRate: 24.6
      }
    };
    
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

// app/api/admin/settings/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function PUT(request) {
  try {
    await dbConnect();
    
    const settings = await request.json();
    
    // In production, save to database or configuration service
    // For now, we'll just return success
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

// app/api/users/connect/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { teacherId, studentUid } = await request.json();
    
    if (!teacherId || !studentUid) {
      return NextResponse.json(
        { error: 'Teacher ID and Student UID are required' },
        { status: 400 }
      );
    }
    
    // Find teacher and student
    const [teacher, student] = await Promise.all([
      User.findOne({ uid: teacherId }),
      User.findOne({ uid: studentUid })
    ]);
    
    if (!teacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      );
    }
    
    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }
    
    if (teacher.role !== 'teacher' && teacher.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only teachers can connect with students' },
        { status: 403 }
      );
    }
    
    if (!['student', 'advanced'].includes(student.role)) {
      return NextResponse.json(
        { error: 'Can only connect with students' },
        { status: 400 }
      );
    }
    
    // Check if already connected
    const existingConnection = teacher.connectedStudents.find(
      conn => conn.studentUid === studentUid
    );
    
    if (existingConnection) {
      return NextResponse.json(
        { error: 'Student already connected' },
        { status: 400 }
      );
    }
    
    // Connect teacher to student
    teacher.connectStudent(studentUid);
    student.connectTeacher(teacherId);
    
    await Promise.all([teacher.save(), student.save()]);
    
    return NextResponse.json({
      success: true,
      student: {
        uid: student.uid,
        displayName: student.displayName,
        email: student.email,
        role: student.role,
        photoURL: student.photoURL
      }
    });
    
  } catch (error) {
    console.error('Connect student error:', error);
    return NextResponse.json(
      { error: 'Failed to connect student' },
      { status: 500 }
    );
  }
}

// app/api/users/connected/[teacherId]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { teacherId } = params;
    
    const teacher = await User.findOne({ uid: teacherId });
    
    if (!teacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      );
    }
    
    if (teacher.role !== 'teacher' && teacher.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }
    
    // Get connected students with their stats
    const connectedStudents = await teacher.getStudentStats();
    
    return NextResponse.json(connectedStudents);
    
  } catch (error) {
    console.error('Get connected students error:', error);
    return NextResponse.json(
      { error: 'Failed to get connected students' },
      { status: 500 }
    );
  }
}

// app/api/messages/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { fromId, toId, message, type } = await request.json();
    
    if (!fromId || !toId || !message || !type) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Find sender and recipient
    const [sender, recipient] = await Promise.all([
      User.findOne({ uid: fromId }),
      User.findOne({ uid: toId })
    ]);
    
    if (!sender || !recipient) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Validate message type and permissions
    if (type === 'teacher_to_student') {
      if (sender.role !== 'teacher' && sender.role !== 'admin') {
        return NextResponse.json(
          { error: 'Only teachers can send messages to students' },
          { status: 403 }
        );
      }
      
      // Check if teacher is connected to student
      const isConnected = sender.connectedStudents.some(
        conn => conn.studentUid === toId && conn.status === 'active'
      );
      
      if (!isConnected && sender.role !== 'admin') {
        return NextResponse.json(
          { error: 'You can only message connected students' },
          { status: 403 }
        );
      }
    }
    
    // Send message
    recipient.sendMessage(fromId, sender.displayName, message, type);
    await recipient.save();
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const user = await User.findOne({ uid: userId });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Return messages sorted by newest first
    const messages = user.messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return NextResponse.json(messages);
    
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Failed to get messages' },
      { status: 500 }
    );
  }
}

// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { email, password, userType } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Verify password (you'll need to hash passwords when creating users)
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Update login stats
    user.loginCount += 1;
    user.lastLogin = new Date();
    await user.save();
    
    // Create JWT token
    const token = jwt.sign(
      { uid: user.uid, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    // Determine redirect URL based on role
    let redirectUrl = '/';
    switch (user.role) {
      case 'admin':
        redirectUrl = '/admin';
        break;
      case 'teacher':
        redirectUrl = '/dashboard';
        break;
      case 'advanced':
      case 'student':
        redirectUrl = '/dashboard';
        break;
      default:
        redirectUrl = '/';
    }
    
    const response = NextResponse.json({
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        photoURL: user.photoURL
      },
      redirectUrl
    });
    
    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });
    
    return response;
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}

// app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { displayName, email, password, userType, studentId, teacherCode, schoolName } = await request.json();
    
    if (!displayName || !email || !password || !userType) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }
    
    // Validate teacher code if registering as teacher
    if (userType === 'teacher' && teacherCode) {
      // Add your teacher code validation logic here
      if (teacherCode !== 'VALID_TEACHER_CODE') { // Replace with actual validation
        return NextResponse.json(
          { error: 'Invalid teacher code' },
          { status: 400 }
        );
      }
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Generate unique UID
    const uid = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Create user
    const newUser = new User({
      uid,
      email: email.toLowerCase(),
      displayName,
      role: userType,
      studentId: studentId || '',
      schoolName: schoolName || '',
      passwordHash, // You'll need to add this field to your User model
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    if (userType === 'teacher') {
      // Teacher code will be auto-generated in pre-save middleware
      newUser.teacherCode = teacherCode;
    }
    
    await newUser.save();
    
    return NextResponse.json({
      success: true,
      message: 'Account created successfully'
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}