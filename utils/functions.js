export function getCurrentMonthAndYear() {
    const now = new Date();
    const month = now.getMonth(); // Months are zero-indexed, so add 1
    const year = now.getFullYear();
  
    return { month, year };
  }

// Utility function to format date as dd/mm/yyyy
export const formatMMDDtoDDMM = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0'); // Ensure two digits
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export function generateRandomText(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}