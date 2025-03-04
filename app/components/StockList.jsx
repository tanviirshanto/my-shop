// app/components/StockList.jsx
"use client"; // Mark as a Client Component

import { useEffect, useState } from "react";

const StockList = ({ refresh }) => {
  const [stock, setStock] = useState([]);
  const [editStockId, setEditStockId] = useState(null); // Track which stock item is being edited
  const [availableQty, setAvailableQty] = useState(""); // Store the updated quantity
  const [error, setError] = useState(""); // Store error messages
  const [showModal, setShowModal] = useState(false); // Control modal visibility

  useEffect(() => {
    fetchStock();
  }, [refresh]); // Refresh when the `refresh` prop changes

  const fetchStock = async () => {
    const response = await fetch("/api/stock");
    const data = await response.json();
    setStock(data);
  };

  // Handle edit button click
  const handleEditClick = (item) => {
    setEditStockId(item._id);
    setAvailableQty(item.availableQty);
    setError(""); // Clear any previous errors
  };

// Handle save button click
const handleSave = async () => {
    // Validate the input
    if (availableQty === "" || isNaN(availableQty)) {
      setError("Please enter a valid number.");
      return;
    }
    if (availableQty < 0) {
      setError("Quantity cannot be negative.");
      return;
    }
  
    // Show confirmation modal
    setShowModal(true);
  };

// Confirm save
const confirmSave = async () => {
    const response = await fetch(`/api/stock/${editStockId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ availableQty }),
    });
  
    if (response.ok) {
      setEditStockId(null); // Close the edit modal
      setError(""); // Clear any errors
      setShowModal(false); // Close the confirmation modal
      fetchStock(); // Refresh the stock list
    } else {
      const data = await response.json();
      setError(data.error || "Failed to update stock.");
    }
  };0

  return (
    <div className="overflow-x-auto">
      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Update</h3>
            <p className="py-4">Are you sure you want to update the stock quantity?</p>
            <div className="modal-action">
              <button onClick={() => setShowModal(false)} className="btn">
                Cancel
              </button>
              <button onClick={confirmSave} className="btn btn-primary">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="table">
        <thead>
          <tr>
            {/* <th>Product</th> */}
            <th>Thickness</th>
            <th>Height</th>
            <th>Color</th>
            <th>Company</th>
            <th>Available Quantity</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stock.map((item) => (
            <tr key={item._id}>
              {/* <td>{item.product?.name}</td> */}
              <td>{item.product?.thickness}</td>
              <td>{item.product?.height}</td>
              <td>{item.product?.color}</td>
              <td>{item.product?.company}</td>
              <td>
                {editStockId === item._id ? (
                  <div>
                    <input
                      type="number"
                      value={availableQty}
                      onChange={(e) => setAvailableQty(e.target.value)}
                      className="input input-bordered input-sm w-20"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                  </div>
                ) : (
                  item.availableQty
                )}
              </td>
              <td>{new Date(item.lastUpdated).toLocaleDateString()}</td>
              <td>
                {editStockId === item._id ? (
                  <button onClick={handleSave} className="btn btn-sm btn-success">
                    Save
                  </button>
                ) : (
                  <button onClick={() => handleEditClick(item)} className="btn btn-sm btn-primary">
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockList;