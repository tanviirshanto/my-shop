"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function StockManagement() {
  const [stocks, setStocks] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ productId: "", availableQty: "" });
  const [editingStockId, setEditingStockId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(7);
  const [totalStocks, setTotalStocks] = useState(0);

  useEffect(() => {
    fetchStocks();
    fetchProducts();
  }, [page, limit]);

  const fetchStocks = async () => {
    try {
      const res = await axios.get(`/api/stock?page=${page}&limit=${limit}`);
      setStocks(res.data.data);
      setTotalStocks(res.data.total);
    } catch (error) {
      console.error("Error fetching stocks", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products/no-pagination");
      setProducts(res.data.products);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const handleCreateOrUpdateStock = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      if (editingStockId) {
        await axios.put(`/api/stock/${editingStockId}`, form);
        toast.success("Stock updated successfully!");
      } else {
        const response = await axios.post("/api/stock", form);
        if (
          response.data.success === false &&
          response.data.message === "Stock already exists for this product"
        ) {
          setErrorMessage(response.data.message);
          toast.error("Stock already exists for this product");
          return;
        }
      }
      setForm({ productId: "", availableQty: "" });
      setEditingStockId(null);
      fetchStocks();
    } catch (error) {
      console.error("Error saving stock", error);
    }
  };

  const handleEditClick = (stock) => {
    setForm({ productId: stock.product._id, availableQty: stock.availableQty });
    setEditingStockId(stock._id);
  };

  const handleDeleteStock = async (id) => {
    if (!confirm("Are you sure you want to delete this stock item?")) return;
    try {
      await axios.delete(`/api/stock/${id}`);
      toast.success("Stock item deleted successfully!");
      fetchStocks();
    } catch (error) {
      console.error("Error deleting stock", error);
      toast.error("Error deleting stock");
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
    setPage(1); // Reset to first page when limit changes
  };

  const handleProductSelectChange = (e) => {
    const selectedProductId = e.target.value;
    setForm({ ...form, productId: selectedProductId });

    if (selectedProductId) {
      const stockToEdit = stocks.find(
        (stock) => stock.product._id === selectedProductId
      );
      if (stockToEdit) {
        handleEditClick(stockToEdit);
      } else {
        setForm({ ...form, availableQty: "" });
        setEditingStockId(null);
      }
    } else {
      setForm({ ...form, availableQty: "" });
      setEditingStockId(null);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-white ">Stock Management</h1>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="grid-cols-2">
          <form className="space-y-4" onSubmit={handleCreateOrUpdateStock}>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">Select Product</span>
              </label>
              <select
                className="select select-bordered w-full bg-gray-800 text-white"
                value={form.productId}
                onChange={handleProductSelectChange}
              >
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.height} - {product.color} - {product.thickness}mm
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">Available Quantity</span>
              </label>
              <input
                type="number"
                placeholder="Available Quantity"
                className="input input-bordered w-full bg-gray-800 text-white"
                value={form.availableQty}
                onChange={(e) => setForm({ ...form, availableQty: e.target.value })}
              />
            </div>

            <button className="btn btn-primary w-full" disabled={!editingStockId}>
              Update Stock
            </button>
          </form>
        </div>
        <div className="grid-cols-2">
          <div className="overflow-x-auto mt-8">
            <table className="table table-zebra w-full shadow-md rounded-lg bg-gray-900 text-white text-center">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Available Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stocks &&
                  stocks.map((stock) => (
                    <tr key={stock._id}>
                      <td>
                        {stock.product?.height} - {stock.product?.color} - {stock.product?.thickness}mm
                      </td>
                      <td>{stock.availableQty}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-info mb-2 mr-0 lg:mb-0 lg:mr-2"
                          onClick={() => handleEditClick(stock)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => handleDeleteStock(stock._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            <button
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className="btn btn-sm mr-2"
            >
              Previous
            </button>
            <span>
              Page {page} of {Math.ceil(totalStocks / limit)}
            </span>
            <button
              disabled={page * limit >= totalStocks}
              onClick={() => handlePageChange(page + 1)}
              className="btn btn-sm ml-2"
            >
              Next
            </button>
          </div>
          <div className="flex justify-center mt-4">
            <select
              value={limit}
              onChange={handleLimitChange}
              className="select select-bordered select-sm bg-gray-800 text-white"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}