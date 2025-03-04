import { connectDB } from "@/lib/db";
import Config from "@/models/config";

await connectDB();


export async function POST(request) {
    
    try {
      const { thicknesses, heights, colors, companies } = await request.json();
  
      // Ensure arrays are not empty before updating
      const updateData = {};
      if (thicknesses?.length) updateData.thicknesses = thicknesses;
      if (heights?.length) updateData.heights = heights;
      if (colors?.length) updateData.colors = colors;
      if (companies?.length) updateData.companies = companies;
  
      // Use `$set` to replace entire array instead of `$push`
      const config = await Config.findOneAndUpdate({}, { $set: updateData }, { new: true, upsert: true });
      console.log(config);
  
      return new Response(JSON.stringify({ message: "Config updated successfully", data: config }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error updating config:", error);
      return new Response(JSON.stringify({ error: "Failed to update config" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
