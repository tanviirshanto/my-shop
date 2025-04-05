"use client";

import { handleReset, handleStockQuantity } from "./functions";

export default function MyComponent() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-base-200 p-6">
      <div className="card mt-10 w-full max-w-md bg-base-100 shadow-xl p-6 text-center space-y-4">
        <h2 className="text-2xl font-bold">Reset Records</h2>
        <p className="text-sm text-gray-500">
          Delete all records in one click.
        </p>
        <div className="flex flex-col gap-3">
          <button
            className="btn btn-primary"
            onClick={handleReset}
            name="purchase"
          >
            Reset Purchases
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleReset}
            name="invoice"
          >
            Reset Invoices
          </button>
          <button
            className="btn btn-warning"
            onClick={handleReset}
            name="stockBook"
          >
            Reset StockBook
          </button>
          <button className="btn  btn-error" onClick={handleReset} name="sells">
            Reset Sells
          </button>
          <button className="btn  btn-info  " onClick={handleStockQuantity} >
            Reset Stock Quantity
          </button>
        </div>
      </div>
    </div>
  );
}
