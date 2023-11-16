import { defineStore } from "pinia";
import { axiosInstance } from "../utils/axios";
import { ProductCategorie } from "../types/categories";
import { camelCase } from "change-case/keys";
import { Product } from "../types/products";

export interface catalogState {
  categories: Map<number, ProductCategorie>;
  products: Map<number, Product>;
}

export const useCatalog = defineStore("catalog", {
  state: (): catalogState => ({
    categories: new Map(),
    products: new Map(),
  }),

  actions: {
    async fetchCategories() {
      const { data: dataCategories }: { data: ProductCategorie[] } = await axiosInstance.get("/products/categories");
      let categoriesMap = new Map<number, ProductCategorie>();

      for (const categorie of dataCategories) {
        categoriesMap.set(categorie.id, camelCase(categorie) as ProductCategorie);
      }
      this.categories = categoriesMap;
    },

    async fetchProducts() {
      const { data: dataProducts }: { data: Product[] } = await axiosInstance.get("/products");
      let productsMap = new Map<number, Product>();

      for (const product of dataProducts) {
        productsMap.set(product.id, camelCase(product) as Product);
      }
      this.products = productsMap;
    },

    async fetchProductById(productId: number) {
      const { data: dataProduct }: { data: Product } = await axiosInstance.get(`/products/${productId}`);
      this.products.set(dataProduct.id, camelCase(dataProduct) as Product);
    },

    async fetchProductsByCategory(categoryId: number) {
      const { data: dataProducts }: { data: Product[] } = await axiosInstance.get(`/products`, {
        params: { categories: categoryId },
      });
      for (const product of dataProducts) {
        this.products.set(product.id, camelCase(product) as Product);
      }
    },
  },
});
