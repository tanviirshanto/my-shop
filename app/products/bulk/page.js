"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Products() {
  const [bulk, setBulk] = useState([]);
  const [config, setConfig] = useState({ thicknesses: [], heights: [], colors: [], companies: [] });
  const [form, setForm] = useState({ thickness: "", price: "", color: "", company: "" });
  const [editingVariation, setEditingVariation] = useState(null);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchBulk();
    fetchConfig();
  }, [currentPage]);

  const fetchBulk = async () => {
    try {
      const res = await axios.get(`/api/products/bulk?page=${currentPage}&limit=${itemsPerPage}`);
      setBulk(res.data.variations);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching bulk", error);
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

  const handleCreateOrUpdateProduct = async (e) => {
    e.preventDefault();

    try {
      if (editingVariation) {
        await axios.put("/api/products/bulk", {
          originalThickness: editingVariation.thickness,
          originalColor: editingVariation.color,
          ...form,
        });
        setMessage("Products updated successfully!");
        toast.success("Products updated successfully!");
      } else {
        await axios.post("/api/products/bulk", form);
        setMessage("Products added successfully!");
        toast.success("Products added successfully!");
      }

      setForm({ thickness: "", price: "", color: "", company: "" });
      setEditingVariation(null);
      fetchBulk();
    } catch (error) {
      console.error("Error saving products", error);
      setMessage("Error saving products.");
      toast.error("Error saving products.");
    }
  };

  const handleEditClick = (variation) => {
    setForm({
      thickness: variation.thickness,
      price: variation.price,
      color: variation.color,
      company: variation.company,
    });
    setEditingVariation(variation);
  };

  const handleDeleteProduct = async (variation) => {
    if (!confirm("Are you sure you want to delete this product combination?")) return;

    try {
      await axios.delete("/api/products/bulk", {
        data: {
          thickness: variation.thickness,
          color: variation.color,
        },
      });
      fetchBulk();
      setMessage("Product combination deleted successfully!");
      toast.success("Product combination deleted successfully!");
    } catch (error) {
      console.error("Error deleting product", error);
      setMessage("Error deleting product.");
      toast.error("Error deleting product.");
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
      <h1 className="text-3xl font-bold text-white ">Product Bulk</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="lg:grid-cols-2">
          <form className="my-4 flex flex-col gap-2" onSubmit={handleCreateOrUpdateProduct}>
            <select
              className="select select-bordered"
              value={form.thickness}
              onChange={(e) => setForm({ ...form, thickness: e.target.value })}
              required
            >
              <option value="">Select Thickness</option>
              {config.thicknesses.map((value) => (
                <option key={value} value={value}>
                  {value} mm
                </option>
              ))}
            </select>

            <input
              className="input input-bordered"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />

            <select
              className="select select-bordered"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              required
            >
              <option value="">Select Color</option>
              {config.colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>

            <select
              className="select select-bordered"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              required
            >
              <option value="">Select Company</option>
              {config.companies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>

            <button
              className="btn btn-primary"
              disabled={!form.thickness || !form.price || !form.color || !form.company}
            >
              {editingVariation ? "Update Products" : "Add Products"}
            </button>
          </form>
        </div>
        <div className="lg:grid-cols-2 overflow-x-auto">
          <table className="table w-full shadow-md rounded-lg">
            <thead>
              <tr>
                <th>Thickness</th>
                <th>Color</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bulk.map((variation) => (
                <tr key={`${variation.thickness}-${variation.color}`}>
                  <td>{variation.thickness} mm</td>
                  <td>{variation.color}</td>
                  <td>{variation.price}</td>
                  <td>
                    <button className="btn btn-sm btn-info mr-2" onClick={() => handleEditClick(variation)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-error" onClick={() => handleDeleteProduct(variation)}>
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