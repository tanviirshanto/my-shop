// app/api/sell/delete-all/route.js

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Sell from '@/models/sell'; // Assuming your sell model is in '@/models/sell'
import { connectDB } from '@/lib/db'; // Assuming you have a database connection utility

export async function DELETE(request) {
  try {
    await connectDB();

    // Delete all sells
    const result = await Sell.deleteMany({});

    if (result.deletedCount > 0) {
      return NextResponse.json({ message: `Successfully deleted ${result.deletedCount} sells.` }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'No sells found to delete.' }, { status: 200 });
    }
  } catch (error) {
    console.error('Error deleting all sells:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}