// app/api/stock/reset-quantity/route.js

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Stock from '@/models/stock'; // Assuming your Stock model is in '@/models/stock'
import { connectDB } from '@/lib/db'; // Assuming you have a database connection utility

export async function PUT(request) { // Use PUT for updating resources
  try {
    await connectDB();

    // Update all stocks to set availableQty to 0
    const result = await Stock.updateMany({}, { availableQty: 0 });

    if (result.modifiedCount > 0) {
      return NextResponse.json({ message: `Successfully reset availableQty to 0 for ${result.modifiedCount} stocks.` }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'No stocks found to update.' }, { status: 200 });
    }
  } catch (error) {
    console.error('Error resetting stock quantities:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}