// app/sells/[...slugs]/page.jsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { use } from 'react'; // Import React.use

export default function SellsPage({ params: paramsPromise }) { // Rename params to paramsPromise
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = use(paramsPromise); // Unwrap params with React.use()
  const { slugs } = params;
  const [sells, setSells] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchSells = async () => {
      setLoading(true);
      setError(null);
      try {
        const page = searchParams.get('page') || 1;
        const limitParam = searchParams.get('limit') || 10;

        const response = await fetch(
          `/api/sell/${slugs.join('/')}?page=${page}&limit=${limitParam}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch sells');
        }

        const data = await response.json();
        setSells(data.sells);
        setTotalPages(data.totalPages);
        setCurrentPage(parseInt(page));
        setLimit(parseInt(limitParam));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSells();
  }, [slugs, searchParams]);

  const handlePageChange = (newPage) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('page', newPage);
    router.push(`/sell/${slugs.join('/')}?${newSearchParams.toString()}`);
  };

  const handleLimitChange = (event) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('limit', event.target.value);
    newSearchParams.set('page', 1);
    router.push(`/sell/${slugs.join('/')}?${newSearchParams.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sells for {slugs.join('/')}</h1>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Date</th>
              <th>Sold Qty</th>
              
              <th>Product</th>
            </tr>
          </thead>
          <tbody>
            {sells.map((sell) => (
              <tr key={sell._id}>
                <td>{new Date(sell.date).toLocaleDateString()}</td>
                <td>{sell.soldQty}</td>
                
                <td>
                  {sell.product?.thickness}/{sell.product?.height}/
                  {sell.product?.color}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <label htmlFor="limit" className="mr-2">
            Items per page:
          </label>
          <select
            id="limit"
            className="select select-bordered select-xs"
            value={limit}
            onChange={handleLimitChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>

        <div className="join">
          <button
            className="join-item btn btn-xs"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            «
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`join-item btn btn-xs ${
                currentPage === page ? 'btn-active' : ''
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="join-item btn btn-xs"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}