import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import invoice from "@/models/invoice";


export async function calculateMonthlyNetProfit(year, month) {
  try {
    await connectDB();
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const result = await mongoose.model("Invoice").aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalNetProfit: { $sum: "$netProfit" },
          sumTotalAmount: { $sum: "$amountPaid" }, // Added totalAmount sum
        },
      },
      {
        $project: {
          _id: 0,
          totalNetProfit: 1,
          sumTotalAmount: 1, // Added sumTotalAmount to project
        },
      },
    ]);

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    const monthName = monthNames[month - 1];

    if (result.length > 0) {
      return {
        year: year,
        month: month,
        monthName: monthName,
        totalNetProfit: result[0].totalNetProfit,
        sumTotalAmount: result[0].sumTotalAmount, // Added sumTotalAmount to response
      };
    } else {
      return {
        year: year,
        month: month,
        monthName: monthName,
        totalNetProfit: 0,
        sumTotalAmount: 0, // Added sumTotalAmount to response
      };
    }
  } catch (error) {
    console.error("Error calculating monthly net profit:", error);
    throw error;
  }
}