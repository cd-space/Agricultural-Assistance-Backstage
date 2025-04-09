<template>
  <div class="carousel-graph-manage">
    <h1>Users manage</h1>
    <button @click="router.push({name:'user-details',params: { id:1}})">用户详情</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router'


</script>

<style scoped>

</style>