"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ConfigPage() {
  const [config, setConfig] = useState({ thicknesses: [], heights: [], colors: [], companies: [] });
  const [newValues, setNewValues] = useState({ thickness: "", height: "", color: "", company: "" });
  const [editValues, setEditValues] = useState({ field: "", oldValue: "", newValue: "" });

  useEffect(() => {
    fetchConfig();
  }, []);

  useEffect(() => {
    console.log("Updated NewValues:", newValues);
  }, [newValues]);

  const fetchConfig = async () => {
    try {
      const res = await axios.get("/api/config");
      console.log("API Response:", res.data);
      setConfig(res.data);
      console.log("Updated Config:", res.data);
    } catch (error) {
      console.error("Error fetching config", error);
    }
  };

  const handleAddValue = async (field) => {
    console.log(field, newValues[field.slice(0, -1)]);

    if (!newValues[field.slice(0, -1)]) return;
    try {
      await axios.post("/api/config", { field, value: newValues[field.slice(0, -1)] });
      fetchConfig();
      setNewValues({ ...newValues, [field.slice(0, -1)]: "" });
    } catch (error) {
      console.error(`Error adding ${field}`, error);
    }
  };

  const handleEditValue = async () => {
    if (!editValues.newValue) return;

    try {
      await axios.put("/api/config", editValues);
      fetchConfig();
      setEditValues({ field: "", oldValue: "", newValue: "" });
    } catch (error) {
      console.error("Error updating value", error);
    }
  };

  const handleDeleteValue = async (field, value) => {
    if (!confirm(`Are you sure you want to delete "${value}" from ${field}?`)) return;

    try {
      await axios.delete("/api/config", { data: { field, value } });
      fetchConfig();
    } catch (error) {
      console.error(`Error deleting ${field} value`, error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold flex text-white justify-center">Configuration</h1>
      {["thicknesses", "heights", "colors", "companies"].map((field) => (
        <div key={field} className="my-4 p-4 border border-2 border-gray-500 rounded-md ">
          <h2 className="text-xl font-semibold capitalize mb-4  flex justify-center">{field}</h2>
          <div className="flex gap-3 flex-wrap justify-center ">
            {config[field] && config[field].map((value) => (
              <div key={value} className="flex flex-col gap-2 justify-normal  items-center p-4 bg-gray-800 rounded-md">
                <span>{value}</span>
                <div className="flex gap-1">
                  <button
                    className="btn btn-sm btn-info mr-2"
                    onClick={() => setEditValues({ field, oldValue: value, newValue: value })}
                  >
                    Edit
                  </button>
                  <button className="btn btn-sm btn-error" onClick={() => handleDeleteValue(field, value)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="my-4 flex justify-center gap-2">
            <input
              className="input input-bordered w-48 "
              type="text"
              placeholder={`Add new ${field.slice(0, -1)}`}
              value={newValues[field.slice(0, -1)] || ""}
              onChange={(e) => {
                console.log("Input Value:", e.target.value);
                const key = field.slice(0, -1);
                const updatedValues = { ...newValues };
                updatedValues[key] = e.target.value;
                setNewValues(updatedValues);
                console.log(`Key: ${key}, Value: ${e.target.value}`);
              }}
            />
            <button className="btn btn-primary" onClick={() => handleAddValue(field)}>
              Add
            </button>
          </div>
        </div>
      ))}
      {editValues.oldValue && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h2 className="text-xl font-semibold">Edit {editValues.field}</h2>
            <input
              className="input input-bordered w-full mt-2"
              type="text"
              value={editValues.newValue || ""}
              onChange={(e) => setEditValues({ ...editValues, newValue: e.target.value })}
            />
            <div className="modal-action">
              <button className="btn btn-primary" onClick={handleEditValue}>
                Save
              </button>
              <button className="btn" onClick={() => setEditValues({ field: "", oldValue: "", newValue: "" })}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}