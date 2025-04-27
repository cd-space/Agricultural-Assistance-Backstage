import ModuleUser from "./User";
import imgLogo from "../assets/logo.png";
import ModuleLayout from "./Layout";
import ModuleGoods from "./Goods";

class ModuleStore {
  constructor() {
    console.log("%c ModuleStore init", "color: #409EFF");
  }

  /** 项目信息 */
  readonly projectInfo = {
    title: "Vue Typescript Admin",
    name: "后台管理系统",
    logo: imgLogo,
    link: "https://github.com/Travis-hjs/vue-admin",
    email: "3023265978@qq.com"
  }

  /** `layout`状态模块 */
  readonly layout = new ModuleLayout();

  /** 用户状态模块 */
  readonly user = new ModuleUser();

  // 以下为测试代码，可随时删除
  // 操作为：没有读取该模块时，不实例化该状态
  private _goods!: ModuleGoods;

  get goods() {
    if (!this._goods) {
      this._goods = new ModuleGoods();
    }
    return this._goods;
  }
  
}

const store = new ModuleStore();

export default store;