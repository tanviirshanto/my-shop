// app/api/purchase/[id]/route.js (for PUT and DELETE)
import { connectDB } from "@/lib/db";
import Purchase from "@/models/purchase";
import { NextResponse } from "next/server";

await connectDB();

export async function PUT(request, { params }) {
  try {
    const { boughtQty } = await request.json();
    const { id } = params;

    const updatedPurchase = await Purchase.findByIdAndUpdate(
      id,
      { boughtQty },
      { new: true } // Return the updated document
    ).populate("product"); // Re-populate product after update

    if (!updatedPurchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }

    return NextResponse.json(updatedPurchase, { status: 200 });
  } catch (error) {
    console.error("Error updating purchase:", error);
    return NextResponse.json({ error: "Failed to update purchase" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const deletedPurchase = await Purchase.findByIdAndDelete(id);

    if (!deletedPurchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Purchase deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting purchase:", error);
    return NextResponse.json({ error: "Failed to delete purchase" }, { status: 500 });
  }
}