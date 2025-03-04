// app/api/invoice/get/route.ts
import { NextResponse } from 'next/server';
import { Invoice } from '@/models';
import { connectDB } from '@/lib/db';

await connectDB();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    const customerId = searchParams.get('customerId'); // Get customerId from query

    let query = Invoice.find({}).populate('customer invoiceItems.product');

    if (customerId) {
      query = Invoice.find({ customer: customerId }).populate('customer invoiceItems.product');
    }

    const invoices = await query.sort({ date: -1 }).skip(skip).limit(limit);
    const totalInvoices = customerId
      ? await Invoice.countDocuments({ customer: customerId })
      : await Invoice.countDocuments({});

    const totalPages = Math.ceil(totalInvoices / limit);

    return NextResponse.json({ invoices, totalPages }, { status: 200 });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ message: 'Failed to fetch invoices' }, { status: 500 });
  }
}