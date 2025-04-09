<template>
  <div class="carousel-graph-manage">
    <h1>supervisoe library</h1>
    <button @click="router.push({name:'add-supervisoe'})">新增导师</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router';

</script>

<style scoped>

</style>