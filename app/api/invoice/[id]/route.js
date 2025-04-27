// app/api/invoices/[id]/route.js
import { NextResponse } from 'next/server';
import Invoice from '@/models/invoice';
import { connectDB } from '@/lib/db';
import { Sell, Stock, StockBook } from '@/models';


export async function GET(request, { params }) {
  const { id } = params;

  try {
await connectDB();
    

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

export async function PUT(req, { params }) {
    const { id } = params;
    const { date, customerId, payment, totalAmount, amountPaid, invoiceItems } = await req.json();
  
    try {
await connectDB();

      // Update the invoice date and other details
      const updatedInvoice = await Invoice.findByIdAndUpdate(
        id,
        { date, customer: customerId, payment, totalAmount, amountPaid, invoiceItems },
        { new: true }
      ).populate('customer invoiceItems.product');
  
      if (!updatedInvoice) {
        return new Response('Invoice not found', { status: 404 });
      }
  
      // Update the associated sells records with the new invoice date
      await Sell.updateMany(
        { invoice: id }, // Find all sells associated with this invoice
        { date } // Update the date of these sells to match the updated invoice date
      );

      await StockBook.updateMany(
        { invoice: id }, // Find all sells associated with this invoice
        { date } // Update the date of these sells to match the updated invoice date
      );
  
      return new Response(JSON.stringify(updatedInvoice), { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response('Error updating invoice', { status: 500 });
    }}
  

    export async function DELETE(req, { params }) {
      const { id } = params;
    
      try {
await connectDB();

        // Fetch the invoice first to access its items
        const invoice = await Invoice.findById(id).populate("invoiceItems.product");
    
        if (!invoice) {
          return new Response("Invoice not found", { status: 404 });
        }
    
        // Loop through invoice items and revert stock quantities
        for (const item of invoice.invoiceItems) {
          const productId = item.product._id;
          const soldQty = item.soldQty;
    
          const updatedStock = await Stock.findOneAndUpdate(
            { product: productId },
            { $inc: { availableQty: soldQty } },
            { new: true }
          );
    
          if (!updatedStock) {
            console.warn(`Stock not found for product ${productId}, skipping...`);
            continue; // Skip to next item
          }
    
        }
    
        // Delete Sell records
        await Sell.deleteMany({ invoice: id });
    
        // Delete StockBook entries related to original sell (not the rollback)
        await StockBook.deleteMany({
          invoice: id,
          transactionType: "Sell" // Only delete original sell records
        });
    
        // Delete invoice profit record (optional but recommended)
        // await InvoiceProfit.deleteOne({ invoice: id });
    
        // Delete the invoice
        await Invoice.findByIdAndDelete(id);
    
        return new Response("Invoice deleted and stock reset successfully", { status: 200 });
    
      } catch (error) {
        console.error("Error deleting invoice and resetting stock:", error);
        return new Response("Error deleting invoice", { status: 500 });
      }
    }
    
    