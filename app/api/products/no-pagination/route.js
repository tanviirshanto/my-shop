import { connectDB } from "@/lib/db";
import Product from "@/models/product";
import { NextResponse } from "next/server";

// Connect to the database
await connectDB();

// GET: Fetch all products (no server-side pagination)
export async function GET() {
  try {
    const products = await Product.find({}).sort({ thickness: 1, height: 1 });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
