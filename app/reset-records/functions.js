import { toast } from "react-hot-toast";


  export const handleReset = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/${e.target.name}/delete-all`, { method: "DELETE" });
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
  
      toast.success(data.message);
    } catch (error) {
      console.error("API call failed", error);
      toast.error(error.message);
    }
  };

  export const handleStockQuantity = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/stock/reset-quantity`, { method: "PUT" });
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
  
      toast.success(data.message);
    } catch (error) {
      console.error("API call failed", error);
      toast.error(error.message);
    }
  };
  
