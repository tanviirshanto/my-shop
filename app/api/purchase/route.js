// app/api/purchase/route.js
import { connectDB } from "@/lib/db";
import Product from "@/models/product";
import Stock from "@/models/stock";
import Purchase from "@/models/purchase";

// Connect to the database
await connectDB();

// POST: Create a new purchase
export async function POST(request) {
  try {
    const { thickness, height, color, company, boughtQty } = await request.json();

    // Step 1: Find the exact product
    const product = await Product.findOne({ thickness, height, color, company });

    if (!product) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Step 2: Update the stock
    let stock = await Stock.findOne({ product: product._id });

    if (!stock) {
      // If stock doesn't exist, create a new entry
      stock = new Stock({
        product: product._id,
        availableQty: Number(boughtQty),
      });
    } else {
      // If stock exists, update the available quantity
      stock.availableQty += Number(boughtQty);
    }

    await stock.save();

    // Step 3: Save the purchase history
    const newPurchase = new Purchase({
      product: product._id,
      boughtQty,
      company,
    });

    await newPurchase.save();

    return new Response(JSON.stringify(newPurchase), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create purchase" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// GET: Fetch all purchase history
export async function GET() {
  try {
    const purchases = await Purchase.find({}).populate("product");
    return new Response(JSON.stringify(purchases), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch purchases" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}