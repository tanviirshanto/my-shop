// InvoiceDetailPageClient.jsx (Client Component)
'use client';
import React, { useState, useEffect, useRef } from 'react';

const InvoiceDetailPageClient = ({ parsedInvoiceData }) => {
 
  const invoiceRef = useRef();

  const invoiceData= JSON.parse(parsedInvoiceData);


  const generatePDF = async () => {
    if (!invoiceData) return;

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html: invoiceRef.current.outerHTML }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'invoice.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to generate PDF:', response.statusText);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (!invoiceData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex justify-center p-4">
      <div className="w-[60%] p-4">
        <h2 className="text-2xl font-bold mb-4">Invoice</h2>

        <div ref={invoiceRef}>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Customer Details</h3>
            <p>Customer ID: {invoiceData.customer.name}</p>
            <p>Payment Status: {invoiceData.payment}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold">Invoice Items</h3>
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Quantity</th>
                  <th className="border px-4 py-2">Product</th>
                  <th className="border px-4 py-2">Price</th>
                  <th className="border px-4 py-2">Item Total</th>
                    <th className="border px-4 py-2">Profit</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.invoiceItems.map((item, index) => (
                  <tr key={index} className="text-center">
                    <td className="border px-4 py-2">{item.soldQty} P</td>
                    <td className="border px-4 py-2">
                      {item.product.height} × {item.product.thickness} mm × {item.product.color}
                    </td>
                    <td className="border px-4 py-2">{item.product.price}</td>
                    <td className="border px-4 py-2">{item.itemTotal}</td>
                    <td className="border px-4 py-2">{item.profit? item.profit:"" }</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold">Total</h3>
            <p>Total Amount: {invoiceData.totalAmount}</p>
            <p>Amount Paid: {invoiceData.amountPaid}</p>
            <p>Net Profit: {invoiceData.netProfit? invoiceData.netProfit:""}</p>
          </div>
        </div>

        <button onClick={generatePDF} className="btn btn-primary">
          Print PDF
        </button>
      </div>
    </div>
  );
};

export default InvoiceDetailPageClient;