import { reactive } from "vue";
import { jsonParse, modifyData } from "../utils";
import { getCookie, removeCookie, setCookie } from "@/utils/cookie";
import type { UserInfo } from "./types";

const cacheName = "ModuleUser";

function createUserInfo(): Readonly<UserInfo> {
  return {
    id: "",
    name: "",
    type: "",
    token: "",
    avatar: "",
    account: "",
    password: ""
  }
}

/** cookie 过期天数 */
const day = 7;
const millisecond = 24 * 60 * 60 * 1000;

/**
 * 用户状态模块
 */
export default class ModuleUser {
  constructor() {
    this.init();
  }

  /** 用户信息（包含登录状态） */
  readonly info = reactive(createUserInfo());

  /** 初始化缓存信息 */
  private init() {
    const value = getCookie(cacheName);
    if (value) {
      const info = jsonParse<Partial<UserInfo>>(value);
      modifyData(this.info, {
        account: info.account || "",
        token: info.token || ""
      });
    }
  }
  

  /**
   * 更新（设置）当前的用户信息并缓存到本地
   * @param value 要更新的值
   */
  update(value: Partial<UserInfo>) {
    modifyData(this.info, value);

    const safeInfo = {
      account: this.info.account,
      token: this.info.token
    };
  
    setCookie(cacheName, JSON.stringify(safeInfo), {
      expires: new Date(Date.now() + (day * millisecond))
    });
  }

  /** 重置（清空）用户信息缓存信息 */
  reset() {
    modifyData(this.info, createUserInfo());
    removeCookie(cacheName);
  }

}
