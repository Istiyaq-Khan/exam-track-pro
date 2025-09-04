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
    const existingConnection = teacher.connectedStudents?.find(
      conn => conn.studentUid === studentUid
    );
    
    if (existingConnection) {
      return NextResponse.json(
        { error: 'Student already connected' },
        { status: 400 }
      );
    }
    
    // Connect teacher to student (assuming these are custom methods)
    if (typeof teacher.connectStudent === 'function') {
      teacher.connectStudent(studentUid);
    }
    if (typeof student.connectTeacher === 'function') {
      student.connectTeacher(teacherId);
    }
    
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