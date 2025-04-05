// app/api/sells/[...slugs]/route.js

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Product from '@/models/product';
import Sell from '@/models/sell';
import { connectDB } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const slugs = params.slugs || [];

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
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const totalSells = await Sell.countDocuments({ product: product._id });
    const totalPages = Math.ceil(totalSells / limit);

    const sells = await Sell.find({ product: product._id })
      .populate('product customer')
      .skip(skip)
      .limit(limit);

    return NextResponse.json({ sells, totalPages, currentPage: page }, { status: 200 });
  } catch (error) {
    console.error('Error fetching sells:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}