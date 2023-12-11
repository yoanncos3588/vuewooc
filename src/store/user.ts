import { defineStore } from "pinia";
import { User } from "../types/user";
import { ApiResponseStatus } from "../types/apiParams";
import api from "../modules/api/api";

export interface userState {
  userData: User | null;
}

export const useUser = defineStore("user", {
  state: (): userState => ({
    userData: JSON.parse(localStorage.getItem("user")!),
  }),

  actions: {
    async login(token: string): Promise<ApiResponseStatus> {
      localStorage.setItem("token", token);
      const resUser = await api.user.fetchCurrentUser();
      if (resUser.valid && resUser.payload) {
        const localUser: User = {
          id: resUser.payload.id,
          username: resUser.payload.username,
        };
        this.userData = localUser;
        localStorage.setItem("user", JSON.stringify(localUser));
      } else {
        // logout if unable to get user from token or unexpected error happened
        this.logout();
      }

      return resUser;
    },

    async logout() {
      this.userData = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  getters: {
    isUserConnected: (state): boolean => state.userData !== null,
  },
});
