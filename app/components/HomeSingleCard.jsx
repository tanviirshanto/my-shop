import Link from "next/link";
import React from "react";

function formatBtnName(path) {
  return path
    .split("/" || "-")                       // Split by '/'
    .map(word =>
      word.charAt(0).toUpperCase() +  // Capitalize first letter
      word.slice(1).toLowerCase()     // Lowercase the rest
    )
    .join(" ");                       // Join back with space
}

const HomeSingleCard = ({ name,firstBtn, secondBtn }) => {
  return (
    <div className="card bg-base-100 image-full w-96 shadow-sm">
      <figure className="brightness-50">
        <img
          src="https://img.lovepik.com/bg/20240427/3D-Illustration-of-PVC-Coated-Metal-Roof-Sheets-and-Corrugated_8222745_wh1200.jpg"
          alt="Shoes"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title rounded-lg  p-2 text-white">{name}</h2>
        <p>
        An invoice records the products delivered , the total amount due, and the preferred payment method.
        </p>
        <div className="card-actions justify-end">
         <Link href={`/${firstBtn}`} className="btn btn-info">
            {formatBtnName(firstBtn)}
          </Link>
          <Link href={`/${secondBtn}`} className="btn btn-primary">
            {formatBtnName(secondBtn)}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeSingleCard;
