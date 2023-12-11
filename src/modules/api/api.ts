import { ApiResponseStatus } from "../../types/apiParams";
import { stripHTMLFromString } from "../../utils/formatText";
import { Buffer } from "buffer";
import user from "./user";
import catalog from "./catalog";
import axios, { AxiosRequestHeaders } from "axios";
import { oauth } from "../../utils/oauth";

const api = {
  user,
  catalog,
};

export const axiosInstanceWoo = axios.create({
  baseURL: import.meta.env.VITE_API_URL_WOO,
});

export const axiosInstanceWp = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const axiosInstanceRest = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

/** WOOCOMMERCE INSTANCE - Add credentials for axios request to WC rest API and handling errors */
axiosInstanceWoo.interceptors.request.use(
  (config) => {
    if (config.method === undefined) {
      throw Error("Missing method type for request to API");
    }

    const queryParameters = new URLSearchParams(config.params).toString();
    const completeUrl = `${config.baseURL}${config.url}${queryParameters ? "?" + queryParameters : ""}`;

    config.headers = oauth.toHeader(oauth.authorize({ url: completeUrl, method: config.method })) as AxiosRequestHeaders;

    return config;
  },
  (error) => {
    console.log(error.request);
  }
);

/** WP INSTANCE CONNECTED USER */
axiosInstanceWp.interceptors.request.use((config) => {
  if (localStorage.getItem("token")) {
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }
  return config;
});

axiosInstanceRest.interceptors.request.use((config) => {
  config.headers.Authorization =
    "Basic " + Buffer.from(`${import.meta.env.VITE_APP_REST_ACCOUNT}:${import.meta.env.VITE_APP_REST_PASSWORD}`).toString("base64");
  return config;
});

/**
 * Format api response
 * @param valid if operation was a success or not
 * @param message text or error instance
 * @param payload data receive from api
 * @returns {ApiResponseStatus}
 */
export function setApiResponseStatus(valid: boolean, message: unknown, payload?: any): ApiResponseStatus {
  let resultMessage: string = "";

  if (axios.isAxiosError(message) && message.response !== undefined) {
    resultMessage = stripHTMLFromString(message.response.data.message);
  } else {
    resultMessage = typeof message === "string" || message instanceof String ? message.toString() : "Une erreur réseau est survenue";
  }

  return {
    valid,
    message: resultMessage,
    payload,
  };
}

export default api;
