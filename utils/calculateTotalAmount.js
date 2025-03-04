const calculateTotalAmount = (invoiceItems) => {
    if (!Array.isArray(invoiceItems) || invoiceItems.length === 0) return 0;
  
    return invoiceItems.reduce((acc, item) => acc + (item.itemTotal || 0), 0);
  };
  
  export default calculateTotalAmount;
  