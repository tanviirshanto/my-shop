"use client";

import React from 'react';

export default function HomeStatCard({ year, monthName, totalNetProfit, sumTotalAmount, totalPurchaseAmount }) {
  return (
    <div className='stats shadow gap-2 flex'>
      <div className="stat place-items-center flex-1">
        <div className="stat-title">{year}</div>
        <div className="stat-value">{monthName}</div>
      </div>
      <div className="stat place-items-center flex-1">
        <div className="stat-title">Net Profit</div>
        <div className="stat-value">{totalNetProfit.toLocaleString()}</div>
      </div>
      <div className="stat place-items-center flex-1">
        <div className="stat-title">Total Sells</div>
        <div className="stat-value text-secondary">{sumTotalAmount.toLocaleString()}</div>
      </div>
      <div className="stat place-items-center flex-1">
        <div className="stat-title">Purchase Amount</div>
        <div className="stat-value">{totalPurchaseAmount.toLocaleString()}</div>
      </div>
    </div>
  );
}
