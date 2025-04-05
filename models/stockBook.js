import mongoose from "mongoose";
import Product from "./product";

const stockBookSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  newQty: { type: Number, required: true},
  transactionType: { type: String, required: true },   
  date: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }

}, { timestamps: true });

export default mongoose.models.StockBook || mongoose.model("StockBook", stockBookSchema);