// components/PurchasePreview.jsx
"use client";
import React from "react";

const PurchasePreview = ({ purchaseData, setPurchaseData }) => {
  const { purchaseItems, company, totalAmount, boughtQty } = purchaseData;

  const removeItem = (index) => {
    const updatedItems = [...purchaseItems];
    updatedItems.splice(index, 1);
    setPurchaseData({ ...purchaseData, purchaseItems: updatedItems });
  };

  return (
    <div className="lg:w-1/2 p-4 ">
      <h2 className="text-2xl font-bold mb-4">Purchase Preview</h2>
      {company && <p className="mb-2"><strong>Company:</strong> {company}</p>}

      {purchaseItems.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table text-center">
            <thead>
            <tr>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Height</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Item Total</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {purchaseItems.map((item, index) => (
                <tr key={index} className='text-center'>
                <td className="border px-4 py-2">{item.boughtQty} P</td>
                <td className="border px-4 py-2">{item.product.height} × {item.product.thickness} mm × {item.product.color} </td>
                <td className="border px-4 py-2">{item.product.price}</td>
                <td className="border px-4 py-2">{item.itemTotal}</td>
                <td className="border px-4 py-2">
                <button
                    onClick={() => removeItem(index)}
                    className="text-red-600"
                  >
                    Delete
                  </button> </td>
              </tr>
              ))}
            </tbody>
            <tfoot>
                <tr>
                    <th>Total</th>
                    <th>{boughtQty}</th>
                    <th></th>
                    <th>{totalAmount}</th>
                    <th></th>
                </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <p>No items added yet.</p>
      )}
      {totalAmount > 0 && (
        <div className="mt-4">
          <p className="text-xl font-semibold">
            Total Amount: {totalAmount}
          </p>
        </div>
      )}
    </div>
  );
};

export default PurchasePreview;