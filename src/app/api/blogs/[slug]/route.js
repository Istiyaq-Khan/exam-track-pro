import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

// GET single blog by slug
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { slug } = params;
    
    const blog = await Blog.findOne({ slug }).populate('author', 'displayName photoURL');
    
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST comment to blog
export async function POST(request, { params }) {
  try {
    await connectDB();
    const { slug } = params;
    const { content, authorId, authorName, authorPhoto } = await request.json();
    
    if (!content || !authorId || !authorName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    const comment = {
      content,
      author: {
        id: authorId,
        name: authorName,
        photo: authorPhoto
      },
      createdAt: new Date()
    };
    
    blog.comments.push(comment);
    await blog.save();
    
    return NextResponse.json({ message: 'Comment added successfully', comment });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update blog by slug
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { slug } = params;
    const updateData = await request.json();
    
    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    // Update allowed fields
    const allowedUpdates = ['title', 'content', 'imageUrl'];
    allowedUpdates.forEach(field => {
      if (updateData[field] !== undefined) {
        blog[field] = updateData[field];
      }
    });
    
    await blog.save();
    return NextResponse.json({ message: 'Blog updated successfully', blog });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE blog by slug
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { slug } = params;
    
    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    await Blog.deleteOne({ slug });
    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 