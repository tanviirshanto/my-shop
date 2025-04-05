"use client"
import Link from 'next/link'
import React from 'react'

const HomeItemCard = () => {
  return (
    <div className="card border-2 border-gray-500 bg-base-100 w-full shadow-sm">
  {/* <figure>
    <img
      src="https://img.lovepik.com/bg/20240427/3D-Illustration-of-PVC-Coated-Metal-Roof-Sheets-and-Corrugated_8222745_wh1200.jpg"
      alt="Roofing Sheet"
      className='w-full h-60 object-cover'
      />
  </figure> */}
  <div className="card-body flex flex-col justify-center items-center">
    <h2 className="card-title mb-2">
      Admin
    </h2>
    <div className="card-actions">
    <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box">
  <li><Link href="/products">Products</Link></li>
  <li><Link href="/stocks">Stocks</Link></li>
  <li><Link href="/sells">Sells</Link></li>
  <li><Link href="/customers">Customers</Link></li>
  <li><Link href="/products/bulk">Bulk Products</Link></li>
  <li><Link href="/configs">Configs</Link></li>
  <li><Link href="/reset-records">Reset Records</Link></li>

</ul>
    </div>
  </div>
</div>
  )
}

export default HomeItemCard