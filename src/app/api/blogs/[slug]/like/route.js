import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

export async function POST(request, { params }) {
  try {
    await connectDB();
    const { slug } = params;
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    const likeIndex = blog.likes.indexOf(userId);
    
    if (likeIndex === -1) {
      // Add like
      blog.likes.push(userId);
    } else {
      // Remove like
      blog.likes.splice(likeIndex, 1);
    }
    
    await blog.save();
    
    return NextResponse.json({ 
      message: likeIndex === -1 ? 'Blog liked' : 'Blog unliked',
      likes: blog.likes.length,
      isLiked: likeIndex === -1
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 