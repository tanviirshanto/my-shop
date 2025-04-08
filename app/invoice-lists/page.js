"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const InvoiceListPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const searchParams = useSearchParams();
  const customerId = searchParams.get("customerId");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const fetchInvoices = async () => {
      let url = `/api/invoice/get?page=${currentPage}&limit=${itemsPerPage}`;
      if (customerId) {
        url += `&customerId=${customerId}`;
      }
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setInvoices(data.invoices);
          setTotalPages(data.totalPages);
          setLoading(false);
        } else {
          console.error("Failed to fetch invoices:", response.statusText);
      setLoading(false);

        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
      setLoading(false);

      }
    };

    fetchInvoices();
  }, [currentPage, itemsPerPage, customerId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <progress className="progress w-56"></progress>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Invoices</h2>
      {invoices.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th>Payment Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td>{invoice._id}</td>
                  <td>{invoice.customer.name}</td>
                  <td>{new Date(invoice.date).toLocaleDateString()}</td>
                  <td>{invoice.totalAmount}</td>
                  <td>{invoice.payment}</td>
                  <td>
                    <Link
                      href={`/invoice/${invoice._id}`}
                      className="btn btn-sm btn-primary"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            <div className="join">
              <button
                className="join-item btn"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                «
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`join-item btn ${
                    currentPage === i + 1 ? "btn-active" : ""
                  }`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="join-item btn"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                »
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>No invoices found.</p>
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(InvoiceListPage), { ssr: false });
