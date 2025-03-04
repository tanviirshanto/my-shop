import mongoose from "mongoose";
import Product from "./product";

const invoiceSchema = new mongoose.Schema({
  invoiceItems: [{ 
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, 
    soldQty: { type: Number, required: true, min: 1 },
    itemTotal: { type: Number, required: true, min: 0 },
    profit: { type: Number}, 
  }],
  date: { type: Date, default: Date.now },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  payment: { type: String, enum: ["Paid", "Pending"], default: "Pending" },
  totalAmount: { type: Number, required: true, min: 0 },
  amountPaid: { type: Number, default: 0, min: 0 },
  netProfit: { type: Number },
}, { timestamps: true });

export default mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);
