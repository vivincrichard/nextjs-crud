"use client";

import { useProductById } from "@/app/Query/ProductQuery";
import { ProductForms } from "./productForms";

export default function ProductClient({ id }: { id: number }) {
  const { data: productDetail, isLoading, error,isRefetching } = useProductById(id);

  if (isLoading || isRefetching ) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !productDetail) {
    return (
      <div className="flex justify-center items-center text-red-600 text-lg">
        <span>Product not found</span>
      </div>
    );
  }

  return <ProductForms id={id} productDetail={productDetail} />;
}
