import mongoose from "mongoose";
import Product from "./product";

const purchaseSchema = new mongoose.Schema({
  purchaseItems: [{ 
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, 
      boughtQty: { type: Number, required: true, min: 1 },
      itemTotal: { type: Number, required: true, min: 0 },
    }],
  company: { type: String, required: true },
  totalAmount: { type: Number, required: true, min: 0 },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema);
