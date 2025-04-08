import Layout from "@/layout/index.vue";
import store from "@/store";
import Page404 from "@/views/page-404.vue";
import type { RouteItem } from "./types";

/**
 * 动态路由
 */
export const dynamicRouters: Array<RouteItem> = [
  {
    path: "/",
    name: "home",
    redirect: "/carousel-manage",
    component: Layout,
    meta: { title: "首页管理", icon: "home" },
    children: [
      {
        path: "/carousel-manage",
        meta: { title: "轮播图管理" },
        component: () => import("../views/home/CarouselGraphManage.vue"),
      },
      {
        path: "/carousel-manage/add",
        name: "carousel-add",
        meta: {
          title: "添加Banner",
          hidden: true, //隐藏侧边栏
          activeMenu: "/carousel-manage", //高亮侧边栏的路径
          breadcrumb: [
            { title: "页面管理", path: "/" },
            { title: "轮播图管理", path: "/carousel-manage" },
            { title: "添加Banner", path: "" }
          ]
        },
        component: () => import("../views/home/CarouselAdd.vue")
      },
      {
        path: "/classify-manage",
        meta: { title: "分类展示管理" },
        component: () => import("../views/home/ClassifyManage.vue")
      },
      {
        path: "/notice-manage",
        meta: { title: "公告信息管理" },
        component: () => import("../views/home/NoticeManage.vue")
      },
      {
        path: "/news-manage",
        meta: { title: "助农新闻管理"},
        component: () => import("../views/home/NewsManage.vue") 
      }
    ]
  },
  {
    path: "/users-manage",
    name: "users-manage",
    meta: { title: "", auth: [0], },
    component: Layout,
    redirect: "/users-manage/index.vue",
    children: [
      {
        path: "/users-manage/index.vue",
        // name: "svg-icons1",
        component: () => import("../views/users-manage/index.vue"),
        meta: { title: "用户账号管理", icon: "svg-icon" }
      }
    ]
  },
  {
    path: "/supervisoe-library",
    name: "supervisoe-library",
    meta: { title: "", auth: [0], },
    component: Layout,
    redirect: "/supervisoe-library/index.vue",
    children: [
      {
        path: "/supervisoe-library/index.vue",
        name: "svg-icons2",
        component: () => import("../views/supervisoe-library/index.vue"),
        meta: { title: "导师库管理", icon: "svg-icon" }
      }
    ]
  },
  {
    path: "/examine",
    name: "examine",
    redirect: "/examine/supervisoe-application",
    component: Layout,
    meta: { title: "审核管理", icon: "home" },
    children: [
      {
        path: "/supervisoe-application",
        name: "supervisoe-application",
        meta: { title: "导师申请管理" },
        component: () => import("../views/application-manage/SupervisorApplication.vue")
      },
      {
        path: "/requirments-release",
        meta: { title: "需求发布管理" },
        component: () => import("../views/application-manage/RequirmentsRelease.vue")
      },
     
    ]
  },
  {
    path: "/feedback",
    name: "feedback",
    redirect: "/feedback/users-feedback",
    component: Layout,
    meta: { title: "反馈处理", icon: "home" },
    children: [
      {
        path: "/users-feedback",
        meta: { title: "用户反馈管理" },
        component: () => import("../views/feedback-manage/UsersFeedback.vue")
      },
      {
        path: "/users-report",
        meta: { title: "用户举报管理" },
        component: () => import("../views/feedback-manage/UsersReport.vue")
      },
     
    ]
  },

];
