import { defineStore } from "pinia";
import { axiosInstanceWp } from "../utils/axios";
import { AxiosError } from "axios";
import { stripHTMLFromString } from "../utils/formatText";
import { User } from "../types/user";

export interface userState {
  userData: User | null;
}

export const useUser = defineStore("user", {
  state: (): userState => ({
    userData: JSON.parse(localStorage.getItem("user")!),
  }),

  actions: {
    async login(username: string, password: string): Promise<string> {
      try {
        const res = await axiosInstanceWp.post("/jwt-auth/v1/token/", { username, password });
        if (res.status !== 200) {
          throw Error();
        }
        const data = res.data;
        localStorage.setItem("token", data.token);
        this.getCurrentUser();
        return "";
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          return stripHTMLFromString(error.response?.data.message);
        } else {
          return "Une erreur inconnue est survenue";
        }
      }
    },
    async getCurrentUser() {
      try {
        const res = await axiosInstanceWp.post("/wp/v2/users/me");
        if (res.status !== 200) {
          throw Error();
        }
        const localUser: User = {
          id: res.data.id,
          username: res.data.username,
        };

        this.userData = localUser;
        localStorage.setItem("user", JSON.stringify(localUser));
      } catch (error) {
        console.log(error);
      }
    },
  },
  getters: {
    isUserConnected: (state): boolean => state.userData !== null,
  },
});
