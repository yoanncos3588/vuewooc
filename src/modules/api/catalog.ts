import { ApiResponseStatus, UrlParams } from "../../types/apiParams";
import { Product } from "../../types/products";
import { axiosInstanceWoo, setApiResponseStatus } from "./api";

const catalog = {
  /**
   * Fetch products categories
   * https://woocommerce.github.io/woocommerce-rest-api-docs/#product-categories
   * @returns {ApiResponseStatus}
   */
  fetchCategories: async (): Promise<ApiResponseStatus> => {
    try {
      const { data: dataCategories } = await axiosInstanceWoo.get("/products/categories");
      return setApiResponseStatus(true, "success", dataCategories);
    } catch (error) {
      return setApiResponseStatus(false, error);
    }
  },

  /**
   * Fetch products from api, with possibles filters
   * @param params @type {UrlParams} : obj listing all parameters use to construct url parameters for filtering
   */
  fetchProducts: async (params?: UrlParams) => {
    try {
      const { data: dataProducts }: { data: Product[] } = await axiosInstanceWoo.get("/products", { params: params });
      return setApiResponseStatus(true, "success", dataProducts);
    } catch (error) {
      return setApiResponseStatus(false, error);
    }
  },

  /**
   * Fetch products from api by id
   * @param productId @type {number} : product id to fetch
   */
  fetchProductById: async (productId: number) => {
    try {
      const { data: dataProduct }: { data: Product } = await axiosInstanceWoo.get(`/products/${productId}`);
      return setApiResponseStatus(true, "success", dataProduct);
    } catch (error) {
      return setApiResponseStatus(false, error);
    }
  },
};

export default catalog;
