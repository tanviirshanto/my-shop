// InvoiceDetailPageClient.jsx (Client Component)
"use client";
import { formatDate } from "@/utils/fetchData";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const InvoiceDetailPageClient = ({ parsedInvoiceData }) => {
  const invoiceRef = useRef();

  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement.tagName.toLowerCase();
      if (
        e.key === "Backspace" &&
        activeTag !== "input" &&
        activeTag !== "textarea"
      ) {
        e.preventDefault(); // Optional: prevent browser back
        router.push("/invoice-lists");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  const [invoiceData, setInvoiceData] = useState(JSON.parse(parsedInvoiceData));
  console.log("Invoice Data:", invoiceData); // Debugging

  // Handle date change
  const handleDateChange = (e) => {
    setInvoiceData((prev) => ({
      ...prev,
      date: e.target.value,
    }));
  };

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

  const handleSubmit = async () => {
    // Make sure to send the updated invoice data to the backend for saving
    const response = await fetch(`/api/invoice/${invoiceData._id}`, {
      method: "PUT", // PUT method for updating the invoice
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoiceData),
    });

    if (response.ok) {
      alert("Invoice updated successfully");
    } else {
      alert("Failed to update invoice");
    }
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <div
        className="lg:w-[70%] p-4"
        ref={invoiceRef}
        style={{ marginTop: "5%", marginLeft: "5%" }}
      >
        <h2 className="text-2xl font-bold text-left mb-3">
          Invoice ID: {invoiceData._id}
        </h2>

        <div>
          <div className="mb-4 text-left  flex flex-col gap-2">
            <input
              type="date"
              value={invoiceData.date.substring(0, 10)} // Ensure date format is YYYY-MM-DD
              onChange={handleDateChange}
              className="input input-bordered"
            />
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
                      {item.soldPrice}
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
      <button onClick={handleSubmit} className="btn btn-success w-56 mt-2">
        Save Changes
      </button>
    </div>
  );
};

export default InvoiceDetailPageClient;
