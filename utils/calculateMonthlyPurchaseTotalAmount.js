import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import Purchase from "@/models/purchase";
connectDB();

export async function calculateMonthlyPurchaseTotalAmount(year, month) {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const result = await mongoose.model("Purchase").aggregate([
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
          totalPurchaseAmount: { $sum: "$totalAmount" },
        },
      },
      {
        $project: {
          _id: 0,
          totalPurchaseAmount: 1,
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
        totalPurchaseAmount: result[0].totalPurchaseAmount,
      };
    } else {
      return {
        year: year,
        month: month,
        monthName: monthName,
        totalPurchaseAmount: 0,
      };
    }
  } catch (error) {
    console.error("Error calculating monthly purchase total amount:", error);
    throw error;
  }
}