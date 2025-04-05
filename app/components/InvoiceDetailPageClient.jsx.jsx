// InvoiceDetailPageClient.jsx (Client Component)
"use client";
import { formatDate } from "@/utils/fetchData";
import React, { useState, useEffect, useRef } from "react";

const InvoiceDetailPageClient = ({ parsedInvoiceData }) => {
  const invoiceRef = useRef();

  const invoiceData = JSON.parse(parsedInvoiceData);
  console.log("Invoice Data:", invoiceData); // Debugging

  const generatePDF = async () => {
    if (!invoiceData) return;

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
        a.download = `${Date()}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Failed to generate PDF:", response.statusText);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  if (!invoiceData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4 flex flex-col items-center">
      <div className="lg:w-[70%] p-4" ref={invoiceRef} style={{ marginTop: "5%", marginLeft: "5%" }}>
        <h2 className="text-2xl font-bold text-left mb-3">
          Invoice ID: {invoiceData._id}
        </h2>

        <div>
          <div className="mb-4 text-left  flex flex-col gap-2">
            <p>Date: {formatDate(invoiceData.date)}</p>
            <p>Customer: {invoiceData.customer.name}</p>
            <p>Payment Status: {invoiceData.payment}</p>
          </div>

          <div className="mb-4">
            <table
              className="w-full"
              style={{
                borderCollapse: "collapse",
                border: "2px solid gray", // Ensures outer border remains
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#e5e7eb",
                    border: "2px solid gray",
                  }}
                  className="text-black"
                >
                  <th style={{ border: "1px solid gray", padding: "8px" }}>
                    Quantity
                  </th>
                  <th style={{ border: "1px solid gray", padding: "8px" }}>
                    Product
                  </th>
                  <th style={{ border: "1px solid gray", padding: "8px" }}>
                    Sold Price
                  </th>
                  <th style={{ border: "1px solid gray", padding: "8px" }}>
                    Buying Price
                  </th>
                  <th style={{ border: "1px solid gray", padding: "8px" }}>
                    Item Total
                  </th>
                  <th style={{ border: "1px solid gray", padding: "8px" }}>
                    Profit
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.invoiceItems.map((item, index) => (
                  <tr key={index} className="text-center">
                    <td style={{ border: "1px solid gray", padding: "8px" }}>
                      {item.soldQty} P
                    </td>
                    <td style={{ border: "1px solid gray", padding: "8px" }}>
                      {item.product.height} × {item.product.thickness} mm ×{" "}
                      {item.product.color}
                    </td>
                    <td style={{ border: "1px solid gray", padding: "8px" }}>
                      {  item.soldPrice}
                    </td>
                    <td style={{ border: "1px solid gray", padding: "8px" }}>
                      {item.product.price}
                    </td>
                    <td style={{ border: "1px solid gray", padding: "8px" }}>
                      {item.itemTotal}
                    </td>
                    <td style={{ border: "1px solid gray", padding: "8px" }}>
                      {item.profit ? item.profit : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-left flex flex-col gap-2">
            <p>Total Amount: {invoiceData.totalAmount}</p>
            <p>Amount Paid: {invoiceData.amountPaid}</p>
            <p>
              Net Profit: {invoiceData.netProfit ? invoiceData.netProfit : ""}
            </p>
          </div>
        </div>
      </div>
      <button onClick={generatePDF} className="btn btn-primary w-56">
        Print PDF
      </button>
    </div>
  );
};

export default InvoiceDetailPageClient;
