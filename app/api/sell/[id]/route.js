import { connectDB } from "@/lib/db";
import Sell from "@/models/sell";
import Product from "@/models/product";
import { NextResponse } from "next/server";

await connectDB();

export async function PUT(request, { params }) {
  try {
    const { company, color, thickness, soldQty, height } = await request.json(); // Include all fields
    const { id } = params;

    const product = await Product.findOne({ company, color, thickness, height });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updatedSell = await Sell.findByIdAndUpdate(
      id,
      { product: product._id, soldQty }, // Update with all fields
      { new: true, runValidators: true } // Return the updated document, validate updates
    ).populate("product"); // Re-populate product after update

    if (!updatedSell) {
      return NextResponse.json({ error: "Sell not found" }, { status: 404 });
    }

    return NextResponse.json(updatedSell, { status: 200 });
  } catch (error) {
    console.error("Error updating sell:", error);
    return NextResponse.json({ error: "Failed to update sell" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const deletedSell = await Sell.findByIdAndDelete(id);

    if (!deletedSell) {
      return NextResponse.json({ error: "Sell not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Sell deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting sell:", error);
    return NextResponse.json({ error: "Failed to delete sell" }, { status: 500 });
  }
}