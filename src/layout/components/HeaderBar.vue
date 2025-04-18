<script lang="ts">
/** 顶部栏组件 */
export default {
  name: "HeaderBar"
}
</script>
<script lang="ts" setup>
import BreadCrumb from "./BreadCrumb.vue";
import store from "@/store";
import { removeRoutes } from "@/router/permission";
import TagList from "./TagList.vue";
import { useLayoutRoute } from "./hooks";
import { ref } from "vue";
import Personal from "./Personal.vue";

const showPersonal = ref(false);
const layoutInfo = store.layout.info;
const userInfo = store.user.info;
const { router } = useLayoutRoute();

function onSwitch() {
  layoutInfo.showSidebar = !layoutInfo.showSidebar;
}

const defaultAvatar = "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif";

function onLogout() {
  store.user.reset();
  router.push("/login").then(() => {
    // 清空历史记录，确保切换用户类型时缓存不存在的路由记录，没有用户类型权限时可以忽略
    layoutInfo.tagList = [];

    // vue 2.x 做法退出登陆后，需要刷新页面，因为我们是通过`addRoutes`添加的，`router`没有`deleteRoutes`这个api
    // 所以清除`token`,清除`permissionList`等信息，刷新页面是最保险的。
    // 网上有另外一种方法是二次封装`addRoutes`去实现无刷新切换动态路由，我嫌麻烦就直接清空缓存信息并刷新实现
    // location.reload();

    // 现在不需要了，vue 3.x 之后路由增加了删除路由方法
    removeRoutes();
  });



}

</script>
<style lang="scss">

@mixin font {
  font-size: 15px;
  color: #555;
}

.user-info-box {
  @include font();
  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    margin-right: 10px;
    display: inline-block;
  }
  .logout {
    border: none;
    outline: none;
    background-color: transparent;
    padding: 6px 10px 6px 4px;
    line-height: 1;
    @include font();
    transition: var(--transition);
    &:hover {
      color: var(--blue);
    }
    .svg-icon {
      margin-right: 4px;
    }
  }
}
</style>
<template>
  <div class="the-layout-header">
    <div class="the-layout-navbar flex">
      <div :class="['fvc hamburger', { 'hamburger-actived': layoutInfo.showSidebar }]" @click="onSwitch()">
        <svg-icon name="hamburger" />
      </div>
      <BreadCrumb class="f1" />
      <div class="user-info-box f-vertical">
        <el-dropdown trigger="click" style="margin-right: 30px; cursor: pointer;">
          <span class="el-dropdown-link" style="display: flex; align-items: center;">
            <img class="avatar" :src="userInfo.avatar || defaultAvatar">
          <div style="display: flex; flex-direction: column;">
            <span style="font-size: 14px;font-weight: 500;color: #111827; margin-bottom: 4px;">张伟明</span>
            <span style="font-size: 12px;color: #6B7280;">系统管理员</span>
          </div>
          </span>
          <template #dropdown>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click="showPersonal = true">个人中心</el-dropdown-item>
            <el-dropdown-item @click.native="onLogout()">退出登录</el-dropdown-item>
          </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <TagList v-if="layoutInfo.showTagList" />
    <Personal v-if="showPersonal" @close="showPersonal = false" />

  </div>
</template>
