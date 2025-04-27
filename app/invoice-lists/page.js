"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { formatDate } from "@/lib/functions";
import Head from "next/head";

// Helper: group invoices by date (YYYY-MM-DD)
function groupInvoicesByDate(invoices) {
  return invoices.reduce((grouped, invoice) => {
    const dateKey = new Date(invoice.date).toISOString().split("T")[0];
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(invoice);
    return grouped;
  }, {});
}

const InvoiceListPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
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
        } else {
          console.error("Failed to fetch invoices:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [currentPage, itemsPerPage, customerId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (invoiceId) => {
    const confirmation = window.confirm("Are you sure you want to delete this invoice?");
    if (confirmation) {
      try {
        const response = await fetch(`/api/invoice/${invoiceId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setInvoices(invoices.filter((invoice) => invoice._id !== invoiceId));
          alert("Invoice deleted successfully");
        } else {
          console.error("Failed to delete invoice:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting invoice:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <progress className="progress w-56"></progress>
      </div>
    );
  }

  const groupedInvoices = groupInvoicesByDate(invoices);
  const sortedDates = Object.keys(groupedInvoices).sort((a, b) => new Date(b) - new Date(a)); // Latest date first

  return (<>
    <Head>
         <title>List of Invoices</title>
         
    </Head>
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
              {sortedDates.map((date) => (
                <React.Fragment key={date}>
                  <tr className="bg-gray-100 text-slate-700">
                    <td colSpan="6" className="font-bold py-2">
                      {formatDate(new Date(date))}
                    </td>
                  </tr>
                  {groupedInvoices[date].map((invoice) => (
                    <tr key={invoice._id}>
                      <td>{invoice._id}</td>
                      <td>{invoice.customer?.name}</td>
                      <td>{formatDate(invoice.date)}</td>
                      <td>{invoice.totalAmount}</td>
                      <td>{invoice.payment}</td>
                      <td className="flex">
                        <Link href={`/invoice/${invoice._id}`} className="btn btn-sm btn-primary">
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(invoice._id)}
                          className="btn btn-sm btn-danger ml-2"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
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
                  className={`join-item btn ${currentPage === i + 1 ? "btn-active" : ""}`}
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
    </div></>
  );
};

export default dynamic(() => Promise.resolve(InvoiceListPage), { ssr: false });
