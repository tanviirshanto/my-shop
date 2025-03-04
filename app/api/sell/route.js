// app/api/sell/route.js
import { connectDB } from "@/lib/db";
import Product from "@/models/product";
import Stock from "@/models/stock";
import Sell from "@/models/sell";
import { NextResponse } from "next/server";

await connectDB();

export async function POST(request) {
  try {
    const { thickness, height, color, company, soldQty } = await request.json();

    // 1. Find the product
    const product = await Product.findOne({ thickness, height, color, company });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // 2. Update the stock (decrement)
    let stock = await Stock.findOne({ product: product._id });

    if (!stock) {
      return NextResponse.json({ error: "Stock entry not found for this product" }, { status: 404 });
    }

    if (stock.availableQty < soldQty) {
        return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
    }

    stock.availableQty -= Number(soldQty);  // Decrement sold quantity from stock

    await stock.save();

    // 3. Save the sell history
    const newSell = new Sell({
      product: product._id,
      soldQty,
      // You might want to include customer information here later
    });

    await newSell.save();

    return NextResponse.json(newSell, { status: 201 });
  } catch (error) {
    console.error("Error creating sell:", error);
    return NextResponse.json({ error: "Failed to create sell" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10; // Default limit

    const skip = (page - 1) * limit;

    const sells = await Sell.find({})
      .sort({ date: -1 })
      .populate("product")
      .skip(skip)
      .limit(limit);

    const totalSells = await Sell.countDocuments({});
    const totalPages = Math.ceil(totalSells / limit);

    return NextResponse.json(
      { sells, totalPages },
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching sells:", error);
    return NextResponse.json({ error: "Failed to fetch sells" }, { status: 500 });
  }
}