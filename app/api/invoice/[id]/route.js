// app/api/invoices/[id]/route.js
import { NextResponse } from 'next/server';
import Invoice from '@/models/invoice';
import { connectDB } from '@/lib/db';

await connectDB();

export async function GET(request, { params }) {
  const { id } = params;

  try {
    

    const invoice = await Invoice.findById(id).populate('customer invoiceItems.product');

    if (!invoice) {
      return NextResponse.json({ message: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json(invoice, { status: 200 });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json({ message: 'Failed to fetch invoice' }, { status: 500 });
  }
}

//If you need to add PUT and DELETE routes.
export async function PUT(request, { params }) {
    const { id } = params;

    try {
        

        const body = await request.json();
        const updatedInvoice = await Invoice.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        }).populate('customer invoiceItems.product');

        if (!updatedInvoice) {
            return NextResponse.json({ message: 'Invoice not found' }, { status: 404 });
        }

        return NextResponse.json(updatedInvoice, { status: 200 });
    } catch (error) {
        console.error('Error updating invoice:', error);
        return NextResponse.json({ message: 'Failed to update invoice' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { id } = params;

    try {
       

        const deletedInvoice = await Invoice.findByIdAndDelete(id);

        if (!deletedInvoice) {
            return NextResponse.json({ message: 'Invoice not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Invoice deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting invoice:', error);
        return NextResponse.json({ message: 'Failed to delete invoice' }, { status: 500 });
    }
}