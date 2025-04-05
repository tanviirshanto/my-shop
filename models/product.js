import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  thickness: String, // Stored as a number
  height: String, // Stored as a number
  price: Number,
  color: String,
  company: String, // Not using Ref to simplify
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", productSchema);
