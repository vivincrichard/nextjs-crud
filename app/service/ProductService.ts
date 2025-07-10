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

export interface IProductList {
  list: IProduct[];
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  totalCount: number;
}

// ProductService.ts
export interface IProductFilters {
  searchName?: string;
  searchDescription?: string;
  sort?: string;
  seek?: number;
}

export class ProductService {
  static list = async (filters?: IProductFilters): Promise<IProductList> => {
    const query = new URLSearchParams();

    if (filters?.searchName) query.append("searchName", filters.searchName);
    if (filters?.searchDescription)
      query.append("searchDescription", filters.searchDescription);
    if (filters?.sort) query.append("sort", filters.sort);
    if (filters?.seek !== undefined) query.append("seek", String(filters.seek));

    const response = await axios.get<IProductList>(
      `/api/products?${query.toString()}`
    );

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
    const response = await axios.put(`/api/products/${id}`, payload);
    return response.data;
  };

  static delete = async (id: number) => {
    const response = await axios.delete<IProduct>(`/api/products/${id}`);
    return response.data;
  };
}
