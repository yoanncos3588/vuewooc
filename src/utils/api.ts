import { AxiosError } from "axios";
import { ApiResponseStatus } from "../types/apiParams";
import { stripHTMLFromString } from "./formatText";

export const apiResponseOk: ApiResponseStatus = { valid: true };

export function getApiResponse(valid: boolean, message?: string, error?: unknown): ApiResponseStatus {
  return {
    valid,
    message: message ? message : error instanceof AxiosError ? stripHTMLFromString(error.response?.data.message) : "Une erreur réseau est survenue",
  };
}
