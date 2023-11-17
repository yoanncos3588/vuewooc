import axios, { AxiosRequestHeaders } from "axios";
import { oauth } from "../utils/oauth";

export const axiosInstanceWoo = axios.create({
  baseURL: import.meta.env.VITE_API_URL_WOO,
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

export const axiosInstanceWp = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

/** WP INSTANCE WITH BEARER */
axiosInstanceWp.interceptors.request.use((config) => {
  if (localStorage.getItem("token")) {
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }
  return config;
});
