import { connectDB } from "@/lib/db";
import Customer from "@/models/customer";
import { NextResponse } from "next/server";

await connectDB();

export async function PUT(request, { params }) {
  try {
    const { name, email, phone, address } = await request.json();
    const { id } = params;

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { name, email, phone, address },
      { new: true, runValidators: true } // Return updated doc, run validators
    );

    if (!updatedCustomer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json(updatedCustomer, { status: 200 });
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const deletedCustomer = await Customer.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Customer deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}