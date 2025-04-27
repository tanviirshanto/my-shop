import { connectDB } from '@/lib/db';
import { calculateMonthlyNetProfit } from '@/utils/calculateMonthlyNetProfit';
import { calculateMonthlyPurchaseTotalAmount } from '@/utils/calculateMonthlyPurchaseTotalAmount';
import React from 'react'



async function  HomeStatCard({year, month}) {
  await connectDB();
  const data = await calculateMonthlyNetProfit(year, month);
  const purchaseAmount = await calculateMonthlyPurchaseTotalAmount(year,month);
  
  return (

<div className='stats shadow gap-2 flex'>
  <div className="stat place-items-center flex-1">
    <div className="stat-title">{data.year}</div>
    <div className="stat-value">{data.monthName}</div>
  </div>
  <div className="stat place-items-center flex-1">
    <div className="stat-title">Net Profit</div>
    <div className="stat-value">{data.totalNetProfit.toLocaleString()}</div>
  </div>
  <div className="stat place-items-center flex-1">
    <div className="stat-title">Total Sells</div>
    <div className="stat-value text-secondary">{data.sumTotalAmount.toLocaleString()}</div>
  </div>
  <div className="stat place-items-center flex-1">
    <div className="stat-title">Purchase Amount</div>
    <div className="stat-value">{purchaseAmount.totalPurchaseAmount.toLocaleString()}</div>
  </div>
  <div className="hidden hover:block stat place-items-center flex-1">
    <div className="stat-title">Purchase Amount</div>
    <div className="stat-value">{purchaseAmount.totalPurchaseAmount.toLocaleString()}</div>
  </div>
</div>


)
}

export default HomeStatCard