import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  thickness: Number, // Stored as a number
  height: Number, // Stored as a number
  price: Number,
  color: String,
  company: String, // Not using Ref to simplify
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", productSchema);
