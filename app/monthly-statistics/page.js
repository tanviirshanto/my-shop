import { connectDB } from '@/lib/db';
import { calculateMonthlyNetProfit } from '@/utils/calculateMonthlyNetProfit';
import { calculateMonthlyPurchaseTotalAmount } from '@/utils/calculateMonthlyPurchaseTotalAmount';
import { getCurrentMonthAndYear } from '@/utils/functions';
import { getPastMonthsAndYears } from '@/utils/getPastMonthsAndYears';
import React from 'react'
import HomeStatCard from '../components/HomeStatCard';

connectDB()

async function  MonthlyStatitics() {
    const pastTwelveMonths = getPastMonthsAndYears(12);
  
  return (
<div className='flex flex-col gap-10 w-[80%] mx-auto'>
    
{pastTwelveMonths.map(({ year, month, monthName }) => (
        <HomeStatCard key={`${year}-${month}`} year={year} month={month}/>
      ))}
</div>
)
}

export default MonthlyStatitics