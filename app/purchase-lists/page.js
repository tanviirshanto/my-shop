"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const PurchaseListPage = () => {
  const [purchases, setPurchases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const searchParams = useSearchParams();
  const company = searchParams.get("company");

  useEffect(() => {
    const fetchPurchases = async () => {
      let url = `/api/purchase/get?page=${currentPage}&limit=${itemsPerPage}`;
      if (company) {
        url += `&company=${company}`;
      }
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setPurchases(data.purchases);
          setTotalPages(data.totalPages);
        } else {
          console.error("Failed to fetch purchases:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching purchases:", error);
      }
    };

    fetchPurchases();
  }, [currentPage, itemsPerPage, company]);

  const handlePageChange = (page ) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Purchases</h2>
      {purchases.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Purchase ID</th>
                <th>Company</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase._id}>
                  <td>{purchase._id}</td>
                  <td>{purchase.company}</td>
                  <td>{new Date(purchase.date).toLocaleDateString()}</td>
                  <td>{purchase.totalAmount}</td>
                  <td>
                    <Link href={`/purchase/${purchase._id}`} className="btn btn-sm btn-primary">
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
        <p>No purchases found.</p>
      )}
    </div>
  );
};

// export default PurchaseListPage;
export default dynamic(() => Promise.resolve(PurchaseListPage), { ssr: false });