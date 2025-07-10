// components/ProductForm.tsx
"use client";

import { useCreateProduct, useUpdateProduct } from "@/app/Query/ProductQuery";
import { IProductPayload } from "@/app/service/ProductService";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRef } from "react";
import * as Yup from "yup";

interface IProps {
  id: number;
  productDetail : any
}

export function ProductForms({ id, productDetail }: IProps) {
  const formikRef = useRef<any>(null);
  const { data: createProduct } = useCreateProduct();
  const { data: updateProduct } = useUpdateProduct();

  const initialData = {
    name: productDetail?.name || "",
    description: productDetail?.description || "",
    price: productDetail?.price || "",
    quantity_in_stock: productDetail?.quantity_in_stock || "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    description: Yup.string(),
    price: Yup.number()
      .required("Price is required")
      .typeError("Price must be a number")
      .min(0, "Price must be a non-negative number"),
    quantity_in_stock: Yup.number()
      .required("Quantity is required")
      .typeError("Quantity must be a number")
      .min(0, "Quantity must be a non-negative number"),
  });


  return (
    <div className="p-6 bg-white rounded shadow-md">
      <Formik
        innerRef={formikRef}
        initialValues={initialData}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const data: IProductPayload = {
            name: values.name,
            description: values.description,
            price: Number(values.price),
            quantity_in_stock: Number(values.quantity_in_stock),
          };
          if (id) {
            updateProduct({ id, data });
          } else {
            createProduct(data);
            formikRef.current?.resetForm();
          }
        }}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Name <span className="text-red-600">*</span>
                </label>
                <Field
                  name="name"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Field
                  name="description"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Price <span className="text-red-600">*</span>
                </label>
                <Field
                  name="price"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Quantity <span className="text-red-600">*</span>
                </label>
                <Field
                  name="quantity_in_stock"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <ErrorMessage
                  name="quantity_in_stock"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Submit
              </button>
              <button
                type="button"
                className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
                onClick={() => formikRef.current?.resetForm()}
              >
                Clear
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
