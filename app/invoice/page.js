"use client";
import React, { useState, useEffect, useRef } from "react";
import InvoicePreview from "../components/InvoicePreview";
import { thkGroupOne, thkGroupThree, thkGroupTwo } from "@/lib/constants";
import calculateItemPrice from "@/utils/calculateItemPrice";
import calculateTotalAmount from "@/utils/calculateTotalAmount";
import { fetchConfig, fetchCustomers } from "@/utils/fetchData";
import Link from "next/link";
import toast from "react-hot-toast";
import QuickButtons from "../components/quickButtons";
import QuickPriceButton from "../components/quickPriceButton";

const quantityItems = [
  20, 21, 25, 27, 30, 35, 36, 40, 45, 50, 60, 80, 70, 90, 100, 120, 282,
];

const InvoicePage = () => {
  const [singleItem, setSingleItem] = useState({
    product: { thickness: "", height: "", color: "", price: 0 },
    soldQty: 0,
    itemTotal: 0,
  });
  const [invoiceData, setInvoiceData] = useState({
    invoiceItems: [],
    customerId: "67d86a5544af1a4fa27de79a",
    payment: "",
    totalAmount: 0,
    amountPaid: 0,
    date: new Date().toISOString().split("T")[0],
  });

  const [generatedInvoice, setGeneratedInvoice] = useState(null);
  const [config, setConfig] = useState({
    thicknesses: [],
    heights: [],
    colors: [],
  });
  const [customers, setCustomers] = useState([]);
  const [itemPrices, setItemPrices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const configData = await fetchConfig();
      if (configData) setConfig(configData);

      const customersData = await fetchCustomers();
      if (customersData.length > 0) setCustomers(customersData);
    };

    loadData();
  }, []);

  const { height, color, thickness, price } = singleItem.product;
  const { soldQty } = singleItem;

  useEffect(() => {
    console.log("useEffect itemTotal called");
    console.log({ height, thickness, soldQty, price, color });

    if (height && thickness && soldQty && price) {
      const itemTotal = calculateItemPrice(height, thickness, soldQty, price);
      setSingleItem((prev) => ({ ...prev, itemTotal }));
    }
  }, [height, thickness, soldQty, price, color]);

  useEffect(() => {
    if (invoiceData.invoiceItems.length > 0) {
      const totalAmount = calculateTotalAmount(invoiceData.invoiceItems);
      setInvoiceData((prev) => ({ ...prev, totalAmount }));
    }
  }, [invoiceData.invoiceItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("singleItem")) {
      const fieldParts = name.split(".");
      const field = fieldParts[1];
      if (fieldParts.length === 3) {
        const subField = fieldParts[2];
        setSingleItem((prev) => ({
          ...prev,
          product: {
            ...prev.product,
            [subField]:
              subField === "price" || subField === "soldQty"
                ? isNaN(Number(value))
                  ? value
                  : Number(value)
                : value, // Handle number fields and string fields
          },
        }));
      } else {
        setSingleItem((prev) => ({
          ...prev,
          [field]: isNaN(Number(value)) ? value : Number(value),
        }));
      }
    } else {
      setInvoiceData((prev) => ({
        ...prev,
        [name]: isNaN(Number(value)) ? value : Number(value),
      }));
    }
  };

  const addItem = () => {
    if (
      !singleItem.product.thickness ||
      !singleItem.product.height ||
      !singleItem.product.color ||
      !singleItem.product.price ||
      !singleItem.soldQty
    ) {
      toast.error("Please fill in all item details.");
      return;
    }

    if (singleItem.soldQty <= 0) {
      toast.error("Quantity must be greater than zero.");
      return;
    }

    if (singleItem.product.price < 0) {
      toast.error("Price cannot be negative.");
      return;
    }
    setInvoiceData((prev) => ({
      ...prev,
      invoiceItems: [...prev.invoiceItems, singleItem],
    }));

    setItemPrices((prevPrices) => [...prevPrices, singleItem.product.price]); // Store the price
    toast.success("Item added to invoice");
  };

  const handleSubmit = async (e) => {
    setLoading(true); // Starts loading
    e.preventDefault();

    if (invoiceData.invoiceItems.length === 0) {
      toast.error("Please add at least one item to the invoice.");
      setLoading(false); // Stop loading if validation fails
      return;
    }

    if (invoiceData.totalAmount < 0) {
      toast.error("Total amount cannot be negative.");
      setLoading(false); // Stop loading if validation fails
      return;
    }

    if (invoiceData.amountPaid < 0) {
      toast.error("Amount paid cannot be negative.");
      setLoading(false); // Stop loading if validation fails
      return;
    }

    try {
      const response = await fetch("/api/invoice/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      });
      const data = await response.json();
      toast.success("Invoice submitted successfully");
    } catch (error) {
      console.error("Error submitting invoice:", error);
      toast.error(error.message);
    } finally {
      setLoading(false); // Stop loading after the API call finishes
    }
  };

  return (
    <div>
      <Link
        href="/invoice-lists"
        className="p-4 underline text-blue-400 hover:text-blue-700"
      >
        Invoice Lists{" "}
      </Link>
      <div className="flex h-screen lg:flex-row flex-col">
        <div className="lg:w-2/3 p-4">
          <h2 className="text-2xl font-bold mb-4">Invoice Form</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 ">
              <QuickButtons
                setSingleItem={setSingleItem}
                quantityItems={quantityItems}
                itemPrices={itemPrices}
              />
              {/* <QuickPriceButton
                setSingleItem={setSingleItem}
                itemPrices={itemPrices}
              /> */}
              <div className="flex justify-between items-end gap-5">
                <div className="form-control  w-full ">
                  <label className="label">
                    <span className="label-text">Sold Quantity</span>
                  </label>
                  <input
                    type="number"
                    name={`singleItem.soldQty`}
                    placeholder="Sold Quantity"
                    value={singleItem.soldQty}
                    onChange={handleChange}
                    className="input input-bordered w-full mb-2"
                    onFocus={() => {
                      if (singleItem.soldQty === 0)
                        setSingleItem((prev) => ({
                          ...prev,
                          soldQty: "",
                        }));
                    }}
                  />
                </div>
                <div className="form-control  w-full ">
                  <label className="label">
                    <span className="label-text">Height</span>
                  </label>
                  <select
                    name={`singleItem.product.height`}
                    value={singleItem.product.height}
                    onChange={handleChange}
                    className="select select-bordered mb-2  w-full"
                  >
                    <option value="">Select Height</option>
                    {config.heights.map((height) => (
                      <option key={height} value={height}>
                        {height}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control  w-full ">
                  <label className="label">
                    <span className="label-text">Thickness</span>
                  </label>
                  <select
                    name={`singleItem.product.thickness`}
                    value={singleItem.product.thickness}
                    onChange={handleChange}
                    className="select select-bordered mb-2 w-full"
                  >
                    <option value="">Select Thickness</option>
                    {config.thicknesses.map((thickness) => (
                      <option key={thickness} value={thickness}>
                        {thickness}
                      </option>
                    ))}
                  </select>{" "}
                </div>
              </div>
              <div className=" flex justify-between gap-5">
                <div className="form-control  w-full ">
                  <label className="label">
                    <span className="label-text">Color</span>
                  </label>
                  <select
                    name={`singleItem.product.color`}
                    value={singleItem.product.color}
                    onChange={handleChange}
                    className="select select-bordered mb-2  w-full"
                  >
                    <option value="">Select Color</option>
                    {config.colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control  w-full ">
                  <label className="label">
                    <span className="label-text">Price</span>
                  </label>
                  <input
                    type="number"
                    name={`singleItem.product.price`}
                    placeholder="Price"
                    value={singleItem.product.price}
                    onChange={handleChange}
                    className="input input-bordered w-full mb-2"
                    onFocus={() => {
                      if (singleItem.product.price === 0)
                        setSingleItem((prev) => ({
                          ...prev,
                          product: { ...prev.product, price: "" },
                        }));
                    }}
                  />
                </div>

                <div className="flex gap-5 items-center text-lg mt-5  w-full ">
                  <h1 className="">
                    <span className="">Item Total</span>
                  </h1>
                  <div>{singleItem.itemTotal}</div>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={addItem}
              className="btn btn-outline mb-4"
            >
              Add Item
            </button>
            <div className="flex justify-between gap-5">
              <div className="form-control w-1/2">
                <label className="label">
                  <span className="label-text">Invoice Date</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={invoiceData.date}
                  onChange={handleChange}
                  className="input input-bordered w-full mb-4"
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Customer</span>
                </label>
                <select
                  name="customerId"
                  value={invoiceData.customerId}
                  onChange={handleChange}
                  className="select select-bordered mb-2 w-full"
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-between gap-5">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Payment</span>
                </label>
                <select
                  name="payment"
                  value={invoiceData.payment}
                  onChange={handleChange}
                  className="select select-bordered mb-2"
                >
                  <option value="">Select Payment</option>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Total Amount</span>
                </label>
                <input
                  type="number"
                  name="totalAmount"
                  placeholder="Total Amount"
                  value={invoiceData.totalAmount}
                  onChange={handleChange}
                  className="input input-bordered w-full mb-2"
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Amount Paid</span>
                </label>
                <input
                  type="number"
                  name="amountPaid"
                  placeholder="Amount Paid"
                  value={invoiceData.amountPaid}
                  onChange={handleChange}
                  className="input input-bordered w-full mb-4"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={invoiceData.invoiceItems.length === 0 || loading}
            >
              {loading ? "Generating Invoice..." : "Generate Invoice"}
              
            </button>
          </form>
        </div>
        <InvoicePreview
          invoiceData={invoiceData}
          setInvoiceData={setInvoiceData}
          customerName={
            customers.find((c) => c._id === invoiceData.customerId)?.name ||
            "General"
          }
        />
      </div>{" "}
    </div>
  );
};

export default InvoicePage;
