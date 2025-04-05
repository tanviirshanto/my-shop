import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
}, { timestamps: true });

export default mongoose.models.Customer || mongoose.model("Customer", customerSchema);
