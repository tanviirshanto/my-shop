import Image from "next/image";
// import HomeItemCard from "./components/HomeItemCard";
import HomeSingleCard from "./components/HomeSingleCard";
import HomeStatCard from "./components/HomeStatCard";
import { getCurrentMonthAndYear } from "@/utils/functions";
import Link from "next/link";

const items = [
  {
    title: "Roofing Sheet",
    url: "/",
  },
];

export default function Home() {
  const { month, year } = getCurrentMonthAndYear();

  return (
    <div className="flex justify-center flex-col items-center m-10 w-[80%] mx-auto gap-10">
     
    {/* <Link href="/monthly-statistics" ><HomeStatCard year={year} month={month} />
    </Link>  */}
      <div className="flex justify-between items-center gap-8">

        <HomeSingleCard
          name="Invoice"
          firstBtn="invoice"
          secondBtn="invoice-lists"
        />
        <HomeSingleCard
          name="Purchase"
          firstBtn="purchase"
          secondBtn="purchase-lists"
        />
        <HomeSingleCard
          name="Stock"
          firstBtn="stockBook"
          secondBtn="stocks/table"
        />
      </div>
      
    </div>
  );
}
