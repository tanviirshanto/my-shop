import mongoose from "mongoose";
import Product from "./product";

const stockSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  availableQty: { type: Number, required: true, min: 0 },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Stock || mongoose.model("Stock", stockSchema);
