import { defineStore } from "pinia";
import { MenuItems } from "../types/menus";
import { camelCase } from "change-case/keys";
import { axiosInstanceRest } from "../utils/axios";

interface MenuState {
  mainMenu: null | MenuItems[];
}

export const useMenus = defineStore("menus", {
  state: (): MenuState => ({
    mainMenu: JSON.parse(localStorage.getItem("mainMenu")!),
  }),
  actions: {
    async fetchMenu(id: number) {
      try {
        const { data }: { data: MenuItems[] } = await axiosInstanceRest(`/wp/v2/menu-items?menus=${id}`);

        // create a Map copy with object ref
        const resMap = new Map<number, MenuItems>();
        data.forEach((item) => resMap.set(item.id, item));

        data.forEach((menuItem, index) => {
          menuItem.url = menuItem.url.replace(import.meta.env.VITE_API_DOMAIN, "");
          // add prop isParent to item or remove if item parent has parent value too
          if (menuItem.parent !== 0) {
            const parent = resMap.get(menuItem.parent);
            if (parent && parent.parent === 0) {
              // parent menu is find and has no parent
              parent.isParent = true;
            } else {
              if (parent) {
                // parent exist and have parent means depth 2 submenu, so we delete it
                data.splice(index, 1);
              }
            }
          } else {
            // top level menu
            menuItem.isParent = false;
          }
        });

        // keeping only needed keys and format
        const cleanMenu = data.map((menuItem) => {
          menuItem = camelCase(menuItem) as MenuItems;
          const { id, title, status, url, object, objectId, parent, menuOrder, isParent } = menuItem;
          const cleanMenuItem: MenuItems = { id, title, status, url, object, objectId, parent, menuOrder, isParent };
          return cleanMenuItem;
        });

        //TODO create array with menu hierarchy

        if (id === 40) {
          this.mainMenu = cleanMenu;
          window.localStorage.setItem(`mainMenu`, JSON.stringify(data));
        }
      } catch (error) {
        console.log(error);
        console.log(`Error : cant load menu with id ${id}`);
      }
    },
  },
  getters: {},
});
