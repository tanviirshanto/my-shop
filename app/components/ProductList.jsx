// app/components/ProductList.jsx
"use client"; // Mark as a Client Component

import { useEffect, useState } from "react";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch("/api/products");
    const data = await response.json();
    setProducts(data);
  };

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Thickness</th>
            <th>Height</th>
            <th>Price</th>
            <th>Color</th>
            <th>Company</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.thickness}</td>
              <td>{product.height}</td>
              <td>{product.price}</td>
              <td>{product.color}</td>
              <td>{product.company}</td>
              <td>
                <button className="btn btn-sm btn-primary mr-2">Edit</button>
                <button className="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;