// app/components/AddPurchaseForm.jsx
"use client"; // Mark as a Client Component

import { useState } from "react";

const AddPurchaseForm = ({ onPurchaseAdded }) => {
  const [formData, setFormData] = useState({
    thickness: "",
    height: "",
    color: "",
    company: "",
    boughtQty: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Purchase added successfully!");
      setFormData({
        thickness: "",
        height: "",
        color: "",
        company: "",
        boughtQty: "",
      });
      onPurchaseAdded(); // Refresh the purchase list
    } else {
      alert("Failed to add purchase.");
    }
  };

  return (
    <div className="card bg-base-200 p-6">
      <h2 className="text-xl font-bold mb-4">Add New Purchase</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="thickness"
            placeholder="Thickness"
            className="input input-bordered"
            value={formData.thickness}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="height"
            placeholder="Height"
            className="input input-bordered"
            value={formData.height}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="color"
            placeholder="Color"
            className="input input-bordered"
            value={formData.color}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="company"
            placeholder="Company"
            className="input input-bordered"
            value={formData.company}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="boughtQty"
            placeholder="Quantity"
            className="input input-bordered"
            value={formData.boughtQty}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-4">
          Add Purchase
        </button>
      </form>
    </div>
  );
};

export default AddPurchaseForm;