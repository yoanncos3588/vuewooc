import { ApiResponseStatus, UrlParams } from "../../types/apiParams";
import { ProductCategorie } from "../../types/categories";
import { Product } from "../../types/products";
import { axiosInstanceWoo, setApiResponseStatus } from "./api";
import { camelCase } from "change-case/keys";

type PayloadFetchProducts = {
  products: Product[];
  totalPages: number;
  totalProducts: number;
};

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
      const totalProducts = Number(res.headers["x-wp-total"]);

      const payload: PayloadFetchProducts = { products, totalPages, totalProducts };

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
};

export default catalog;
