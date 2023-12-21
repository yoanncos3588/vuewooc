import { ApiResponseStatus, UrlParams } from "../../types/apiParams";
import { Attribute, AttributeTerm } from "../../types/attributes";
import { ProductCategorie } from "../../types/categories";
import { Product, ProductVariation } from "../../types/products";
import { axiosInstanceWoo, setApiResponseStatus } from "./api";
import { camelCase } from "change-case/keys";

interface PaginatedPayload {
  totalPages: number;
  totalItems: number;
}

interface PayloadFetchProducts extends PaginatedPayload {
  products: Product[];
}

interface PayloadFetchVariations extends PaginatedPayload {
  variations: ProductVariation[];
}

const catalog = {
  /**
   * Fetch products categories
   * https://woocommerce.github.io/woocommerce-rest-api-docs/#product-categories
   * @returns {ApiResponseStatus}
   */
  fetchCategories: async (categories: ProductCategorie[] = [], currentPage = 1): Promise<ApiResponseStatus<Array<ProductCategorie>>> => {
    try {
      const res = await axiosInstanceWoo.get(`/products/categories?page=${currentPage}`);

      categories = categories.concat(res.data);
      const totalPages = Number(res.headers["x-wp-totalpages"]);

      if (totalPages > currentPage) {
        currentPage++;
        return catalog.fetchCategories(categories, currentPage);
      }
      return setApiResponseStatus(true, "success", categories);
    } catch (error) {
      return setApiResponseStatus(false, error);
    }
  },

  /**
   * Fetch products from api, with possibles filters
   * @param params @type {UrlParams} : obj listing all parameters use to construct url parameters for filtering
   */
  fetchProducts: async (params?: UrlParams): Promise<ApiResponseStatus<PayloadFetchProducts>> => {
    try {
      const res = await axiosInstanceWoo.get("/products", { params: params });

      const productsRaw = res.data;
      const products: Product[] = productsRaw.map((product: any) => camelCase(product, 2));

      const totalPages = Number(res.headers["x-wp-totalpages"]);
      const totalItems = Number(res.headers["x-wp-total"]);

      const payload: PayloadFetchProducts = { products, totalPages, totalItems };

      return setApiResponseStatus(true, "success", payload);
    } catch (error) {
      return setApiResponseStatus(false, error);
    }
  },

  /**
   * Fetch products from api by id
   * @param productId @type {number} : product id to fetch
   */
  fetchProductById: async (productId: number): Promise<ApiResponseStatus<Product>> => {
    try {
      const { data: dataProduct }: { data: Product } = await axiosInstanceWoo.get(`/products/${productId}`);
      return setApiResponseStatus(true, "success", camelCase(dataProduct));
    } catch (error) {
      return setApiResponseStatus(false, error);
    }
  },
  /**
   * Fetch variation from api by id
   * @param productId @type {number} : product id parent of the variation
   * @param productVariationId @type {number} : variation id to fetch
   */
  fetchProductVariationById: async (productId: number, productVariationId: number): Promise<ApiResponseStatus<ProductVariation>> => {
    try {
      const { data: dataProduct }: { data: ProductVariation } = await axiosInstanceWoo.get(`/products/${productId}/variations/${productVariationId}`);
      return setApiResponseStatus(true, "success", camelCase(dataProduct));
    } catch (error) {
      return setApiResponseStatus(false, error);
    }
  },
  /**
   * Fetch variations from api by id
   * @param productId @type {number} : product id parent of the variations
   * @param params @type {UrlParams} : obj listing all parameters use to construct url parameters for filtering
   */
  fetchProductVariations: async (productId: number, params: UrlParams): Promise<ApiResponseStatus<PayloadFetchVariations>> => {
    try {
      const res = await axiosInstanceWoo.get(`/products/${productId}/variations`, params);

      const { data: dataVariations }: { data: ProductVariation[] } = res;
      const totalPages = Number(res.headers["x-wp-totalpages"]);
      const totalItems = Number(res.headers["x-wp-total"]);

      return setApiResponseStatus(true, "success", { variations: camelCase(dataVariations), totalPages, totalItems });
    } catch (error) {
      return setApiResponseStatus(false, error);
    }
  },
  /**
   * Fetch attributes from api
   */
  fetchProductsAttributes: async (): Promise<ApiResponseStatus<Attribute[]>> => {
    try {
      const param: UrlParams = { per_page: 100 };
      const { data: dataAttribute }: { data: Attribute[] } = await axiosInstanceWoo.get(`/products/attributes/`, param);
      return setApiResponseStatus(true, "success", camelCase(dataAttribute));
    } catch (error) {
      return setApiResponseStatus(false, error);
    }
  },
  /**
   * Fetch attributes from api by id
   * @param attributeId @type {number} : attribute's id
   */
  fetchProductsAttributesById: async (attributeId: number): Promise<ApiResponseStatus<Attribute>> => {
    try {
      const { data: dataAttribute }: { data: Attribute } = await axiosInstanceWoo.get(`/products/attributes/${attributeId}`);
      return setApiResponseStatus(true, "success", camelCase(dataAttribute));
    } catch (error) {
      return setApiResponseStatus(false, error);
    }
  },
  /**
   * Fetch attributes terms from api
   * @param attributeId @type {number} : attribute's id
   */
  fetchAttributeTerms: async (attributeId: number): Promise<ApiResponseStatus<AttributeTerm[]>> => {
    try {
      const param: UrlParams = { per_page: 100 };
      const { data: dataAttributeTerms }: { data: AttributeTerm[] } = await axiosInstanceWoo.get(`/products/attributes/${attributeId}/terms`, param);
      return setApiResponseStatus(true, "success", camelCase(dataAttributeTerms));
    } catch (error) {
      return setApiResponseStatus(false, error);
    }
  },
};

export default catalog;
