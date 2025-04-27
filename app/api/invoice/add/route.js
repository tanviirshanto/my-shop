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

    const { invoiceItems, customerId, payment, totalAmount, amountPaid, date } =
      body;

    // ✅ Basic Validation
    if (!Array.isArray(invoiceItems) || invoiceItems.length === 0) {
      return NextResponse.json(
        { error: "No invoice items provided." },
        { status: 400 }
      );
    }

    if (!customerId || !date || !payment) {
      return NextResponse.json(
        { error: "Missing required invoice fields." },
        { status: 400 }
      );
    }

    if (totalAmount < 0 || amountPaid < 0) {
      return NextResponse.json(
        { error: "Amounts cannot be negative." },
        { status: 400 }
      );
    }

    let buyingTotal = 0;
    const modifiedInvoiceItems = [];

    for (const invoiceItem of invoiceItems) {
      try {
        const { product, soldQty, itemTotal } = invoiceItem;
        const { thickness, height, color, price } = product;

        if (!thickness || !height || !color || !price || !soldQty) {
          return NextResponse.json(
            {
              error: "Incomplete product details in one of the invoice items.",
            },
            { status: 400 }
          );
        }

        const foundProduct = await Product.findOne({
          thickness,
          height,
          color,
        });

        if (!foundProduct) {
          return NextResponse.json(
            {
              error: `Product not found for: ${thickness}, ${height}, ${color}`,
            },
            { status: 404 }
          );
        }

        const buyingPrice = Number(foundProduct.price);
        let x = 0;

        if (price < 2000) {
          x = Math.floor(buyingPrice * soldQty);
        } else if (price > 2000 && price < 20000 && height !== "11") {
          const heightNum = Number(height);
          const bundleCalc = (groupVal) =>
            Math.floor(
              (buyingPrice * Math.floor(72 / heightNum)) /
                Math.floor(groupVal / heightNum)
            );
          // console.log(buyingPrice);
          // console.log(buyingPrice * (72 / heightNum));
          // console.log(Math.floor(1344 / heightNum));

          if (thkGroupOne.includes(thickness.toString().trim())) {
            // console.log(bundleCalc(1692));
            x = Math.floor(
              (bundleCalc(1692) * soldQty) / Math.floor(72 / heightNum)
            );
          } else if (thkGroupTwo.includes(thickness.toString().trim())) {
            // console.log(bundleCalc(1344));
            x = Math.floor(
              (bundleCalc(1344) * soldQty) / Math.floor(72 / heightNum)
            );
          } else if (thkGroupThree.includes(thickness.toString().trim())) {
            // console.log(bundleCalc(1053));
            x = Math.floor(
              (bundleCalc(1053) * soldQty) / Math.floor(72 / heightNum)
            );
          }
        } else if (price < 20000 && height === "11") {
          const heightNum = Number(height);
          const bundleCalc = (groupVal) =>
            Math.floor(
              (buyingPrice * Math.floor(72 / heightNum)) /
                Math.floor(groupVal / heightNum)
            );

          if (thkGroupOne.includes(thickness.toString().trim())) {
            // console.log(bundleCalc(1692));
            x = Math.floor((bundleCalc(1692) * soldQty * heightNum) / 72);
          } else if (thkGroupTwo.includes(thickness.toString().trim())) {
            // console.log(bundleCalc(1344));
            x = Math.floor((bundleCalc(1344) * soldQty * heightNum) / 72);
          } else if (thkGroupThree.includes(thickness.toString().trim())) {
            // console.log(bundleCalc(1053));
            x = Math.floor((bundleCalc(1053) * soldQty * heightNum) / 72);
          }
        } else if (price > 20000) {
          const heightNum = Number(height);
          const valMap = {
            thkGroupOne: 1692,
            thkGroupTwo: 1344,
            thkGroupThree: 1053,
          };

          if (thkGroupOne.includes(thickness.toString().trim())) {
            x = Math.floor(
              (buyingPrice * soldQty) /
                Math.floor(valMap.thkGroupOne / heightNum)
            );
          } else if (thkGroupTwo.includes(thickness.toString().trim())) {
            x = Math.floor(
              (buyingPrice * soldQty) /
                Math.floor(valMap.thkGroupTwo / heightNum)
            );
          } else if (thkGroupThree.includes(thickness.toString().trim())) {
            x = Math.floor(
              (buyingPrice * soldQty) /
                Math.floor(valMap.thkGroupThree / heightNum)
            );
          } else {
            return NextResponse.json(
              { error: "Program Error related to product group calculations." },
              { status: 500 }
            );
          }
        } else {
          return NextResponse.json(
            {
              error:
                "Unhandled pricing logic case. Equation still in development.",
            },
            { status: 500 }
          );
        }

        buyingTotal += x;

        modifiedInvoiceItems.push({
          product: foundProduct._id,
          soldQty,
          itemTotal,
          soldPrice: price,
          profit: itemTotal - x,
        });
      } catch (itemError) {
        console.error("Item processing error:", itemError);
        return NextResponse.json(
          { error: `Failed to process an invoice item: ${itemError.message}` },
          { status: 500 }
        );
      }
    }

    const profit = Number(amountPaid) - buyingTotal;

    const invoice = new Invoice({
      invoiceItems: modifiedInvoiceItems,
      customer: customerId,
      date,
      payment,
      totalAmount,
      amountPaid,
      netProfit: profit,
    });

    const savedInvoice = await invoice.save();

    try {
      const invoiceProfit = new InvoiceProfit({
        invoice: savedInvoice._id,
        profit,
      });
      await invoiceProfit.save();
    } catch (profitError) {
      console.error("InvoiceProfit Save Error:", profitError);
      return NextResponse.json(
        { error: `Failed to save invoice profit: ${profitError.message}` },
        { status: 500 }
      );
    }

    for (const item of modifiedInvoiceItems) {
      try {
        const stock = await Stock.findOne({ product: item.product });
        if (!stock) {
          return NextResponse.json(
            { error: `Stock not found for product: ${item.product}` },
            { status: 404 }
          );
        }

        const updatedStock = await Stock.findOneAndUpdate(
          { product: item.product },
          { $inc: { availableQty: -item.soldQty } },
          { new: true }
        );

        await StockBook.create({
          product: item.product,
          invoice: savedInvoice._id,
          quantity: Number(item.soldQty),
          newQty: updatedStock.availableQty,
          transactionType: "Sell",
        });
      } catch (stockError) {
        console.error("Stock handling error:", stockError);
        return NextResponse.json(
          {
            error: `Failed to update stock for a product: ${stockError.message}`,
          },
          { status: 500 }
        );
      }
    }

    for (const item of modifiedInvoiceItems) {
      try {
        const newSell = new Sell({
          product: item.product,
          soldQty: item.soldQty,
          invoice: savedInvoice._id,
          date,
        });
        await newSell.save();
      } catch (sellError) {
        console.error("Sell creation error:", sellError);
        return NextResponse.json(
          { error: `Failed to create Sell record: ${sellError.message}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ invoice: savedInvoice });
  } catch (error) {
    console.error("Invoice creation error (outer):", error);
    return NextResponse.json(
      { error: `Failed to create invoice: ${error.message}` },
      { status: 500 }
    );
  }
}
