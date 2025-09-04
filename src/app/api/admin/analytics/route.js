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
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
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