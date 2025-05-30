import { reactive, watch } from "vue";
import { modifyData } from "@/utils";
import type { RouteItem } from "@/router/types";
import type { LayoutType } from "./types";

const cacheName = "ModuleLayout";

/**
 * `layout`状态模块
*/
export default class ModuleLayout {
  constructor() {
    const value = sessionStorage.getItem(cacheName);

    try {
      if (value) {
        modifyData(this.info, JSON.parse(value));
      }
    } catch (error) {
      console.log("ModuleLayout init fail >>", error);
    }

    watch(
      this.info, 
      () => {
        sessionStorage.setItem(cacheName, JSON.stringify(this.info));
      }
    );
  }

  /**
   * 动态添加的权限路由
   * @description 这里可以不是响应式的，因为在登录之后才会渲染，登录的时候就已经拼接好了
   */
  addRouters: Array<RouteItem> = [];

  /**
   * (基础路由+动态路由)列表
   * @description 这里可以不是响应式的，因为在登录之后才会渲染，登录的时候就已经拼接好了
   */
  completeRouters: Array<RouteItem> = [];

  /** 
   * `layout`布局信息
   */
  readonly info = reactive<LayoutType.Info>({
    showTagList: false,
    showSidebar: true,
    showSidebarLogo: true,
    tagList: [],
    layoutMode: "",
    keyword: "",
  });

}
