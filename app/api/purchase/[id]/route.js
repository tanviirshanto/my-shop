// app/api/purchases/[id]/route.js
import { NextResponse } from 'next/server';
import Purchase from '@/models/purchase';
import { connectDB } from '@/lib/db';

await connectDB();

export async function GET(request, { params }) {
  const { id } = params;

  try {
    

    const purchase = await Purchase.findById(id);

    if (!purchase) {
      return NextResponse.json({ message: 'Purchase not found' }, { status: 404 });
    }

    return NextResponse.json(purchase, { status: 200 });
  } catch (error) {
    console.error('Error fetching purchase:', error);
    return NextResponse.json({ message: 'Failed to fetch purchase' }, { status: 500 });
  }
}