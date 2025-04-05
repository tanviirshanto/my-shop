// app/api/purchases/delete-all/route.js

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Purchase from '@/models/purchase'; // Assuming your purchase model is in '@/models/purchase'
import { connectDB } from '@/lib/db'; // Assuming you have a database connection utility

export async function DELETE(request) {
  try {
    await connectDB();

    // Delete all purchases
    const result = await Purchase.deleteMany({});

    if (result.deletedCount > 0) {
      return NextResponse.json({ message: `Successfully deleted ${result.deletedCount} purchases.` }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'No purchases found to delete.' }, { status: 200 });
    }
  } catch (error) {
    console.error('Error deleting all purchases:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}