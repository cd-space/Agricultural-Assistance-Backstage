<script lang="ts">
/** 侧边栏组件 */
export default {
  name: "Sidebar"
}
</script>
<script lang="ts" setup>
import Menu from "./Menu.vue";
import { Scrollbar } from "@/components/Scrollbar";
import store from "@/store";

const layoutInfo = store.layout.info;

const info = store.projectInfo;

function onClear() {
  layoutInfo.keyword = "";
}
</script>
<template>
  <div class="the-layout-sidebar">
    <section class="the-layout-sidebar-content-1">
      <transition name="fade" mode="out-in">
        <div class="the-logo-box" v-if="layoutInfo.showSidebarLogo">
          <router-link class="the-logo-link f-vertical" to="/">
            <img class="the-logo" :src="info.logo" />
          </router-link>
        </div>
        <div v-else style="height: var(--page-padding);"></div>
      </transition>
    </section>
    <section class="f1">
      <Scrollbar>
        <div class="the-layout-sidebar-content padding-full">
          <Menu :mergeOnlyOneChild="1" />
        </div>
      </Scrollbar>
    </section>
  </div>
</template>


<style lang="scss" scoped>
.the-layout-sidebar-content-1{
  border-bottom: 1px solid #1F2937;
  background-color: #111827;
}
.f1{
  background-color: #111827;
}
</style>