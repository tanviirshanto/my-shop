// app/api/stockBooks/delete-all/route.js

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import StockBook from '@/models/stockBook'; // Assuming your stockBook model is in '@/models/stockBook'
import { connectDB } from '@/lib/db'; // Assuming you have a database connection utility

export async function DELETE(request) {
  try {
    await connectDB();
    console.log('Deleting all stockBooks...');
    // Delete all stockBooks
    const result = await StockBook.deleteMany({});

    if (result.deletedCount > 0) {
      return NextResponse.json({ message: `Successfully deleted ${result.deletedCount} stockBooks.` }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'No stockBooks found to delete.' }, { status: 200 });
    }
  } catch (error) {
    console.error('Error deleting all stockBooks:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}