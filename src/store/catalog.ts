import { defineStore } from "pinia";
import { axiosInstance } from "../utils/axios";

export const useCatalog = defineStore("catalog", {
  state: () => ({
    categories: new Map(),
    products: new Map(),
  }),
  actions: {
    async fetchCategories() {
      const res = await axiosInstance.get("/wp-json/wc/v3/products/categories");
      console.log(res);
    },
  },
});
