"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";  // Import usePathname
import { BiSolidPurchaseTag } from "react-icons/bi";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { MdInventory2 } from "react-icons/md";
import { RiHome5Fill } from "react-icons/ri";
import { AiFillProduct } from "react-icons/ai";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  const [openDropdown, setOpenDropdown] = useState(null);
  const pathname = usePathname();  
  console.log(pathname); 
  // Function to handle dropdown toggle
  const handleDropdownClick = (dropdownKey) => {
    setOpenDropdown((prev) => (prev === dropdownKey ? null : dropdownKey));
  };

  // Function to close dropdown on item click
  const handleItemClick = () => {
    setOpenDropdown(null);
  };

  // Close dropdown if clicking outside the navbar
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".dropdown")) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  // Check if the current route is 'signin' or 'register' page
  const isAuthPage = pathname === "/signin" || pathname === "/register";

  // If it's an authentication page, don't render the Navbar
  if (isAuthPage) {
    return null; 
  }

  return (
    <div className="flex max-w-screen navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link
          href="/"
          className="flex text-xl gap-1 items-center no-underline transition duration-300 text-green-400 btn btn-ghost"
        >
          <RiHome5Fill /> Home
        </Link>
      </div>
      <div className="flex-none z-50">
        <ul className="menu space-x-4 menu-horizontal px-1">
          {[
            {
              key: "invoice",
              icon: <FaFileInvoiceDollar />,
              label: "Invoice",
              links: ["/invoice", "/invoice-lists"],
            },
            {
              key: "purchase",
              icon: <BiSolidPurchaseTag />,
              label: "Purchase",
              links: ["/purchase", "/purchase-lists"],
            },
            {
              key: "stock",
              icon: <MdInventory2 />,
              label: "Stock",
              links: ["/stocks/table", "/stockBook"],
            },
            {
              key: "products",
              icon: <AiFillProduct />,
              label: "Products",
              links: ["/products", "/products/bulk"],
            },
          ].map(({ key, icon, label, links }) => (
            <li key={key} className="dropdown relative">
              <button
                className="flex gap-1 items-center btn btn-ghost"
                onClick={() => handleDropdownClick(key)}
              >
                {icon} {label}
              </button>
              {openDropdown === key && (
                <ul className="absolute left-0 top-full mt-2 bg-base-100 shadow-lg rounded-lg w-40 p-2 space-y-2">
                  {links.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link}
                        className="block p-2 hover:bg-base-200 rounded-md"
                        onClick={handleItemClick}
                      >
                        {link.split("/").pop().replace("-", " ")}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="mx-4">
        {session && 
          <button
            className="btn btn-primary no-underline transition duration-300"
            onClick={() => signOut()}
          >
            Sign Out
          </button>}
      </div>
    </div>
  );
};

export default Navbar;
