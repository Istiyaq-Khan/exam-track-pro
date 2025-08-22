import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// POST upgrade user role
export async function POST(request, { params }) {
  try {
    const { uid } = params;
    const body = await request.json();
    await connectDB();
    
    const user = await User.findOne({ uid });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    const { reason, criteria, newRole } = body;
    
    // Determine new role based on criteria or manual assignment
    let targetRole = newRole;
    
    if (!targetRole) {
      if (criteria === 'login_count_and_exam_progress') {
        if (user.role === 'student' && user.loginCount >= 10 && user.examProgress.totalExams >= 5) {
          targetRole = 'advanced';
        }
      }
    }
    
    if (!targetRole || targetRole === user.role) {
      return NextResponse.json({
        message: 'No upgrade needed or possible',
        currentRole: user.role,
        criteria: {
          loginCount: user.loginCount,
          totalExams: user.examProgress.totalExams
        }
      });
    }
    
    // Validate role upgrade path
    const validUpgrades = {
      'student': ['advanced'],
      'advanced': ['admin'],
      'admin': []
    };
    
    if (!validUpgrades[user.role].includes(targetRole)) {
      return NextResponse.json(
        { error: 'Invalid role upgrade path' },
        { status: 400 }
      );
    }
    
    // Update user role
    const oldRole = user.role;
    user.role = targetRole;
    user.updatedAt = new Date();
    
    // Update isAdmin flag
    user.isAdmin = targetRole === 'admin';
    
    await user.save();
    
    return NextResponse.json({
      message: 'User role upgraded successfully',
      oldRole,
      newRole: targetRole,
      reason: reason || 'automatic_upgrade',
      criteria: criteria || 'manual_upgrade'
    });
  } catch (error) {
    console.error('Error upgrading user:', error);
    return NextResponse.json(
      { error: 'Failed to upgrade user' },
      { status: 500 }
    );
  }
} 