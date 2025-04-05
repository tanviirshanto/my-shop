import { NextResponse } from 'next/server';
import { Purchase } from '@/models';
import { connectDB } from '@/lib/db';

await connectDB();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;
    const company = searchParams.get('company'); // Optional filter by company

    let query = Purchase.find({}).populate('purchaseItems.product');

    if (company) {
      query = Purchase.find({ company }).populate('purchaseItems.product');
    }

    const purchases = await query.sort({ date: -1 }).skip(skip).limit(limit);
    const totalPurchases = company
      ? await Purchase.countDocuments({ company })
      : await Purchase.countDocuments({});

    const totalPages = Math.ceil(totalPurchases / limit);

    return NextResponse.json({ purchases, totalPages }, { status: 200 });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return NextResponse.json({ message: 'Failed to fetch purchases' }, { status: 500 });
  }
}
