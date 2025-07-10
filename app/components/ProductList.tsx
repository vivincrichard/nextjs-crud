"use client";
import moment from "moment";
import { useAllProduct } from "../Query/ProductQuery";
import { IProduct } from "../service/ProductService";
import Link from "next/link";

export default function ProductList() {
  const { data } = useAllProduct();

  return (
    <div>
      <p className="text-5xl">Product List</p>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg m-3">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Product Id
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Available Quantity
              </th>
              <th scope="col" className="px-6 py-3">
                Created At
              </th>
              <th scope="col" className="px-6 py-3">
                Updated At
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item: IProduct) => (
              <tr
                key={item?.id}
                className="bg-white text-black hover:bg-gray-50 dark:hover:bg-gray-200"
              >
                <td className="px-6 py-4">{item?.id}</td>
                <td className="px-6 py-4">{item?.name}</td>
                <td className="px-6 py-4">{item?.description}</td>
                <td className="px-6 py-4">{item?.price}</td>
                <td className="px-6 py-4">{item?.quantity_in_stock}</td>
                <td>
                  {item?.created_at &&
                    moment(item?.created_at).format("DD MMM YY, hh:mm A")}
                </td>
                <td>
                  {item?.updated_at &&
                    moment(item?.updated_at).format("DD MMM YY, hh:mm A")}
                </td>
                <td className="px-6 py-4 text-left">
                  <Link
                    href={`/products/${item?.id}`}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
