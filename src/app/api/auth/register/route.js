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
    
    // Create user data
    const userData = {
      uid,
      email: email.toLowerCase(),
      displayName,
      role: userType,
      studentId: studentId || '',
      schoolName: schoolName || '',
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
      loginCount: 0,
      messages: [],
      connectedStudents: userType === 'teacher' ? [] : undefined
    };
    
    if (userType === 'teacher') {
      userData.teacherCode = teacherCode;
    }
    
    // Create user
    const newUser = new User(userData);
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