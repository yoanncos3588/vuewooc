import { ApiResponseStatus } from "../../types/apiParams";
import { axiosInstanceWoo } from "../../utils/axios";
import { setApiResponseStatus } from "./api";

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
};

export default catalog;
