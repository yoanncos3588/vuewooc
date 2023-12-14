import { ApiResponseStatus } from "../../types/apiParams";
import { axiosInstanceWoo, setApiResponseStatus } from "./api";

const countries = {
  get: async (): Promise<ApiResponseStatus> => {
    try {
      const res = await axiosInstanceWoo.get("/data/countriesaefaef");
      return setApiResponseStatus(true, "Success", res.data);
    } catch (error) {
      return setApiResponseStatus(false, "Impossible de récupérer la liste des pays");
    }
  },
};

export default countries;
