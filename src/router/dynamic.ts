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
            { title: "首页管理", path: "/" },
            { title: "轮播图管理", path: "/carousel-manage" },
            { title: "添加Banner", path: "" }
          ]
        },
        component: () => import("../views/home/CarouselAdd.vue")
      },
      {
        path: "/carousel-manage/view/:id",
        name: "carousel-view",
        meta: {
          title: "更新Banner",
          hidden: true, //隐藏侧边栏
          activeMenu: "/carousel-manage", //高亮侧边栏的路径
          breadcrumb: [
            { title: "首页管理", path: "/" },
            { title: "轮播图管理", path: "/carousel-manage" },
            { title: "更新Banner", path: "" }
          ]
        },
        component: () => import("../views/home/CarouselView.vue")
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
        path: "/notice-manage/publish-announcement",
        name: "publish-announcement",
        meta: {
          title: "发布公告",
          hidden: true, //隐藏侧边栏
          activeMenu: "/notice-manage", //高亮侧边栏的路径
          breadcrumb: [
            { title: "首页管理", path: "/" },
            { title: "公告信息管理", path: "/notice-manage" },
            { title: "发布公告", path: "" }
          ]
        },
        component: () => import("../views/home/PublishNotice.vue")
      },
      {
        path: "/notice-manage/viev-announcement/:id",
        name: "viev-announcement",
        meta: {
          title: "查看公告",
          hidden: true, //隐藏侧边栏
          activeMenu: "/notice-manage", //高亮侧边栏的路径
          breadcrumb: [
            { title: "首页管理", path: "/" },
            { title: "公告信息管理", path: "/viev-manage" },
            { title: "查看公告", path: "" }
          ]
        },
        component: () => import("../views/home/PublishNotice.vue")
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
    meta: { title: "用户账号管理", auth: [0], },
    component: Layout,
    redirect: "/users-manage/UsersList",
    children: [
      {
        path: "/users-manage/UsersList",
        component: () => import("../views/users-manage/UsersList.vue"),
        meta: { title: "用户账号管理", 
        icon: "svg-icon",
        breadcrumb: [
          { title: "用户账号管理", path: "/users-manage" },
          { title: "用户列表", path: "" },
        ] 
      }
      },
      {
        path: "/users-manage/user-detail/:id",
        name: "user-details",
        meta: {
          title: "用户详情",
          hidden: true, //隐藏侧边栏
          activeMenu: "/users-manage/UsersList", //高亮侧边栏的路径
          breadcrumb: [
            { title: "用户账号管理", path: "/users-manage" },
            { title: "用户列表", path: "/users-manage" },
            { title: "用户详情", path: "" }
          ]
        },
        component: () => import("../views/users-manage/UserDetails.vue")
      },
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
      },
      {
        path: "/supervisoe-library/add",
        name: "add-supervisoe",
        meta: {
          title: "新增导师",
          hidden: true, //隐藏侧边栏
          activeMenu: "/supervisoe-library/index.vue", //高亮侧边栏的路径
          breadcrumb: [
            { title: "导师库管理", path: "/supervisoe-library" },
            { title: "新增导师", path: "" },
          ]
        },
        component: () => import("../views/supervisoe-library/AddSupervisoe.vue")
      },
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
