import { defineStore } from "pinia";
import { ProductCategorie } from "../types/categories";
import { camelCase } from "change-case/keys";
import { Product, ProductVariation } from "../types/products";
import { UrlParams } from "../types/apiParams";
import { toRaw } from "vue";
import api from "../modules/api/api";
import { Attribute, AttributeTerm } from "../types/attributes";

export interface catalogState {
  categories: Map<number, ProductCategorie>;
  products: Map<number, Product>;
  variations: Map<number, ProductVariation>;
  attributes: Map<number, Attribute>;
  terms: Map<number, AttributeTerm>;
}

export const useCatalog = defineStore("catalog", {
  state: (): catalogState => ({
    categories: new Map(),
    products: new Map(),
    variations: new Map(),
    attributes: new Map(),
    terms: new Map(),
  }),

  actions: {
    /**
     * Get all categories and save them in pinia store
     * @param params
     */
    async getCategories() {
      const resCategories = await api.catalog.fetchCategories();

      if (resCategories.valid && resCategories.payload) {
        let categoriesMap = new Map<number, ProductCategorie>();
        for (const categorie of resCategories.payload) {
          categoriesMap.set(categorie.id, camelCase(categorie, 2) as ProductCategorie);
        }
        this.categories = categoriesMap;
      } else {
        console.log("fetchCategories : " + resCategories.message);
      }
    },

    /**
     * Get all products attributes and save them in pinia store
     */
    async getAttributesAndTerms() {
      const resAttributes = await api.catalog.fetchProductsAttributes();
      if (resAttributes.valid && resAttributes.payload) {
        let attributesMap = new Map<number, Attribute>();
        for (const attribute of resAttributes.payload) {
          attributesMap.set(attribute.id, attribute);
        }
        this.attributes = attributesMap;
        this.getAttributesTerms();
      } else {
        console.log("fetchCategories : " + resAttributes.message);
      }
    },

    /**
     * Get all terms for all attributes and save them in pinia store
     */
    async getAttributesTerms() {
      for (const [key, attribute] of this.attributes) {
        const resTerms = await api.catalog.fetchAttributeTerms(attribute.id);
        if (resTerms.valid && resTerms.payload) {
          for (const term of resTerms.payload) {
            this.terms.set(term.id, term);
          }
        } else {
          console.log("fetchCategories : " + resTerms.message);
        }
      }
    },

    /**
     * Get products and save them in pinia store
     * @param params @type {UrlParams} : obj listing all parameters use to construct url parameters for filtering
     */
    async getProducts(params?: UrlParams): Promise<{ valid: boolean; totalPages: number; totalProducts: number }> {
      const resProducts = await api.catalog.fetchProducts(params);

      if (resProducts.valid && resProducts.payload) {
        this.products.clear();
        const { products } = resProducts.payload;
        for (const product of products) {
          this.products.set(product.id, product);
        }
        return { valid: resProducts.valid, totalPages: resProducts.payload.totalPages, totalProducts: resProducts.payload.totalItems };
      } else {
        console.log("fetchProducts : " + resProducts.message);
        return { valid: resProducts.valid, totalPages: 0, totalProducts: 0 };
      }
    },

    /**
     * Get product by id and save it in pinia store
     * @param productId @type {number} : id of product to fetch
     */
    async getProductById(productId: number) {
      const resProducts = await api.catalog.fetchProductById(productId);

      if (resProducts.valid && resProducts.payload) {
        this.products.set(resProducts.payload.id, resProducts.payload);
      } else {
        console.log("fetchProductById" + resProducts.message);
      }
    },

    /**
     * Get all variations of a product and save it in pinia store
     * @param productId @type {number} : id of product's variations to fetch
     */
    async getVariations(productId: number, params: UrlParams = {}, page = 1) {
      const resVariations = await api.catalog.fetchProductVariations(productId, params);

      if (resVariations.valid && resVariations.payload?.variations) {
        for (const variation of resVariations.payload.variations) {
          this.variations.set(variation.id, variation);
        }
        if (resVariations.payload.totalPages > 1) {
          this.getVariations(productId, { ...params, page: page++ });
        }
      } else {
        console.log("fetchProductById" + resVariations.message);
      }
    },
  },
  getters: {
    getFeaturedProducts: (state): Product[] => {
      return Array.from(state.products)
        .filter(([_key, product]) => product.featured === true)
        .map(([_key, product]) => product);
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
