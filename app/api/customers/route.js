// app/api/customers/route.js
import { connectDB } from "@/lib/db";
import Customer from "@/models/customer";

// Connect to the database
await connectDB();

// GET: Fetch all customers
export async function GET() {
  try {
    const customers = await Customer.find({});
    return new Response(JSON.stringify(customers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch customers" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// POST: Create a new customer
export async function POST(request) {
  try {
    const { name, phone, address } = await request.json();

    const newCustomer = new Customer({
      name,
      phone,
      address,
    });

    await newCustomer.save();

    return new Response(JSON.stringify(newCustomer), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create customer" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// PUT: Update a customer by ID
export async function PUT(request) {
  try {
    const { id, name, phone, address } = await request.json();

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { name, phone, address },
      { new: true } // Return the updated document
    );

    if (!updatedCustomer) {
      return new Response(JSON.stringify({ error: "Customer not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(updatedCustomer), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update customer" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// DELETE: Delete a customer by ID
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    const deletedCustomer = await Customer.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return new Response(JSON.stringify({ error: "Customer not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Customer deleted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete customer" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}