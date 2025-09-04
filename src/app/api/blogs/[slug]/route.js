// app/api/blogs/[slug]/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    // Await params before using
    const { slug } = await params;

    // Remove populate since author info is stored directly in the blog document
    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    await connectDB();
    
    // Await params before using
    const { slug } = await params;
    const { userId, userDisplayName, userPhotoURL, content } = await request.json();

    if (!userId || !content) {
      return NextResponse.json(
        { error: 'User ID and content are required' }, 
        { status: 400 }
      );
    }

    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    // Add comment
    blog.comments.push({
      userId,
      userDisplayName,
      userPhotoURL,
      content,
      createdAt: new Date()
    });

    await blog.save();

    return NextResponse.json({
      message: 'Comment added successfully',
      comments: blog.comments
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}