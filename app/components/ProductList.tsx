"use client";

import moment from "moment";
import Link from "next/link";
import { useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useAllProduct, useDeleteProduct } from "../Query/ProductQuery";
import { IProduct } from "../service/ProductService";

export default function ProductList() {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [sortField, setSortField] = useState<"createdAt" | "updatedAt">(
    "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Combine into API-friendly format: sort=-createdAt or sort=updatedAt
  const sortQuery = `${sortOrder === "desc" ? "-" : ""}${sortField}`;

  const { data } = useAllProduct({
    searchName: name,
    searchDescription: description,
    sort: sortQuery,
  });

  const { mutateAsync: deleteProduct } = useDeleteProduct();

  const handleSort = (field: "createdAt" | "updatedAt") => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="p-8">
      <p className="text-5xl font-bold mb-6">Product List</p>

      {/* Filters */}
      <div className="flex flex-wrap gap-6 items-end mb-8">
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-1 font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Filter by name"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="description" className="mb-1 font-medium">
            Description
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Filter by description"
          />
        </div>
        <Link
          href="/products"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5"
        >
          Create Product
        </Link>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-400">
          <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-6 py-3">Product Id</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Available Quantity</th>

              {/* Created At */}
              <th
                className="px-6 py-3 cursor-pointer select-none"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center gap-1">
                  Created At
                  <div className="flex items-center leading-none ml-1">
                    <ArrowUp
                      size={12}
                      className={
                        sortField === "createdAt" && sortOrder === "asc"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }
                    />
                    <ArrowDown
                      size={12}
                      className={
                        sortField === "createdAt" && sortOrder === "desc"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }
                    />
                  </div>
                </div>
              </th>

              {/* Updated At */}
              <th
                className="px-6 py-3 cursor-pointer select-none"
                onClick={() => handleSort("updatedAt")}
              >
                <div className="flex items-center gap-1">
                  Updated At
                  <div className="flex items-center leading-none ml-1">
                    <ArrowUp
                      size={12}
                      className={
                        sortField === "updatedAt" && sortOrder === "asc"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }
                    />
                    <ArrowDown
                      size={12}
                      className={
                        sortField === "updatedAt" && sortOrder === "desc"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }
                    />
                  </div>
                </div>
              </th>

              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {data?.map((item: IProduct) => (
              <tr
                key={item?.id}
                className="bg-white hover:bg-gray-300 text-black"
              >
                <td className="px-6 py-4">{item?.id}</td>
                <td className="px-6 py-4">{item?.name}</td>
                <td className="px-6 py-4">{item?.description || "----"}</td>
                <td className="px-6 py-4">{item?.price}</td>
                <td className="px-6 py-4">{item?.quantity_in_stock}</td>
                <td className="px-6 py-4">
                  {moment(item.created_at).format("DD MMM YY, hh:mm A")}
                </td>
                <td className="px-6 py-4">
                  {moment(item.updated_at).format("DD MMM YY, hh:mm A")}
                </td>
                <td className="px-6 py-4 flex gap-3">
                  <Link
                    href={`/products/${item?.id}`}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteProduct(item?.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
