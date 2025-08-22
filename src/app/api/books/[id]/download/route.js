import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Book from '@/models/Book';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    await connectDB();
    
    const book = await Book.findById(id);
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }
    
    // Increment download count
    book.downloads += 1;
    await book.save();
    
    return NextResponse.json({ message: 'Download count updated' });
  } catch (error) {
    console.error('Error updating download count:', error);
    return NextResponse.json(
      { error: 'Failed to update download count' },
      { status: 500 }
    );
  }
} 