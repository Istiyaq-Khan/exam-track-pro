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
      const isConnected = sender.connectedStudents?.some(
        conn => conn.studentUid === toId && conn.status === 'active'
      );
      
      if (!isConnected && sender.role !== 'admin') {
        return NextResponse.json(
          { error: 'You can only message connected students' },
          { status: 403 }
        );
      }
    }
    
    // Send message (assuming this is a custom method)
    if (typeof recipient.sendMessage === 'function') {
      recipient.sendMessage(fromId, sender.displayName, message, type);
    } else {
      // Fallback: manually add message
      if (!recipient.messages) {
        recipient.messages = [];
      }
      recipient.messages.push({
        fromId,
        fromName: sender.displayName,
        message,
        type,
        createdAt: new Date(),
        read: false
      });
    }
    
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
    const messages = (user.messages || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return NextResponse.json(messages);
    
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Failed to get messages' },
      { status: 500 }
    );
  }
}