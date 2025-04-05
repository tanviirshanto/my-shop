import { thkGroupOne, thkGroupThree, thkGroupTwo,thkTunnel } from "@/lib/constants";

const calculateItemPriceTon = (height, thickness, boughtQty, price) => {

  const heightNum = Number(height);
  const isTonPricing = price > 20000;
  const isTunnel = thickness.includes(thkTunnel); 

  if (isTunnel) {
    console.log("Tunnel");
    return Math.floor(price * boughtQty);
  }


  if (isTonPricing) {
    console.log("Ton pricing");
    if (thkGroupOne.includes(thickness.trim())) {
      console.log("Light weight");
      return Math.floor((price * boughtQty) / Math.floor(1692 / heightNum));
    }
    if (thkGroupTwo.includes(thickness.trim())) {
      console.log("Moderate weight");
      return Math.floor((price * boughtQty) / Math.floor(1344 / heightNum));
    }
    if (thkGroupThree.includes(thickness.trim())) {
      console.log("Heavy weight");
      return Math.floor((price * boughtQty) / Math.floor(1053 / heightNum));
    }
    console.error("Program Error: Unknown thickness group.");
    return 0;
  }

  return 0;
};

export default calculateItemPriceTon;
