import { defineStore } from "pinia";
import { axiosInstanceWoo } from "../utils/axios";
import { ProductCategorie } from "../types/categories";
import { camelCase } from "change-case/keys";
import { Product } from "../types/products";
import { UrlParams } from "../types/apiParams";
import { toRaw } from "vue";

export interface catalogState {
  productsIds: number[]; // use for easy use of maps and filter (keep up to date!)
  categories: Map<number, ProductCategorie>;
  products: Map<number, Product>;
  paramsHistory: UrlParams[];
}

export const useCatalog = defineStore("catalog", {
  state: (): catalogState => ({
    productsIds: [],
    categories: new Map(),
    products: new Map(),
    paramsHistory: [],
  }),

  actions: {
    async fetchCategories(params?: UrlParams) {
      const { data: dataCategories }: { data: ProductCategorie[] } = await axiosInstanceWoo.get("/products/categories", {
        params: params,
      });

      let categoriesMap = new Map<number, ProductCategorie>();

      for (const categorie of dataCategories) {
        categoriesMap.set(categorie.id, camelCase(categorie) as ProductCategorie);
      }

      this.categories = categoriesMap;
    },

    /**
     * Fetch products from api, with possibles filters
     * @param params @type {UrlParams} : obj listing all parameters use to construct url parameters for filtering
     */
    async fetchProducts(params?: UrlParams) {
      const { data: dataProducts }: { data: Product[] } = await axiosInstanceWoo.get("/products", {
        params: params,
      });

      if (params) {
        this.paramsHistory.push(params);
      }

      for (const product of dataProducts) {
        if (!this.productsIds.includes(product.id)) {
          // important : product wasn't fetch before and wasn't in id's array
          this.productsIds.push(product.id);
        }
        this.products.set(product.id, camelCase(product) as Product);
      }
    },

    async fetchProductById(productId: number) {
      const { data: dataProduct }: { data: Product } = await axiosInstanceWoo.get(`/products/${productId}`);
      if (!this.productsIds.includes(dataProduct.id)) {
        // important : product wasn't fetch before and wasn't in id's array
        this.productsIds.push(productId);
      }
      this.products.set(dataProduct.id, camelCase(dataProduct) as Product);
    },
  },
  getters: {
    getFeaturedProducts: (state): Product[] => {
      return Array.from(state.products)
        .filter(([key, product]) => product.featured === true)
        .map(([key, product]) => product);
    },
    getCategoryBySlug: (state) => {
      return (slug: string) => {
        let results;
        state.categories.forEach((category) => {
          if (category.slug === slug) {
            results = category;
          }
        });
        return results as ProductCategorie | undefined;
      };
    },
    getProductsByCategory: (state) => {
      return (slug: string) => {
        let results: Array<Product> = [];
        state.products.forEach((product) => {
          const isInCategory = product.categories.some((category) => category.slug === slug);
          if (isInCategory) {
            results.push(toRaw(product));
          }
        });
        return results;
      };
    },
  },
});
