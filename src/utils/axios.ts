import axios, { AxiosRequestHeaders } from "axios";
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

    const queryParameters = new URLSearchParams(config.params).toString();
    const completeUrl = `${config.baseURL}${config.url}${queryParameters ? "?" + queryParameters : ""}`;

    config.headers = oauth.toHeader(oauth.authorize({ url: completeUrl, method: config.method })) as AxiosRequestHeaders;

    if (localStorage.getItem("token")) {
      console.log("axiosinstance with token");
      config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    }

    return config;
  },
  (error) => {
    console.log(error.request);
  }
);

// axiosInstance.interceptors.response.use(
//   (config) => config,
//   (error) => {
//     console.log(error.response.data);
//     console.log(error.response.status);
//     console.log(error.response.headers);
//   }
// );
