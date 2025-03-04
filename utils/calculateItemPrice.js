import { thkGroupOne, thkGroupThree, thkGroupTwo } from "@/lib/constants";

const calculateItemPrice = (height, thickness, soldQty, price) => {

  const heightNum = Number(height);
  const isBundle = height !== "11" && price < 20000;
  const isBundle11ft = height === "11" && price < 20000;
  const isTonPricing = price > 20000;

  if (isBundle) {
    console.log("Bundle");
    return Math.floor((price * soldQty) / Math.floor(72 / heightNum));
  }
  if (isBundle11ft) {
    console.log("Bundle 11ft");
    return Math.floor((price * soldQty * 11) / 72);
  }
  if (isTonPricing) {
    if (thkGroupOne.includes(thickness.trim())) {
      console.log("Light weight");
      return Math.floor((price * soldQty) / Math.floor(1692 / heightNum));
    }
    if (thkGroupTwo.includes(thickness.trim())) {
      console.log("Moderate weight");
      return Math.floor((price * soldQty) / Math.floor(1344 / heightNum));
    }
    if (thkGroupThree.includes(thickness.trim())) {
      console.log("Heavy weight");
      return Math.floor((price * soldQty) / Math.floor(1053 / heightNum));
    }
    console.error("Program Error: Unknown thickness group.");
    return 0;
  }

  return 0;
};

export default calculateItemPrice;
