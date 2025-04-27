export const dynamic = "force-dynamic";

import { calculateMonthlyNetProfit } from '@/utils/calculateMonthlyNetProfit';
import { calculateMonthlyPurchaseTotalAmount } from '@/utils/calculateMonthlyPurchaseTotalAmount';
import { getPastMonthsAndYears } from '@/utils/getPastMonthsAndYears';
import HomeStatCard from '../components/HomeStatCard';


export default async function MonthlyStatistics() {
  const pastTwelveMonths = getPastMonthsAndYears(12);

  // Fetch all stats in parallel
  const stats = await Promise.all(
    pastTwelveMonths.map(async ({ year, month }) => {
      const netProfit = await calculateMonthlyNetProfit(year, month);
      const purchase = await calculateMonthlyPurchaseTotalAmount(year, month);
      return {
        year,
        month,
        monthName: netProfit.monthName,
        totalNetProfit: netProfit.totalNetProfit,
        sumTotalAmount: netProfit.sumTotalAmount,
        totalPurchaseAmount: purchase.totalPurchaseAmount,
      };
    })
  );

  return (
    <div className="flex flex-col gap-10 w-[80%] mx-auto">
      {stats.map(stat => (
        <HomeStatCard
          key={`${stat.year}-${stat.month}`}
          {...stat}
        />
      ))}
    </div>
  );
}
