import { defineStore } from "pinia";
import { axiosInstance } from "../utils/axios";
import { AxiosError } from "axios";
import { stripHTMLFromString } from "../utils/formatText";

export interface userState {
  id?: number;
  pseudo?: string;
}

export const useUser = defineStore("user", {
  state: (): userState => ({
    id: undefined,
    pseudo: undefined,
  }),

  actions: {
    async login(username: string, password: string): Promise<string> {
      try {
        const res = await axiosInstance.post("/jwt-auth/v1/token/", { username, password });
        if (res.status !== 200) {
          throw Error();
        }
        const data = res.data;
        localStorage.setItem("token", data.token);
        return "";
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          return stripHTMLFromString(error.response?.data.message);
        } else {
          return "Une erreur inconnue est survenue";
        }
      }
    },
    async getUser() {
      try {
        const res = await axiosInstance.get("/wp/v2/users");
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
  },
});
