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
  
 export function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }


