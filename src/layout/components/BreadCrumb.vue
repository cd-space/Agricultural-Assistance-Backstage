<script lang="ts">
/** 面包屑组件 */
export default {
  name: "BreadCrumb"
}
</script>
<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const list = ref<Array<{ path: string; meta: any }>>([]);

function updateList() {
  const metaBreadcrumb = route.meta?.breadcrumb;
  if (metaBreadcrumb && Array.isArray(metaBreadcrumb)) {
    // 如果定义了自定义面包屑，则使用它
    list.value = metaBreadcrumb.map(item => ({
      path: item.path,
      meta: { title: item.title }
    }));
  } else {
    // 否则回退到默认 matched 路径
    const matched = route.matched
      .filter((item) => item.meta && item.meta.title)
      .map((item) => ({
        path: item.path,
        meta: { ...item.meta },
      }));
    list.value = matched;
  }
}

watch(
  () => route.path,
  function () {
    if (route.path.startsWith("/redirect/")) return;
    updateList();
  }
);

updateList();
</script>
<template>
  <transition-group name="breadcrumb" tag="div" class="layout-breadcrumb f-vertical">
    <span :class="['layout-breadcrumb-item', {'last': index === list.length - 1}]" v-for="(item, index) in list" :key="item.path">
      <i class="separator" v-if="index > 0">/</i>
      <a href="javascript:void(0)" v-if="index === list.length - 1">{{ item.meta.title }}</a>
      <router-link v-else :to="item.path">{{ item.meta.title }}</router-link>
    </span>
  </transition-group>
</template>
