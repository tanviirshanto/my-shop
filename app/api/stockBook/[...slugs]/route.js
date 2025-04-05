// app/api/items/[...slugs]/route.js

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Product from '@/models/product';
import StockBook from '@/models/stockBook';
import { connectDB } from '@/lib/db';
import { Stock } from '@/models';

export async function GET(request, { params }) { // Remove paramsPromise and use directly params
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const slugs = params.slugs || []; // Use params directly

    if (slugs.length !== 3) {
      return NextResponse.json(
        { message: 'Please provide thickness, height, and color as slugs.' },
        { status: 400 }
      );
    }

    const [thickness, height, color] = slugs;

    const product = await Product.findOne({
      thickness: thickness,
      height: height,
      color: color,
    });

    if (!product) {
      return NextResponse.json({ message: 'Product is not created yet.' }, { status: 200 });
    }

    const totalItems = await StockBook.countDocuments({ product: product._id });
    const totalPages = Math.ceil(totalItems / limit);

    const items = await StockBook.find({ product: product._id })
      .populate('product')
      .skip(skip)
      .limit(limit);

    const stock = await Stock.find({ product: product._id });
    let availableQty = undefined;

    if (stock && stock.length > 0) {
      availableQty = stock[0].availableQty;
    }

    console.log(availableQty);

    if (items.length === 0) {
      return NextResponse.json({ availableQty, message: 'No records in Stock Book' }, { status: 200 });
    }

    return NextResponse.json({ items, availableQty, totalPages, currentPage: page }, { status: 200 });
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}