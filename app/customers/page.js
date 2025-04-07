"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [message, setMessage] = useState("");
  const [editingCustomerId, setEditingCustomerId] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("/api/customers");
      setCustomers(res.data);
      // toast.success("Customers fetched successfully!");
    } catch (error) {
      console.error("Error fetching customers", error);
      toast.error("Error fetching customers");
    }
  };

  const handleCreateOrUpdateCustomer = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomerId) {
        await axios.put(`/api/customers/${editingCustomerId}`, form);
        setMessage("Customer updated successfully!");
        toast.success("Customer updated successfully!");
      } else {
        await axios.post("/api/customers", form);
        setMessage("Customer created successfully!");
        toast.success("Customer created successfully!");
      }
      
      // Reset the form only after the operation is successful
      setForm({ name: "", phone: "", address: "" });
      setEditingCustomerId(null);
      fetchCustomers(); // Reload customers list
    } catch (error) {
      console.error("Error saving customer", error);
      if (error.response) {
        // Handle known errors like validation or server issues
        setMessage(`Error: ${error.response.data.message || 'Something went wrong'}`);
      } else {
        setMessage("Error saving customer");
      }
      toast.error("Error saving customer");
    }
  };
  

  const handleEditClick = (customer) => {
    setForm(customer);
    setEditingCustomerId(customer._id);
  };

  const handleDeleteClick = async (id) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(`/api/customers/${id}`);
        fetchCustomers();
        setMessage("Customer deleted successfully!");
        toast.success("Customer deleted successfully!");
      } catch (error) {
        console.error("Error deleting customer", error);
        setMessage("Error deleting customer");
        toast.error("Error deleting customer");
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-white ">Customers</h1>

      {/* {message && (
        <div className={`alert ${message.startsWith("Error") ? "alert-error" : "alert-success"}`}>
          {message}
        </div>
      )} */}

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="grid-cols-1">
          <form
            className="my-4 flex flex-col gap-2"
            onSubmit={handleCreateOrUpdateCustomer}
          >
            <input
              className="input input-bordered"
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            
            <input
              className="input input-bordered"
              type="text"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
            <input
              className="input input-bordered"
              type="text"
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
            <button className="btn btn-primary">
              {editingCustomerId ? "Update Customer" : "Add Customer"}
            </button>
          </form>
        </div>

        <div className="grid-cols-1 overflow-x-auto">
          <table className="table w-full shadow-md rounded-lg">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td className="hover:text-blue-500 hover:underline">
                    <Link
                      href={`/invoice-lists?customerId=${customer._id}`}
                      className=""
                      key={customer._id}
                    >
                      {customer.name}
                    </Link>{" "}
                  </td>
                  <td>{customer.phone}</td>
                  <td>{customer.address}</td>
                  <td className=" flex gap-2">
                    <button
                      className="btn btn-sm btn-info mr-2"
                      onClick={() => handleEditClick(customer)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDeleteClick(customer._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
