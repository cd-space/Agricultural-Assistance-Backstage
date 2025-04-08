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
        component: () => import("../views/home/CarouselGraphManage.vue")
      },
      {
        path: "/carousel-manage/add",
        name: "carousel-add",
        component: () => import("../views/home/CarouselAdd.vue"),
        meta: { title: "新增轮播图" },
        hidden: true
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
    path: "/icon1",
    name: "icon1",
    meta: { title: "图标栏目", auth: [0], },
    component: Layout,
    redirect: "/icon1/svg-icons1",
    children: [
      {
        path: "/icon/svg-icons1",
        name: "svg-icons1",
        component: () => import("../views/users-manage/index.vue"),
        meta: { title: "用户账号管理", icon: "svg-icon" }
      }
    ]
  },
  {
    path: "/icon2",
    name: "icon2",
    meta: { title: "图标栏目", auth: [0], },
    component: Layout,
    redirect: "/icon1/svg-icons2",
    children: [
      {
        path: "/icon/svg-icons2",
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
