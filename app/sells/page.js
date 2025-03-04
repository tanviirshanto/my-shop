"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { formatDate } from "@/lib/functions";

export default function Sells() {
  const [sells, setSells] = useState([]);
  const [config, setConfig] = useState({ thicknesses: [], heights: [], colors: [], companies: [] });
  const [form, setForm] = useState({ company: "", color: "", thickness: "", soldQty: "", height: "" });
  const [editingSellId, setEditingSellId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5; // You can adjust this

  useEffect(() => {
    fetchSells();
    fetchConfig();
  }, [currentPage]);

  const fetchSells = async () => {
    try {
      const res = await axios.get(`/api/sell?page=${currentPage}&limit=${itemsPerPage}`);
      setSells(res.data.sells);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching sells", error);
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

  const handleCreateOrUpdateSell = async (e) => {
    e.preventDefault();
    try {
      if (editingSellId) {
        await axios.put(`/api/sell/${editingSellId}`, form);
      } else {
        await axios.post("/api/sell", form);
      }
      setForm({ company: "", color: "", thickness: "", soldQty: "", height: "" });
      setEditingSellId(null);
      fetchSells();
    } catch (error) {
      console.error("Error saving sell", error);
    }
  };

  const handleEditClick = (sell) => {
    setForm({ ...sell.product, soldQty: sell.soldQty, height: sell.product.height, thickness: sell.product.thickness, color: sell.product.color, company: sell.product.company });
    setEditingSellId(sell._id);
  };

  const handleDeleteSell = async (id) => {
    if (!confirm("Are you sure you want to delete this sell?")) return;
    try {
      await axios.delete(`/api/sell/${id}`);
      fetchSells();
    } catch (error) {
      console.error("Error deleting sell", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`btn btn-sm mx-1 ${currentPage === i ? "btn-active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return <div className="join mt-4">{pages}</div>;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-white">Sells</h1>

      <div className="grid lg:grid-cols-2 gap-4">
        <form className="space-y-4 grid-cols-1" onSubmit={handleCreateOrUpdateSell}>
          {/* Form inputs */}
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
              <span className="label-text">Sold Quantity</span>
            </label>
            <input
              type="number"
              placeholder="Sold Quantity"
              className="input input-bordered w-full"
              value={form.soldQty}
              onChange={(e) => setForm({ ...form, soldQty: e.target.value })}
            />
          </div>

          <button className="btn btn-primary w-full" disabled={!editingSellId}>
            Update Sell
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
              {sells.map((sell) => (
                <tr key={sell._id}>
                  <td>{formatDate(sell.date)}</td>
                  <td>
                    {sell.product.height}ft - {sell.product.thickness}mm - {sell.product.color} - {sell.product.company}
                  </td>
                  <td>{sell.soldQty}</td>
                  <td>
                    <button className="btn btn-sm btn-info mb-2 mr-0 lg:mb-0 lg:mr-2" onClick={() => handleEditClick(sell)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-error" onClick={() => handleDeleteSell(sell._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {renderPagination()}
        </div>
      </div>
    </div>
  );
}