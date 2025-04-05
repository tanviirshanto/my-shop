// app/api/invoice/add/route.js
import { NextResponse } from "next/server";
import {
  Invoice,
  Stock,
  Product,
  Customer,
  InvoiceProfit,
  Sell,
  StockBook,
} from "@/models";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { thkGroupOne, thkGroupThree, thkGroupTwo } from "@/lib/constants";

await connectDB();

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Invoice Body:", body);
    const { invoiceItems, customerId, payment, totalAmount, amountPaid,date } = body;

    let buyingTotal = 0;
    const modifiedInvoiceItems = []; // Create a new array to store modified invoice items.

    // Add the sell items to Sell Table
    for (const invoiceItem of invoiceItems) {
      const { product, soldQty, itemTotal } = invoiceItem;
      const { thickness, height, color, price } = product;

      const foundProduct = await Product.findOne({
        thickness: thickness,
        height: height,
        color: color,
      });

      if (!foundProduct) {
        return NextResponse.json(
          { error: `Product not found for: ${thickness}, ${height}, ${color}` },
          { status: 404 }
        );
      }

      const newSell = new Sell({
        product: foundProduct._id,
        soldQty:-Math.abs(soldQty),
      });

      await newSell.save();

      const buyingPrice = Number(foundProduct.price);

      // x is total buying price of the product 
      let x = 0;

      // Calculation
      if (price < 2000 && height === "6") {
        if (thkGroupOne.includes(thickness.toString().trim())) {
          x = Math.floor(
            (buyingPrice / Math.floor(1692 / Number(height)) / 3) * soldQty
          );
        } else if (thkGroupTwo.includes(thickness.toString().trim())) {
          x = Math.floor(
            (buyingPrice / Math.floor(1344 / Number(height)) / 3) * soldQty
          );
        } else if (thkGroupThree.includes(thickness.toString().trim())) {
          x = Math.floor(
            (buyingPrice / Math.floor(1053 / Number(height)) / 3) * soldQty
          );
        } else {
          return NextResponse.json(
            { error: "Program Error related to product calculations." },
            { status: 500 }
          );
        }
      } else if (price < 2000 && height !== "6") {
        x = Math.floor(buyingPrice * soldQty);
      } else if (price < 20000 && height !== "11") {
        if (thkGroupOne.includes(thickness.toString().trim())) {
          const buyingPriceInBundle = Math.floor(
            (buyingPrice * (72 / height)) / Math.floor(1692 / Number(height))
          );
          x = Math.floor(
            (buyingPriceInBundle * soldQty) / Math.floor(72 / Number(height))
          );
        } else if (thkGroupTwo.includes(thickness.toString().trim())) {
          const buyingPriceInBundle = Math.floor(
            (buyingPrice * (72 / height)) / Math.floor(1344 / Number(height))
          );
          x = Math.floor(
            (buyingPriceInBundle * soldQty) / Math.floor(72 / Number(height))
          );
        } else if (thkGroupThree.includes(thickness.toString().trim())) {
          const buyingPriceInBundle = Math.floor(
            (buyingPrice * (72 / height)) / Math.floor(1053 / Number(height))
          );
          x = Math.floor(
            (buyingPriceInBundle * soldQty) / Math.floor(72 / Number(height))
          );
        }
      } else if (price > 20000) {
        if (thkGroupOne.includes(thickness.toString().trim())) {
          x = Math.floor(
            (buyingPrice * soldQty) / Math.floor(1692 / Number(height))
          );
        } else if (thkGroupTwo.includes(thickness.toString().trim())) {
          x = Math.floor(
            (buyingPrice * soldQty) / Math.floor(1344 / Number(height))
          );
        } else if (thkGroupThree.includes(thickness.toString().trim())) {
          x = Math.floor(
            (buyingPrice * soldQty) / Math.floor(1053 / Number(height))
          );
        } else {
          return NextResponse.json(
            { error: "Program Error related to product calculations." },
            { status: 500 }
          );
        }
      } else if (price < 20000 && height === "11") {
        if (thkGroupOne.includes(thickness.toString().trim())) {
          const buyingPriceInBundle = Math.floor(
            (buyingPrice * (72 / height)) / Math.floor(1692 / Number(height))
          );
          x = Math.floor((buyingPriceInBundle * soldQty * Number(height)) / 72);
        } else if (thkGroupTwo.includes(thickness.toString().trim())) {
          const buyingPriceInBundle = Math.floor(
            (buyingPrice * (72 / height)) / Math.floor(1344 / Number(height))
          );
          x = Math.floor((buyingPriceInBundle * soldQty * Number(height)) / 72);
        } else if (thkGroupThree.includes(thickness.toString().trim())) {
          const buyingPriceInBundle = Math.floor(
            (buyingPrice * (72 / height)) / Math.floor(1053 / Number(height))
          );
          x = Math.floor((buyingPriceInBundle * soldQty * Number(height)) / 72);
        }
      } else {
        return NextResponse.json(
          { error: "Equation is being developed" },
          { status: 500 }
        );
      }

      console.log("X:", x);
      buyingTotal += x;
      console.log("Buying Total:", buyingTotal);

      // Modify the invoice item to include the product's _id
      modifiedInvoiceItems.push({
        product: foundProduct._id,
        soldQty:-Math.abs(soldQty),
        itemTotal:-Math.abs(itemTotal),
        soldPrice:price,
        profit: -Math.abs(itemTotal - x),
      });
    }

    const profit = Number(amountPaid) - buyingTotal;

    const invoice = new Invoice({
      invoiceItems: modifiedInvoiceItems, // Use the modified invoice items
      customer: customerId,
      date,
      payment: payment,
      totalAmount:  -Math.abs(totalAmount),
      amountPaid:  -Math.abs(amountPaid),
      netProfit:  -Math.abs(profit),
    });

    const savedInvoice = await invoice.save();

    const invoiceProfit = new InvoiceProfit({
      invoice: savedInvoice._id,
      profit: -Math.abs(profit),
    });

    try {
      await invoiceProfit.save();
    } catch (profitError) {
      return NextResponse.json(
        { error: `Failed to save invoice profit: ${profitError.message}` },
        { status: 500 }
      );
    }

    for (const item of modifiedInvoiceItems) {
      const stock = await Stock.findOne({ product: item.product });
      if (!stock) {
        return NextResponse.json(
          { error: `Stock not found for product: ${item.product}` },
          { status: 404 }
        );
      }

      const updatedStock=await Stock.findOneAndUpdate(
        { product: item.product },
        { $inc: { availableQty: -item.soldQty } },
        { new: true }
      );

      await StockBook.create({
        product: item.product,
        quantity: Number(item.soldQty),
        newQty: updatedStock.availableQty,
        transactionType: "Return",
      });
    }


    return NextResponse.json({ invoice: savedInvoice });
  } catch (error) {
    console.error("Invoice creation error:", error);
    return NextResponse.json(
      { error: `Failed to create invoice: ${error.message}` },
      { status: 500 }
    );
  }
}
