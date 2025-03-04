// app/invoices/[id]/page.jsx (Server Component)
import InvoiceDetailPageClient from '@/app/components/InvoiceDetailPageClient.jsx';
import { connectDB } from '@/lib/db';
import { Invoice } from '@/models';
import React from 'react';

await connectDB();

const fetchInvoiceData = async (id) => {
    const invoiceData = await Invoice.findById(id).populate('customer invoiceItems.product');
    return invoiceData;
}

export default async function InvoiceDetailPage({ params }) {
    const invoiceData = await fetchInvoiceData(params.id);
    return <InvoiceDetailPageClient parsedInvoiceData={JSON.stringify(invoiceData)} />;
}