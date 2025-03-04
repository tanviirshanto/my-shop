// app/page.jsx
"use client"; // Mark as a Client Component

import { useState } from "react";
import ProductList from "./components/ProductList";
import AddProductForm from "./components/AddProductForm";
import CustomerList from "./components/CustomerList";
import AddCustomerForm from "./components/AddCustomerForm";
import PurchaseList from "./components/PurchaseList";
import AddPurchaseForm from "./components/AddPurchaseForm";
import StockList from "./components/StockList";



export default function Home() {
  const [activeTab, setActiveTab] = useState("products"); // Default to "products" tab
  const [refreshProducts, setRefreshProducts] = useState(false);
  const [refreshCustomers, setRefreshCustomers] = useState(false);
  const [refreshPurchases, setRefreshPurchases] = useState(false);
  const [refreshStock, setRefreshStock] = useState(false);
  const [refreshInvoice, setRefreshInvoice] = useState(false);


  // Handle product added
  const handleProductAdded = () => {
    setRefreshProducts(!refreshProducts); // Toggle refresh state to refetch products
  };

  // Handle customer added
  const handleCustomerAdded = () => {
    setRefreshCustomers(!refreshCustomers); // Toggle refresh state to refetch customers
  };

  // Handle purchase added
  const handlePurchaseAdded = () => {
    setRefreshPurchases(!refreshPurchases); // Toggle refresh state to refetch purchases
    setRefreshStock(!refreshStock); // Also refresh the stock list
  };

    // Handle invoice added
    const handleInvoiceAdded = () => {
      setRefreshInvoice(!refreshInvoice); // Toggle refresh state to refetch Invoices
    };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Shop Management</h1>

      {/* Tabs for switching between Products, Customers, Purchases, and Stock */}
      <div className="tabs">
        <button
          className={`tab tab-bordered ${activeTab === "products" ? "tab-active text-white" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
        <button
          className={`tab tab-bordered ${activeTab === "customers" ? "tab-active text-white" : ""}`}
          onClick={() => setActiveTab("customers")}
        >
          Customers
        </button>
        <button
          className={`tab tab-bordered ${activeTab === "purchases" ? "tab-active text-white" : ""}`}
          onClick={() => setActiveTab("purchases")}
        >
          Purchases
        </button>
        <button
          className={`tab tab-bordered ${activeTab === "stock" ? "tab-active text-white" : ""}`}
          onClick={() => setActiveTab("stock")}
        >
          Stock
        </button>
        <button
          className={`tab tab-bordered ${activeTab === "invoice" ? "tab-active text-white" : ""}`}
          onClick={() => setActiveTab("invoice")}
        >
          Invoice
        </button>
      </div>

      {/* Products Tab Content */}
      {activeTab === "products" && (
        <div>
          <AddProductForm onProductAdded={handleProductAdded} />
          <div className="mt-8 text-center">
            <ProductList refresh={refreshProducts} />
          </div>
        </div>
      )}

      {/* Customers Tab Content */}
      {activeTab === "customers" && (
        <div>
          <AddCustomerForm onCustomerAdded={handleCustomerAdded} />
          <div className="mt-8">
            <CustomerList refresh={refreshCustomers} />
          </div>
        </div>
      )}

      {/* Purchases Tab Content */}
      {activeTab === "purchases" && (
        <div>
          <AddPurchaseForm onPurchaseAdded={handlePurchaseAdded} />
          <div className="mt-8">
            <PurchaseList refresh={refreshPurchases} />
          </div>
        </div>
      )}

      {/* Stock Tab Content */}
      {activeTab === "stock" && (
        <div>
          <div className="mt-8">
            <StockList refresh={refreshStock} />
          </div>
        </div>
      )}

      

    </div>
  );
}
