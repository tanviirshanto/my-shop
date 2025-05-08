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
import Head from "next/head";

const InvoicePage = () => {
  const [singleItem, setSingleItem] = useState({
    product: { thickness: "", height: "", color: "", price: 0 },
    soldQty: 0,
    itemTotal: 0,
  });
  const [invoiceData, setInvoiceData] = useState({
    invoiceItems: [],
    customerId: "",
    payment: "",
    totalAmount: 0,
    amountPaid: 0,
    date: "", // date can be manually set by the user
  });

  const [customers, setCustomers] = useState([]);
  const [config, setConfig] = useState({
    thicknesses: [],
    heights: [],
    colors: [],
  });
  const [itemPrices, setItemPrices] = useState([]);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]); // Array of refs for input elements
  const soldQtyRef = useRef(null);

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
    const { height, thickness, color, price } = singleItem.product;
  
    // Check if any required field is empty
    if (!thickness || !height || !color || !price || !singleItem.soldQty) {
      toast.error("Please fill in all item details.");
      return;
    }
  
    // Validate presence in suggestions
    const isValidThickness = config.thicknesses.includes(thickness);
    const isValidHeight = config.heights.includes(height);
    const isValidColor = config.colors.includes(color);
  
    if (!isValidHeight) {
      toast.error("Height is invalid. Please select a value from suggestions.");
      return;
    }

    if (!isValidThickness) {
      toast.error("Thickness is invalid. Please select a value from suggestions.");
      return;
    }

    if (!isValidColor) {
      toast.error("Color is invalid. Please select a value from suggestions.");
      return;
    }
  
    if (singleItem.soldQty <= 0) {
      toast.error("Quantity must be greater than zero.");
      return;
    }
  
    if (price < 0) {
      toast.error("Price cannot be negative.");
      return;
    }
  
    setInvoiceData((prev) => ({
      ...prev,
      invoiceItems: [...prev.invoiceItems, singleItem],
    }));
  
    setItemPrices((prevPrices) => {
      if (!prevPrices.includes(price)) {
        return [...prevPrices, price];
      }
      return prevPrices;
    });
  
    setSingleItem((prevSingleItem) => ({
      ...prevSingleItem,
      product: {
        ...prevSingleItem.product,
        height: "",
        color: "",
        thickness: "",
        price: 0,
      },
      soldQty: 0,
      itemTotal: 0,
    }));
  
    setTimeout(() => soldQtyRef.current?.focus(), 0);
    toast.success("Item added to invoice");
  };
  

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (invoiceData.invoiceItems.length === 0) {
      toast.error("Please add at least one item to the invoice.");
      setLoading(false);
      return;
    }

    if (invoiceData.totalAmount < 0) {
      toast.error("Total amount cannot be negative.");
      setLoading(false);
      return;
    }

    if (invoiceData.amountPaid < 0) {
      toast.error("Amount paid cannot be negative.");
      setLoading(false);
      return;
    }

    if (!invoiceData.date) {
      toast.error("Please select a date.");
      setLoading(false);
      return;
    }

    if (!invoiceData.customerId) {
      toast.error("Please select a customer.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/invoice/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Something went wrong.");
      } else {
        toast.success("Invoice submitted successfully");

        setInvoiceData((prev) => ({
          invoiceItems: [],
          customerId: "",
          payment: "",
          totalAmount: 0,
          amountPaid: 0,
          date: prev.date,
        }));

        setSingleItem({
          product: { thickness: "", height: "", color: "All", price: 0 },
          soldQty: 0,
          itemTotal: 0,
        });

        setItemPrices([]);
      }
    } catch (error) {
      console.error("Error submitting invoice:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = (index) => {
    const itemToEdit = invoiceData.invoiceItems[index];

    // Remove item from list
    const updatedItems = invoiceData.invoiceItems.filter((_, i) => i !== index);
    const totalAmount = calculateTotalAmount(updatedItems);

    setInvoiceData((prev) => ({
      ...prev,
      invoiceItems: updatedItems,
      totalAmount,
    }));

    setSingleItem(itemToEdit); // Load into form
    toast("Item loaded for editing");
  };

  // Function to handle arrow key navigation
  const handleArrowNavigation = (e) => {
    const activeElement = document.activeElement;
    const currentIndex = inputRefs.current.indexOf(activeElement);
  
    if (currentIndex === -1) return;
  
    const currentInput = activeElement.getAttribute("name");
  
    if (e.key === "Enter" && currentInput !== "singleItem.product.price") {
      e.preventDefault();
      let nextIndex = currentIndex + 1;
      if (nextIndex >= inputRefs.current.length) nextIndex = 0;
      inputRefs.current[nextIndex]?.focus();
    }
  
    if (e.key === "ArrowRight") {
      e.preventDefault();
      let nextIndex = currentIndex + 1;
      if (nextIndex >= inputRefs.current.length) nextIndex = 0;
      inputRefs.current[nextIndex]?.focus();
    }
  
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      let prevIndex = currentIndex - 1;
      if (prevIndex < 0) prevIndex = inputRefs.current.length - 1;
      inputRefs.current[prevIndex]?.focus();
    }
  };
  

  useEffect(() => {
    document.addEventListener("keydown", handleArrowNavigation);
    return () => document.removeEventListener("keydown", handleArrowNavigation);
  }, []);

  

  return (
    <>
      <Head>
        <title>Invoice</title>
      </Head>
      <div>
        <Link
          href="/invoice-lists"
          className="p-4 underline text-blue-400 hover:text-blue-700"
        >
          Invoice Lists
        </Link>
        <div className="flex h-screen lg:flex-row flex-col">
          <div className="lg:w-[60%] p-4">
            <h2 className="text-2xl font-bold mb-4">Invoice Form</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
               
                <div className="flex justify-between items-end gap-5">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Sold Quantity</span>
                    </label>
                    <input
                      ref={(el) => {
                        soldQtyRef.current = el; // Attach ref here
                        if (el && !inputRefs.current.some(ref => ref === el)) {
                          inputRefs.current.push(el);
                        }
                      }}
                      type="number"
                      name="singleItem.soldQty"
                      placeholder="Sold Quantity"
                      value={singleItem.soldQty}
                      onChange={handleChange}
                      className="input input-bordered w-full mb-2"
                      onFocus={() => {
                        if (singleItem.soldQty === 0) {
                          setSingleItem((prev) => ({ ...prev, soldQty: "" }));
                        }
                      }}
                    />
                  </div>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Height</span>
                    </label>
                    <input
                      ref={(el) => {
                        if (el && !inputRefs.current.some(ref => ref === el)) {
                          inputRefs.current.push(el);
                        }
                      }}
                      type="text"
                      name="singleItem.product.height"
                      value={singleItem.product.height}
                      onChange={handleChange}
                      className="input input-bordered mb-2 w-full"
                      placeholder="Enter Height"
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Thickness</span>
                    </label>
                    <input
                      ref={(el) => {
                        if (el && !inputRefs.current.some(ref => ref === el)) {
                          inputRefs.current.push(el);
                        }
                      }}
                      type="text"
                      name="singleItem.product.thickness"
                      value={singleItem.product.thickness}
                      onChange={handleChange}
                      list="thickness-suggestions"
                      className="input input-bordered mb-2 w-full"
                      placeholder="Enter Thickness"
                    />
                    <datalist id="thickness-suggestions">
                      {config.thicknesses.map((thickness) => (
                        <option key={thickness} value={thickness}>
                          {thickness}
                        </option>
                      ))}
                    </datalist>
                  </div>
                </div>
                <div className="flex justify-between gap-5">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Color</span>
                    </label>
                    <input
                      ref={(el) => {
                        if (el && !inputRefs.current.some(ref => ref === el)) {
                          inputRefs.current.push(el);
                        }
                      }}
                      type="text"
                      name="singleItem.product.color"
                      value={singleItem.product.color}
                      onChange={handleChange}
                      list="color-suggestions"
                      className="input input-bordered mb-2 w-full"
                      placeholder="Enter Color"
                    />
                    <datalist id="color-suggestions">
                      {config.colors.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </datalist>
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Price</span>
                    </label>
                    <input
                     ref={(el) => {
                      if (el && !inputRefs.current.some(ref => ref === el)) {
                        inputRefs.current.push(el);
                      }
                    }}
                      type="number"
                      name="singleItem.product.price"
                      placeholder="Price"
                      value={singleItem.product.price}
                      onChange={handleChange}
                      className="input input-bordered w-full mb-2"
                      onFocus={() => {
                        if (singleItem.product.price === 0) {
                          setSingleItem((prev) => ({
                            ...prev,
                            product: { ...prev.product, price: "" },
                          }));
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addItem(); // Keep existing behavior
                          setTimeout(() => soldQtyRef.current?.focus(), 0); // Then focus Sold Quantity
                        }
                      }}
                      
                    />
                  </div>

                  <div className="flex gap-5 items-center text-lg mt-5 w-full">
                    <h1>
                      <span>Item Total</span>
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
                    ref={(el) => inputRefs.current.push(el)}
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
                    ref={(el) => inputRefs.current.push(el)}
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
              <div className="flex justify-between gap-5 mt-5">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Total Amount</span>
                  </label>
                  <div className="input flex items-center input-bordered mb-2 w-full">
                    {invoiceData.totalAmount}
                  </div>
                </div>
                

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Amount Paid</span>
                  </label>
                  <input
                    ref={(el) => inputRefs.current.push(el)}
                    type="number"
                    name="amountPaid"
                    value={invoiceData.amountPaid}
                    onChange={handleChange}
                    className="input input-bordered w-full mb-2"
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Payment</span>
                  </label>
                  <select
                    ref={(el) => inputRefs.current.push(el)}
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
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full mt-5"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Invoice"}
              </button>
            </form>
          </div>
          <div className="lg:w-[40%] p-4">
            <InvoicePreview
              invoiceData={invoiceData}
              setInvoiceData={setInvoiceData}
              onEdit={handleEditItem}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoicePage;
