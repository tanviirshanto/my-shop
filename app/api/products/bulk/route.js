import { connectDB } from "@/lib/db";
import { Stock } from "@/models";
import Product from "@/models/product";
import { NextResponse } from "next/server";

// Connect to the database
await connectDB();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 50;
    const skip = (page - 1) * limit;

    const variations = await Product.aggregate([
      {
        $group: {
          _id: { thickness: "$thickness", color: "$color", price: "$price" },
        },
      },
      {
        $project: {
          _id: 0,
          thickness: "$_id.thickness",
          color: "$_id.color",
          price: "$_id.price",
        },
      },
      { $sort: { thickness: 1, color: 1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const totalVariations = await Product.aggregate([
      {
        $group: {
          _id: { thickness: "$thickness", color: "$color", price: "$price" },
        },
      },
      {
        $count: "count",
      },
    ]);

    const totalCount = totalVariations.length > 0 ? totalVariations[0].count : 0;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({ variations, totalPages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching variations:", error);
    return NextResponse.json(
      { error: "Failed to fetch variations" },
      { status: 500 }
    );
  }
}

// POST: Create multiple products with varying heights

export async function POST(request) {
  try {
    const { thickness, price, color, company } = await request.json();
    const createdProducts = [];

    const existingProduct = await Product.findOne({
      thickness,
      color,
      company,
    });

    if (existingProduct) {
      
      return NextResponse.json(
        { error: `Product with thickness ${thickness}, color ${color}, and company ${company} already exists.` },
        { status: 400 }
      );
    }

    for (let height = 6; height <= 10; height++) {
      // Check if the product already exists
      const newProduct = new Product({
        thickness,
        height,
        price,
        color,
        company,
      });

      const savedProduct = await newProduct.save();

      await Stock.create({
        product: savedProduct._id,
        availableQty: 0,
      });

      createdProducts.push(savedProduct);
    }

    return NextResponse.json(createdProducts, { status: 201 });
  } catch (error) {
    console.error("Error creating products:", error);
    return NextResponse.json(
      { error: "Failed to create products" },
      { status: 500 }
    );
  }
}


export async function PUT(request) {
  try {
    const {
      originalThickness,
      originalColor,
      thickness,
      price,
      color,
      company,
    } = await request.json();

    await Product.updateMany(
      { thickness: originalThickness, color: originalColor },
      { thickness, price, color, company }
    );

    return NextResponse.json({ message: "Products updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating products:", error);
    return NextResponse.json(
      { error: "Failed to update products" },
      { status: 500 }
    );
  }
}