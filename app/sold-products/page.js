// app/sold-products/page.js
import React from 'react';
import mongoose from 'mongoose';
import { Sell,Product } from '@/models'; 
import { connectDB } from '@/lib/db'; // Import your database connection function

async function getSoldProductsForCurrentMonth() {
  await connectDB(); // Connect to the database

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  try {
    const soldProducts = await Sell.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$product',
          totalSoldQty: { $sum: '$soldQty' },
        },
      },
      {
        $lookup: {
          from: 'products', // Collection name for Product model
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $unwind: '$productDetails',
      },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          thickness: '$productDetails.thickness', 
          height: '$productDetails.height',
          color: '$productDetails.color', 
          totalSoldQty: 1,
          productPrice: '$productDetails.price' //assuming price is available
        },
      },
      {
        $sort: {
          totalSoldQty: -1, // Sort by total sold quantity in descending order
        },
      },
    ]);

    return JSON.parse(JSON.stringify(soldProducts)); // Serialize Mongoose documents
  } catch (error) {
    console.error('Error fetching sold products:', error);
    return [];
  }
}

export default async function SoldProductsPage() {
  const soldProducts = await getSoldProductsForCurrentMonth();
  console.log(soldProducts);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products Sold This Month</h1>
      {soldProducts.length === 0 ? (
        <p>No products sold this month.</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity Sold</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            </tr>
          </thead>
          <tbody className=" divide-y divide-gray-200">
            {soldProducts.map((product) => (
              <tr key={product.productId}>
                <td className="px-6 py-4 whitespace-nowrap">{product.height}ft - {product.thickness}mm -{product.color} </td>
                <td className="px-6 py-4 whitespace-nowrap">{product.totalSoldQty}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.productPrice.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}