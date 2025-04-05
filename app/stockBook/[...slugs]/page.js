'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { use } from 'react';
import { formatDate } from '@/utils/fetchData';

export default function StockBooksPage({ params: paramsPromise }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = use(paramsPromise);
  const { slugs } = params;
  const [stockBooks, setStockBooks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [limit, setLimit] = useState(10);
  const [availableQty, setAvailableQty] = useState(undefined);

  useEffect(() => {
    const fetchStockBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const page = searchParams.get('page') || 1;
        const limitParam = searchParams.get('limit') || 10;
        const response = await fetch(
          `/api/stockBook/${slugs.join('/')}?page=${page}&limit=${limitParam}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to fetch stockBooks:', response.status, errorData);
          throw new Error(`Failed to fetch stockBooks: ${response.statusText}`);
        }

        const data = await response.json();
        setMessage(data.message);
        setStockBooks(data.items || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(parseInt(page));
        setLimit(parseInt(limitParam));
        setAvailableQty(data.availableQty);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStockBooks();
  }, [slugs, searchParams]);

  const handlePageChange = (newPage) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('page', newPage);
    router.push(`/stockBooks/${slugs.join('/')}?${newSearchParams.toString()}`);
  };

  const handleLimitChange = (event) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('limit', event.target.value);
    newSearchParams.set('page', 1);
    router.push(`/stockBook/${slugs.join('/')}?${newSearchParams.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="mt-4">Fetching stock books...</p>
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
      <h1 className="text-2xl font-bold text-white mt-10 w-[60%] mx-auto text-center">
        StockBooks for <span className="text-blue-300"> {slugs[0]}mm - {slugs[1]}ft - {slugs[2]} </span>
      </h1>
      <h2 className="text-xl font-semibold text-white mt-4 mb-10 w-[60%] mx-auto text-center">Available Quantity: <span className="text-blue-300"> {availableQty} </span> </h2>

      <div className="overflow-x-auto w-full flex justify-center">
        <table className="table table-zebra w-[60%] table-bordered text-center table-compact table-striped">
          <thead className="text-lg">
            <tr>
              <th>Date</th>
              <th>Quantity</th>
              <th>Available Qty</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(stockBooks) && stockBooks.length > 0 ? (
              stockBooks.map((stockBook) => (
                <tr key={stockBook._id}>
                  <td>{formatDate(stockBook.date)}</td>
                  {stockBook.transactionType === "Sell" ? (
                    <td className="text-red-400">{stockBook.quantity}</td>
                  ) : (
                    <td className="text-green-400">{stockBook.quantity}</td>
                  )}
                  <td>{stockBook.newQty}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  {message || 'No stock books found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center w-[60%] mx-auto mt-4">
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
              className={`join-item btn btn-xs ${currentPage === page ? 'btn-active' : ''}`}
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