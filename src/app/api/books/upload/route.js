import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Book from '@/models/Book';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();
    const title = formData.get('title');
    const author = formData.get('author');
    const description = formData.get('description') || '';
    const category = formData.get('category');
    const grade = formData.get('grade');
    const pdfFile = formData.get('pdfFile');
    const coverFile = formData.get('coverFile');

    // Validate required fields
    if (!title || !author || !category || !grade || !pdfFile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create uploads directories if they don't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const booksDir = path.join(uploadsDir, 'books');
    const coversDir = path.join(uploadsDir, 'covers');

    try {
      await mkdir(uploadsDir, { recursive: true });
      await mkdir(booksDir, { recursive: true });
      await mkdir(coversDir, { recursive: true });
    } catch (error) {
      // Directories might already exist, which is fine
    }

    // Generate unique filenames
    const timestamp = Date.now();
    const pdfFileName = `${timestamp}_${pdfFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const pdfFilePath = path.join(booksDir, pdfFileName);
    const pdfUrl = `/uploads/books/${pdfFileName}`;

    // Save PDF file
    const pdfBytes = await pdfFile.arrayBuffer();
    await writeFile(pdfFilePath, Buffer.from(pdfBytes));

    let coverImageUrl = null;
    // Save cover image if provided
    if (coverFile && coverFile.size > 0) {
      const coverFileName = `${timestamp}_${coverFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const coverFilePath = path.join(coversDir, coverFileName);
      coverImageUrl = `/uploads/covers/${coverFileName}`;
      
      const coverBytes = await coverFile.arrayBuffer();
      await writeFile(coverFilePath, Buffer.from(coverBytes));
    }

    // Create book document
    const bookData = {
      title,
      author,
      description,
      category,
      grade,
      pdfUrl,
      coverImage: coverImageUrl,
      uploadDate: new Date(),
      downloads: 0,
      views: 0,
      isActive: true,
      fileSize: pdfFile.size,
      fileName: pdfFile.name
    };

    const book = new Book(bookData);
    await book.save();

    return NextResponse.json({
      success: true,
      bookId: book._id,
      message: 'Book uploaded successfully',
      book: bookData
    }, { status: 201 });

  } catch (error) {
    console.error('Error uploading book:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload book',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { 
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}