"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [config, setConfig] = useState({ thicknesses: [], heights: [], colors: [], companies: [] });
  const [form, setForm] = useState({ thickness: "", height: "", price: "", color: "", company: "" });
  const [editingProductId, setEditingProductId] = useState(null);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9; // Adjust as needed

  useEffect(() => {
    fetchProducts();
    fetchConfig();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`/api/products?page=${currentPage}&limit=${itemsPerPage}`);
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching products", error);
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
      if (editingProductId) {
        await axios.put("/api/products", { id: editingProductId, ...form });
        setMessage("Product updated successfully!");
      } else {
        await axios.post("/api/products", form);
        setMessage("Product added successfully!");
        toast.success("Product added successfully!");
      }

      setForm({ thickness: "", height: "", price: "", color: "", company: "" });
      setEditingProductId(null);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product", error);
      setMessage("Error saving product.");
      toast.error("Error saving product.");
    }
  };

  const handleEditClick = (product) => {
    setForm(product);
    setEditingProductId(product._id);
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete("/api/products", { data: { id } });
      fetchProducts();
      setMessage("Product deleted successfully!");
      toast.success("Product deleted successfully!");
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
      <h1 className="text-3xl font-bold text-white ">Products</h1>

      {/* {message && <div className="alert alert-success">{message}</div>} */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="lg:grid-cols-2">
          <form className="my-4 flex flex-col gap-2" onSubmit={handleCreateOrUpdateProduct}>
            {/* Form inputs */}
            <select className="select select-bordered" value={form.thickness} onChange={(e) => setForm({ ...form, thickness: e.target.value })} required>
              <option value="">Select Thickness</option>
              {config.thicknesses.map((value) => (
                <option key={value} value={value}>{value} mm</option>
              ))}
            </select>

            <select className="select select-bordered" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} required>
              <option value="">Select Height</option>
              {config.heights.map((value) => (
                <option key={value} value={value}>{value} feet</option>
              ))}
            </select>

            <input className="input input-bordered" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />

            <select className="select select-bordered" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} required>
              <option value="">Select Color</option>
              {config.colors.map((color) => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>

            <select className="select select-bordered" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required>
              <option value="">Select Company</option>
              {config.companies.map((company) => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>

            <button className="btn btn-primary" disabled={!form.thickness || !form.height || !form.price || !form.color || !form.company}>
              {editingProductId ? "Update Product" : "Add Product"}
            </button>
          </form>
        </div>
        { products? 
        <div className="lg:grid-cols-2 overflow-x-auto">
          <table className="table w-full shadow-md rounded-lg">
            <thead>
              <tr>
                <th>Thickness</th>
                <th>Height</th>
                <th>Price</th>
                <th>Color</th>
                <th>Company</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.thickness} mm</td>
                  <td>{product.height} feet</td>
                  <td>{product.price}</td>
                  <td>{product.color}</td>
                  <td>{product.company}</td>
                  <td>
                    <button className="btn btn-sm btn-info mr-2" onClick={() => handleEditClick(product)}>Edit</button>
                    <button className="btn btn-sm btn-error" onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {renderPagination()}
        </div>: "No product to show." }
      </div>
    </div>
  );
}