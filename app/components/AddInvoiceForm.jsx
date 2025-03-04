"use client";

import { useState, useEffect } from "react";

export default function AddInvoiceForm() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [items, setItems] = useState([]);
  const [payment, setPayment] = useState("Pending");

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch("/api/products");
    const data = await response.json();
    setProducts(data);
  };

  const fetchCustomers = async () => {
    const response = await fetch("/api/customers");
    const data = await response.json();
    setCustomers(data);
  };

  const addItem = () => {
    setItems([...items, { product: "", soldQty: 0, itemTotal: 0 }]);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === "product" || field === "soldQty") {
      const product = products.find((p) => p._id === newItems[index].product);
      if (product && newItems[index].soldQty) {
        newItems[index].itemTotal = product.price * newItems[index].soldQty;
      }
    }

    setItems(newItems);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const invoiceData = {
      customer: selectedCustomer,
      items,
      payment,
    };

    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      });

      if (response.ok) {
        alert("Invoice created successfully!");
        setItems([]);
        setSelectedCustomer("");
        setPayment("Pending");
      } else {
        alert("Failed to create invoice");
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Error creating invoice");
    }
  };

  return (
    <div className="card bg-base-200 p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Invoice</h2>
      <form onSubmit={handleSubmit}>
        {/* Customer Selection */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Select Customer</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            required
          >
            <option value="">Select a customer</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.name} - {customer.phone}
              </option>
            ))}
          </select>
        </div>

        {/* Invoice Items */}
        <div className="space-y-4 mb-4">
          {items.map((item, index) => (
            <div key={index} className="card bg-base-100 p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  className="select select-bordered"
                  value={item.product}
                  onChange={(e) => updateItem(index, "product", e.target.value)}
                  required
                >
                  <option value="">Select product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.thickness}mm - {product.height}ft - {product.color}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  className="input input-bordered"
                  placeholder="Quantity"
                  value={item.soldQty || ""}
                  onChange={(e) =>
                    updateItem(index, "soldQty", parseInt(e.target.value))
                  }
                  required
                />
                <div className="input input-bordered flex items-center">
                  Total: ₹{item.itemTotal}
                </div>
                <button
                  type="button"
                  className="btn btn-error"
                  onClick={() => removeItem(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <button type="button" className="btn btn-secondary mb-4" onClick={addItem}>
          Add Item
        </button>

        {/* Payment Status */}
        <div className="form-control mb-6">
          <label className="label">
            <span className="label-text">Payment Status</span>
          </label>
          <select
            className="select select-bordered"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            required
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        {/* Total Amount */}
        <div className="text-xl font-bold mb-6">
          Total Amount: ₹
          {items.reduce((sum, item) => sum + (item.itemTotal || 0), 0)}
        </div>

        <button type="submit" className="btn btn-primary">
          Create Invoice
        </button>
      </form>
    </div>
  );
}