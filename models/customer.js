import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  address: String,
}, { timestamps: true });

export default mongoose.models.Customer || mongoose.model("Customer", customerSchema);
