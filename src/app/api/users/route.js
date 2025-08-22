import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// GET all users (admin only)
export async function GET(request) {
  try {
    await connectDB();
    
    // Get user from authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    // Verify token and check if user is admin
    // This would typically involve Firebase Admin SDK verification
    
    const users = await User.find({}, { 
      password: 0, 
      __v: 0 
    }).sort({ createdAt: -1 });
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST create new user
export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ uid: body.uid }, { email: body.email }] 
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }
    
    // Create new user with default role
    const user = new User({
      uid: body.uid,
      email: body.email,
      displayName: body.displayName,
      photoURL: body.photoURL,
      role: body.role || 'student',
      lastLogin: new Date(),
      loginCount: 1
    });
    
    await user.save();
    
    // Return user without sensitive data
    const userResponse = user.toObject();
    delete userResponse.__v;
    
    return NextResponse.json(userResponse, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 