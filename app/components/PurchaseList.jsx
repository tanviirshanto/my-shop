// app/components/PurchaseList.jsx
"use client"; // Mark as a Client Component

import { useEffect, useState } from "react";

const PurchaseList = ({ refresh }) => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    fetchPurchases();
  }, [refresh]); // Refresh when the `refresh` prop changes

  const fetchPurchases = async () => {
    const response = await fetch("/api/purchase");
    const data = await response.json();
    setPurchases(data);
  };

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Company</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((purchase) => (
            <tr key={purchase._id}>
              <td>{purchase.product?.height} ft - {purchase.product?.thickness} mm - {purchase.product?.color}</td>
              <td>{purchase.boughtQty}</td>
              <td>{purchase.company}</td>
              <td>{new Date(purchase.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseList;