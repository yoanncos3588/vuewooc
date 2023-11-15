import axios from "axios";
import { oauth } from "../utils/oauth";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

/** Add credentials for axios request to WC rest API */
axiosInstance.interceptors.request.use((config) => {
  if (config.method === undefined) {
    throw Error("Missing method type for request to API");
  }
  config.params = oauth.authorize({ url: `${config.baseURL}${config.url}`, method: config.method });
  return config;
});
