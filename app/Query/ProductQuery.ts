import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "./keys/QueryKeys";
import { IProductPayload, ProductService } from "../service/ProductService";
import { toast } from "react-toastify";

export const useAllProduct = (filters?: { searchName?: string; searchDescription?: string }) => {
  const { data } = useQuery({
    queryKey: [QueryKeys.LIST_PRODUCTS, filters], 
    queryFn: () => ProductService.list(filters),
  });

  return { data };
};

export const useProductById = (id: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [QueryKeys.GET_PRODUCT_ID],
    queryFn: () => ProductService.getById(id),
  });
  return { data, isLoading, error };
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QueryKeys.CREATE_PRODUCT],
    mutationFn: (data: IProductPayload) => ProductService.create(data),
    onSuccess: () => {
      toast.success("Product created successfully!");
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.LIST_PRODUCTS],
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [QueryKeys.UPDATE_PRODUCT],
    mutationFn: ({ id, data }: { id: number; data: IProductPayload }) =>
      ProductService.update(id, data),
    onSuccess: () => {
      toast.dark("Product Updated Successfully");
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.LIST_PRODUCTS],
      });
    },
    onError: (error: any) => {
      if (error?.response?.data?.length === 0) {
        toast.error("Failed to update product");
      }
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QueryKeys.DELETE_PRODUCT],
    mutationFn: (id: number) => ProductService.delete(id),
    onSuccess: () => {
      toast.dark("Product Deleted Successfully!");
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.LIST_PRODUCTS],
      });
    },
    onError: (error: any) => {
      if (error?.response?.data?.length === 0) {
        toast.error("Failed to Delete Product");
      }
    },
  });
};
