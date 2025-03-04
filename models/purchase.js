import mongoose from "mongoose";
import Product from "./product";

const purchaseSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  boughtQty: { type: Number, required: true, min: 1 },
  company: { type: String, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema);
