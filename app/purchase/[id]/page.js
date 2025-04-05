// app/purchases/[id]/page.jsx (Server Component)
import PurchaseDetailPageClient from '@/app/components/PurchaseDetailPageClient.jsx';
import { connectDB } from '@/lib/db';
import { Purchase } from '@/models';
import React from 'react';

await connectDB();

const fetchPurchaseData = async (id) => {
    const purchaseData = await Purchase.findById(id).populate('purchaseItems.product');
    return purchaseData;
}

export default async function PurchaseDetailPage({ params }) {
    const purchaseData = await fetchPurchaseData(params.id);
    return <PurchaseDetailPageClient parsedPurchaseData={JSON.stringify(purchaseData)} />;
}