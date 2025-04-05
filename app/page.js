import Image from "next/image";
import HomeItemCard from "./components/HomeItemCard";
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
     
    <Link href="/monthly-statistics" ><HomeStatCard year={year} month={month} />
    </Link> 
      <div className="flex justify-between items-center gap-8">

        <HomeSingleCard
          name="Invoice"
          btnName="Create invoice"
          btnUrl="/invoice"
        />
        <HomeSingleCard
          name="Purchase"
          btnName="Add purchase"
          btnUrl="/purchase"
        />
        <HomeSingleCard
          name="Stock Book"
          btnName="Check stocks"
          btnUrl="/stockBook"
        />
      </div>
      <HomeItemCard />
    </div>
  );
}
