// app/products/[id]/ProductClient.tsx
"use client";

import { useProductById } from "@/app/Query/ProductQuery";
import { ProductForms } from "./productForms";

export default function ProductClient({ id }: { id: number }) {
  const { data: productDetail, isLoading, error } = useProductById(id);

  if (isLoading) return <div>Loading...</div>;
  if (error || !productDetail) return <div>Product not found</div>;

  return <ProductForms id={id} productDetail={productDetail} />;
}
