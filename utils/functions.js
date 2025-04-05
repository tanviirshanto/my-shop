export function getCurrentMonthAndYear() {
    const now = new Date();
    const month = now.getMonth(); // Months are zero-indexed, so add 1
    const year = now.getFullYear();
  
    return { month, year };
  }