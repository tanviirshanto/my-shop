"use client";
import React, { useState, useEffect } from "react";
import PurchasePreview from "../components/PurchasePreview";
import { fetchConfig } from "@/utils/fetchData";
import calculateItemPriceTon from "@/utils/calculateItemPriceTon";
import calculateTotalAmount from "@/utils/calculateTotalAmount";
import Link from "next/link";
import toast from "react-hot-toast";
import QuickBoughtQty from "../components/quickButtonPurchase";
import QuickButtonPurchase from "../components/quickButtonPurchase";

const quantityItems = [
  282, 241, 211, 188, 169, 224, 192, 168, 149, 134, 122, 112, 175, 150, 131,
  117, 105,
];

const PurchasePage = () => {
  const [singleItem, setSingleItem] = useState({
    product: { thickness: "", height: "", color: "", price: 0 },
    boughtQty: 0,
    itemTotal: 0,
  });

  const [productPrices, setProductPrices] = useState([]);

  const [purchaseData, setPurchaseData] = useState({
    purchaseItems: [],
    company: "",
    totalAmount: 0,
  });

  const [config, setConfig] = useState({
    thicknesses: [],
    heights: [],
    colors: [],
    companies: [],
  });

  useEffect(() => {
    const loadData = async () => {
      const configData = await fetchConfig();
      if (configData) setConfig(configData);
    };
    loadData();
  }, []);

  useEffect(() => {
    const { height, thickness, price } = singleItem.product;
    const { boughtQty } = singleItem;

    if (height && thickness && boughtQty > 0 && price > 0) {
      const itemTotal = calculateItemPriceTon(
        height,
        thickness,
        boughtQty,
        price
      );
      console.log("Calculated itemTotal:", itemTotal); // Debugging
      setSingleItem((prev) => ({ ...prev, itemTotal }));
    }
  }, [singleItem.product, singleItem.boughtQty]);

  useEffect(() => {
    if (purchaseData.purchaseItems.length > 0) {
      const totalAmount = calculateTotalAmount(purchaseData.purchaseItems);
      setPurchaseData((prev) => ({ ...prev, totalAmount }));
    }
  }, [purchaseData.purchaseItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("singleItem")) {
      const fieldParts = name.split(".");
      const field = fieldParts[1];

      if (field === "boughtQty") {
        setSingleItem((prev) => ({
          ...prev,
          boughtQty: Number(value),
        }));
      } else if (fieldParts.length === 3) {
        const subField = fieldParts[2];
        setSingleItem((prev) => ({
          ...prev,
          product: { ...prev.product, [subField]: value },
        }));
      }
    } else {
      setPurchaseData((prev) => ({
        ...prev,
        [name]: isNaN(Number(value)) ? value : Number(value),
      }));
    }
  };

  const addItem = () => {
    setPurchaseData((prev) => ({
      ...prev,
      purchaseItems: [...prev.purchaseItems, singleItem],
    }));
    toast.success("Item added to purchase");
  };

  useEffect(() => {
    const fetchProductPrices = async () => {
      const response = await fetch("/api/products/no-pagination");
      const data = await response.json();
      if (data) {
        const prices = data.products.map((product) => product.price);
        // Store only distinct values using a Set
        const distinctPrices = [...new Set(prices)];
        setProductPrices(distinctPrices);
      }
    };
    fetchProductPrices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/purchase/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(purchaseData),
      });
      toast.success("Purchase submitted successfully");
    } catch (error) {
      toast.error("Error submitting purchase");
    }
  };

  return (
    <div>
      <Link
        href="/purchase-lists"
        className="p-4 underline text-blue-400 hover:text-blue-700"
      >
        Purchase Lists
      </Link>
      <div className="flex h-screen lg:flex-row flex-col">
        <div className="lg:w-1/2 p-4">
          <h2 className="text-2xl font-bold mb-4">Purchase Form</h2>
          <QuickButtonPurchase
            setSingleItem={setSingleItem}
            quantityItems={quantityItems}
            productPrices={productPrices}
          />
          <form onSubmit={handleSubmit}>
            <div className="form-control w-full">
              <label className="label">Company</label>
              <select
                name="company"
                value={purchaseData.company}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">Select Company</option>
                {config.companies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-5">
              <div className="form-control w-full">
                <label className="label">Bought Quantity</label>
                <input
                  type="number"
                  name="singleItem.boughtQty"
                  value={singleItem.boughtQty}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control w-full">
                <label className="label">Height</label>
                <select
                  name="singleItem.product.height"
                  value={singleItem.product.height}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                >
                  <option value="">Select Height</option>
                  {config.heights.map((height) => (
                    <option key={height} value={height}>
                      {height}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control w-full">
                <label className="label">Thickness</label>
                <select
                  name="singleItem.product.thickness"
                  value={singleItem.product.thickness}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                >
                  <option value="">Select Thickness</option>
                  {config.thicknesses.map((thickness) => (
                    <option key={thickness} value={thickness}>
                      {thickness}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-between gap-5">
              <div className="form-control w-full">
                <label className="label">Color</label>
                <select
                  name="singleItem.product.color"
                  value={singleItem.product.color}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                >
                  <option value="">Select Color</option>
                  {config.colors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control w-full">
                <label className="label">Price</label>
                <input
                  type="number"
                  name="singleItem.product.price"
                  value={singleItem.product.price}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="flex gap-5 items-center text-lg mt-5 w-full">
                <h1>Item Total</h1>
                <div>{singleItem.itemTotal}</div>
              </div>
            </div>

            <div className="flex justify-between gap-5 my-5">
              <button
                type="button"
                onClick={addItem}
                className="btn btn-outline mb-4"
              >
                Add Item
              </button>
              <button type="submit" className="btn btn-primary">
                Submit Purchase
              </button>
            </div>
          </form>
        </div>
        <PurchasePreview
          purchaseData={purchaseData}
          setPurchaseData={setPurchaseData}
        />
      </div>
    </div>
  );
};

export default PurchasePage;
