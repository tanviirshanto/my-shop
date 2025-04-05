// PurchaseDetailPageClient.jsx (Client Component)
'use client';
import { formatDate } from '@/utils/fetchData';
import React, { useState, useEffect, useRef } from 'react';

const PurchaseDetailPageClient = ({ parsedPurchaseData }) => {
 
  const purchaseRef = useRef();

  const purchaseData= JSON.parse(parsedPurchaseData);


  const generatePDF = async () => {
    if (!purchaseData) return;

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html: purchaseRef.current.outerHTML }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${Date()}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to generate PDF:', response.statusText);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (!purchaseData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex justify-center p-4">
      <div className="w-[60%] p-4">
        <h2 className="text-2xl font-bold mb-4">Purchase</h2>

        <div ref={purchaseRef} style={{ margin:'10%' }}>
          <div className="mb-4">
            <p>Date: {formatDate(purchaseData.date)}</p>
            <p>Company: {purchaseData.company}</p>
           
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold">Purchase Items</h3>
            <table
  className="w-full"
  style={{
    borderCollapse: 'collapse',
    border: '2px solid black', // Ensures outer border remains
  }}
>
  <thead>
    <tr className='text-gray-600' style={{ backgroundColor: '#e5e7eb', border: '2px solid black' }}>
      <th style={{ border: '1px solid black', padding: '8px' }}>Quantity</th>
      <th style={{ border: '1px solid black', padding: '8px' }}>Product</th>
      <th style={{ border: '1px solid black', padding: '8px' }}>Price</th>
      <th style={{ border: '1px solid black', padding: '8px' }}>Item Total</th>
    </tr>
  </thead>
  <tbody>
    {purchaseData.purchaseItems.map((item, index) => (
      <tr key={index} style={{ border: '2px solid black', textAlign: 'center' }}>
        <td style={{ border: '1px solid black', padding: '8px' }}>{item.boughtQty} P</td>
        <td style={{ border: '1px solid black', padding: '8px' }}>
          {item.product.height} × {item.product.thickness} mm × {item.product.color}
        </td>
        <td style={{ border: '1px solid black', padding: '8px' }}>{item.product.price}</td>
        <td style={{ border: '1px solid black', padding: '8px' }}>{item.itemTotal}</td>
      </tr>
    ))}
  </tbody>
</table>



          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold">Total Amount: {purchaseData.totalAmount}</h3>
            
            
          </div>
        </div>

        <button onClick={generatePDF} className="btn btn-primary">
          Print PDF
        </button>
      </div>
    </div>
  );
};

export default PurchaseDetailPageClient;