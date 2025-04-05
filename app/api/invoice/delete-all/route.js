// app/api/invoices/delete-all/route.js

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Invoice from '@/models/invoice'; // Assuming your invoice model is in '@/models/invoice'
import { connectDB } from '@/lib/db'; // Assuming you have a database connection utility

export async function DELETE(request) {
  try {
    await connectDB();

    // Delete all invoices
    const result = await Invoice.deleteMany({});

    if (result.deletedCount > 0) {
      return NextResponse.json({ message: `Successfully deleted ${result.deletedCount} invoices.` }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'No invoices found to delete.' }, { status: 200 });
    }
  } catch (error) {
    console.error('Error deleting all invoices:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}