import { snakeCase } from "change-case/keys";
import { Customer } from "../../types/user";
import { axiosInstanceWoo, axiosInstanceWp } from "../../utils/axios";
import { ApiResponseStatus } from "../../types/apiParams";
import { setApiResponseStatus } from "./api";

const user = {
  /**
   * Créer un compte client via l'api woocommerce
   * https://woocommerce.github.io/woocommerce-rest-api-docs/#create-a-customer
   * @param customer
   * @returns {ApiResponseStatus}
   */
  createCusomer: async (customer: Customer): Promise<ApiResponseStatus> => {
    try {
      await axiosInstanceWoo.post("/customers", snakeCase(customer, 2));
      return setApiResponseStatus(true, "Votre compte a bien été créé, vous allez être redirigé");
    } catch (error) {
      return setApiResponseStatus(false, error);
    }
  },

  /**
   * Retrive jwt from bo
   * https://fr.wordpress.org/plugins/jwt-authentication-for-wp-rest-api/
   * @param {string} username
   * @param {string} password
   * @returns {ApiResponseStatus}
   */
  login: async (username: string, password: string): Promise<ApiResponseStatus> => {
    try {
      const { data } = await axiosInstanceWp.post("/jwt-auth/v1/token/", { username, password });
      return setApiResponseStatus(true, "Token généré", data.token as string);
    } catch (error) {
      return setApiResponseStatus(false, error);
    }
  },

  /**
   * Get user's infos not formatted from api
   * https://developer.wordpress.org/rest-api/reference/users/#definition-example-request-2
   * @returns {ApiResponseStatus}
   */
  getCurrentUser: async (): Promise<ApiResponseStatus> => {
    try {
      const { data } = await axiosInstanceWp.post("/wp/v2/users/me");
      return setApiResponseStatus(true, "Vous êtes bien connecté, vous allez être redirigé", data);
    } catch (error) {
      return setApiResponseStatus(false, "Une erreur technique est survenue : impossible de récupérer l'utilisateur");
    }
  },
};

export default user;
