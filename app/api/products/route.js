import { connectDB } from "@/lib/db";
import { Stock } from "@/models";
import Product from "@/models/product";
import { NextResponse } from "next/server";

// Connect to the database
await connectDB();

// GET: Fetch all products
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({})
      .sort({ thickness: 1, height: 1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments({});
    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json({ products, totalPages }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST: Create a new product
export async function POST(request) {
  try {
    const { thickness, height, price, color, company } = await request.json();

    const existingProduct = await Product.findOne({
      thickness,
      height,
      color,
      company,
    });

    if (existingProduct) {
      throw new Error("Product already exists");
    }

    const newProduct = new Product({
      thickness,
      height,
      price,
      color,
      company,
    });

    // Save the product and get the saved document
    const savedProduct = await newProduct.save();

    // Create a corresponding stock item
    const newStock = new Stock({
      product: savedProduct._id, // Use the _id from the saved product
      availableQty: 0,
    });

    const savedStock = await newStock.save();

    return new Response(JSON.stringify(savedProduct), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return new Response(JSON.stringify({ error: "Failed to create product" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// PUT: Update a product by ID
export async function PUT(request) {
  try {
    const { id, thickness, height, price, color, company } =
      await request.json();

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { thickness, height, price, color, company },
      { new: true }
    );

    if (!updatedProduct) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(updatedProduct), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update product" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// DELETE: Delete a product by ID
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Delete the corresponding stock item
    await Stock.deleteOne({ product: deletedProduct._id });

    return new Response(
      JSON.stringify({
        message: "product and associated stock deleted successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete product" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
