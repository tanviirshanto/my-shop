export const fetchConfig = async () => {
    try {
      const response = await fetch("/api/config");
      if (!response.ok) throw new Error("Failed to fetch config");
      return await response.json();
    } catch (error) {
      console.error("Error fetching config:", error);
      return null;
    }
  };
  
  export const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customers");
      if (!response.ok) throw new Error("Failed to fetch customers");
      const data = await response.json();
      console.log("Customers:", data);
      return data;
    } catch (error) {
      console.error("Error fetching customers:", error);
      return [];
    }
  };
  