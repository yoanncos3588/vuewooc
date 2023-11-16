import { defineStore } from "pinia";
import { axiosInstance } from "../utils/axios";
import { ProductCategorie } from "../types/categories";
import { camelCase } from "change-case/keys";
import { Product } from "../types/products";

export interface catalogState {
  categoriesIds: number[]; //use for easy use of maps and filter (keep up to date!)
  productsIds: number[]; // use for easy use of maps and filter (keep up to date!)
  categories: Map<number, ProductCategorie>;
  products: Map<number, Product>;
}

export const useCatalog = defineStore("catalog", {
  state: (): catalogState => ({
    categoriesIds: [],
    productsIds: [],
    categories: new Map(),
    products: new Map(),
  }),

  actions: {
    async fetchCategories() {
      const { data: dataCategories }: { data: ProductCategorie[] } = await axiosInstance.get("/products/categories");

      let categoriesId: number[] = [];
      let categoriesMap = new Map<number, ProductCategorie>();

      for (const categorie of dataCategories) {
        categoriesId.push(categorie.id);
        categoriesMap.set(categorie.id, camelCase(categorie) as ProductCategorie);
      }

      this.categoriesIds = categoriesId;
      this.categories = categoriesMap;
    },

    async fetchProducts() {
      const { data: dataProducts }: { data: Product[] } = await axiosInstance.get("/products");

      let productsId: number[] = [];
      let productsMap = new Map<number, Product>();

      for (const product of dataProducts) {
        productsId.push(product.id);
        productsMap.set(product.id, camelCase(product) as Product);
      }

      this.productsIds = productsId;
      this.products = productsMap;
    },

    async fetchProductById(productId: number) {
      const { data: dataProduct }: { data: Product } = await axiosInstance.get(`/products/${productId}`);
      if (!this.productsIds.includes(dataProduct.id)) {
        // important : product wasn't fetch before and wasn't in id's array
        this.productsIds.push(productId);
      }
      this.products.set(dataProduct.id, camelCase(dataProduct) as Product);
    },

    async fetchProductsByCategory(categoryId: number) {
      const { data: dataProducts }: { data: Product[] } = await axiosInstance.get(`/products`, {
        params: { categories: categoryId },
      });
      for (const product of dataProducts) {
        if (!this.productsIds.includes(product.id)) {
          // important : product wasn't fetch before and wasn't in id's array
          this.productsIds.push(product.id);
        }
        this.products.set(product.id, camelCase(product) as Product);
      }
    },
  },
});
