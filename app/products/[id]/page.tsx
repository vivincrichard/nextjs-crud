// app/products/[id]/page.tsx

import ProductClient from "./productClient";

export default function ProductIdPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);

  return (
    <>
      <ProductClient id={id} />;
    </>
  );
}
