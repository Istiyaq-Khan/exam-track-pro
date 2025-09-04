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
    let connectedStudents = [];
    if (typeof teacher.getStudentStats === 'function') {
      connectedStudents = await teacher.getStudentStats();
    } else {
      // Fallback: get basic student info
      const studentUids = teacher.connectedStudents?.map(conn => conn.studentUid) || [];
      connectedStudents = await User.find({ uid: { $in: studentUids } })
        .select('uid displayName email role photoURL createdAt')
        .lean();
    }
    
    return NextResponse.json(connectedStudents);
    
  } catch (error) {
    console.error('Get connected students error:', error);
    return NextResponse.json(
      { error: 'Failed to get connected students' },
      { status: 500 }
    );
  }
}