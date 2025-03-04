// app/api/invoice/add/route.js
import { NextResponse } from "next/server";
import { Invoice, Stock, Product, Customer, InvoiceProfit, Sell } from "@/models";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { thkGroupOne, thkGroupThree, thkGroupTwo } from "@/lib/constants";

await connectDB();

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Invoice Body:", body);
    const { invoiceItems, customerId, payment, totalAmount, amountPaid } = body;

    let buyingTotal = 0;
    const modifiedInvoiceItems = []; // Create a new array to store modified invoice items.

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
        soldQty,
      });

      await newSell.save();

      const buyingPrice = Number(foundProduct.price);

      let x = 0;
      
      if(price < 20000 && height !== "11" && height !== "Ridging") {
        if (thkGroupOne.includes(thickness.toString().trim())) {
          const buyingPriceInBundle = Math.floor((buyingPrice *(72/height))/Math.floor(1692 / Number(height)));
          x= Math.floor((buyingPriceInBundle * soldQty) / Math.floor(72 / Number(height)));
        }
        else if (thkGroupTwo.includes(thickness.toString().trim())) {
          const buyingPriceInBundle = Math.floor((buyingPrice *(72/height))/Math.floor(1344 / Number(height)));
          x= Math.floor((buyingPriceInBundle * soldQty) / Math.floor(72 / Number(height)));

        }
        else if (thkGroupThree.includes(thickness.toString().trim())) {
          const buyingPriceInBundle = Math.floor((buyingPrice *(72/height))/Math.floor(1053 / Number(height)));
          x= Math.floor((buyingPriceInBundle * soldQty) / Math.floor(72 / Number(height)))
        }
      }


      else if(price > 20000 ) {
        
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
      } 
      

      else if(price < 20000 && height === "11") {
        if (thkGroupOne.includes(thickness.toString().trim())) {
          const buyingPriceInBundle = Math.floor((buyingPrice *(72/height))/Math.floor(1692 / Number(height)));
          x= Math.floor((buyingPriceInBundle * soldQty * Number(height)) / 72);
        }
        else if (thkGroupTwo.includes(thickness.toString().trim())) {
          const buyingPriceInBundle = Math.floor((buyingPrice *(72/height))/Math.floor(1344 / Number(height)));
          x= Math.floor((buyingPriceInBundle * soldQty * Number(height)) / 72);

        }
        else if (thkGroupThree.includes(thickness.toString().trim())) {
          const buyingPriceInBundle = Math.floor((buyingPrice *(72/height))/Math.floor(1053 / Number(height)));
          x= Math.floor((buyingPriceInBundle * soldQty * Number(height)) / 72);
        }
      }

      else if(height === "Ridging"){
        if (thkGroupOne.includes(thickness.toString().trim())) {
          x = Math.floor(
            (((buyingPrice) / Math.floor(1692 / Number(height)))/3)*soldQty
          );
        } else if (thkGroupTwo.includes(thickness.toString().trim())) {
          x = Math.floor(
            (((buyingPrice) / Math.floor(1344 / Number(height)))/3)*soldQty
          );
        } else if (thkGroupThree.includes(thickness.toString().trim())) {
          x = Math.floor(
            (((buyingPrice) / Math.floor(1053 / Number(height)))/3)*soldQty
          );
        } else {
          return NextResponse.json(
            { error: "Program Error related to product calculations." },
            { status: 500 }
          );
        }
      }

      else {
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
        soldQty,
        itemTotal,
        profit: itemTotal - x,
      });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    const profit = Number(totalAmount) - buyingTotal;

    const invoice = new Invoice({
      invoiceItems: modifiedInvoiceItems, // Use the modified invoice items
      customer: customerId,
      date: new Date(),
      payment: payment,
      totalAmount: totalAmount,
      amountPaid: amountPaid,
      netProfit: profit,
    });

    const savedInvoice = await invoice.save();


    const invoiceProfit = new InvoiceProfit({
      invoice: savedInvoice._id,
      profit: profit,
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

      if (stock.availableQty < item.soldQty) {
        return NextResponse.json(
          { error: `Insufficient stock for product: ${item.product}` },
          { status: 400 }
        );
      }

      await Stock.findOneAndUpdate(
        { product: item.product },
        { $inc: { availableQty: -item.soldQty } },
        { new: true }
      );
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