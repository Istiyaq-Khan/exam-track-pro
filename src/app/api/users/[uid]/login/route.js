import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// POST update user login statistics
export async function POST(request, { params }) {
  try {
    const { uid } = params;
    await connectDB();
    
    const user = await User.findOne({ uid });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Update login statistics
    user.lastLogin = new Date();
    user.loginCount += 1;
    
    // Check for automatic role upgrade
    const wasUpgraded = user.checkForUpgrade();
    
    await user.save();
    
    return NextResponse.json({
      message: 'Login updated successfully',
      wasUpgraded,
      newRole: user.role,
      loginCount: user.loginCount
    });
  } catch (error) {
    console.error('Error updating login:', error);
    return NextResponse.json(
      { error: 'Failed to update login' },
      { status: 500 }
    );
  }
} 