"use client";
import React, { useRef } from "react";
import uniqid from "uniqid";

const InvoicePreview = ({ invoiceData, setInvoiceData, customerName ,onEdit}) => {
  const invoiceRef = useRef();

  if (
    !invoiceData ||
    !invoiceData.invoiceItems ||
    invoiceData.invoiceItems.length === 0
  ) {
    return (
      <div className="w-1/2 p-4">
        <h2 className="text-2xl font-bold mb-4">Invoice Preview</h2>
        <p>No invoice data available.</p>
      </div>
    );
  }

  const generatePDF = async () => {
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html: invoiceRef.current.outerHTML }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "invoice.pdf";
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Failed to generate PDF:", response.statusText);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleDelete = (index) => {
    const updatedItems = invoiceData.invoiceItems.filter((_, i) => i !== index);
    const totalAmount = updatedItems.reduce(
      (sum, item) => sum + item.itemTotal,
      0
    );

    setInvoiceData((prev) => ({
      ...prev,
      invoiceItems: updatedItems,
      totalAmount,
    }));
  };

  return (
    <div className=" p-4 ">
      <h2 className="text-2xl font-bold mb-4"> Preview</h2>

      <div ref={invoiceRef}>
        <div className="mb-4">
          <h3 className="text-lg ">
            {" "}
            <span className="font-semibold">Date:</span> {invoiceData.date}
          </h3>
          <p>
            {" "}
            <span className="font-semibold">Customer Name:</span> {customerName}
          </p>
          <p>
            {" "}
            <span className="font-semibold">Payment Status:</span>{" "}
            {invoiceData.payment}
          </p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Invoice Items</h3>
          <table className="w-full table-auto">
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
              {invoiceData.invoiceItems.map((item, index) => (
                <tr
                  key={`${item.product.height}-${item.product.thickness}-${item.product.color}-${index}`}
                  className="text-center"
                >
                  <td className="border px-4 py-2">{item.soldQty} P</td>
                  <td className="border px-4 py-2">
                    {item.product.height} × {item.product.thickness} mm ×{" "}
                    {item.product.color}{" "}
                  </td>
                  <td className="border px-4 py-2">{item.product.price}</td>
                  <td className="border px-4 py-2">{item.itemTotal}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => onEdit(index)}
                      className="text-blue-400 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Total</h3>
          <p>Total Amount: {invoiceData.totalAmount}</p>
          <p>Amount Paid: {invoiceData.amountPaid}</p>
        </div>
      </div>

      <button onClick={generatePDF} className="btn btn-primary">
        Print PDF
      </button>
    </div>
  );
};

export default InvoicePreview;
