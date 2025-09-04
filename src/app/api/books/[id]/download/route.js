import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Book from '@/models/Book';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    await connectDB();

    // Find the book and increment download count
    const book = await Book.findByIdAndUpdate(
      id,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Download recorded',
      downloads: book.downloads,
      pdfUrl: book.pdfUrl
    });

  } catch (error) {
    console.error('Error recording download:', error);
    return NextResponse.json(
      { error: 'Failed to record download' },
      { status: 500 }
    );
  }
}

// Optional: GET method to retrieve download count
export async function GET(request, { params }) {
  try {
    const { id } = params;
    await connectDB();

    const book = await Book.findById(id, 'downloads title');
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      bookId: book._id,
      title: book.title,
      downloads: book.downloads
    });

  } catch (error) {
    console.error('Error fetching download stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch download stats' },
      { status: 500 }
    );
  }
}