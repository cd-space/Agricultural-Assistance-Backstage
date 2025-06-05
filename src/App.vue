<script lang="ts">
export default {
  name: "App",
}
</script>
<template>
  <router-view />
      <footer class="site-footer">
      <p>©2025 重庆光瑞御华科技有限公司 版权所有 | 渝ICP备2025060909号</p>
    </footer>
</template>
<style lang="scss">
@import "./styles/index.scss";
@import "./styles/layout.scss";
.site-footer {
  position: fixed;
  bottom: 0;
    width: 100%;
  text-align: center;
  padding: 10px 0;
  font-size: 12px;
  color: #666;
  z-index: 9999; 
}
</style>
