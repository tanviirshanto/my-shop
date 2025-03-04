"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { formatDate } from "@/lib/functions"; // Assuming this is where your formatDate function is

export default function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [config, setConfig] = useState({ thicknesses: [], heights: [], colors: [], companies: [] });
  const [form, setForm] = useState({ company: "", color: "", thickness: "", boughtQty: "", height: "" });
  const [editingPurchaseId, setEditingPurchaseId] = useState(null);

  useEffect(() => {
    fetchPurchases();
    fetchConfig();
  }, []);

  const fetchPurchases = async () => {
    try {
      const res = await axios.get("/api/purchase");
      setPurchases(res.data);
    } catch (error) {
      console.error("Error fetching purchases", error);
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await axios.get("/api/config");
      setConfig(res.data);
    } catch (error) {
      console.error("Error fetching config", error);
    }
  };

  const handleCreateOrUpdatePurchase = async (e) => {
    e.preventDefault();
    try {
      if (editingPurchaseId) {
        await axios.put(`/api/purchase/${editingPurchaseId}`, form);
      } else {
        await axios.post("/api/purchase", form);
      }
      setForm({ company: "", color: "", thickness: "", boughtQty: "", height: "" });
      setEditingPurchaseId(null);
      fetchPurchases();
    } catch (error) {
      console.error("Error saving purchase", error);
    }
  };

  const handleEditClick = (purchase) => {
    setForm({ ...purchase.product, boughtQty: purchase.boughtQty, height: purchase.product.height, thickness: purchase.product.thickness, color: purchase.product.color, company: purchase.product.company }); // Pre-fill with product details + all other fields
    setEditingPurchaseId(purchase._id);
  };

  const handleDeletePurchase = async (id) => {
    if (!confirm("Are you sure you want to delete this purchase?")) return;
    try {
      await axios.delete(`/api/purchase/${id}`);
      fetchPurchases();
    } catch (error) {
      console.error("Error deleting purchase", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-white">Purchases</h1>

<div className="grid lg:grid-cols-2 gap-4">
      <form className="space-y-4 grid-cols-1" onSubmit={handleCreateOrUpdatePurchase}>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Height (ft)</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={form.height}
            onChange={(e) => setForm({ ...form, height: e.target.value })}
          >
            <option value="">Select Heights</option>
            {config.heights.map((height) => (
              <option key={height} value={height}>
                {height}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Thickness (mm)</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={form.thickness}
            onChange={(e) => setForm({ ...form, thickness: e.target.value })}
          >
            <option value="">Select Thickness</option>
            {config.thicknesses.map((thickness) => (
              <option key={thickness} value={thickness}>
                {thickness}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Company</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          >
            <option value="">Select Company</option>
            {config.companies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Color</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
          >
            <option value="">Select Color</option>
            {config.colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Bought Quantity</span>
          </label>
          <input
            type="number"
            placeholder="Bought Quantity"
            className="input input-bordered w-full"
            value={form.boughtQty}
            onChange={(e) => setForm({ ...form, boughtQty: e.target.value })}
          />
        </div>

        <button className="btn btn-primary w-full"  disabled={!form.height || !form.thickness || !form.boughtQty}>
          {editingPurchaseId ? "Update Purchase" : "Add Purchase"}
        </button>
      </form>

      <div className="overflow-x-auto mt-8 grid-cols-1">
        <table className="table table-zebra w-full shadow-md rounded-lg">
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase._id}>
                <td>{formatDate(purchase.date)}</td>
                <td>
                  {purchase.product.height}ft - {purchase.product.thickness}mm - {purchase.product.color} - {purchase.product.company}
                </td>
                <td>{purchase.boughtQty}</td>
                <td>
                  <button className="btn btn-sm btn-info mb-2 mr-0 lg:mb-0 lg:mr-2" onClick={() => handleEditClick(purchase)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-error" onClick={() => handleDeletePurchase(purchase._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div></div>
  );
}