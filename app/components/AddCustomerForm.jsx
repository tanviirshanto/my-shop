// app/components/AddCustomerForm.jsx
"use client"; // Mark as a Client Component

import { useState } from "react";

const AddCustomerForm = ({ onCustomerAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Customer added successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
      });
      onCustomerAdded(); // Refresh the customer list
    } else {
      alert("Failed to add customer.");
    }
  };

  return (
    <div className="card bg-base-200 p-6">
      <h2 className="text-xl font-bold mb-4">Add New Customer</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="input input-bordered"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            className="input input-bordered"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            className="input input-bordered"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-4">
          Add Customer
        </button>
      </form>
    </div>
  );
};

export default AddCustomerForm;