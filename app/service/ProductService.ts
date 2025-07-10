import axios from "axios";

export interface IProductPayload {
  name: string | undefined;
  description: string | undefined;
  price: number;
  quantity_in_stock: number;
}

export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity_in_stock: number;
  created_at: string;
  updated_at: string;
}

interface IProductList {
  next: number | null;
  previous: number | null;
  list: IProduct[];
}

export class ProductService {
  static list = async () => {
    const response = await axios.get("/api/products");
    return response.data;
  };

  static getById = async (id: number) => {
    const response = await axios.get<IProduct>(`/api/products/${id}`);
    return response.data;
  };

  static create = async (payload: IProductPayload) => {
    const response = await axios.post("/api/products", payload);
    return response.data;
  };

  static update = async (id: number, payload: IProductPayload) => {
    const response = await axios.put(`/api/products${id}`, payload);
    return response.data;
  };

  static delete = async (id: number) => {
    const response = await axios.delete<IProduct>(`/api/products/${id}`);
    return response.data;
  };
}
