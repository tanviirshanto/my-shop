import mongoose from "mongoose";
import Product from "./product";

const sellSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  invoice: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" },
  soldQty: { type: Number, required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Sell || mongoose.model("Sell", sellSchema);
