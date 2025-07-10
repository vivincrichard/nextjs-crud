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

// ProductService.ts
export interface IProductFilters {
  searchName?: string;
  searchDescription?: string;
  sort?: string; 
}


export class ProductService {
  static async list(filters?: IProductFilters): Promise<IProduct[]> {
    const query = new URLSearchParams();

    if (filters?.searchName) query.append("searchName", filters.searchName);
    if (filters?.searchDescription)
      query.append("searchDescription", filters.searchDescription);
    if (filters?.sort) query.append("sort", filters.sort);

    const res = await fetch(`/api/products?${query.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  }

  static getById = async (id: number) => {
    const response = await axios.get<IProduct>(`/api/products/${id}`);
    return response.data;
  };

  static create = async (payload: IProductPayload) => {
    const response = await axios.post("/api/products", payload);
    return response.data;
  };

  static update = async (id: number, payload: IProductPayload) => {
    const response = await axios.put(`/api/products/${id}`, payload);
    return response.data;
  };

  static delete = async (id: number) => {
    const response = await axios.delete<IProduct>(`/api/products/${id}`);
    return response.data;
  };
}
