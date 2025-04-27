import { NextResponse } from "next/server";
import Purchase from "@/models/purchase";
import Product from "@/models/product";
import Stock from "@/models/stock";
import StockBook from "@/models/stockBook";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    console.log("Purchase Body:", body);

    const { purchaseItems, company, totalAmount } = body;

    if (!purchaseItems?.length || !company || totalAmount < 0) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    let formattedPurchaseItems = [];

    for (const item of purchaseItems) {
      const { product, boughtQty, itemTotal } = item;
      const { thickness, height, color } = product;

      // Find the actual product in the database
      const foundProduct = await Product.findOne({ thickness, height, color });
      console.log("Found Product:", foundProduct);

      if (!foundProduct) {
        return NextResponse.json(
          { error: `Product not found for: ${thickness}, ${height}, ${color}` },
          { status: 404 }
        );
      }

      // Find the stock entry for this product
      const stock = await Stock.findOne({ product: foundProduct._id });
      console.log("Stock:", stock);
      if (!stock) {
        return NextResponse.json(
          {
            error: `Stock not found for product: ${thickness}, ${height}, ${color}`,
          },
          { status: 404 }
        );
      }

      const newQty = stock.availableQty + boughtQty;

      // Update stock quantity
      const stockUpdate = await Stock.findOneAndUpdate(
        { product: foundProduct._id },
        { $inc: { availableQty: boughtQty } },
        { new: true }
      );

      console.log("Stock Update:", stockUpdate);

      // Add entry to StockBook
      const stockBookCreate = await StockBook.create({
        product: foundProduct._id,
        quantity: Number(boughtQty),
        newQty: stockUpdate.availableQty,
        transactionType: "Purchase",
      });

      console.log("Stock Create:", stockBookCreate);

      const pushItems = formattedPurchaseItems.push({
        product: foundProduct._id, // Store ObjectId instead of object
        boughtQty,
        itemTotal, // Ensure itemTotal is included
      });
      console.log("Push Items:", pushItems);
    }

    // Create a new purchase with properly formatted data
    const newPurchase = await Purchase.create({
      purchaseItems: formattedPurchaseItems,
      company,
      totalAmount,
    });

    console.log(newPurchase);

    return NextResponse.json(
      { message: "Purchase added successfully", purchase: newPurchase },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding purchase:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
