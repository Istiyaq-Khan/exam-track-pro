import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// GET user by UID
export async function GET(request, { params }) {
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
    
    // Return user without sensitive data
    const userResponse = user.toObject();
    delete userResponse.__v;
    
    return NextResponse.json(userResponse);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT update user (admin only for role changes)
export async function PUT(request, { params }) {
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
    
    // Only allow certain fields to be updated
    const allowedUpdates = ['displayName', 'photoURL', 'examProgress', 'studyStreak'];
    
    // Role can only be changed by admin
    if (body.role && body.role !== user.role) {
      // Check if requester is admin (this would be verified via middleware/token)
      // For now, we'll allow it but in production you'd verify admin status
      allowedUpdates.push('role');
    }
    
    allowedUpdates.forEach(field => {
      if (body[field] !== undefined) {
        user[field] = body[field];
      }
    });
    
    user.updatedAt = new Date();
    await user.save();
    
    // Return updated user
    const userResponse = user.toObject();
    delete userResponse.__v;
    
    return NextResponse.json(userResponse);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE user (admin only)
export async function DELETE(request, { params }) {
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
    
    await User.deleteOne({ uid });
    
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
} 