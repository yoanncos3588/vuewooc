import axios from "axios";
import { oauth } from "../utils/oauth";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

/** Add credentials for axios request to WC rest API and handling errors */
axiosInstance.interceptors.request.use(
  (config) => {
    if (config.method === undefined) {
      throw Error("Missing method type for request to API");
    }
    // add oauth to any existing params
    config.params = { ...oauth.authorize({ url: `${config.baseURL}${config.url}`, method: config.method, ...config.params }) };
    return config;
  },
  (error) => {
    console.log(error.request);
  }
);

axiosInstance.interceptors.response.use(
  (config) => config,
  (error) => {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  }
);
