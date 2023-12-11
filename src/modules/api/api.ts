import { ApiResponseStatus } from "../../types/apiParams";
import { stripHTMLFromString } from "../../utils/formatText";
import user from "./user";
import axios from "axios";

const api = {
  user,
};

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
