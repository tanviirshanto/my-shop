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
    // Ensure database connection
    await connectDB();

    const { name, phone, address } = await request.json();

    console.log(name, phone, address, "name, phone, address");

    const newCustomer = new Customer({
      name,
      phone,
      address,
    });

    console.log(newCustomer, "newCustomer");

    // Try saving the new customer to the database
    await newCustomer.save();

    return new Response(JSON.stringify(newCustomer), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Log full error stack for debugging
    console.error('Error creating customer:', error.message);
    console.error(error.stack);

    // Return a more detailed error response
    return new Response(
      JSON.stringify({ error: "Failed to create customer", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
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