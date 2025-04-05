// app/stock-availability/page.js
'use server';

import React from 'react';
import { Stock, Product } from '@/models';
import { connectDB } from '@/lib/db';

async function getStockData() {
  await connectDB();

  try {
    const products = await Product.find({});
    const stocks = await Stock.find({}).populate('product');

    const variations = {};
    const allHeights = new Set();

    stocks.forEach((stock) => {
      const { thickness, color, height } = stock.product;
      const variationKey = `${thickness}-${color}`;
      allHeights.add(height);

      if (!variations[variationKey]) {
        variations[variationKey] = {};
      }
      variations[variationKey][height] = stock.availableQty;
    });

    return { variations, allHeights: Array.from(allHeights).sort((a, b) => Number(a) - Number(b)) };
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return { variations: {}, allHeights: [] };
  }
}

export default async function StockAvailabilityPage() {
  const { variations, allHeights } = await getStockData();

  const sortedVariations = Object.entries(variations).sort(([aKey], [bKey]) => {
    const aThickness = Number(aKey.split('-')[0]);
    const bThickness = Number(bKey.split('-')[0]);
    return aThickness - bThickness;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Stock Availability</h1>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Thickness-Color</th>
              {allHeights.map((height) => (
                <th key={height}>{height}</th>
              ))}
            </tr>
          </thead>
          <tbody>
    
            {sortedVariations.map(([variationKey, heightData]) => (
              <tr key={variationKey}> 
                <td>{variationKey}</td>
                {allHeights.map((height) => (
                  <td key={`${variationKey}-${height}`}>{heightData[height] !== undefined ? heightData[height] : '0'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}