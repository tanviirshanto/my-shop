// app/api/stocks/[id]/route.js
import {connectDB} from "@/lib/db";
import Stock from "@/models/stock";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await connectDB();
  try {
    const stock = await Stock.findById(params.id).populate("product");
    if (!stock) {
      return NextResponse.json({ success: false, message: "Stock not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: stock }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request, { params }) {
  await connectDB();
  try {
    const body = await request.json();
    const stock = await Stock.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    }).populate("product");
    if (!stock) {
      return NextResponse.json({ success: false, message: "Stock not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: stock }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  await connectDB();
  try {
    const deletedStock = await Stock.findByIdAndDelete(params.id);
    if (!deletedStock) {
      return NextResponse.json({ success: false, message: "Stock not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}