// app/api/stock/route.js
import { connectDB } from "@/lib/db";
import Stock from "@/models/stock";
import Product from "@/models/product";
import { NextResponse } from "next/server";

await connectDB();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const stocks = await Stock.find({})
      .sort({ thickness: 1 })
      .populate("product")
      .skip(skip)
      .limit(limit);

    const totalStocks = await Stock.countDocuments({});

    return NextResponse.json(
      { success: true, data: stocks, total: totalStocks, page, limit },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { product: productId, availableQty } = body;
    console.log("body", body);

    // Check if product exists
    const foundProduct = await Product.findById(productId);

    // if (!foundProduct) {
    //   return NextResponse.json(
    //     { success: false, message: "Product not found" },
    //     { status: 404 }
    //   );
    // }
    console.log("foundProduct", foundProduct);
    // Check if stock already exists for this product
    const existingStock = await Stock.findOne({ product: productId });

    if (existingStock) {
      // Stock already exists, you might want to update it instead of creating a new one
      // If you wish to update, uncomment the following code.
      // const updatedStock = await Stock.findByIdAndUpdate(existingStock._id, { availableQty }, { new: true });
      // return NextResponse.json({ success: true, data: updatedStock }, { status: 200 });
      return NextResponse.json(
        { success: false, message: "Stock already exists for this product" },
        { status: 400 }
      );
    }

    // Stock does not exist, create a new one
    const stock = await Stock.create({
      product: productId,
      availableQty,
    });
    console.log("Stock created:", stock);
    return NextResponse.json({ success: true, data: stock }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
