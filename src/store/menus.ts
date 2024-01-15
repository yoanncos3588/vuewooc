import { defineStore } from "pinia";
import { MenuItems } from "../types/menus";
import { camelCase } from "change-case/keys";
import { axiosInstanceRest } from "../modules/api/api";

interface MenuState {
  main: null | MenuItems[];
  isDrawerOpen: boolean;
}

export const useMenus = defineStore("menus", {
  state: (): MenuState => ({
    main: JSON.parse(localStorage.getItem("mainMenu")!),
    isDrawerOpen: false,
  }),
  actions: {
    async fetchMenu(id: number) {
      try {
        const { data }: { data: MenuItems[] } = await axiosInstanceRest(`/wp/v2/menu-items?menus=${id}`);

        // keeping only needed keys and format
        const cleanMenu = data.map((menuItem) => {
          menuItem = camelCase(menuItem, 2) as MenuItems;
          const { id, title, status, url, object, objectId, parent, menuOrder, childrens } = menuItem;
          const cleanMenuItem: MenuItems = { id, title, status, url, object, objectId, parent, menuOrder, childrens };
          return cleanMenuItem;
        });

        // create a Map copy with object reference, use for delete and find elements in array
        const dataMap = new Map<number, MenuItems>();
        cleanMenu.forEach((item) => dataMap.set(item.id, item));

        cleanMenu.forEach((menuItem) => {
          menuItem.url = menuItem.url.replace(import.meta.env.VITE_API_DOMAIN, "");
          menuItem.childrens = [];
          // add prop isParent to item or remove if item parent has parent value too
          if (menuItem.parent !== 0) {
            const parent = dataMap.get(menuItem.parent);
            if (parent && parent.parent === 0) {
              // parent menu is find and has no parent
              parent.childrens.push(menuItem);
              dataMap.delete(menuItem.id);
            }
          }
        });

        const finalMenu = [...dataMap.values()];

        if (id === 40) {
          this.main = finalMenu;
          window.localStorage.setItem(`mainMenu`, JSON.stringify(finalMenu));
        }
      } catch (error) {
        console.log(error);
        console.log(`Error : cant load menu with id ${id}`);
      }
    },
    toggleDrawer() {
      this.isDrawerOpen = !this.isDrawerOpen;
    },
    closeDrawer() {
      this.isDrawerOpen = false;
    },
  },
  getters: {},
});
