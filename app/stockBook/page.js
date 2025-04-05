"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function StockBook() {
  const [bulk, setBulk] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 25;
  const [heights, setHeights] = useState([]);
  const [loading, setLoading] = useState(true);
  


  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`btn btn-sm mx-1 ${currentPage === i ? "btn-active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return <div className="join mt-4">{pages}</div>;
  };

  const fetchBulk = async () => {
    try {
      const res = await axios.get(
        `/api/products/bulk`
      );
      setBulk(res.data.variations);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Error fetching bulk", error);
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await axios.get("/api/config");
      console.log("config", res.data);
      setHeights(res.data.heights);
    } catch (error) {
      console.error("Error fetching config", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await Promise.all([fetchBulk(), fetchConfig()]);
      setLoading(false);
    };
    fetchData();
  }, [currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <progress className="progress w-56"></progress>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full overflow-x-auto">
      <h1 className="text-3xl text-slate-200 font-semibold my-8">Stock Book</h1>
      <table className="table lg:w-[60%] w-full  border border-gray-500 shadow-md rounded-lg text-center text-[16px]">
        <thead>
          <tr className="text-slate-300 text-sm">
            <th>Thickness</th>
            <th>Color</th>
            <th>Price</th>
            <th>Heights</th>
          </tr>
        </thead>
        <tbody>
          {bulk.map((variation) => (
            <tr key={`${variation.thickness}-${variation.color}`}>
              <td>{variation.thickness} mm</td>
              <td>{variation.color}</td>
              <td>{variation.price}</td>
              <td>
               {heights.map((value) => <Link href={`/stockBook/${variation.thickness}/${value}/${variation.color}`} key={value} className="mr-3 hover:underline" >{value}</Link>)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* {renderPagination()} */}
    </div>
  );
}

export default StockBook;
