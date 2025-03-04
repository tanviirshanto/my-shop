import mongoose from "mongoose";

const invoiceProfitSchema = new mongoose.Schema({
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice", required: true },
    profit: { type: Number },
}, { timestamps: true });

export default mongoose.models.InvoiceProfit || mongoose.model("InvoiceProfit", invoiceProfitSchema);