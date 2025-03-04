import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
  thicknesses: { type: [String], default: [] }, 
  heights: { type: [String], default: [] }, 
  colors: { type: [String], default: [] }, 
  companies: { type: [String], default: [] } 
});

export default mongoose.models.Config || mongoose.model("Config", configSchema);
