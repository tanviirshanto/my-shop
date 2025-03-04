import { connectDB } from "@/lib/db";
import Config from "@/models/config";

await connectDB();

// GET: Fetch configuration settings
export async function GET() {
  try {
    const config = await Config.findOne({});
    if (!config) {
      return new Response(JSON.stringify({ error: "Config not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify(config), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch config" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}



// POST: Add a new value to a specific field
export async function POST(request) {
  
    try {
      const { field, value } = await request.json();

      console.log(field,value);
  
      if (!field || !value) {
        return new Response(JSON.stringify({ error: "Field and value are required" }), { status: 400 });
      }
  
      // Ensure the config document exists
      let config = await Config.findOne({});
      if (!config) {
        config = await Config.create({
          thicknesses: [],
          heights: [],
          colors: [],
          companies: [],
        });
      }
  
      // Push new value to the specified field
      const updatedConfig = await Config.findOneAndUpdate(
        {},
        { $addToSet: { [field]: value } }, // `$addToSet` prevents duplicates
        { new: true }
      );
  
      return new Response(JSON.stringify(updatedConfig), { status: 201 });
  
    } catch (error) {
      console.error("Error adding item:", error);
      return new Response(JSON.stringify({ error: "Failed to add item" }), { status: 500 });
    }
  }

// PUT: Edit an existing value in a specific field
export async function PUT(request) {
  try {
    const { field, oldValue, newValue } = await request.json();
    const config = await Config.findOneAndUpdate({}, { $set: { [`${field}.$[elem]`]: newValue } }, { 
      arrayFilters: [{ elem: oldValue }], new: true 
    });

    return new Response(JSON.stringify(config), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update item" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// DELETE: Remove a value from a specific field
export async function DELETE(request) {
  try {
    const { field, value } = await request.json();
    const config = await Config.findOneAndUpdate({}, { $pull: { [field]: value } }, { new: true });

    return new Response(JSON.stringify(config), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete item" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
