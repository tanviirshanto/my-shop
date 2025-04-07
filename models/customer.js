import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
}, { timestamps: true });

// Remove any old or unnecessary indexes before saving
customerSchema.index({ name: 1 }, { unique: false });

export default mongoose.models.Customer || mongoose.model("Customer", customerSchema);
